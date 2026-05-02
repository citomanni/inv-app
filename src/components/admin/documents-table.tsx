"use client";

import * as React from "react";
import useSWR from "swr";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  ExternalLink,
  FileText,
  FileSignature,
  Plus,
  Receipt,
  ScrollText,
  Search,
  Trash2,
  Wallet,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentUploadDialog } from "./document-upload-dialog";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const TYPE_META: Record<
  string,
  { label: string; icon: any; tint: string }
> = {
  investment_agreement: {
    label: "Agreement",
    icon: FileSignature,
    tint: "bg-blue-50 text-blue-700 border-blue-200",
  },
  payment_receipt: {
    label: "Receipt",
    icon: Receipt,
    tint: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  summary_statement: {
    label: "Statement",
    icon: ScrollText,
    tint: "bg-purple-50 text-purple-700 border-purple-200",
  },
  tax_form: {
    label: "Tax form",
    icon: Wallet,
    tint: "bg-amber-50 text-amber-700 border-amber-200",
  },
  other: {
    label: "Other",
    icon: FileText,
    tint: "bg-zinc-50 text-zinc-700 border-zinc-200",
  },
};

interface Investor {
  id: string;
  name: string;
  email: string;
  kycStatus: string;
}

export function DocumentsTable({ investors }: { investors: Investor[] }) {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [type, setType] = React.useState("all");
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const swrKey = React.useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (type !== "all") params.set("type", type);
    params.set("limit", "50");
    return `/api/admin/documents?${params.toString()}`;
  }, [debouncedSearch, type]);

  const { data, isLoading, mutate } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000,
  });

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      const res = await fetch(`/api/admin/documents/${deletingId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      toast.success("Document removed");
      mutate();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    } finally {
      setDeletingId(null);
    }
  };

  const docs = (data?.documents ?? []) as any[];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="flex items-end gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search title or investor…"
              className="w-[260px] rounded-md border bg-background py-2 pl-8 pr-2 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {Object.entries(TYPE_META).map(([k, v]) => (
                <SelectItem key={k} value={k}>
                  {v.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Upload document
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border-2 border-muted">
        <Table className="text-sm">
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              {["Title", "Type", "Investor", "Fund", "Uploaded", ""].map(
                (h) => (
                  <TableHead
                    key={h}
                    className="px-4 py-3 text-xs font-medium text-muted-foreground"
                  >
                    {h}
                  </TableHead>
                ),
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j} className="px-4 py-3">
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : docs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  <FileText className="mx-auto mb-2 h-8 w-8 opacity-30" />
                  No documents uploaded yet.
                </TableCell>
              </TableRow>
            ) : (
              docs.map((d) => {
                const meta = TYPE_META[d.type] ?? TYPE_META.other;
                return (
                  <TableRow key={d.id}>
                    <TableCell className="px-4 py-3">
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
                      >
                        {d.title}
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={
                          "inline-flex items-center gap-1 px-2 py-1 text-xs " +
                          meta.tint
                        }
                      >
                        <meta.icon className="h-3 w-3" />
                        {meta.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs">
                      <div className="flex flex-col">
                        <span>{d.userName}</span>
                        <span className="text-muted-foreground">
                          {d.userEmail}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                      {d.fundName || "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                      {format(new Date(d.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingId(d.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <DocumentUploadDialog
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={() => {
          setUploadOpen(false);
          mutate();
        }}
        investors={investors}
      />

      <ConfirmationDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete this document?"
        description="The investor will no longer be able to see it. This cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
}
