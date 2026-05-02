import "server-only";
import { db } from "@/db";
import { document, fund, investment, notification, user } from "@/db/schema";
import { generateId } from "@/lib/id";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

export interface DocumentListItem {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  investmentId: string | null;
  fundName: string | null;
  type: string;
  title: string;
  url: string;
  createdAt: Date;
}

export interface ListDocumentsOptions {
  userId?: string;
  page?: number;
  limit?: number;
  type?: string;
  search?: string;
}

export async function listDocuments(opts: ListDocumentsOptions = {}) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  const offset = (page - 1) * limit;

  const conditions = [];
  if (opts.userId) conditions.push(eq(document.userId, opts.userId));
  if (opts.type && opts.type !== "all") {
    conditions.push(eq(document.type, opts.type));
  }
  if (opts.search) {
    const pattern = `%${opts.search}%`;
    conditions.push(
      or(
        ilike(document.title, pattern),
        ilike(user.name, pattern),
        ilike(user.email, pattern),
      ),
    );
  }
  const whereClause = conditions.length ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: document.id,
      userId: document.userId,
      userName: user.name,
      userEmail: user.email,
      investmentId: document.investmentId,
      fundName: fund.name,
      type: document.type,
      title: document.title,
      url: document.url,
      createdAt: document.createdAt,
    })
    .from(document)
    .leftJoin(user, eq(document.userId, user.id))
    .leftJoin(investment, eq(document.investmentId, investment.id))
    .leftJoin(fund, eq(investment.fundId, fund.id))
    .where(whereClause)
    .orderBy(desc(document.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(document)
    .leftJoin(user, eq(document.userId, user.id))
    .where(whereClause);

  return {
    documents: rows as DocumentListItem[],
    total: count,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(count / limit)),
  };
}

export async function createDocument(input: {
  userId: string;
  investmentId?: string | null;
  type: string;
  title: string;
  url: string;
  uploadedBy: string;
}): Promise<string> {
  const id = generateId();
  const now = new Date();
  await db.transaction(async (tx) => {
    await tx.insert(document).values({
      id,
      userId: input.userId,
      investmentId: input.investmentId || null,
      type: input.type,
      title: input.title,
      url: input.url,
      uploadedBy: input.uploadedBy,
      createdAt: now,
    });
    await tx.insert(notification).values({
      id: generateId(),
      userId: input.userId,
      type: "document_added",
      title: "A new document is available",
      body: input.title,
      url: "/documents",
      createdAt: now,
    });
  });
  return id;
}

export async function deleteDocument(id: string) {
  await db.delete(document).where(eq(document.id, id));
}
