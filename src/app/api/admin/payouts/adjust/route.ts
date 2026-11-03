import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { balanceAdjustCommitSchema } from "@/lib/schemas";
import { applyBalanceAdjustment } from "@/utils/balance-adjustments";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = balanceAdjustCommitSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const result = await applyBalanceAdjustment({
      userId: parsed.data.userId,
      targetReturns: parsed.data.targetReturns,
      amounts: parsed.data.amounts,
      performedBy: session.user.id,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (e: any) {
    const message = e?.message || "Failed to apply adjustment";
    const status = message.includes("changed since preview") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
