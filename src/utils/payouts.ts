import "server-only";
import { db } from "@/db";
import {
  fund,
  investment,
  notification,
  payout,
  payoutDistribution,
  transaction,
} from "@/db/schema";
import { generateId } from "@/lib/id";
import { and, desc, eq, sql } from "drizzle-orm";

export interface PayoutRunSummary {
  id: string;
  fundId: string;
  fundName: string;
  fundCoverImage: string;
  periodStart: Date;
  periodEnd: Date;
  ratePercent: string;
  totalDistributed: string;
  status: string;
  note: string | null;
  distributedAt: Date | null;
  createdAt: Date;
  recipientsCount: number;
}

/** Atomic payout run: creates the payout + distributions + transactions + notifications. */
export async function distributePayoutRun(opts: {
  fundId: string;
  periodStart: Date;
  periodEnd: Date;
  ratePercent: number; // e.g. 0.71 for ~8.5% annualized monthly
  distributedBy: string;
  note?: string | null;
}): Promise<{ payoutId: string; recipients: number; total: number }> {
  const now = new Date();

  return db.transaction(async (tx) => {
    const [theFund] = await tx
      .select()
      .from(fund)
      .where(eq(fund.id, opts.fundId))
      .limit(1);
    if (!theFund) throw new Error("Fund not found");

    const activeInvestments = await tx
      .select({
        id: investment.id,
        userId: investment.userId,
        amount: investment.amount,
        totalReturnsCredited: investment.totalReturnsCredited,
      })
      .from(investment)
      .where(
        and(
          eq(investment.fundId, opts.fundId),
          eq(investment.status, "active"),
        ),
      );

    if (activeInvestments.length === 0) {
      throw new Error(
        "No active investments to distribute returns to in this fund",
      );
    }

    const payoutId = generateId();
    let total = 0;

    await tx.insert(payout).values({
      id: payoutId,
      fundId: opts.fundId,
      periodStart: opts.periodStart,
      periodEnd: opts.periodEnd,
      ratePercent: String(opts.ratePercent),
      totalDistributed: "0",
      status: "draft",
      note: opts.note ?? null,
      distributedBy: opts.distributedBy,
      createdAt: now,
    });

    for (const inv of activeInvestments) {
      const principal = parseFloat(inv.amount);
      const amount = +(principal * (opts.ratePercent / 100)).toFixed(2);
      total = +(total + amount).toFixed(2);

      const txId = generateId();
      await tx.insert(transaction).values({
        id: txId,
        userId: inv.userId,
        investmentId: inv.id,
        type: "payout",
        amount: String(amount),
        status: "completed",
        description: `Distribution from ${theFund.name} (${formatPeriod(
          opts.periodStart,
          opts.periodEnd,
        )})`,
        referenceId: payoutId,
        createdAt: now,
      });

      await tx.insert(payoutDistribution).values({
        id: generateId(),
        payoutId,
        investmentId: inv.id,
        userId: inv.userId,
        amount: String(amount),
        transactionId: txId,
        createdAt: now,
      });

      const newTotal = +(
        parseFloat(inv.totalReturnsCredited) + amount
      ).toFixed(2);
      await tx
        .update(investment)
        .set({
          totalReturnsCredited: String(newTotal),
          updatedAt: now,
        })
        .where(eq(investment.id, inv.id));

      await tx.insert(notification).values({
        id: generateId(),
        userId: inv.userId,
        type: "payout_credited",
        title: `Returns credited from ${theFund.name}`,
        body: `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} has been added to your portfolio.`,
        url: "/transactions",
        createdAt: now,
      });
    }

    await tx
      .update(payout)
      .set({
        totalDistributed: String(total),
        status: "distributed",
        distributedAt: now,
      })
      .where(eq(payout.id, payoutId));

    return { payoutId, recipients: activeInvestments.length, total };
  });
}

function formatPeriod(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  return `${fmt(start)} – ${fmt(end)}`;
}

export interface ListPayoutsOptions {
  page?: number;
  limit?: number;
  fundId?: string;
}

export async function listPayouts(opts: ListPayoutsOptions = {}) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  const offset = (page - 1) * limit;

  const conditions = [];
  if (opts.fundId) conditions.push(eq(payout.fundId, opts.fundId));
  const whereClause = conditions.length ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: payout.id,
      fundId: payout.fundId,
      fundName: fund.name,
      fundCoverImage: fund.coverImage,
      periodStart: payout.periodStart,
      periodEnd: payout.periodEnd,
      ratePercent: payout.ratePercent,
      totalDistributed: payout.totalDistributed,
      status: payout.status,
      note: payout.note,
      distributedAt: payout.distributedAt,
      createdAt: payout.createdAt,
      recipientsCount: sql<number>`(select count(*)::int from payout_distribution where payout_id = ${payout.id})`,
    })
    .from(payout)
    .innerJoin(fund, eq(payout.fundId, fund.id))
    .where(whereClause)
    .orderBy(desc(payout.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(payout)
    .where(whereClause);

  return {
    payouts: rows as PayoutRunSummary[],
    total: count,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(count / limit)),
  };
}

/** Quick preview of how many investors would receive a distribution and the total. */
export async function previewPayout(opts: {
  fundId: string;
  ratePercent: number;
}) {
  const rows = await db
    .select({
      amount: investment.amount,
    })
    .from(investment)
    .where(
      and(eq(investment.fundId, opts.fundId), eq(investment.status, "active")),
    );

  const total = rows.reduce(
    (acc, r) => acc + parseFloat(r.amount) * (opts.ratePercent / 100),
    0,
  );

  return { recipients: rows.length, total: +total.toFixed(2) };
}
