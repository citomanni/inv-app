import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";

import { SectionCards } from "@/components/section-cards";
import { requireApprovedUser } from "@/lib/session";
import { listUserPositions } from "@/utils/transactions";
import { listFundsWithImages, toNumber } from "@/utils/funds";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const usd = (n: number, opts?: { compact?: boolean }) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: opts?.compact ? "compact" : "standard",
    maximumFractionDigits: opts?.compact ? 1 : 0,
  }).format(n);

export default async function DashboardPage() {
  const user = await requireApprovedUser();

  const [positions, openFunds] = await Promise.all([
    listUserPositions(user.id),
    listFundsWithImages({ status: "open", limit: 4 }),
  ]);

  const activePositions = positions.filter((p) => p.status === "active");
  const recommendedFunds = openFunds.funds.filter(
    (f) => !activePositions.some((p) => p.fundId === f.id),
  );

  return (
    <>
      <SectionCards userId={user.id} />

      <div className="px-4 lg:px-6 space-y-6">
        {/* Active investments */}
        <section className="rounded-xl border bg-card">
          <header className="flex items-center justify-between border-b px-6 py-4">
            <div>
              <h2 className="text-base font-semibold">Your investments</h2>
              <p className="text-xs text-muted-foreground">
                Active positions earning returns.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/portfolio">
                View portfolio
                <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </header>

          {activePositions.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Building2 className="h-10 w-10 text-muted-foreground/40" />
              <div>
                <p className="font-medium">No active investments yet</p>
                <p className="text-sm text-muted-foreground">
                  Browse our open funds to start building your portfolio.
                </p>
              </div>
              <Button asChild>
                <Link href="/investments">Explore funds</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {activePositions.slice(0, 5).map((p) => (
                <Link
                  key={p.id}
                  href={`/investments/${p.fundSlug}`}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-muted/30"
                >
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={p.fundCoverImage}
                      alt={p.fundName}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="font-medium">{p.fundName}</span>
                    <span className="text-xs text-muted-foreground">
                      <MapPin className="mr-1 inline-block h-3 w-3" />
                      {p.fundLocation}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold tabular-nums">
                      {usd(toNumber(p.amount))}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      +{usd(toNumber(p.totalReturnsCredited))} earned
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Open funds you can invest in */}
        {recommendedFunds.length > 0 && (
          <section className="rounded-xl border bg-card">
            <header className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-base font-semibold">Open opportunities</h2>
                <p className="text-xs text-muted-foreground">
                  Funds currently accepting commitments.
                </p>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link href="/investments">
                  See all
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </header>
            <div className="grid grid-cols-1 gap-3 p-6 md:grid-cols-2 xl:grid-cols-4">
              {recommendedFunds.slice(0, 4).map((f) => {
                const min = toNumber(f.minimumInvestment);
                const target = toNumber(f.targetAnnualReturnPercent);
                return (
                  <Link
                    key={f.id}
                    href={`/investments/${f.slug}`}
                    className="group overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-[16/9] w-full bg-muted">
                      <Image
                        src={f.coverImage}
                        alt={f.name}
                        fill
                        sizes="(min-width: 1280px) 250px, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-1 text-sm font-semibold">
                        {f.name}
                      </h3>
                      <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {f.location}
                      </p>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <Badge variant="outline">
                          {target.toFixed(1)}% target
                        </Badge>
                        <span className="text-muted-foreground">
                          Min {usd(min)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
