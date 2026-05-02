import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { payoutCreateSchema } from "@/lib/schemas";
import {
  distributePayoutRun,
  listPayouts,
  previewPayout,
} from "@/utils/payouts";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const sp = request.nextUrl.searchParams;
  const result = await listPayouts({
    page: parseInt(sp.get("page") || "1"),
    limit: parseInt(sp.get("limit") || "10"),
    fundId: sp.get("fundId") || undefined,
  });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = payoutCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const result = await distributePayoutRun({
      fundId: parsed.data.fundId,
      periodStart: new Date(parsed.data.periodStart),
      periodEnd: new Date(parsed.data.periodEnd),
      ratePercent: parsed.data.ratePercent,
      distributedBy: session.user.id,
      note: parsed.data.note || null,
    });
    return NextResponse.json(result, { status: 201 });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || "Failed to distribute payout" },
      { status: 400 },
    );
  }
}
