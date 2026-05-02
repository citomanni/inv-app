import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { investmentReviewSchema } from "@/lib/schemas";
import { getInvestmentDetail, reviewInvestment } from "@/utils/investments";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const detail = await getInvestmentDetail(id);
  if (!detail) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(detail);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = investmentReviewSchema.safeParse(body);
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
    await reviewInvestment({
      investmentId: id,
      reviewerId: session.user.id,
      decision: parsed.data.decision,
      rejectionReason: parsed.data.rejectionReason,
    });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to review investment" },
      { status: 400 },
    );
  }
}
