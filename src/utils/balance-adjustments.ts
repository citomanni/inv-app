import "server-only";
import { db } from "@/db";
import { fund, investment, notification, transaction } from "@/db/schema";
import { generateId } from "@/lib/id";
import { and, eq } from "drizzle-orm";

/**
 * Admin "set target balance" override (test feature).
 *
 * Moves a SINGLE investor's total returns (sum of investment.totalReturnsCredited)
 * to an exact target by generating a short plan of randomized payout/refund events —
 * without running a fund-wide payout and without touching any other investor.
 *
 * Lightweight by design: each installment writes a `transaction` + `notification`
 * and bumps the attributed `investment.totalReturnsCredited`. It does NOT create
 * `payout` / `payout_distribution` rows, so the admin Payouts history stays limited
 * to real fund-wide runs. The whole batch is traceable via transaction.referenceId.
 */

const MIN_INSTALLMENT = 1; // dollars
const DEFAULT_MIN_COUNT = 2;
const DEFAULT_MAX_COUNT = 6;
const MAX_COUNT = 12;

export interface ActiveInvestmentLite {
  id: string;
  fundId: string;
  fundName: string;
  amount: string;
  totalReturnsCredited: string;
}

function round2(n: number): number {
  return +n.toFixed(2);
}

/** Current total returns + active investments for a user. */
export async function getUserReturnsContext(userId: string): Promise<{
  currentReturns: number;
  activeInvestments: ActiveInvestmentLite[];
}> {
  const rows = await db
    .select({
      id: investment.id,
      fundId: investment.fundId,
      fundName: fund.name,
      amount: investment.amount,
      totalReturnsCredited: investment.totalReturnsCredited,
    })
    .from(investment)
    .innerJoin(fund, eq(investment.fundId, fund.id))
    .where(and(eq(investment.userId, userId), eq(investment.status, "active")));

  const currentReturns = round2(
    rows.reduce((acc, r) => acc + parseFloat(r.totalReturnsCredited), 0),
  );

  return { currentReturns, activeInvestments: rows };
}

/**
 * Split an absolute gap `G` into `count` random installments that sum exactly to G.
 * Each installment is >= MIN_INSTALLMENT; count is reduced if G is too small.
 * Returned amounts are unsigned (caller applies the gap's sign).
 */
export function generateInstallments(
  gapAbs: number,
  requestedCount?: number,
): number[] {
  const G = round2(gapAbs);
  if (G <= 0) return [];

  // How many installments can we afford at the minimum?
  const maxAffordable = Math.max(1, Math.floor(G / MIN_INSTALLMENT));

  let count: number;
  if (requestedCount && requestedCount > 0) {
    count = Math.min(requestedCount, MAX_COUNT, maxAffordable);
  } else {
    const hi = Math.min(DEFAULT_MAX_COUNT, maxAffordable);
    const lo = Math.min(DEFAULT_MIN_COUNT, hi);
    count = lo + Math.floor(Math.random() * (hi - lo + 1));
  }
  count = Math.max(1, count);

  if (count === 1) return [G];

  // Random weights → scale to (G - count*MIN) so every slice clears the minimum,
  // then add MIN back to each. Fix rounding drift on the last slice.
  const floorTotal = MIN_INSTALLMENT * count;
  const spread = round2(G - floorTotal);

  const weights = Array.from({ length: count }, () => Math.random());
  const weightSum = weights.reduce((a, b) => a + b, 0) || 1;

  const amounts: number[] = [];
  let allocated = 0;
  for (let i = 0; i < count - 1; i++) {
    const slice = round2(MIN_INSTALLMENT + (spread * weights[i]) / weightSum);
    amounts.push(slice);
    allocated = round2(allocated + slice);
  }
  // Last slice absorbs rounding so the sum is exact.
  amounts.push(round2(G - allocated));
  return amounts;
}

export interface BalanceAdjustPlan {
  current: number;
  target: number;
  gap: number; // signed (target - current)
  installments: number[]; // signed, sum to gap
  recipientInvestments: number;
}

export async function previewBalanceAdjustment(opts: {
  userId: string;
  targetReturns: number;
  installments?: number;
}): Promise<BalanceAdjustPlan> {
  const { currentReturns, activeInvestments } = await getUserReturnsContext(
    opts.userId,
  );
  if (activeInvestments.length === 0) {
    throw new Error("User has no active investments to attribute returns to");
  }

  const target = round2(opts.targetReturns);
  const gap = round2(target - currentReturns);
  const sign = gap < 0 ? -1 : 1;
  const amounts = generateInstallments(Math.abs(gap), opts.installments).map(
    (a) => round2(a * sign),
  );

  return {
    current: currentReturns,
    target,
    gap,
    installments: amounts,
    recipientInvestments: activeInvestments.length,
  };
}

