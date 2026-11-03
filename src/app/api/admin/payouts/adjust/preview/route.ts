import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { balanceAdjustPreviewSchema } from "@/lib/schemas";
import { previewBalanceAdjustment } from "@/utils/balance-adjustments";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = balanceAdjustPreviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const plan = await previewBalanceAdjustment({
      userId: parsed.data.userId,
      targetReturns: parsed.data.targetReturns,
      installments: parsed.data.installments,
    });
    return NextResponse.json(plan);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to build plan" },
      { status: 400 },
    );
  }
}
