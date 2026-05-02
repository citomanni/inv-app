import Link from "next/link";
import { format } from "date-fns";
import {
  ExternalLink,
  FileText,
  FileSignature,
  Receipt,
  Wallet,
  ScrollText,
} from "lucide-react";

import { requireApprovedUser } from "@/lib/session";
import { listDocuments } from "@/utils/documents";

export const metadata = { title: "Documents" };

const TYPE_META: Record<
  string,
  { label: string; icon: any; tint: string }
> = {
  investment_agreement: {
    label: "Investment Agreement",
    icon: FileSignature,
    tint: "bg-blue-100 text-blue-700",
  },
  payment_receipt: {
    label: "Payment Receipt",
    icon: Receipt,
    tint: "bg-emerald-100 text-emerald-700",
  },
  summary_statement: {
    label: "Summary Statement",
    icon: ScrollText,
    tint: "bg-purple-100 text-purple-700",
  },
  tax_form: {
    label: "Tax Form",
    icon: Wallet,
    tint: "bg-amber-100 text-amber-700",
  },
  other: {
    label: "Document",
    icon: FileText,
    tint: "bg-zinc-100 text-zinc-700",
  },
};

export default async function DocumentsPage() {
  const user = await requireApprovedUser();
  const { documents } = await listDocuments({ userId: user.id, limit: 100 });

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Documents</h1>
        <p className="text-sm text-muted-foreground">
          Investment agreements, payment receipts, and statements uploaded for
          your account.
        </p>
      </div>

      {documents.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border bg-card py-16 text-center">
          <FileText className="h-12 w-12 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No documents on file yet. Statements and agreements will appear here
            after each completed investment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {documents.map((d) => {
            const meta = TYPE_META[d.type] ?? TYPE_META.other;
            return (
              <Link
                key={d.id}
                href={d.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-xl border bg-card p-5 transition-colors hover:bg-muted/40"
              >
                <span
                  className={
                    "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-lg " +
                    meta.tint
                  }
                >
                  <meta.icon className="h-6 w-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold">{d.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {meta.label}
                    {d.fundName ? ` · ${d.fundName}` : ""} ·{" "}
                    {format(new Date(d.createdAt), "MMM d, yyyy")}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