export async function applyBalanceAdjustment(opts: {
  userId: string;
  targetReturns: number;
  amounts: number[];
  performedBy: string;
}): Promise<{ batchId: string; events: number; newTotal: number }> {
  const now = new Date();
  const batchId = generateId();

  return db.transaction(async (tx) => {
    // Re-read fresh inside the transaction (race guard).
    const invs = await tx
      .select({
        id: investment.id,
        userId: investment.userId,
        fundId: investment.fundId,
        amount: investment.amount,
        totalReturnsCredited: investment.totalReturnsCredited,
      })
      .from(investment)
      .where(
        and(
          eq(investment.userId, opts.userId),
          eq(investment.status, "active"),
        ),
      );

    if (invs.length === 0) {
      throw new Error("User has no active investments to attribute returns to");
    }

    const fundRows = await tx
      .select({ id: fund.id, name: fund.name })
      .from(fund);
    const fundNameById = new Map(fundRows.map((f) => [f.id, f.name]));

    const currentReturns = round2(
      invs.reduce((acc, i) => acc + parseFloat(i.totalReturnsCredited), 0),
    );
    const target = round2(opts.targetReturns);
    const expectedGap = round2(target - currentReturns);
    const providedGap = round2(opts.amounts.reduce((a, b) => a + b, 0));

    // The approved plan must still match the live gap (within a cent).
    if (Math.abs(providedGap - expectedGap) > 0.01) {
      throw new Error("Balance changed since preview — please regenerate");
    }

    // Mutable running totals per investment (so decreases can floor at 0 and spill).
    const running = new Map(
      invs.map((i) => [i.id, parseFloat(i.totalReturnsCredited)]),
    );

    let rr = 0; // round-robin cursor
    let events = 0;

    for (const rawAmount of opts.amounts) {
      let remaining = round2(rawAmount);
      if (remaining === 0) continue;

      const isCredit = remaining > 0;

      // A single installment may need to spill across investments (decrease floored at 0).
      let safety = invs.length; // consecutive investments that couldn't absorb
      while (Math.abs(remaining) >= 0.005 && safety > 0) {
        const inv = invs[rr % invs.length];
        rr++;

        const prev = running.get(inv.id) ?? 0;
        let applied: number;

        if (isCredit) {
          applied = round2(remaining);
          remaining = 0;
        } else {
          // Don't drive a single investment below zero.
          const canRemove = Math.min(Math.abs(remaining), prev);
          if (canRemove <= 0) {
            // This investment is already at 0; try the next one. If a full lap
            // finds nothing to remove, stop (invariant should prevent this).
            safety--;
            continue;
          }
          safety = invs.length; // made progress; reset the lap guard
          applied = round2(-canRemove);
          remaining = round2(remaining - applied);
        }

        const newTotal = round2(prev + applied);
        running.set(inv.id, newTotal);

        const fundName = fundNameById.get(inv.fundId) ?? "your fund";
        const txId = generateId();
        const absApplied = Math.abs(applied);

        await tx.insert(transaction).values({
          id: txId,
          userId: opts.userId,
          investmentId: inv.id,
          type: isCredit ? "payout" : "refund",
          amount: String(applied),
          status: "completed",
          description: isCredit
            ? `Distribution from ${fundName}`
            : `Portfolio adjustment on ${fundName}`,
          referenceId: `manual-adjust:${batchId}`,
          createdAt: now,
        });

        await tx
          .update(investment)
          .set({ totalReturnsCredited: String(newTotal), updatedAt: now })
          .where(eq(investment.id, inv.id));

        await tx.insert(notification).values({
          id: generateId(),
          userId: opts.userId,
          type: isCredit ? "payout_credited" : "portfolio_adjustment",
          title: isCredit
            ? `Returns credited from ${fundName}`
            : "Portfolio adjustment",
          body: isCredit
            ? `$${absApplied.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} has been added to your portfolio.`
            : `Your returns balance was adjusted by -$${absApplied.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}.`,
          url: "/transactions",
          createdAt: now,
        });

        events++;
      }
    }

    const newTotal = round2(
      Array.from(running.values()).reduce((a, b) => a + b, 0),
    );

    return { batchId, events, newTotal };
  });
}
