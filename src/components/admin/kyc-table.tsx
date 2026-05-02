"use client";

import * as React from "react";
import useSWR from "swr";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import {
  CheckCircle,
  Clock,
  Eye,
  Search,
  ShieldCheck,
  XCircle,
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
import type { KycListItem } from "@/utils/kyc";
import { KycReviewDialog } from "./kyc-review-dialog";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const STATUS_OPTIONS = [
  { value: "all", label: "All", icon: ShieldCheck },
  { value: "pending", label: "Pending", icon: Clock },
  { value: "approved", label: "Approved", icon: CheckCircle },
  { value: "rejected", label: "Rejected", icon: XCircle },
] as const;

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string; Icon: any }> = {
    pending: {
      label: "Pending",
      className:
        "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
      Icon: Clock,
    },
    approved: {
      label: "Approved",
      className:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
      Icon: CheckCircle,
    },
    rejected: {
      label: "Rejected",
      className:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
      Icon: XCircle,
    },
  };
  const v = map[status] ?? map.pending;
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

export function KycTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = React.useState(
    searchParams.get("status") || "pending",
  );
  const [search, setSearch] = React.useState(searchParams.get("search") || "");
  const [debouncedSearch, setDebouncedSearch] = React.useState(search);
  const [page, setPage] = React.useState(
    Number(searchParams.get("page")) || 1,
  );
  const [reviewing, setReviewing] = React.useState<KycListItem | null>(null);
  const limit = 10;

  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  React.useEffect(() => {
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    if (debouncedSearch) params.set("search", debouncedSearch);
    params.set("page", String(page));
    params.set("limit", String(limit));
    router.replace(`?${params.toString()}`);
  }, [status, debouncedSearch, page, router]);

  const swrKey = React.useMemo(() => {
    const params = new URLSearchParams();
    if (status && status !== "all") params.set("status", status);
    if (debouncedSearch) params.set("search", debouncedSearch);
    params.set("page", String(page));
    params.set("limit", String(limit));
    return `/api/admin/kyc?${params.toString()}`;
  }, [status, debouncedSearch, page]);

  const { data, error, isLoading, mutate } = useSWR(swrKey, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 2000,
  });

  const filterControls = (
    <div className="flex flex-wrap items-end justify-between gap-2">
      <div className="flex items-end gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search name or email..."
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
            <span className="flex items-center gap-2">
              {(() => {
                const opt = STATUS_OPTIONS.find((o) => o.value === status);
                const Icon = opt?.icon ?? ShieldCheck;
                return (
                  <>
                    <Icon className="h-4 w-4" />
                    {opt?.label ?? "All"}
                  </>
                );
              })()}
            </span>
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                <span className="flex items-center gap-2">
                  <o.icon className="h-4 w-4" />
                  {o.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  if (error) return <div>Failed to load submissions</div>;

  const submissions: KycListItem[] = data?.submissions ?? [];
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
              <PaginationLink
                isActive={p === page}
                onClick={() => setPage(p)}
              >
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
      {filterControls}
      <div className="overflow-hidden rounded-lg border-2 border-muted">
        <Table className="text-sm">
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              {[
                "Investor",
                "Submitted Name",
                "Country",
                "Status",
                "Submitted",
                "Reviewed",
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
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  No submissions match the current filter.
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{s.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {s.userEmail}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs">
                    {s.fullName}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs">
                    {s.country}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <StatusBadge status={s.status} />
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                    {format(new Date(s.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                    {s.reviewedAt
                      ? format(new Date(s.reviewedAt), "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setReviewing(s)}
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
          Showing {submissions.length} of {total} submissions
        </div>
        {renderPagination()}
      </div>
      <KycReviewDialog
        submission={reviewing}
        onClose={() => setReviewing(null)}
        onReviewed={() => {
          setReviewing(null);
          mutate();
        }}
      />
    </div>
  );
}
