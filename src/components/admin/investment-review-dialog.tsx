"use client";

import * as React from "react";
import useSWR from "swr";
import Image from "next/image";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Building2,
  CheckCircle,
  ExternalLink,
  Loader2,
  ShieldCheck,
  TrendingUp,
  XCircle,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { InvestmentListItem } from "@/utils/investments";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

interface Props {
  item: InvestmentListItem | null;
  onClose: () => void;
  onReviewed: () => void;
}

export function InvestmentReviewDialog({ item, onClose, onReviewed }: Props) {
  const [decision, setDecision] = React.useState<"approve" | "reject" | null>(
    null,
  );
  const [reason, setReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const { data, isLoading } = useSWR(
    item ? `/api/admin/investments/${item.id}` : null,
    fetcher,
  );

  React.useEffect(() => {
    if (!item) {
      setDecision(null);
      setReason("");
    }
  }, [item]);

  const inv = data?.investment;
  const investor = data?.user;
  const fund = data?.fund;
  const status = inv?.status as string | undefined;
  const isReviewable = status === "pending_verification";

  const handleSubmit = async () => {
    if (!item || !decision) return;
    if (decision === "reject" && !reason.trim()) {
      toast.error("Add a reason for rejection");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/investments/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          rejectionReason: decision === "reject" ? reason : undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Review failed");
      toast.success(decision === "approve" ? "Investment activated" : "Rejected");
      onReviewed();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const isImage = inv?.paymentProofUrl
    ? /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(inv.paymentProofUrl)
    : false;

  return (
    <Sheet open={!!item} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Review investment</SheetTitle>
          <SheetDescription>
            {item ? `${item.userEmail} → ${item.fundName}` : ""}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 px-4">
          {isLoading || !data ? (
            <div className="space-y-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          ) : (
            <>
              {/* Investor + KYC */}
              <Card title="Investor" icon={ShieldCheck}>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Field label="Name" value={investor?.name} />
                  <Field label="Email" value={investor?.email} />
                  <div className="col-span-2">
                    <span className="text-xs text-muted-foreground">
                      KYC status:
                    </span>{" "}
                    <Badge
                      variant="outline"
                      className={
                        investor?.kycStatus === "approved"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-yellow-50 text-yellow-700 border-yellow-200"
                      }
                    >
                      {investor?.kycStatus}
                    </Badge>
                  </div>
                </div>
              </Card>

              {/* Fund */}
              <Card title="Fund" icon={Building2}>
                <div className="flex gap-3">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                    {fund?.coverImage && (
                      <Image
                        src={fund.coverImage}
                        alt={fund.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col text-sm">
                    <span className="font-semibold">{fund?.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {fund?.location} · {fund?.holdYears}yr ·{" "}
                      {fund?.payoutFrequency}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Min: {fund && usd(parseFloat(fund.minimumInvestment))}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Amount + reference */}
              <Card title="Commitment" icon={TrendingUp}>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Field
                    label="Amount"
                    value={inv ? usd(parseFloat(inv.amount)) : null}
                    emphasis
                  />
                  <Field
                    label="Status"
                    value={inv?.status?.replace(/_/g, " ")}
                  />
                  <Field
                    label="Submitted"
                    value={
                      inv?.createdAt
                        ? format(new Date(inv.createdAt), "MMM d, yyyy h:mm a")
                        : null
                    }
                  />
                  <Field
                    label="Bank ref"
                    value={inv?.paymentReference || "—"}
                  />
                  {inv?.activatedAt && (
                    <Field
                      label="Activated"
                      value={format(new Date(inv.activatedAt), "MMM d, yyyy")}
                    />
                  )}
                  {inv?.maturityDate && (
                    <Field
                      label="Matures"
                      value={format(new Date(inv.maturityDate), "MMM d, yyyy")}
                    />
                  )}
                </div>
              </Card>

              {/* Payment proof */}
              <Card title="Payment proof" icon={ExternalLink}>
                {inv?.paymentProofUrl ? (
                  <a
                    href={inv.paymentProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden rounded-lg border"
                  >
                    {isImage ? (
                      <div className="relative aspect-[4/3] w-full bg-muted">
                        <Image
                          src={inv.paymentProofUrl}
                          alt="Payment proof"
                          fill
                          sizes="(min-width: 640px) 600px, 100vw"
                          className="object-contain transition-transform group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 bg-muted px-4 py-8 text-sm">
                        <ExternalLink className="h-4 w-4" />
                        Open payment proof
                      </div>
                    )}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">No proof on file</p>
                )}
              </Card>

              {!isReviewable && inv?.rejectionReason && (
                <Card title="Reviewer note">
                  <p className="text-sm text-muted-foreground">
                    {inv.rejectionReason}
                  </p>
                </Card>
              )}

              {isReviewable && (
                <div className="rounded-lg border p-4">
                  <p className="mb-3 text-sm font-medium">Decision</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDecision("approve")}
                      className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                        decision === "approve"
                          ? "border-green-300 bg-green-50 text-green-800 dark:bg-green-900/40 dark:text-green-100"
                          : "hover:bg-muted/60"
                      }`}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Activate
                    </button>
                    <button
                      type="button"
                      onClick={() => setDecision("reject")}
                      className={`flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                        decision === "reject"
                          ? "border-red-300 bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-100"
                          : "hover:bg-muted/60"
                      }`}
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                  {decision === "reject" && (
                    <div className="mt-3">
                      <label className="text-xs text-muted-foreground">
                        Reason (shown to investor)
                      </label>
                      <Textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="e.g. Bank transfer amount didn't match the commitment."
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <SheetFooter className="border-t">
          {isReviewable && (
            <Button
              onClick={handleSubmit}
              disabled={!decision || submitting}
              className="w-full"
              variant={decision === "reject" ? "destructive" : "default"}
            >
              {submitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {decision === "reject"
                ? "Reject investment"
                : decision === "approve"
                  ? "Activate investment"
                  : "Choose a decision"}
            </Button>
          )}
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-card">
      <header className="flex items-center gap-2 border-b px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {title}
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  emphasis,
}: {
  label: string;
  value?: React.ReactNode;
  emphasis?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className={
          emphasis ? "text-lg font-semibold" : "text-sm capitalize"
        }
      >
        {value ?? "—"}
      </div>
    </div>
  );
}
