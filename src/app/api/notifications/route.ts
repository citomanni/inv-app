import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import {
  listUserNotifications,
  markAllRead,
  unreadCountForUser,
} from "@/utils/notifications";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const sp = request.nextUrl.searchParams;
  const onlyUnread = sp.get("unread") === "true";
  const [items, unread] = await Promise.all([
    listUserNotifications(session.user.id, {
      limit: parseInt(sp.get("limit") || "50"),
      onlyUnread,
    }),
    unreadCountForUser(session.user.id),
  ]);
  return NextResponse.json({ notifications: items, unread });
}

export async function PATCH() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await markAllRead(session.user.id);
  return NextResponse.json({ ok: true });
}
