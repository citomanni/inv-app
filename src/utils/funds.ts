import "server-only";
import { db } from "@/db";
import { fund, fundImage } from "@/db/schema";
import { generateId } from "@/lib/id";
import { and, asc, desc, eq, ilike, inArray, ne, or, sql } from "drizzle-orm";

export type FundStatus =
  | "draft"
  | "open"
  | "closed"
  | "oversubscribed"
  | "archived";

export type PayoutFrequency = "monthly" | "quarterly" | "annually";

export type DistributionType = "cash_flow" | "appreciation" | "mixed";

export interface FundWithImages {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  coverImage: string;
  location: string;
  propertyType: string;
  totalSize: string;
  raisedAmount: string;
  minimumInvestment: string;
  targetAnnualReturnPercent: string;
  targetIrrPercent: string | null;
  equityMultiple: string | null;
  holdYears: number;
  payoutFrequency: PayoutFrequency;
  distributionType: DistributionType;
  units: number | null;
  status: FundStatus;
  openedAt: Date | null;
  closesAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  images: { id: string; url: string; alt: string | null; sortOrder: number }[];
}

export interface FundCreateInput {
  slug: string;
  name: string;
  tagline?: string | null;
  description: string;
  coverImage: string;
  location: string;
  propertyType: string;
  totalSize: number | string;
  minimumInvestment: number | string;
  targetAnnualReturnPercent: number | string;
  targetIrrPercent?: number | string | null;
  equityMultiple?: number | string | null;
  holdYears: number;
  payoutFrequency: PayoutFrequency;
  distributionType: DistributionType;
  units?: number | null;
  status?: FundStatus;
  closesAt?: Date | null;
  createdBy?: string | null;
}

export type FundUpdateInput = Partial<FundCreateInput> & {
  raisedAmount?: number | string;
  openedAt?: Date | null;
};

const SLUGIFY_RE = /[^a-z0-9]+/g;
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(SLUGIFY_RE, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function ensureUniqueSlug(
  base: string,
  excludeId?: string,
): Promise<string> {
  let candidate = slugify(base) || generateId().slice(0, 8);
  let suffix = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const conditions = [eq(fund.slug, candidate)];
    if (excludeId) conditions.push(ne(fund.id, excludeId));
    const [existing] = await db
      .select({ id: fund.id })
      .from(fund)
      .where(and(...conditions))
      .limit(1);
    if (!existing) return candidate;
    suffix += 1;
    candidate = `${slugify(base)}-${suffix}`;
  }
}

export async function createFund(input: FundCreateInput): Promise<string> {
  const id = generateId();
  const slug = await ensureUniqueSlug(input.slug || input.name, undefined);
  const now = new Date();
  await db.insert(fund).values({
    id,
    slug,
    name: input.name,
    tagline: input.tagline ?? null,
    description: input.description,
    coverImage: input.coverImage,
    location: input.location,
    propertyType: input.propertyType,
    totalSize: String(input.totalSize),
    minimumInvestment: String(input.minimumInvestment),
    targetAnnualReturnPercent: String(input.targetAnnualReturnPercent),
    targetIrrPercent:
      input.targetIrrPercent != null ? String(input.targetIrrPercent) : null,
    equityMultiple:
      input.equityMultiple != null ? String(input.equityMultiple) : null,
    holdYears: input.holdYears,
    payoutFrequency: input.payoutFrequency,
    distributionType: input.distributionType,
    units: input.units ?? null,
    status: input.status ?? "open",
    openedAt: input.status === "open" || !input.status ? now : null,
    closesAt: input.closesAt ?? null,
    createdBy: input.createdBy ?? null,
    createdAt: now,
    updatedAt: now,
  });
  return id;
}

export async function updateFund(id: string, input: FundUpdateInput) {
  const now = new Date();
  const data: Record<string, any> = { updatedAt: now };

  for (const key of [
    "name",
    "tagline",
    "description",
    "coverImage",
    "location",
    "propertyType",
    "payoutFrequency",
    "distributionType",
    "status",
    "closesAt",
    "openedAt",
  ] as const) {
    if (input[key] !== undefined) data[key] = input[key];
  }
  if (input.holdYears !== undefined) data.holdYears = input.holdYears;
  if (input.units !== undefined) data.units = input.units;
  if (input.totalSize !== undefined) data.totalSize = String(input.totalSize);
  if (input.minimumInvestment !== undefined)
    data.minimumInvestment = String(input.minimumInvestment);
  if (input.raisedAmount !== undefined)
    data.raisedAmount = String(input.raisedAmount);
  if (input.targetAnnualReturnPercent !== undefined)
    data.targetAnnualReturnPercent = String(input.targetAnnualReturnPercent);
  if (input.targetIrrPercent !== undefined)
    data.targetIrrPercent =
      input.targetIrrPercent === null ? null : String(input.targetIrrPercent);
  if (input.equityMultiple !== undefined)
    data.equityMultiple =
      input.equityMultiple === null ? null : String(input.equityMultiple);

  if (input.slug !== undefined) {
    data.slug = await ensureUniqueSlug(input.slug, id);
  }

  await db.update(fund).set(data).where(eq(fund.id, id));
}

