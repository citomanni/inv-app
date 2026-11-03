import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { adminCreateInvestment, listInvestments } from "@/utils/investments";
import { adminInvestmentCreateSchema } from "@/lib/schemas";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sp = request.nextUrl.searchParams;
  const result = await listInvestments({
    page: parseInt(sp.get("page") || "1"),
    limit: parseInt(sp.get("limit") || "10"),
    status: sp.get("status") || undefined,
    search: sp.get("search") || undefined,
    fundId: sp.get("fundId") || undefined,
    userId: sp.get("userId") || undefined,
  });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = adminInvestmentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const id = await adminCreateInvestment({
      userId: parsed.data.userId,
      fundId: parsed.data.fundId,
      amount: parsed.data.amount,
      paymentProofUrl: parsed.data.paymentProofUrl,
      paymentReference: parsed.data.paymentReference || null,
      reviewerId: session.user.id,
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to create investment" },
      { status: 400 },
    );
  }
}
