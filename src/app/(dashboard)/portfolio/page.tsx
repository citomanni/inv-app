import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
  Building2,
  CalendarDays,
  CheckCircle,
  Clock,
  ExternalLink,
  TrendingUp,
  XCircle,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requireApprovedUser } from "@/lib/session";
import {
  listUserPositions,
  type PortfolioPosition,
} from "@/utils/transactions";
import { getUserPortfolioStats } from "@/utils/investments";

export const metadata = { title: "Portfolio" };

const usd = (n: number, opts?: { precise?: boolean }) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: opts?.precise ? 2 : 0,
  }).format(n);

const STATUS_BADGES: Record<
  string,
  { label: string; className: string; Icon: any }
> = {
  pending_verification: {
    label: "Pending verification",
    className:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
    Icon: Clock,
  },
  active: {
    label: "Active",
    className:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
    Icon: CheckCircle,
  },
  matured: {
    label: "Matured",
    className: "bg-purple-50 text-purple-700 border-purple-200",
    Icon: Sparkles,
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
    Icon: XCircle,
  },
  pending_payment: {
    label: "Awaiting payment",
    className: "bg-zinc-100 text-zinc-700 border-zinc-200",
    Icon: Clock,
  },
};

function StatusBadge({ status }: { status: string }) {
  const v = STATUS_BADGES[status] ?? STATUS_BADGES.pending_verification;
  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 px-2 py-1 text-xs ${v.className}`}
    >
      <v.Icon className="h-3 w-3" />
      {v.label}
    </Badge>
  );
}

export default async function PortfolioPage() {
  const user = await requireApprovedUser();
  const [positions, stats] = await Promise.all([
    listUserPositions(user.id),
    getUserPortfolioStats(user.id),
  ]);

  const portfolioValue = stats.totalInvested + stats.totalReturns;
  const yieldPct =
    stats.totalInvested > 0
      ? (stats.totalReturns / stats.totalInvested) * 100
      : 0;

  const groups: { title: string; items: PortfolioPosition[] }[] = [
    { title: "Active", items: positions.filter((p) => p.status === "active") },
    {
      title: "Pending review",
      items: positions.filter((p) => p.status === "pending_verification"),
    },
    {
      title: "Other",
      items: positions.filter(
        (p) =>
          p.status !== "active" &&
          p.status !== "pending_verification",
      ),
    },
  ];

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Portfolio</h1>
        <p className="text-sm text-muted-foreground">
          Every position you hold across our funds — from pending commitments to
          matured investments.
        </p>
      </div>

      {/* Hero summary */}
      <section className="grid gap-4 lg:grid-cols-3">
        <SummaryCard
          label="Total portfolio value"
          value={usd(portfolioValue)}
          subtitle={`Principal ${usd(stats.totalInvested)} · Returns ${usd(
            stats.totalReturns,
            { precise: true },
          )}`}
        />
        <SummaryCard
          label="All-time yield"
          value={`${yieldPct.toFixed(2)}%`}
          subtitle="Returns earned ÷ capital deployed"
        />
        <SummaryCard
          label="Position count"
          value={String(stats.activeCount)}
          subtitle={`${stats.pendingCount} awaiting verification`}
        />
      </section>

      {positions.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card py-16 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground/40" />
          <div>
            <p className="text-base font-medium">
              You don't have any positions yet
            </p>
            <p className="text-sm text-muted-foreground">
              Pick a fund from the marketplace to get started.
            </p>
          </div>
          <Button asChild>
            <Link href="/investments">Explore funds</Link>
          </Button>
        </div>
      ) : (
        groups
          .filter((g) => g.items.length > 0)
          .map((group) => (
            <section key={group.title} className="rounded-xl border bg-card">
              <header className="flex items-center justify-between border-b px-6 py-4">
                <h2 className="text-base font-semibold">
                  {group.title}{" "}
                  <span className="ml-1 text-xs font-normal text-muted-foreground">
                    ({group.items.length})
                  </span>
                </h2>
              </header>
              <div className="divide-y">
                {group.items.map((p) => (
                  <PositionRow key={p.id} position={p} />
                ))}
              </div>
            </section>
          ))
      )}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{subtitle}</div>
    </div>
  );
}

function PositionRow({ position }: { position: PortfolioPosition }) {
  const principal = parseFloat(position.amount);
  const returns = parseFloat(position.totalReturnsCredited);
  const annualRate = parseFloat(position.targetAnnualReturnPercent);

  return (
    <div className="grid grid-cols-1 gap-4 px-6 py-5 md:grid-cols-[1fr_auto_auto] md:items-center">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
          <Image
            src={position.fundCoverImage}
            alt={position.fundName}
            fill
            sizes="96px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <Link
            href={`/investments/${position.fundSlug}`}
            className="group inline-flex items-center gap-1 font-medium hover:underline"
          >
            {position.fundName}
            <ExternalLink className="h-3 w-3 text-muted-foreground transition-colors group-hover:text-foreground" />
          </Link>
          <p className="text-xs text-muted-foreground">
            {position.fundLocation} · {position.payoutFrequency}{" "}
            distributions · {position.holdYears}yr
          </p>
          <div className="mt-1 flex items-center gap-2">
            <StatusBadge status={position.status} />
            {position.activatedAt && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarDays className="h-3 w-3" />
                Active since{" "}
                {format(new Date(position.activatedAt), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 md:gap-8 md:text-right">
        <div>
          <div className="text-xs text-muted-foreground">Principal</div>
          <div className="font-semibold tabular-nums">{usd(principal)}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Returns earned</div>
          <div className="font-semibold tabular-nums text-green-700">
            +{usd(returns, { precise: true })}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Target</div>
          <div className="inline-flex items-center gap-1 font-semibold tabular-nums">
            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
            {annualRate.toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
}
