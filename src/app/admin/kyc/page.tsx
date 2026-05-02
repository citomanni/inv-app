import type { Metadata } from "next";
import { KycTable } from "@/components/admin/kyc-table";

export const metadata: Metadata = {
  title: "KYC Reviews | Admin Dashboard",
  description: "Review investor identity verification submissions",
};

export default function AdminKycPage() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">KYC Reviews</h1>
        <p className="text-sm text-muted-foreground">
          Approve or reject investor identity submissions. Approved investors
          can fund their first investment.
        </p>
      </div>
      <KycTable />
    </div>
  );
}
