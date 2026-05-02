"use client";

import * as React from "react";
import Link from "next/link";
import Filter from "./filter";
import ProjectCard from "./project-card";

import type { Investment } from "./types";

export type MarketplaceFund = {
  slug: string;
  name: string;
  tagline: string | null;
  coverImage: string;
  location: string;
  propertyType: string;
  status: string;
  units: number | null;
  targetIrrPercent: string | null;
  equityMultiple: string | null;
  targetAnnualReturnPercent: number;
  minimumInvestment: number;
};

interface Props {
  funds: MarketplaceFund[];
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  multifamily: "Multifamily",
  mixed_use: "Mixed Use",
  commercial: "Commercial",
  hospitality: "Hospitality",
};

export function InvestmentMarketplace({ funds }: Props) {
  const propertyTypes = React.useMemo(() => {
    const set = new Set(funds.map((f) => f.propertyType));
    return ["All", ...Array.from(set).map((p) => PROPERTY_TYPE_LABELS[p] ?? p)];
  }, [funds]);

  // Adapt our DB shape to the legacy Filter component's expected shape.
  const adaptedAll: Investment[] = funds.map((f) => ({
    title: f.name,
    img: f.coverImage,
    location_desc: f.location,
    categories: PROPERTY_TYPE_LABELS[f.propertyType] ?? f.propertyType,
    isOversuscribed: f.status === "oversubscribed",
    total_Units: f.units ?? 0,
    targeted_IRR: f.targetIrrPercent ?? "Coming Soon",
    targeted_Equity_Multiple: f.equityMultiple ?? "Coming Soon",
  }));

  const [filtered, setFiltered] = React.useState<Investment[]>(adaptedAll);

  React.useEffect(() => {
    setFiltered(adaptedAll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [funds]);

  const slugByTitle = React.useMemo(() => {
    const map = new Map<string, string>();
    funds.forEach((f) => map.set(f.name, f.slug));
    return map;
  }, [funds]);

  return (
    <>
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 px-4 py-3 rounded-lg bg-[#1C2D49] text-white">
          <h3 className="text-lg font-semibold">Filter:</h3>
          <div className="flex-1">
            <Filter
              filterOptions={propertyTypes}
              data={adaptedAll}
              setProjectData={setFiltered}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              No funds match the selected filter.
            </p>
          </div>
        ) : (
          filtered.map((investment) => {
            const slug = slugByTitle.get(investment.title);
            const card = (
              <ProjectCard
                image={investment.img}
                image_desc={investment.title}
                title={investment.title}
                location={investment.location_desc}
                isOverSuscribed={investment.isOversuscribed}
                target_equity_multiple={investment.targeted_Equity_Multiple}
                targeted_irr={investment.targeted_IRR}
                totalUnits={investment.total_Units}
              />
            );
            return (
              <div
                key={investment.location_desc + investment.title}
                className="fade-in-child"
              >
                {slug ? (
                  <Link
                    href={`/investments/${slug}`}
                    className="block focus:outline-none"
                  >
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
