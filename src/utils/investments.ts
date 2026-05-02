import "server-only";
import {
  fund,
  investment,
  notification,
  transaction,
  user,
} from "@/db/schema";
import { db } from "@/db";
import { generateId } from "@/lib/id";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

export type InvestmentStatus =
  | "pending_payment"
  | "pending_verification"
  | "active"
  | "matured"
  | "rejected";

export interface InvestmentListItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  fundId: string;
  fundName: string;
  fundSlug: string;
  fundCoverImage: string;
  amount: string;
  status: InvestmentStatus;
  paymentProofUrl: string | null;
  paymentReference: string | null;
  bankTransferAt: Date | null;
  activatedAt: Date | null;
  rejectionReason: string | null;
  totalReturnsCredited: string;
  createdAt: Date;
}

/** User commits to investing — we store the proof and mark pending review. */
export async function commitInvestment(opts: {
  userId: string;
  fundId: string;
  amount: number;
  paymentProofUrl: string;
  paymentReference?: string | null;
}): Promise<string> {
  const id = generateId();
  const now = new Date();

  await db.transaction(async (tx) => {
    const [theFund] = await tx
      .select()
      .from(fund)
      .where(eq(fund.id, opts.fundId))
      .limit(1);

    if (!theFund) throw new Error("Fund not found");
    if (theFund.status !== "open") {
      throw new Error("This fund is not currently accepting new investments");
    }

    const minimum = parseFloat(theFund.minimumInvestment);
    if (opts.amount < minimum) {
      throw new Error(
        `Minimum investment is $${minimum.toLocaleString("en-US")}`,
      );
    }

    await tx.insert(investment).values({
      id,
      userId: opts.userId,
      fundId: opts.fundId,
      amount: String(opts.amount),
      status: "pending_verification",
      paymentProofUrl: opts.paymentProofUrl,
      paymentReference: opts.paymentReference ?? null,
      bankTransferAt: now,
      createdAt: now,
      updatedAt: now,
    });

    await tx.insert(transaction).values({
      id: generateId(),
      userId: opts.userId,
      investmentId: id,
      type: "investment_commit",
      amount: String(opts.amount),
      status: "pending",
      description: `Pending investment in ${theFund.name}`,
      createdAt: now,
    });
  });

  return id;
}

export async function reviewInvestment(opts: {
  investmentId: string;
  reviewerId: string;
  decision: "approve" | "reject";
  rejectionReason?: string;
}) {
  const now = new Date();

  await db.transaction(async (tx) => {
    const [inv] = await tx
      .select()
      .from(investment)
      .where(eq(investment.id, opts.investmentId))
      .limit(1);

    if (!inv) throw new Error("Investment not found");
    if (inv.status !== "pending_verification") {
      throw new Error("This investment is not awaiting review");
    }

    const [theFund] = await tx
      .select()
      .from(fund)
      .where(eq(fund.id, inv.fundId))
      .limit(1);

    if (!theFund) throw new Error("Fund not found");

    if (opts.decision === "approve") {
      const maturity = new Date(now);
      maturity.setFullYear(maturity.getFullYear() + theFund.holdYears);

      await tx
        .update(investment)
        .set({
          status: "active",
          activatedAt: now,
          maturityDate: maturity,
          reviewedBy: opts.reviewerId,
          reviewedAt: now,
          updatedAt: now,
        })
        .where(eq(investment.id, opts.investmentId));

      // Update fund raisedAmount
      const newRaised =
        parseFloat(theFund.raisedAmount) + parseFloat(inv.amount);
      await tx
        .update(fund)
        .set({
          raisedAmount: String(newRaised),
          updatedAt: now,
        })
        .where(eq(fund.id, theFund.id));

      // Mark commit transaction as completed and create an "investment_active" entry
      await tx
        .update(transaction)
        .set({ status: "completed" })
        .where(
          and(
            eq(transaction.investmentId, inv.id),
            eq(transaction.type, "investment_commit"),
          ),
        );

      await tx.insert(transaction).values({
        id: generateId(),
        userId: inv.userId,
        investmentId: inv.id,
        type: "investment_active",
        amount: inv.amount,
        status: "completed",
        description: `Investment in ${theFund.name} activated`,
        createdAt: now,
      });

      await tx.insert(notification).values({
        id: generateId(),
        userId: inv.userId,
        type: "investment_activated",
        title: `Your investment in ${theFund.name} is active`,
        body: `Your $${parseFloat(inv.amount).toLocaleString("en-US")} commitment has been verified and is now earning returns.`,
        url: "/portfolio",
        createdAt: now,
      });
    } else {
      await tx
        .update(investment)
        .set({
          status: "rejected",
          rejectionReason: opts.rejectionReason ?? null,
          reviewedBy: opts.reviewerId,
          reviewedAt: now,
          updatedAt: now,
        })
        .where(eq(investment.id, opts.investmentId));

      await tx
        .update(transaction)
        .set({ status: "failed" })
        .where(
          and(
            eq(transaction.investmentId, inv.id),
            eq(transaction.type, "investment_commit"),
          ),
        );

      await tx.insert(notification).values({
        id: generateId(),
        userId: inv.userId,
        type: "investment_rejected",
        title: `Your investment in ${theFund.name} could not be verified`,
        body:
          opts.rejectionReason ||
          "We couldn't confirm your bank transfer. Please review and resubmit.",
        url: "/transactions",
        createdAt: now,
      });
    }
  });
}

