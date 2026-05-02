import type { Metadata } from "next";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { DocumentsTable } from "@/components/admin/documents-table";

export const metadata: Metadata = {
  title: "Documents | Admin Dashboard",
};

export default async function AdminDocumentsPage() {
  const investors = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      kycStatus: user.kycStatus,
    })
    .from(user)
    .where(eq(user.kycStatus, "approved"))
    .orderBy(user.name);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
        <p className="text-sm text-muted-foreground">
          Upload investment agreements, payment receipts, statements, and tax
          forms to specific investors.
        </p>
      </div>
      <DocumentsTable investors={investors} />
    </div>
  );
}
