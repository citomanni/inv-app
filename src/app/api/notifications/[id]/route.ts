import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { markNotificationRead } from "@/utils/notifications";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  await markNotificationRead(id, session.user.id);
  return NextResponse.json({ ok: true });
}