export interface ListInvestmentsOptions {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  fundId?: string;
  userId?: string;
}

export async function listInvestments(opts: ListInvestmentsOptions = {}) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 10));
  const offset = (page - 1) * limit;

  const conditions = [];
  if (opts.status && opts.status !== "all") {
    conditions.push(eq(investment.status, opts.status));
  }
  if (opts.fundId) conditions.push(eq(investment.fundId, opts.fundId));
  if (opts.userId) conditions.push(eq(investment.userId, opts.userId));
  if (opts.search) {
    const pattern = `%${opts.search}%`;
    conditions.push(
      or(
        ilike(user.name, pattern),
        ilike(user.email, pattern),
        ilike(fund.name, pattern),
      ),
    );
  }
  const whereClause = conditions.length ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: investment.id,
      userId: investment.userId,
      userName: user.name,
      userEmail: user.email,
      fundId: investment.fundId,
      fundName: fund.name,
      fundSlug: fund.slug,
      fundCoverImage: fund.coverImage,
      amount: investment.amount,
      status: investment.status,
      paymentProofUrl: investment.paymentProofUrl,
      paymentReference: investment.paymentReference,
      bankTransferAt: investment.bankTransferAt,
      activatedAt: investment.activatedAt,
      rejectionReason: investment.rejectionReason,
      totalReturnsCredited: investment.totalReturnsCredited,
      createdAt: investment.createdAt,
    })
    .from(investment)
    .innerJoin(user, eq(investment.userId, user.id))
    .innerJoin(fund, eq(investment.fundId, fund.id))
    .where(whereClause)
    .orderBy(desc(investment.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(investment)
    .innerJoin(user, eq(investment.userId, user.id))
    .innerJoin(fund, eq(investment.fundId, fund.id))
    .where(whereClause);

  return {
    investments: rows as InvestmentListItem[],
    total: count,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(count / limit)),
  };
}

export async function getInvestmentDetail(id: string) {
  const [row] = await db
    .select({
      investment: investment,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        kycStatus: user.kycStatus,
      },
      fund: {
        id: fund.id,
        name: fund.name,
        slug: fund.slug,
        coverImage: fund.coverImage,
        location: fund.location,
        propertyType: fund.propertyType,
        minimumInvestment: fund.minimumInvestment,
        targetAnnualReturnPercent: fund.targetAnnualReturnPercent,
        holdYears: fund.holdYears,
        payoutFrequency: fund.payoutFrequency,
      },
    })
    .from(investment)
    .innerJoin(user, eq(investment.userId, user.id))
    .innerJoin(fund, eq(investment.fundId, fund.id))
    .where(eq(investment.id, id))
    .limit(1);
  return row ?? null;
}

/** Aggregate stats across a user's investments. */
export async function getUserPortfolioStats(userId: string) {
  const [stats] = await db
    .select({
      totalInvested: sql<string>`coalesce(sum(${investment.amount}) filter (where ${investment.status} in ('active','matured')), '0')`,
      activeCount: sql<number>`count(*) filter (where ${investment.status} = 'active')::int`,
      pendingCount: sql<number>`count(*) filter (where ${investment.status} = 'pending_verification')::int`,
      totalReturns: sql<string>`coalesce(sum(${investment.totalReturnsCredited}), '0')`,
    })
    .from(investment)
    .where(eq(investment.userId, userId));
  return {
    totalInvested: parseFloat(stats?.totalInvested ?? "0"),
    activeCount: Number(stats?.activeCount ?? 0),
    pendingCount: Number(stats?.pendingCount ?? 0),
    totalReturns: parseFloat(stats?.totalReturns ?? "0"),
  };
}
