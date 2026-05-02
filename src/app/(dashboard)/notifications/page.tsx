import Link from "next/link";
import { format } from "date-fns";
import {
  Bell,
  CheckCircle2,
  CircleDollarSign,
  FileText,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from "lucide-react";

import { requireApprovedUser } from "@/lib/session";
import { listUserNotifications, markAllRead } from "@/utils/notifications";

export const metadata = { title: "Notifications" };

const TYPE_META: Record<
  string,
  { label: string; icon: any; tint: string }
> = {
  kyc_approved: {
    label: "KYC",
    icon: ShieldCheck,
    tint: "bg-green-100 text-green-700",
  },
  kyc_rejected: {
    label: "KYC",
    icon: XCircle,
    tint: "bg-red-100 text-red-700",
  },
  investment_activated: {
    label: "Investment",
    icon: CheckCircle2,
    tint: "bg-blue-100 text-blue-700",
  },
  investment_rejected: {
    label: "Investment",
    icon: XCircle,
    tint: "bg-red-100 text-red-700",
  },
  payout_credited: {
    label: "Payout",
    icon: CircleDollarSign,
    tint: "bg-emerald-100 text-emerald-700",
  },
  document_added: {
    label: "Document",
    icon: FileText,
    tint: "bg-purple-100 text-purple-700",
  },
};

export default async function NotificationsPage() {
  const user = await requireApprovedUser();
  // Mark everything read on view (simplest UX for the demo).
  await markAllRead(user.id);
  const items = await listUserNotifications(user.id, { limit: 100 });

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
        <p className="text-sm text-muted-foreground">
          Updates on your investments, KYC status, and account activity.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card py-16 text-center">
          <Bell className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No notifications yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          {items.map((n) => {
            const meta =
              TYPE_META[n.type] ??
              ({
                label: "Update",
                icon: Bell,
                tint: "bg-zinc-100 text-zinc-700",
              } as const);
            const body = (
              <div className="flex items-start gap-4 px-6 py-5">
                <span
                  className={
                    "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full " +
                    meta.tint
                  }
                >
                  <meta.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-medium">{n.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(n.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  {n.body && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {n.body}
                    </p>
                  )}
                </div>
              </div>
            );
            return n.url ? (
              <Link
                key={n.id}
                href={n.url}
                className="block border-b last:border-b-0 transition-colors hover:bg-muted/40"
              >
                {body}
              </Link>
            ) : (
              <div key={n.id} className="border-b last:border-b-0">
                {body}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
