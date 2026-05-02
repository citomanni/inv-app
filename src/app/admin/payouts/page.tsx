import type { Metadata } from "next";
import { db } from "@/db";
import { fund } from "@/db/schema";
import { ne } from "drizzle-orm";
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

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Payouts</h1>
        <p className="text-sm text-muted-foreground">
          Run a distribution to credit returns to all active investors in a
          fund. Each run posts a transaction and notifies investors.
        </p>
      </div>
      <PayoutsTable fundOptions={fundOptions} />
    </div>
  );
}
