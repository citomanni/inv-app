import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { kycReviewSchema } from "@/lib/schemas";
import { getKycSubmissionById, reviewKycSubmission } from "@/utils/kyc";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const row = await getKycSubmissionById(id);
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(row);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = kycReviewSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid review", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  if (
    parsed.data.decision === "reject" &&
    !parsed.data.rejectionReason?.trim()
  ) {
    return NextResponse.json(
      { error: "A reason is required when rejecting" },
      { status: 400 },
    );
  }

  try {
    const { id } = await params;
    await reviewKycSubmission({
      submissionId: id,
      reviewerId: session.user.id,
      decision: parsed.data.decision,
      rejectionReason: parsed.data.rejectionReason,
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to review submission" },
      { status: 400 },
    );
  }
}
