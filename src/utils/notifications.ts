import "server-only";
import { db } from "@/db";
import { notification } from "@/db/schema";
import { and, desc, eq, isNull, sql } from "drizzle-orm";

export async function listUserNotifications(
  userId: string,
  opts: { limit?: number; onlyUnread?: boolean } = {},
) {
  const limit = Math.min(100, Math.max(1, opts.limit ?? 50));
  const conditions = [eq(notification.userId, userId)];
  if (opts.onlyUnread) conditions.push(isNull(notification.readAt));
  return db
    .select()
    .from(notification)
    .where(and(...conditions))
    .orderBy(desc(notification.createdAt))
    .limit(limit);
}

export async function unreadCountForUser(userId: string) {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notification)
    .where(
      and(eq(notification.userId, userId), isNull(notification.readAt)),
    );
  return Number(count ?? 0);
}

export async function markNotificationRead(id: string, userId: string) {
  await db
    .update(notification)
    .set({ readAt: new Date() })
    .where(and(eq(notification.id, id), eq(notification.userId, userId)));
}

export async function markAllRead(userId: string) {
  await db
    .update(notification)
    .set({ readAt: new Date() })
    .where(
      and(eq(notification.userId, userId), isNull(notification.readAt)),
    );
}
