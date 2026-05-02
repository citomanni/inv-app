import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { previewPayout } from "@/utils/payouts";

const schema = z.object({
  fundId: z.string().min(1),
  ratePercent: z.coerce.number().min(0).max(100),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const result = await previewPayout(parsed.data);
  return NextResponse.json(result);
}
