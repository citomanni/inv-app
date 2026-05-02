import "server-only";
import { db } from "@/db";
import { fund, investment, transaction } from "@/db/schema";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

export interface TransactionListItem {
  id: string;
  userId: string;
  investmentId: string | null;
  fundName: string | null;
  fundSlug: string | null;
  type: string;
  amount: string;
  status: string;
  description: string | null;
  createdAt: Date;
}

export interface ListTransactionsOptions {
  userId?: string;
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}

export async function listTransactions(opts: ListTransactionsOptions = {}) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  const offset = (page - 1) * limit;

  const conditions = [];
  if (opts.userId) conditions.push(eq(transaction.userId, opts.userId));
  if (opts.type && opts.type !== "all") {
    conditions.push(eq(transaction.type, opts.type));
  }
  if (opts.search) {
    const pattern = `%${opts.search}%`;
    conditions.push(
      or(
        ilike(transaction.description, pattern),
        ilike(fund.name, pattern),
      ),
    );
  }
  const whereClause = conditions.length ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: transaction.id,
      userId: transaction.userId,
      investmentId: transaction.investmentId,
      fundName: fund.name,
      fundSlug: fund.slug,
      type: transaction.type,
      amount: transaction.amount,
      status: transaction.status,
      description: transaction.description,
      createdAt: transaction.createdAt,
    })
    .from(transaction)
    .leftJoin(investment, eq(transaction.investmentId, investment.id))
    .leftJoin(fund, eq(investment.fundId, fund.id))
    .where(whereClause)
    .orderBy(desc(transaction.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(transaction)
    .leftJoin(investment, eq(transaction.investmentId, investment.id))
    .leftJoin(fund, eq(investment.fundId, fund.id))
    .where(whereClause);

  return {
    transactions: rows as TransactionListItem[],
    total: count,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(count / limit)),
  };
}

export interface PortfolioPosition {
  id: string;
  fundId: string;
  fundName: string;
  fundSlug: string;
  fundCoverImage: string;
  fundLocation: string;
  amount: string;
  status: string;
  activatedAt: Date | null;
  maturityDate: Date | null;
  totalReturnsCredited: string;
  targetAnnualReturnPercent: string;
  payoutFrequency: string;
  holdYears: number;
  createdAt: Date;
}

export async function listUserPositions(userId: string) {
  const rows = await db
    .select({
      id: investment.id,
      fundId: investment.fundId,
      fundName: fund.name,
      fundSlug: fund.slug,
      fundCoverImage: fund.coverImage,
      fundLocation: fund.location,
      amount: investment.amount,
      status: investment.status,
      activatedAt: investment.activatedAt,
      maturityDate: investment.maturityDate,
      totalReturnsCredited: investment.totalReturnsCredited,
      targetAnnualReturnPercent: fund.targetAnnualReturnPercent,
      payoutFrequency: fund.payoutFrequency,
      holdYears: fund.holdYears,
      createdAt: investment.createdAt,
    })
    .from(investment)
    .innerJoin(fund, eq(investment.fundId, fund.id))
    .where(eq(investment.userId, userId))
    .orderBy(desc(investment.createdAt));
  return rows as PortfolioPosition[];
}
