import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { investmentCreateSchema } from "@/lib/schemas";
import { commitInvestment } from "@/utils/investments";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if ((session.user as any).kycStatus !== "approved") {
    return NextResponse.json(
      { error: "Complete KYC verification before investing" },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = investmentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const id = await commitInvestment({
      userId: session.user.id,
      fundId: parsed.data.fundId,
      amount: parsed.data.amount,
      paymentProofUrl: parsed.data.paymentProofUrl,
      paymentReference: parsed.data.paymentReference || null,
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to commit investment" },
      { status: 400 },
    );
  }
}
