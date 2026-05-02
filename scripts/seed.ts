/**
 * Seed script — populates the database with starter funds backed by the
 * real-estate photos in /public/2025/07. Run with:
 *
 *   pnpm tsx scripts/seed.ts
 *
 * Idempotent: already-seeded funds (matched by slug) are skipped.
 */

import "dotenv/config";
import { db } from "../src/db";
import { fund, fundImage } from "../src/db/schema";
import { generateId } from "../src/lib/id";
import { eq } from "drizzle-orm";

type SeedFund = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  cover: string;
  gallery: string[];
  location: string;
  propertyType: "multifamily" | "mixed_use" | "commercial" | "hospitality";
  totalSize: number;
  raisedAmount: number;
  minimumInvestment: number;
  targetAnnualReturnPercent: number;
  targetIrrPercent: number;
  equityMultiple: number;
  holdYears: number;
  payoutFrequency: "monthly" | "quarterly" | "annually";
  distributionType: "cash_flow" | "appreciation" | "mixed";
  units: number;
  status: "draft" | "open" | "closed" | "oversubscribed";
};

const IMG = (file: string) => `/2025/07/${file}`;

const FUNDS: SeedFund[] = [
  {
    slug: "10x-integra-shores",
    name: "10X Integra Shores",
    tagline: "Coastal multifamily community in Southwest Florida",
    description:
      "10X Integra Shores is a 312-unit garden-style apartment community located minutes from Florida's gulf coast. The fund targets durable in-place cash flow from existing rents, with upside through a value-add interior renovation program. Investors participate in distributions monthly, with a structured exit between years 5 and 7.",
    cover: IMG("WEB_NEW_01-10XINTEGRASHORES.jpg"),
    gallery: [
      IMG("WEB_NEW_02-10XHARBOURPINES.jpg"),
      IMG("WEB_NEW_03-10XHARBOURPALMS.jpg"),
      IMG("WEB_NEW_04-10XHARBOURCAYSOUTH.jpg"),
      IMG("10x-investment-desktop-3.jpg"),
    ],
    location: "Naples, FL",
    propertyType: "multifamily",
    totalSize: 18_000_000,
    raisedAmount: 12_400_000,
    minimumInvestment: 5_000,
    targetAnnualReturnPercent: 8.5,
    targetIrrPercent: 14,
    equityMultiple: 1.9,
    holdYears: 6,
    payoutFrequency: "monthly",
    distributionType: "mixed",
    units: 312,
    status: "open",
  },
  {
    slug: "10x-harbour-bay",
    name: "10X Harbour Bay",
    tagline: "248-unit waterfront community with marina access",
    description:
      "Located along the intracoastal in Pinellas County, Harbour Bay combines premium amenities with stable Class B rents. The investment thesis blends income from current operations with appreciation captured through ongoing upgrades to the dockage and clubhouse.",
    cover: IMG("WEB_NEW_06-10XHARBOURBAY.jpg"),
    gallery: [
      IMG("WEB_NEW_05-10XHARBOURCAY.jpg"),
      IMG("WEB_NEW_07-10XHARBOURBREEZE.jpg"),
      IMG("WEB_NEW_04-10XHARBOURCAYSOUTH.jpg"),
    ],
    location: "St. Petersburg, FL",
    propertyType: "multifamily",
    totalSize: 14_500_000,
    raisedAmount: 14_500_000,
    minimumInvestment: 5_000,
    targetAnnualReturnPercent: 7.8,
    targetIrrPercent: 13.5,
    equityMultiple: 1.85,
    holdYears: 5,
    payoutFrequency: "monthly",
    distributionType: "cash_flow",
    units: 248,
    status: "oversubscribed",
  },
  {
    slug: "10x-wellington-club",
    name: "10X Wellington Club",
    tagline: "Boutique luxury rentals near Palm Beach",
    description:
      "Wellington Club is a 96-unit boutique multifamily asset attached to a private equestrian community. Rents trend with Palm Beach County premium markets, and the fund targets a moderately leveraged hold with predictable quarterly distributions.",
    cover: IMG("WEB_NEW_08-10XWELLINGTONCLUB.jpg"),
    gallery: [
      IMG("WEB_NEW_09-10XTRELLIS.jpg"),
      IMG("WEB_NEW_10-10XAUDUBON.jpg"),
      IMG("WEB_NEW_11-10XIONALAKES.jpg"),
    ],
    location: "Wellington, FL",
    propertyType: "multifamily",
    totalSize: 9_750_000,
    raisedAmount: 5_125_000,
    minimumInvestment: 10_000,
    targetAnnualReturnPercent: 9.2,
    targetIrrPercent: 15.5,
    equityMultiple: 2.05,
    holdYears: 5,
    payoutFrequency: "quarterly",
    distributionType: "mixed",
    units: 96,
    status: "open",
  },
  {
    slug: "10x-murano-lakes",
    name: "10X Murano Lakes",
    tagline: "Stabilized 220-unit lakefront community",
    description:
      "Murano Lakes is a Class A community in Tampa's high-growth I-75 corridor. The asset benefits from rising rents and strong occupancy, with the fund's strategy centred on capturing premium renewals via a light interior refresh and amenity expansion.",
    cover: IMG("WEB_NEW_12-10XMURANO.jpg"),
    gallery: [
      IMG("WEB_NEW_15-10XWOODWAY.jpg"),
      IMG("WEB_NEW_18-10XNAPLES.jpg"),
      IMG("WEB_NEW_19-10XSTELLA.jpg"),
    ],
    location: "Tampa, FL",
    propertyType: "multifamily",
    totalSize: 12_000_000,
    raisedAmount: 4_300_000,
    minimumInvestment: 5_000,
    targetAnnualReturnPercent: 8.0,
    targetIrrPercent: 13.8,
    equityMultiple: 1.9,
    holdYears: 6,
    payoutFrequency: "monthly",
    distributionType: "mixed",
    units: 220,
    status: "open",
  },
  {
    slug: "10x-reserve-port-st-lucie",
    name: "10X Reserve Port St. Lucie",
    tagline: "Newly delivered 184-unit Class A community",
    description:
      "Located in one of Florida's fastest-growing MSAs, this fund acquires a recently delivered Class A community with stable, in-place leases. The conservative business plan centres on operational efficiency and modest rent growth, suiting investors seeking durable monthly cash flow.",
    cover: IMG("WEB_NEW_13-10XRESERVEPORTSTLUCIE.jpg"),
    gallery: [
      IMG("WEB_NEW_14-10XRESERVEORMOND.jpg"),
      IMG("WEB_NEW_16-GRANDVIEW.jpg"),
      IMG("WEB_NEW_22-10XPANAMACITYBEACH.jpg"),
    ],
    location: "Port St. Lucie, FL",
    propertyType: "multifamily",
    totalSize: 11_500_000,
    raisedAmount: 8_700_000,
    minimumInvestment: 5_000,
    targetAnnualReturnPercent: 7.5,
    targetIrrPercent: 12.5,
    equityMultiple: 1.75,
    holdYears: 5,
    payoutFrequency: "monthly",
    distributionType: "cash_flow",
    units: 184,
    status: "open",
  },
  {
    slug: "10x-sawgrass",
    name: "10X Sawgrass",
    tagline: "Suburban 156-unit value-add play",
    description:
      "Sawgrass is a value-add multifamily acquisition in west Broward county. The plan combines unit-level renovations with light operational improvements and exit at stabilization in year 5. Distributions begin in year 2 and grow with rent uplifts.",
    cover: IMG("WEB_NEW_21-10XSAWGRASS.jpg"),
    gallery: [
      IMG("WEB_NEW_24-10XRETREATPANAMA.jpeg"),
      IMG("WEB_NEW_25-10XADDISONPLACE.jpg"),
      IMG("WEB_NEW_26-10XPORTROYALE.jpg"),
    ],
    location: "Sunrise, FL",
    propertyType: "multifamily",
    totalSize: 9_200_000,
    raisedAmount: 1_840_000,
    minimumInvestment: 10_000,
    targetAnnualReturnPercent: 9.5,
    targetIrrPercent: 16,
    equityMultiple: 2.1,
    holdYears: 5,
    payoutFrequency: "quarterly",
    distributionType: "appreciation",
    units: 156,
    status: "open",
  },
  {
    slug: "10x-boca-raton",
    name: "10X Boca Raton",
    tagline: "Mixed-use luxury offering in core Boca",
    description:
      "10X Boca Raton is a mixed-use development combining upscale residences with ground-floor retail in one of South Florida's most affluent submarkets. The fund balances cash flow from leases with appreciation from continuing area gentrification.",
    cover: IMG("WEB_NEW_27-10XBOCARATON.jpg"),
    gallery: [
      IMG("WEB_NEW_46-10XBOCA101VIAMIZNER.jpg"),
      IMG("WEB_NEW_25-10XADDISONPLACE.jpg"),
      IMG("WEB_NEW_17-10XBREAKFAST.jpg"),
    ],
    location: "Boca Raton, FL",
    propertyType: "mixed_use",
    totalSize: 22_000_000,
    raisedAmount: 13_500_000,
    minimumInvestment: 25_000,
    targetAnnualReturnPercent: 9.0,
    targetIrrPercent: 16.5,
    equityMultiple: 2.2,
    holdYears: 7,
    payoutFrequency: "quarterly",
    distributionType: "mixed",
    units: 142,
    status: "open",
  },
  {
    slug: "10x-las-olas-walk",
    name: "10X Las Olas Walk",
    tagline: "Urban core mixed-use in Fort Lauderdale",
    description:
      "On a high-traffic corner of Fort Lauderdale's Las Olas Boulevard, this fund acquires a mixed-use building with 126 luxury units and street-level retail. Cash flow is supplemented by rising land values in the surrounding pedestrian district.",
    cover: IMG("WEB_NEW_33-10XLASOLASWALK.jpg"),
    gallery: [
      IMG("WEB_NEW_34-10XRIVERWALK.jpg"),
      IMG("WEB_NEW_35-10XSUNRISE.jpg"),
      IMG("WEB_NEW_28-10XFORTLAUDERDALE-1.jpg"),
    ],
    location: "Fort Lauderdale, FL",
    propertyType: "mixed_use",
    totalSize: 16_750_000,
    raisedAmount: 9_900_000,
    minimumInvestment: 10_000,
    targetAnnualReturnPercent: 8.4,
    targetIrrPercent: 14.5,
    equityMultiple: 1.95,
    holdYears: 6,
    payoutFrequency: "monthly",
    distributionType: "mixed",
    units: 126,
    status: "open",
  },
  {
    slug: "10x-miami-river",
    name: "10X Miami River",
    tagline: "Riverfront mid-rise in growing Miami submarket",
    description:
      "10X Miami River is a 198-unit riverfront mid-rise with skyline views and walkable access to Brickell and downtown Miami. The fund's thesis centres on capturing premium rents from young professionals as Miami River continues to densify.",
    cover: IMG("WEB_NEW_37-10XMIAMIRIVER.jpg"),
    gallery: [
      IMG("WEB_NEW_36-10XWESTON.jpg"),
      IMG("WEB_NEW_40-10XTARPON.jpg"),
      IMG("WEB_NEW_43-JACARANDA.jpg"),
    ],
    location: "Miami, FL",
    propertyType: "mixed_use",
    totalSize: 28_500_000,
    raisedAmount: 22_300_000,
    minimumInvestment: 25_000,
    targetAnnualReturnPercent: 9.8,
    targetIrrPercent: 17.5,
    equityMultiple: 2.35,
    holdYears: 7,
    payoutFrequency: "quarterly",
    distributionType: "mixed",
    units: 198,
    status: "open",
  },
  {
    slug: "the-edge-flagler-village",
    name: "The Edge at Flagler Village",
    tagline: "Class A high-rise in Fort Lauderdale's arts district",
    description:
      "A 234-unit Class A high-rise in Fort Lauderdale's Flagler Village arts district. The fund combines stabilized in-place rents with continued rent growth as Flagler Village matures into a primary urban submarket.",
    cover: IMG("WEB_NEW_42-10XFLAGLER.jpg"),
    gallery: [
      IMG("WEB_NEW_44-THEEDGE.jpg"),
      IMG("WEB_NEW_39-THEEDISON.jpg"),
      IMG("WEB_NEW_41-10XTHEFORUM.jpg"),
    ],
    location: "Fort Lauderdale, FL",
    propertyType: "mixed_use",
    totalSize: 24_000_000,
    raisedAmount: 6_000_000,
    minimumInvestment: 10_000,
    targetAnnualReturnPercent: 9.2,
    targetIrrPercent: 15.8,
    equityMultiple: 2.1,
    holdYears: 6,
    payoutFrequency: "monthly",
    distributionType: "mixed",
    units: 234,
    status: "open",
  },
];

