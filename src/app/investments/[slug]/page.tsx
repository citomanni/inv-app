import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CalendarDays,
  CircleDollarSign,
  Layers3,
  MapPin,
  Repeat,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import type { Metadata } from "next";

import { getFundBySlug, toNumber } from "@/utils/funds";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FloatingWhatsapp from "@/components/landing/FloatingWhatsapp";
import Footer from "@/components/landing/Footer";
import { FundGallery } from "../components/fund-gallery";

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  multifamily: "Multifamily",
  mixed_use: "Mixed Use",
  commercial: "Commercial",
  hospitality: "Hospitality",
};

const PAYOUT_LABELS: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annually: "Annually",
};

const DISTRIBUTION_LABELS: Record<string, string> = {
  cash_flow: "Cash Flow",
  appreciation: "Appreciation",
  mixed: "Cash Flow + Appreciation",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fund = await getFundBySlug(slug);
  if (!fund) return { title: "Investment not found" };
  return {
    title: fund.name,
    description: fund.tagline ?? fund.description.slice(0, 160),
  };
}

const usd = (n: number, opts?: { compact?: boolean }) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: opts?.compact ? "compact" : "standard",
    maximumFractionDigits: opts?.compact ? 1 : 0,
  }).format(n);

export default async function FundDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fund = await getFundBySlug(slug);
  if (!fund || fund.status === "archived" || fund.status === "draft") {
    notFound();
  }

  const totalSize = toNumber(fund.totalSize);
  const raised = toNumber(fund.raisedAmount);
  const minInvestment = toNumber(fund.minimumInvestment);
  const targetReturn = toNumber(fund.targetAnnualReturnPercent);
  const targetIrr = fund.targetIrrPercent ? toNumber(fund.targetIrrPercent) : null;
  const equityMultiple = fund.equityMultiple
    ? toNumber(fund.equityMultiple)
    : null;
  const progress = totalSize > 0 ? Math.min(100, (raised / totalSize) * 100) : 0;
  const galleryImages = [
    { id: "cover", url: fund.coverImage, alt: fund.name },
    ...fund.images.map((i) => ({
      id: i.id,
      url: i.url,
      alt: i.alt ?? fund.name,
    })),
  ];

  const isOversubscribed = fund.status === "oversubscribed";
  const isClosed = fund.status === "closed";

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative h-[480px] w-full overflow-hidden">
        <Image
          src={fund.coverImage}
          alt={fund.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/80" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10 text-white">
          <Link
            href="/investments"
            className="mb-4 inline-flex w-fit items-center gap-1 rounded-full border border-white/30 bg-black/20 px-3 py-1 text-xs uppercase tracking-wider backdrop-blur transition-colors hover:bg-black/40"
          >
            ← Back to investments
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-white/15 text-white backdrop-blur border-white/25">
              {PROPERTY_TYPE_LABELS[fund.propertyType] ?? fund.propertyType}
            </Badge>
            {isOversubscribed && (
              <Badge className="bg-red-500/90 text-white">Oversubscribed</Badge>
            )}
            {isClosed && (
              <Badge className="bg-zinc-700 text-white">Closed</Badge>
            )}
            <span className="inline-flex items-center gap-1 text-sm font-medium tracking-wide">
              <MapPin className="h-4 w-4" />
              {fund.location}
            </span>
          </div>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
            {fund.name}
          </h1>
          {fund.tagline && (
            <p className="mt-2 max-w-2xl text-base text-white/80 md:text-lg">
              {fund.tagline}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Left column */}
          <div>
            <FundGallery images={galleryImages} />

            <div className="mt-10">
              <h2 className="text-2xl font-bold text-[#181B31]">About this fund</h2>
              <p className="mt-3 whitespace-pre-line text-[#4A4A4A] leading-relaxed">
                {fund.description}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
              <Stat
                icon={TrendingUp}
                label="Target Annual Return"
                value={`${targetReturn.toFixed(1)}%`}
              />
              {targetIrr != null && (
                <Stat
                  icon={CircleDollarSign}
                  label="Target IRR"
                  value={`${targetIrr.toFixed(1)}%`}
                />
              )}
              {equityMultiple != null && (
                <Stat
                  icon={Layers3}
                  label="Equity Multiple"
                  value={`${equityMultiple.toFixed(2)}x`}
                />
              )}
              <Stat
                icon={CalendarDays}
                label="Hold Period"
                value={`${fund.holdYears} years`}
              />
              <Stat
                icon={Repeat}
                label="Distributions"
                value={PAYOUT_LABELS[fund.payoutFrequency]}
              />
              <Stat
                icon={Building2}
                label="Strategy"
                value={DISTRIBUTION_LABELS[fund.distributionType]}
              />
              {fund.units != null && (
                <Stat
                  icon={Building2}
                  label="Units"
                  value={fund.units.toString()}
                />
              )}
            </div>
          </div>

          {/* Right column — sticky offer card */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <div className="flex items-baseline justify-between">
                <span className="text-sm uppercase tracking-wider text-muted-foreground">
                  Minimum investment
                </span>
                <span className="text-2xl font-bold text-[#181B31]">
                  {usd(minInvestment)}
                </span>
              </div>

              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Raised</span>
                  <span className="font-medium text-foreground">
                    {usd(raised, { compact: true })} of{" "}
                    {usd(totalSize, { compact: true })}
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-[#1C2D49] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {progress.toFixed(0)}% funded
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 rounded-lg border bg-muted/40 p-4 text-center">
                <div>
                  <div className="text-xs text-muted-foreground">Annual yield</div>
                  <div className="text-lg font-bold text-[#181B31]">
                    {targetReturn.toFixed(1)}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Term</div>
                  <div className="text-lg font-bold text-[#181B31]">
                    {fund.holdYears} yr
                  </div>
                </div>
              </div>

              <div className="mt-5">
                {isClosed ? (
                  <Button disabled className="w-full" size="lg">
                    Fund closed
                  </Button>
                ) : isOversubscribed ? (
                  <Button disabled className="w-full" size="lg">
                    Oversubscribed
                  </Button>
                ) : (
                  <Button
                    asChild
                    className="w-full bg-[#1C2D49] hover:bg-[#243a62]"
                    size="lg"
                  >
                    <Link href={`/dashboard/invest/${fund.slug}`}>
                      Invest in this fund
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
                <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  KYC verification required to invest.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <FloatingWhatsapp />
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="mt-1 text-xl font-bold text-[#181B31]">{value}</div>
    </div>
  );
}
