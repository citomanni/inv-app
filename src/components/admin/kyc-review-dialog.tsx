"use client";

import * as React from "react";
import useSWR from "swr";
import Image from "next/image";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  CheckCircle,
  ExternalLink,
  Globe,
  IdCard,
  Loader2,
  ShieldCheck,
  Wallet,
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { KycListItem } from "@/utils/kyc";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

interface Props {
  submission: KycListItem | null;
  onClose: () => void;
  onReviewed: () => void;
}

export function KycReviewDialog({ submission, onClose, onReviewed }: Props) {
  const [decision, setDecision] = React.useState<"approve" | "reject" | null>(
    null,
  );
  const [reason, setReason] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const { data, isLoading } = useSWR(
    submission ? `/api/admin/kyc/${submission.id}` : null,
    fetcher,
  );

  React.useEffect(() => {
    if (!submission) {
      setDecision(null);
      setReason("");
    }
  }, [submission]);

  const handleSubmit = async () => {
    if (!submission || !decision) return;
    if (decision === "reject" && !reason.trim()) {
      toast.error("Please add a reason for rejection");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/kyc/${submission.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          decision,
          rejectionReason: decision === "reject" ? reason : undefined,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Review failed");
      toast.success(
        decision === "approve"
          ? "Submission approved"
          : "Submission rejected",
      );
      onReviewed();
    } catch (e: any) {
      toast.error(e?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const sub = data?.submission;
  const investor = data?.user;
  const isPending = sub?.status === "pending";

  return (
    <Sheet open={!!submission} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>KYC Review</SheetTitle>
          <SheetDescription>
            {submission
              ? `Submitted by ${submission.userEmail}`
              : "Loading..."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-5 px-4">
          {isLoading || !data ? (
            <div className="space-y-3">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <>
              <SectionRow title="Investor">
                <Field label="Name" value={investor?.name} />
                <Field label="Email" value={investor?.email} />
                <Field
                  label="Joined"
                  value={
                    investor?.createdAt
                      ? format(new Date(investor.createdAt), "MMM d, yyyy")
                      : null
                  }
                />
                <div className="col-span-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Status:</span>
                  <StatusPill status={sub?.status} />
                </div>
              </SectionRow>

              <SectionRow title="Personal" icon={IdCard}>
                <Field label="Full legal name" value={sub?.fullName} />
                <Field
                  label="Date of birth"
                  value={
                    sub?.dateOfBirth
                      ? format(new Date(sub.dateOfBirth), "MMM d, yyyy")
                      : null
                  }
                />
                <Field label="Nationality" value={sub?.nationality} />
                <Field label="Phone" value={sub?.phoneNumber} />
                <Field label="Occupation" value={sub?.occupation} />
                <Field label="Employer" value={sub?.employer} />
              </SectionRow>

              <SectionRow title="Address" icon={Globe}>
                <Field
                  label="Line 1"
                  value={sub?.addressLine1}
                  span={2}
                />
                {sub?.addressLine2 && (
                  <Field label="Line 2" value={sub.addressLine2} span={2} />
                )}
                <Field label="City" value={sub?.city} />
                <Field label="State / Region" value={sub?.state || "—"} />
                <Field label="Country" value={sub?.country} />
                <Field label="Postal code" value={sub?.postalCode} />
              </SectionRow>

              <SectionRow title="Financial profile" icon={Wallet}>
                <Field
                  label="Annual income"
                  value={formatIncomeBand(sub?.annualIncomeBand)}
                />
                <Field
                  label="Source of funds"
                  value={formatSource(sub?.sourceOfFunds)}
                />
                <Field
                  label="Accredited"
                  value={sub?.accreditedInvestor ? "Yes" : "No"}
                />
              </SectionRow>

              <SectionRow title="Identity documents" icon={ShieldCheck}>
                <Field label="ID type" value={formatIdType(sub?.idType)} />
                <Field label="ID number" value={sub?.idNumber} />
                <div className="col-span-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <DocPreview label="Front of ID" url={sub?.idFrontUrl} />
                  <DocPreview label="Back of ID" url={sub?.idBackUrl} />
                  <DocPreview
                    label="Proof of address"
                    url={sub?.proofOfAddressUrl}
                  />
                  <DocPreview label="Selfie" url={sub?.selfieUrl} />
                </div>
              </SectionRow>

              {!isPending && (
                <div className="rounded-lg border bg-muted/40 p-4 text-sm">
                  <div className="font-medium">
                    Already reviewed
                    {sub?.reviewedAt
                      ? ` · ${format(new Date(sub.reviewedAt), "MMM d, yyyy")}`
                      : ""}
                  </div>
                  {sub?.rejectionReason && (
                    <p className="mt-1 text-muted-foreground">
                      Reason: {sub.rejectionReason}
                    </p>
                  )}
                </div>
              )}

              {isPending && (
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
                      Approve
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
                        placeholder="e.g. Proof of address doesn't show your name."
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
          {isPending && (
            <Button
              onClick={handleSubmit}
              disabled={!decision || submitting}
              className="w-full"
              variant={decision === "reject" ? "destructive" : "default"}
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {decision === "reject"
                ? "Reject submission"
                : decision === "approve"
                  ? "Approve submission"
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

function SectionRow({
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
      <div className="grid grid-cols-2 gap-3 p-4 text-sm">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  span = 1,
}: {
  label: string;
  value?: string | null;
  span?: 1 | 2;
}) {
  return (
    <div className={span === 2 ? "col-span-2" : ""}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm">{value || "—"}</div>
    </div>
  );
}

function DocPreview({ label, url }: { label: string; url?: string | null }) {
  if (!url) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-md border bg-muted/40 text-xs text-muted-foreground">
        — {label} —
      </div>
    );
  }
  const isImage = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(url);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-square w-full overflow-hidden rounded-md border"
    >
      {isImage ? (
        <Image
          src={url}
          alt={label}
          fill
          sizes="160px"
          className="object-cover transition-transform group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-xs">
          PDF
        </div>
      )}
      <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-[10px] text-white">
        <div className="flex items-center justify-between">
          <span className="truncate">{label}</span>
          <ExternalLink className="h-3 w-3" />
        </div>
      </div>
    </a>
  );
}

function StatusPill({ status }: { status?: string }) {
  if (!status) return null;
  const map: Record<string, string> = {
    pending:
      "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
    approved:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
    rejected:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
  };
  return (
    <Badge variant="outline" className={map[status] || ""}>
      {status[0].toUpperCase() + status.slice(1)}
    </Badge>
  );
}

function formatIncomeBand(b?: string | null) {
  if (!b) return null;
  return (
    {
      under_25k: "Under $25,000",
      "25k_50k": "$25,000 – $50,000",
      "50k_100k": "$50,000 – $100,000",
      "100k_250k": "$100,000 – $250,000",
      "250k_plus": "$250,000+",
    } as Record<string, string>
  )[b] ?? b;
}

function formatSource(s?: string | null) {
  if (!s) return null;
  return (
    {
      salary: "Salary / Employment",
      business: "Business Income",
      savings: "Savings",
      investments: "Investment Returns",
      inheritance: "Inheritance",
      other: "Other",
    } as Record<string, string>
  )[s] ?? s;
}

function formatIdType(t?: string | null) {
  if (!t) return null;
  return (
    {
      passport: "Passport",
      drivers_license: "Driver's License",
      national_id: "National ID",
    } as Record<string, string>
  )[t] ?? t;
}

