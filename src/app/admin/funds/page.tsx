import type { Metadata } from "next";
import { FundsTable } from "@/components/admin/funds-table";

export const metadata: Metadata = {
  title: "Funds | Admin Dashboard",
  description: "Manage investment funds",
};

export default function AdminFundsPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Funds</h1>
        <p className="text-sm text-muted-foreground">
          Create, edit, and manage all investment products available to your
          investors.
        </p>
      </div>
      <FundsTable />
    </div>
  );
}
