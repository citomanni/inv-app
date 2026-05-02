"use client";

import * as React from "react";
import Link from "next/link";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
import { Bell } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function NotificationsBell() {
  const { data, mutate } = useSWR("/api/notifications?limit=10", fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
  });

  const items = (data?.notifications ?? []) as any[];
  const unread = data?.unread ?? 0;

  const handleMarkAll = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await fetch("/api/notifications", { method: "PATCH" });
    mutate();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2.5">
          <span className="text-sm font-semibold">Notifications</span>
          {unread > 0 && (
            <button
              onClick={handleMarkAll}
              className="text-xs text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {items.length === 0 ? (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              You're all caught up.
            </div>
          ) : (
            items.map((n) => {
              const isUnread = !n.readAt;
              const inner = (
                <div className="flex flex-col px-3 py-2.5">
                  <span className="text-sm font-medium">{n.title}</span>
                  {n.body && (
                    <span className="line-clamp-2 text-xs text-muted-foreground">
                      {n.body}
                    </span>
                  )}
                  <span className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {formatDistanceToNow(new Date(n.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              );
              const className =
                "block border-b last:border-b-0 transition-colors hover:bg-muted/40 " +
                (isUnread ? "bg-blue-50/40 dark:bg-blue-950/20" : "");
              return n.url ? (
                <Link key={n.id} href={n.url} className={className}>
                  {inner}
                </Link>
              ) : (
                <div key={n.id} className={className}>
                  {inner}
                </div>
              );
            })
          )}
        </div>
        <div className="border-t">
          <Link
            href="/notifications"
            className="block px-3 py-2.5 text-center text-xs text-muted-foreground hover:bg-muted/40"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
