import Link from "next/link";
import { format } from "date-fns";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CircleDollarSign,
  Clock,
  XCircle,
  CheckCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { requireApprovedUser } from "@/lib/session";
import { listTransactions } from "@/utils/transactions";

export const metadata = { title: "Transactions" };

const usd = (n: number, opts?: { precise?: boolean }) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: opts?.precise ? 2 : 0,
  }).format(n);

const TYPE_META: Record<
  string,
  { label: string; icon: any; sign: 1 | -1; tint: "in" | "out" }
> = {
  investment_commit: {
    label: "Investment commit",
    icon: ArrowUpRight,
    sign: -1,
    tint: "out",
  },
  investment_active: {
    label: "Investment activated",
    icon: CircleDollarSign,
    sign: -1,
    tint: "out",
  },
  payout: {
    label: "Distribution",
    icon: ArrowDownLeft,
    sign: 1,
    tint: "in",
  },
  refund: {
    label: "Refund",
    icon: ArrowDownLeft,
    sign: 1,
    tint: "in",
  },
};

const STATUS_META: Record<string, { label: string; cls: string; Icon: any }> = {
  completed: {
    label: "Completed",
    cls: "bg-green-50 text-green-700 border-green-200",
    Icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    cls: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Icon: Clock,
  },
  failed: {
    label: "Failed",
    cls: "bg-red-50 text-red-700 border-red-200",
    Icon: XCircle,
  },
};

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string }>;
}) {
  const user = await requireApprovedUser();
  const sp = await searchParams;
  const page = parseInt(sp.page || "1");
  const type = sp.type || "all";

  const result = await listTransactions({
    userId: user.id,
    page,
    limit: 25,
    type,
  });

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
        <p className="text-sm text-muted-foreground">
          Every financial event on your account — investments, distributions,
          and refunds.
        </p>
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap gap-2">
        <FilterPill href="/transactions" label="All" active={type === "all"} />
        <FilterPill
          href="/transactions?type=payout"
          label="Distributions"
          active={type === "payout"}
        />
        <FilterPill
          href="/transactions?type=investment_active"
          label="Investments"
          active={type === "investment_active"}
        />
        <FilterPill
          href="/transactions?type=investment_commit"
          label="Pending commits"
          active={type === "investment_commit"}
        />
      </div>

      {result.transactions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card py-16 text-center">
          <CircleDollarSign className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No transactions match this filter yet.
          </p>
        </div>
      ) : (
        <section className="overflow-hidden rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Type</th>
                <th className="px-6 py-3 text-left font-medium">Description</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-right font-medium">Amount</th>
                <th className="px-6 py-3 text-right font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {result.transactions.map((t) => {
                const meta = TYPE_META[t.type] ?? TYPE_META.payout;
                const stMeta = STATUS_META[t.status] ?? STATUS_META.completed;
                const amount = parseFloat(t.amount) * meta.sign;
                return (
                  <tr key={t.id}>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span
                          className={
                            "inline-flex h-7 w-7 items-center justify-center rounded-full " +
                            (meta.tint === "in"
                              ? "bg-green-100 text-green-700"
                              : "bg-zinc-100 text-zinc-700")
                          }
                        >
                          <meta.icon className="h-3.5 w-3.5" />
                        </span>
                        {meta.label}
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm">
                      <div>{t.description}</div>
                      {t.fundSlug && (
                        <Link
                          href={`/investments/${t.fundSlug}`}
                          className="text-xs text-muted-foreground hover:text-foreground hover:underline"
                        >
                          {t.fundName}
                        </Link>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <Badge
                        variant="outline"
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs ${stMeta.cls}`}
                      >
                        <stMeta.Icon className="h-3 w-3" />
                        {stMeta.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span
                        className={
                          "tabular-nums font-semibold " +
                          (amount > 0
                            ? "text-green-700"
                            : amount < 0
                              ? "text-foreground"
                              : "")
                        }
                      >
                        {amount > 0 ? "+" : ""}
                        {usd(amount, { precise: true })}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right text-xs text-muted-foreground">
                      {format(new Date(t.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

      {result.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Page {result.page} of {result.totalPages} · {result.total} total
          </span>
          <div className="flex gap-2">
            {result.page > 1 && (
              <Link
                href={`/transactions?page=${result.page - 1}${type !== "all" ? `&type=${type}` : ""}`}
                className="rounded-md border px-3 py-1.5 text-xs hover:bg-muted/50"
              >
                Previous
              </Link>
            )}
            {result.page < result.totalPages && (
              <Link
                href={`/transactions?page=${result.page + 1}${type !== "all" ? `&type=${type}` : ""}`}
                className="rounded-md border px-3 py-1.5 text-xs hover:bg-muted/50"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        "rounded-full border px-3 py-1.5 text-xs transition-colors " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "hover:bg-muted/60")
      }
    >
      {label}
    </Link>
  );
}
