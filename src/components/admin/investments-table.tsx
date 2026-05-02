"use client";

import * as React from "react";
import useSWR from "swr";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  CheckCircle,
  Clock,
  Eye,
  Search,
  TrendingUp,
  XCircle,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { InvestmentListItem } from "@/utils/investments";
import { InvestmentReviewDialog } from "./investment-review-dialog";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_BADGES: Record<
  string,
  { label: string; className: string; Icon: any }
> = {
  pending_payment: {
    label: "Awaiting payment",
    className: "bg-zinc-100 text-zinc-700 border-zinc-200",
    Icon: Clock,
  },
  pending_verification: {
    label: "Pending verification",
    className:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
    Icon: Clock,
  },
  active: {
    label: "Active",
    className:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
    Icon: CheckCircle,
  },
  matured: {
    label: "Matured",
    className:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700",
    Icon: Sparkles,
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
    Icon: XCircle,
  },
};

function StatusBadge({ status }: { status: string }) {
  const v = STATUS_BADGES[status] ?? STATUS_BADGES.pending_verification;
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

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export function InvestmentsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = React.useState(
    searchParams.get("status") || "pending_verification",
  );
  const [search, setSearch] = React.useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  const [page, setPage] = React.useState(
    Number(searchParams.get("page")) || 1,
  );
  const [reviewing, setReviewing] = React.useState<InvestmentListItem | null>(
    null,
  );
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
    return `/api/admin/investments?${params.toString()}`;
  }, [status, debouncedSearch, page]);

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000,
  });

  if (error) return <div>Failed to load investments</div>;

  const items = (data?.investments ?? []) as InvestmentListItem[];
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
              placeholder="Search investor or fund…"
              className="w-[260px] rounded-md border bg-background py-2 pl-8 pr-2 text-sm"
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
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending_verification">
                Pending verification
              </SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="matured">Matured</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border-2 border-muted">
        <Table className="text-sm">
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              {[
                "Investor",
                "Fund",
                "Amount",
                "Status",
                "Submitted",
                "Activated",
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
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  <TrendingUp className="mx-auto mb-2 h-8 w-8 opacity-30" />
                  No investments match the current filter.
                </TableCell>
              </TableRow>
            ) : (
              items.map((it) => (
                <TableRow key={it.id}>
                  <TableCell className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{it.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {it.userEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={it.fundCoverImage}
                          alt={it.fundName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-xs">{it.fundName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-semibold">
                    {usd(parseFloat(it.amount))}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <StatusBadge status={it.status} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                    {format(new Date(it.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                    {it.activatedAt
                      ? format(new Date(it.activatedAt), "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReviewing(it)}
                    >
                      <Eye className="mr-1 h-3.5 w-3.5" />
                      Review
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between px-4 py-1">
        <div className="text-sm text-muted-foreground">
          Showing {items.length} of {total}
        </div>
        {renderPagination()}
      </div>

      <InvestmentReviewDialog
        item={reviewing}
        onClose={() => setReviewing(null)}
        onReviewed={() => {
          setReviewing(null);
          mutate();
        }}
      />
    </div>
  );
}
