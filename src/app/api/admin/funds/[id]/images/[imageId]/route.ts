import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { removeFundImage } from "@/utils/funds";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { imageId } = await params;
  await removeFundImage(imageId);
  return NextResponse.json({ ok: true });
}