export async function archiveFund(id: string) {
  await db
    .update(fund)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(fund.id, id));
}

export async function getFundById(id: string): Promise<FundWithImages | null> {
  const [row] = await db.select().from(fund).where(eq(fund.id, id)).limit(1);
  if (!row) return null;
  const images = await db
    .select({
      id: fundImage.id,
      url: fundImage.url,
      alt: fundImage.alt,
      sortOrder: fundImage.sortOrder,
    })
    .from(fundImage)
    .where(eq(fundImage.fundId, id))
    .orderBy(asc(fundImage.sortOrder));
  return { ...row, images } as FundWithImages;
}

export async function getFundBySlug(
  slug: string,
): Promise<FundWithImages | null> {
  const [row] = await db
    .select()
    .from(fund)
    .where(eq(fund.slug, slug))
    .limit(1);
  if (!row) return null;
  const images = await db
    .select({
      id: fundImage.id,
      url: fundImage.url,
      alt: fundImage.alt,
      sortOrder: fundImage.sortOrder,
    })
    .from(fundImage)
    .where(eq(fundImage.fundId, row.id))
    .orderBy(asc(fundImage.sortOrder));
  return { ...row, images } as FundWithImages;
}

export interface ListFundsOptions {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  propertyType?: string;
  includeArchived?: boolean;
}

export async function listFunds(opts: ListFundsOptions = {}) {
  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  const offset = (page - 1) * limit;

  const conditions = [];
  if (opts.status && opts.status !== "all") {
    conditions.push(eq(fund.status, opts.status));
  } else if (!opts.includeArchived) {
    conditions.push(ne(fund.status, "archived"));
  }
  if (opts.propertyType && opts.propertyType !== "all") {
    conditions.push(eq(fund.propertyType, opts.propertyType));
  }
  if (opts.search) {
    const pattern = `%${opts.search}%`;
    conditions.push(
      or(
        ilike(fund.name, pattern),
        ilike(fund.location, pattern),
        ilike(fund.tagline, pattern),
      ),
    );
  }
  const whereClause = conditions.length ? and(...conditions) : undefined;

  const rows = await db
    .select()
    .from(fund)
    .where(whereClause)
    .orderBy(desc(fund.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(fund)
    .where(whereClause);

  return {
    funds: rows as Omit<FundWithImages, "images">[],
    total: count,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(count / limit)),
  };
}

export async function listFundsWithImages(opts: ListFundsOptions = {}) {
  const result = await listFunds(opts);
  if (result.funds.length === 0) return { ...result, funds: [] };
  const ids = result.funds.map((f) => f.id);
  const images = await db
    .select({
      id: fundImage.id,
      fundId: fundImage.fundId,
      url: fundImage.url,
      alt: fundImage.alt,
      sortOrder: fundImage.sortOrder,
    })
    .from(fundImage)
    .where(inArray(fundImage.fundId, ids))
    .orderBy(asc(fundImage.sortOrder));
  const grouped = new Map<string, FundWithImages["images"]>();
  for (const img of images) {
    if (!grouped.has(img.fundId)) grouped.set(img.fundId, []);
    grouped.get(img.fundId)!.push(img);
  }
  return {
    ...result,
    funds: result.funds.map((f) => ({
      ...f,
      images: grouped.get(f.id) ?? [],
    })) as FundWithImages[],
  };
}

export async function addFundImage(
  fundId: string,
  url: string,
  alt?: string | null,
) {
  const id = generateId();
  // Determine next sortOrder
  const [{ max }] = await db
    .select({
      max: sql<number>`coalesce(max(${fundImage.sortOrder}), -1)`,
    })
    .from(fundImage)
    .where(eq(fundImage.fundId, fundId));
  await db.insert(fundImage).values({
    id,
    fundId,
    url,
    alt: alt ?? null,
    sortOrder: (max ?? -1) + 1,
  });
  return id;
}

export async function removeFundImage(imageId: string) {
  await db.delete(fundImage).where(eq(fundImage.id, imageId));
}

// Helpers used by client UIs to format numeric/string Drizzle values.
export function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number") return value;
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}
