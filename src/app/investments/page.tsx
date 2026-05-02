import { listFundsWithImages, toNumber } from "@/utils/funds";
import Hero from "./components/hero";
import FloatingWhatsapp from "@/components/landing/FloatingWhatsapp";
import Footer from "@/components/landing/Footer";
import { InvestmentMarketplace } from "./components/marketplace";

export const metadata = {
  title: "Investments",
  description:
    "Browse our open real-estate investment funds and start building passive income.",
};

export default async function InvestmentsPage() {
  const { funds } = await listFundsWithImages({
    status: "all",
    limit: 50,
  });

  // Hide drafts from the public marketplace.
  const visibleFunds = funds
    .filter((f) => f.status !== "draft" && f.status !== "archived")
    .map((f) => ({
      slug: f.slug,
      name: f.name,
      tagline: f.tagline,
      coverImage: f.coverImage,
      location: f.location,
      propertyType: f.propertyType,
      status: f.status,
      units: f.units,
      targetIrrPercent: f.targetIrrPercent
        ? `${toNumber(f.targetIrrPercent).toFixed(1)}%`
        : null,
      equityMultiple: f.equityMultiple
        ? `${toNumber(f.equityMultiple).toFixed(2)}x`
        : null,
      targetAnnualReturnPercent: toNumber(f.targetAnnualReturnPercent),
      minimumInvestment: toNumber(f.minimumInvestment),
    }));

  return (
    <div className="bg-white">
      <Hero />
      <section className="relative bg-[#fffefb] z-10 py-10 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[#181B31] text-3xl md:text-5xl font-bold mb-4">
              Current Investments
            </h2>
            <p className="text-[#4A4A4A] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Take a look at the real estate investments that are actively
              generating returns and building wealth for our investors.
            </p>
          </div>
          <InvestmentMarketplace funds={visibleFunds} />
        </div>
      </section>

      <FloatingWhatsapp />
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
