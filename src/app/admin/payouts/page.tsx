import type { Metadata } from "next";
import { db } from "@/db";
import { fund, investment, user } from "@/db/schema";
import { and, eq, ne, sql } from "drizzle-orm";
import { PayoutsTable } from "@/components/admin/payouts-table";

export const metadata: Metadata = {
  title: "Payouts | Admin Dashboard",
};

export default async function AdminPayoutsPage() {
  // Eligible funds = anything not draft/archived. Server-rendered for the dropdown.
  const fundOptions = await db
    .select({
      id: fund.id,
      name: fund.name,
      slug: fund.slug,
      status: fund.status,
      payoutFrequency: fund.payoutFrequency,
      targetAnnualReturnPercent: fund.targetAnnualReturnPercent,
    })
    .from(fund)
    .where(ne(fund.status, "archived"))
    .orderBy(fund.name);

  // Investors with >= 1 active investment, plus their current total returns.
  // Used by the single-investor "adjust balance" dialog.
  const investorRows = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      currentReturns: sql<string>`coalesce(sum(${investment.totalReturnsCredited}), '0')`,
    })
    .from(user)
    .innerJoin(
      investment,
      and(
        eq(investment.userId, user.id),
        eq(investment.status, "active"),
      ),
    )
    .groupBy(user.id, user.name, user.email)
    .orderBy(user.name);

  const investors = investorRows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    currentReturns: parseFloat(r.currentReturns),
  }));

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payouts</h1>
        <p className="text-sm text-muted-foreground">
          Run a distribution to credit returns to all active investors in a
          fund. Each run posts a transaction and notifies investors.
        </p>
      </div>
      <PayoutsTable fundOptions={fundOptions} investors={investors} />
    </div>
  );
}
