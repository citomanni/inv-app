import type { Metadata } from "next";
import { InvestmentsTable } from "@/components/admin/investments-table";

export const metadata: Metadata = {
  title: "Investments | Admin Dashboard",
};

export default function AdminInvestmentsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Investments</h1>
        <p className="text-sm text-muted-foreground">
          Verify pending bank transfers and manage active investor positions.
        </p>
      </div>
      <InvestmentsTable />
    </div>
  );
}
