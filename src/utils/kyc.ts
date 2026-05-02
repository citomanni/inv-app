import "server-only";
import { db } from "@/db";
import { kycSubmission, user, notification } from "@/db/schema";
import { generateId } from "@/lib/id";
import type { KycSubmissionInput } from "@/lib/schemas";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

export type KycStatus = "not_submitted" | "pending" | "approved" | "rejected";

export interface KycListItem {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  fullName: string;
  status: KycStatus;
  country: string;
  idType: string;
  createdAt: Date;
  reviewedAt: Date | null;
  rejectionReason: string | null;
}

export async function createKycSubmission(
  userId: string,
  input: KycSubmissionInput,
) {
  const id = generateId();
  const now = new Date();

  await db.transaction(async (tx) => {
    await tx.insert(kycSubmission).values({
      id,
      userId,
      fullName: input.fullName,
      dateOfBirth: new Date(input.dateOfBirth),
      nationality: input.nationality,
      phoneNumber: input.phoneNumber,
      occupation: input.occupation || null,
      employer: input.employer || null,
      addressLine1: input.addressLine1,
      addressLine2: input.addressLine2 || null,
      city: input.city,
      state: input.state || null,
      country: input.country,
      postalCode: input.postalCode,
      annualIncomeBand: input.annualIncomeBand,
      sourceOfFunds: input.sourceOfFunds,
      accreditedInvestor: input.accreditedInvestor,
      idType: input.idType,
      idNumber: input.idNumber,
      idFrontUrl: input.idFrontUrl,
      idBackUrl: input.idBackUrl || null,
      proofOfAddressUrl: input.proofOfAddressUrl,
      selfieUrl: input.selfieUrl || null,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });

    await tx
      .update(user)
      .set({ kycStatus: "pending", updatedAt: now })
      .where(eq(user.id, userId));
  });

  return id;
}

export async function getLatestKycForUser(userId: string) {
  const [row] = await db
    .select()
    .from(kycSubmission)
    .where(eq(kycSubmission.userId, userId))
    .orderBy(desc(kycSubmission.createdAt))
    .limit(1);
  return row ?? null;
}

export async function reviewKycSubmission(opts: {
  submissionId: string;
  reviewerId: string;
  decision: "approve" | "reject";
  rejectionReason?: string;
}) {
  const now = new Date();
  const newStatus = opts.decision === "approve" ? "approved" : "rejected";

  await db.transaction(async (tx) => {
    const [submission] = await tx
      .select()
      .from(kycSubmission)
      .where(eq(kycSubmission.id, opts.submissionId))
      .limit(1);

    if (!submission) throw new Error("KYC submission not found");
    if (submission.status !== "pending") {
      throw new Error("This submission has already been reviewed");
    }

    await tx
      .update(kycSubmission)
      .set({
        status: newStatus,
        rejectionReason:
          opts.decision === "reject" ? opts.rejectionReason ?? null : null,
        reviewedBy: opts.reviewerId,
        reviewedAt: now,
        updatedAt: now,
      })
      .where(eq(kycSubmission.id, opts.submissionId));

    await tx
      .update(user)
      .set({ kycStatus: newStatus, updatedAt: now })
      .where(eq(user.id, submission.userId));

    await tx.insert(notification).values({
      id: generateId(),
      userId: submission.userId,
      type: opts.decision === "approve" ? "kyc_approved" : "kyc_rejected",
      title:
        opts.decision === "approve"
          ? "Your identity verification was approved"
          : "Your identity verification needs attention",
      body:
        opts.decision === "approve"
          ? "You can now invest in any of our funds."
          : opts.rejectionReason ??
            "Please review your submission and try again.",
      url: opts.decision === "approve" ? "/dashboard" : "/onboarding",
      createdAt: now,
    });
  });
}

export async function listKycSubmissions(opts: {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}) {
  const { page, limit, status, search } = opts;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (status && status !== "all") {
    conditions.push(eq(kycSubmission.status, status));
  }
  if (search) {
    const pattern = `%${search}%`;
    conditions.push(
      or(
        ilike(kycSubmission.fullName, pattern),
        ilike(user.email, pattern),
        ilike(user.name, pattern),
      ),
    );
  }
  const whereClause =
    conditions.length > 0 ? and(...conditions) : undefined;

  const rows = await db
    .select({
      id: kycSubmission.id,
      userId: kycSubmission.userId,
      userName: user.name,
      userEmail: user.email,
      fullName: kycSubmission.fullName,
      status: kycSubmission.status,
      country: kycSubmission.country,
      idType: kycSubmission.idType,
      createdAt: kycSubmission.createdAt,
      reviewedAt: kycSubmission.reviewedAt,
      rejectionReason: kycSubmission.rejectionReason,
    })
    .from(kycSubmission)
    .innerJoin(user, eq(kycSubmission.userId, user.id))
    .where(whereClause)
    .orderBy(desc(kycSubmission.createdAt))
    .limit(limit)
    .offset(offset);

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(kycSubmission)
    .innerJoin(user, eq(kycSubmission.userId, user.id))
    .where(whereClause);

  return {
    submissions: rows as KycListItem[],
    total: count,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(count / limit)),
  };
}

export async function getKycSubmissionById(id: string) {
  const [row] = await db
    .select({
      submission: kycSubmission,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        kycStatus: user.kycStatus,
        createdAt: user.createdAt,
      },
    })
    .from(kycSubmission)
    .innerJoin(user, eq(kycSubmission.userId, user.id))
    .where(eq(kycSubmission.id, id))
    .limit(1);

  return row ?? null;
}
