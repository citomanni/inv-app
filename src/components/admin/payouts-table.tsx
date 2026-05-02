"use client";

import * as React from "react";
import useSWR from "swr";
import Image from "next/image";
import { format } from "date-fns";
import {
  CircleDollarSign,
  Plus,
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
import { PayoutCreateDialog } from "./payout-create-dialog";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);

interface FundOption {
  id: string;
  name: string;
  slug: string;
  status: string;
  payoutFrequency: string;
  targetAnnualReturnPercent: string;
}

export function PayoutsTable({ fundOptions }: { fundOptions: FundOption[] }) {
  const [createOpen, setCreateOpen] = React.useState(false);
  const { data, isLoading, mutate } = useSWR(
    "/api/admin/payouts?page=1&limit=50",
    fetcher,
    { revalidateOnFocus: false, dedupingInterval: 2000 },
  );
  const rows = (data?.payouts ?? []) as any[];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Distribute returns
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border-2 border-muted">
        <Table className="text-sm">
          <TableHeader className="sticky top-0 z-10 bg-muted">
            <TableRow>
              {[
                "Fund",
                "Period",
                "Rate",
                "Recipients",
                "Total Distributed",
                "Status",
                "Distributed At",
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
                      <Skeleton className="h-4 w-[120px]" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  <CircleDollarSign className="mx-auto mb-2 h-8 w-8 opacity-30" />
                  No payouts yet. Click "Distribute returns" to credit your
                  investors.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="relative h-9 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={p.fundCoverImage}
                          alt={p.fundName}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium">{p.fundName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs">
                    {format(new Date(p.periodStart), "MMM d, yyyy")} →{" "}
                    {format(new Date(p.periodEnd), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs">
                    {parseFloat(p.ratePercent).toFixed(3)}%
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs">
                    {p.recipientsCount}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-sm font-semibold">
                    {usd(parseFloat(p.totalDistributed))}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={
                        p.status === "distributed"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-zinc-100 text-zinc-700 border-zinc-200"
                      }
                    >
                      {p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                    {p.distributedAt
                      ? format(
                          new Date(p.distributedAt),
                          "MMM d, yyyy 'at' h:mm a",
                        )
                      : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PayoutCreateDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          mutate();
        }}
        fundOptions={fundOptions}
      />
    </div>
  );
}
