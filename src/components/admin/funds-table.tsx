"use client";

import * as React from "react";
import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  Building2,
  CheckCircle,
  Clock,
  Edit,
  Plus,
  Search,
  XCircle,
  Archive,
  Sparkles,
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FundFormDialog } from "./fund-form-dialog";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_BADGES: Record<
  string,
  { label: string; className: string; Icon: any }
> = {
  draft: {
    label: "Draft",
    className: "bg-zinc-100 text-zinc-700 border-zinc-200",
    Icon: Clock,
  },
  open: {
    label: "Open",
    className:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
    Icon: CheckCircle,
  },
  oversubscribed: {
    label: "Oversubscribed",
    className:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700",
    Icon: Sparkles,
  },
  closed: {
    label: "Closed",
    className: "bg-zinc-200 text-zinc-700 border-zinc-300",
    Icon: XCircle,
  },
  archived: {
    label: "Archived",
    className: "bg-zinc-200 text-zinc-500 border-zinc-300",
    Icon: Archive,
  },
};

function StatusBadge({ status }: { status: string }) {
  const v = STATUS_BADGES[status] ?? STATUS_BADGES.draft;
  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-1 px-2 py-1 text-xs ${v.className}`}
    >
      <v.Icon className="h-3 w-3" />
      {v.label}
    </Badge>
  );
}

const usd = (n: number, opts?: { compact?: boolean }) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: opts?.compact ? "compact" : "standard",
    maximumFractionDigits: opts?.compact ? 1 : 0,
  }).format(n);

export function FundsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = React.useState(
    searchParams.get("status") || "all",
  );
  const [search, setSearch] = React.useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  const [page, setPage] = React.useState(
    Number(searchParams.get("page")) || 1,
  );
  const [createOpen, setCreateOpen] = React.useState(false);
  const limit = 10;

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (debouncedSearch) params.set("search", debouncedSearch);
    params.set("page", String(page));
    router.replace(`?${params.toString()}`);
  }, [status, debouncedSearch, page, router]);

  const swrKey = React.useMemo(() => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (debouncedSearch) params.set("search", debouncedSearch);
    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("includeArchived", "true");
    return `/api/admin/funds?${params.toString()}`;
  }, [status, debouncedSearch, page]);

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000,
  });

  if (error) return <div>Failed to load funds</div>;

  const funds = (data?.funds ?? []) as any[];
  const total: number = data?.total ?? 0;
  const totalPages: number = data?.totalPages ?? 1;

  const renderPagination = () => {
    if (totalPages <= 1) return null;
    const pages: number[] = [];
    const maxShow = 5;
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);
    if (end - start < maxShow - 1) {
      if (start === 1) end = Math.min(totalPages, start + maxShow - 1);
      else if (end === totalPages) start = Math.max(1, end - maxShow + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-disabled={page === 1}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {start > 1 && (
            <>
              <PaginationItem>
                <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
              </PaginationItem>
              {start > 2 && <PaginationEllipsis />}
            </>
          )}
          {pages.map((p) => (
            <PaginationItem key={p}>
              <PaginationLink isActive={p === page} onClick={() => setPage(p)}>
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
          {end < totalPages && (
            <>
              {end < totalPages - 1 && <PaginationEllipsis />}
              <PaginationItem>
                <PaginationLink onClick={() => setPage(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              aria-disabled={page === totalPages}
              className={
                page === totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div className="flex items-end gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search funds..."
              className="w-[240px] rounded-md border bg-background py-2 pl-8 pr-2 text-sm"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Select
            value={status}
            onValueChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="oversubscribed">Oversubscribed</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Add fund
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border-2 border-muted">
        <Table className="text-sm">
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              {[
                "Fund",
                "Status",
                "Min. Investment",
                "Target Return",
                "Raised",
                "Created",
                "Actions",
              ].map((h) => (
                <TableHead
                  key={h}
                  className="px-4 py-3 text-xs font-medium text-muted-foreground"
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((__, j) => (
                    <TableCell key={j} className="px-4 py-3">
                      <Skeleton className="h-4 w-[140px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : funds.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  <Building2 className="mx-auto mb-2 h-8 w-8 opacity-30" />
                  No funds yet. Click "Add fund" to create your first one.
                </TableCell>
              </TableRow>
            ) : (
              funds.map((f) => {
                const totalSize = parseFloat(f.totalSize);
                const raised = parseFloat(f.raisedAmount);
                const progress =
                  totalSize > 0 ? (raised / totalSize) * 100 : 0;
                return (
                  <TableRow key={f.id}>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                          {f.coverImage && (
                            <Image
                              src={f.coverImage}
                              alt={f.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{f.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {f.location}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <StatusBadge status={f.status} />
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs">
                      {usd(parseFloat(f.minimumInvestment))}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs">
                      {parseFloat(f.targetAnnualReturnPercent).toFixed(1)}%
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs text-muted-foreground">
                          {usd(raised, { compact: true })} /{" "}
                          {usd(totalSize, { compact: true })}
                        </div>
                        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${Math.min(100, progress)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                      {format(new Date(f.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/funds/${f.id}`}>
                          <Edit className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4 py-1">
        <div className="text-sm text-muted-foreground">
          Showing {funds.length} of {total} funds
        </div>
        {renderPagination()}
      </div>

      <FundFormDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSaved={() => {
          setCreateOpen(false);
          mutate();
        }}
      />
    </div>
  );
}
