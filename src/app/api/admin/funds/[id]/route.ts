import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { fundUpdateSchema } from "@/lib/schemas";
import { archiveFund, getFundById, updateFund } from "@/utils/funds";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const fund = await getFundById(id);
  if (!fund) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ fund });
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
  const parsed = fundUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { id } = await params;
  const data: any = { ...parsed.data };
  if (data.targetIrrPercent === "") data.targetIrrPercent = null;
  if (data.equityMultiple === "") data.equityMultiple = null;
  if (data.units === "") data.units = null;
  if (data.tagline === "") data.tagline = null;

  await updateFund(id, data);
  const updated = await getFundById(id);
  return NextResponse.json({ fund: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  await archiveFund(id);
  return NextResponse.json({ ok: true });
}
