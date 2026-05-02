import {
  IconBriefcase,
  IconCurrencyDollar,
  IconReportMoney,
  IconTrendingUp,
} from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listFunds } from "@/utils/funds";
import { getUserPortfolioStats } from "@/utils/investments";

const usd = (n: number, opts?: { compact?: boolean; precise?: boolean }) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: opts?.compact ? "compact" : "standard",
    maximumFractionDigits: opts?.precise ? 2 : opts?.compact ? 1 : 0,
  }).format(n);

export async function SectionCards({ userId }: { userId: string }) {
  const [stats, openFunds] = await Promise.all([
    getUserPortfolioStats(userId),
    listFunds({ status: "open", limit: 1 }),
  ]);

  const portfolioValue = stats.totalInvested + stats.totalReturns;
  const yieldPct =
    stats.totalInvested > 0
      ? (stats.totalReturns / stats.totalInvested) * 100
      : 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-bl *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Portfolio Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {usd(portfolioValue)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {yieldPct.toFixed(2)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Principal + accrued returns
          </div>
          <div className="text-muted-foreground">
            Across {stats.activeCount} active position
            {stats.activeCount === 1 ? "" : "s"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Investments</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.activeCount}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconBriefcase />
              {stats.pendingCount} pending
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Earning monthly distributions
          </div>
          <div className="text-muted-foreground">
            {stats.pendingCount > 0
              ? "Pending verification will activate after admin review"
              : "Browse the marketplace to add positions"}
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Returns Earned</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {usd(stats.totalReturns, { precise: true })}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconReportMoney />
              All time
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Sum of every distribution credited
          </div>
          <div className="text-muted-foreground">
            View the breakdown in <span className="font-medium">Transactions</span>
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Available Funds</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {openFunds.total}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconCurrencyDollar />
              Open
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Currently accepting investors
          </div>
          <div className="text-muted-foreground">
            Browse the <span className="font-medium">Investments</span> tab
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