async function main() {
  console.log("Seeding funds…");
  let inserted = 0;
  let skipped = 0;
  const now = new Date();

  for (const f of FUNDS) {
    const [existing] = await db
      .select({ id: fund.id })
      .from(fund)
      .where(eq(fund.slug, f.slug))
      .limit(1);

    if (existing) {
      skipped += 1;
      console.log(`  • skip  ${f.slug} (already exists)`);
      continue;
    }

    const fundId = generateId();
    await db.insert(fund).values({
      id: fundId,
      slug: f.slug,
      name: f.name,
      tagline: f.tagline,
      description: f.description,
      coverImage: f.cover,
      location: f.location,
      propertyType: f.propertyType,
      totalSize: String(f.totalSize),
      raisedAmount: String(f.raisedAmount),
      minimumInvestment: String(f.minimumInvestment),
      targetAnnualReturnPercent: String(f.targetAnnualReturnPercent),
      targetIrrPercent: String(f.targetIrrPercent),
      equityMultiple: String(f.equityMultiple),
      holdYears: f.holdYears,
      payoutFrequency: f.payoutFrequency,
      distributionType: f.distributionType,
      units: f.units,
      status: f.status,
      openedAt: f.status === "draft" ? null : now,
      createdAt: now,
      updatedAt: now,
    });

    for (let i = 0; i < f.gallery.length; i++) {
      await db.insert(fundImage).values({
        id: generateId(),
        fundId,
        url: f.gallery[i],
        alt: `${f.name} — image ${i + 1}`,
        sortOrder: i,
      });
    }

    inserted += 1;
    console.log(`  ✓ seed  ${f.slug}`);
  }

  console.log(
    `\nDone. ${inserted} fund(s) inserted, ${skipped} already existed.`,
  );
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
