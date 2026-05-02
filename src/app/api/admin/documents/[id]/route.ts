import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { deleteDocument } from "@/utils/documents";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  await deleteDocument(id);
  return NextResponse.json({ ok: true });
}
