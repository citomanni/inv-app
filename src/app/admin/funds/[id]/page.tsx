import { notFound } from "next/navigation";
import { getFundById } from "@/utils/funds";
import { FundEditor } from "@/components/admin/fund-editor";

export default async function AdminFundDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const fund = await getFundById(id);
  if (!fund) notFound();

  // Serialize Date objects so they cross the server→client boundary safely.
  const serialized = {
    ...fund,
    openedAt: fund.openedAt?.toISOString() ?? null,
    closesAt: fund.closesAt?.toISOString() ?? null,
    createdAt: fund.createdAt.toISOString(),
    updatedAt: fund.updatedAt.toISOString(),
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <FundEditor fund={serialized} />
    </div>
  );
}
