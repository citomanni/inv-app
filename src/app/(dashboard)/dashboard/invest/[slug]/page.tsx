import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

import { getFundBySlug, toNumber } from "@/utils/funds";
import { InvestForm } from "@/components/invest/invest-form";
import { Badge } from "@/components/ui/badge";

export default async function InvestPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fund = await getFundBySlug(slug);
  if (!fund || fund.status === "archived" || fund.status === "draft") {
    notFound();
  }
  if (fund.status !== "open") {
    redirect(`/investments/${fund.slug}`);
  }

  const totalSize = toNumber(fund.totalSize);
  const raised = toNumber(fund.raisedAmount);
  const minInvestment = toNumber(fund.minimumInvestment);

  // Pass a JSON-safe shape down to the client.
  const fundForClient = {
    id: fund.id,
    slug: fund.slug,
    name: fund.name,
    coverImage: fund.coverImage,
    location: fund.location,
    propertyType: fund.propertyType,
    minimumInvestment: minInvestment,
    targetAnnualReturnPercent: toNumber(fund.targetAnnualReturnPercent),
    holdYears: fund.holdYears,
    payoutFrequency: fund.payoutFrequency,
  };

  return (
    <div className="px-4 lg:px-6">
      <div className="mb-6">
        <Link
          href={`/investments/${fund.slug}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to fund details
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          Invest in {fund.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Confirm your commitment, transfer funds via bank, then upload your
          payment proof. Our team will activate your position within one
          business day.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <InvestForm fund={fundForClient} />

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={fund.coverImage}
                alt={fund.name}
                fill
                sizes="(min-width: 1024px) 320px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Accepting investments
              </Badge>
              <h3 className="mt-3 text-lg font-semibold">{fund.name}</h3>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {fund.location}
              </p>

              <dl className="mt-5 space-y-2 border-t pt-4 text-sm">
                <Row
                  label="Min. investment"
                  value={new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(minInvestment)}
                />
                <Row
                  label="Target annual return"
                  value={`${fundForClient.targetAnnualReturnPercent.toFixed(1)}%`}
                />
                <Row
                  label="Hold period"
                  value={`${fund.holdYears} years`}
                />
                <Row
                  label="Distributions"
                  value={
                    fund.payoutFrequency.charAt(0).toUpperCase() +
                    fund.payoutFrequency.slice(1)
                  }
                />
              </dl>

              <div className="mt-5 space-y-1">
                <div className="text-xs text-muted-foreground">
                  Raised so far
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${
                        totalSize > 0
                          ? Math.min(100, (raised / totalSize) * 100)
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(raised)}
                  </span>
                  <span>
                    of{" "}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(totalSize)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
