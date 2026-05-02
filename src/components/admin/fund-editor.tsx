"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  ArrowLeft,
  Archive,
  ExternalLink,
  Edit,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { FundFormDialog } from "./fund-form-dialog";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface SerializedFund {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  coverImage: string;
  location: string;
  propertyType: string;
  totalSize: string;
  raisedAmount: string;
  minimumInvestment: string;
  targetAnnualReturnPercent: string;
  targetIrrPercent: string | null;
  equityMultiple: string | null;
  holdYears: number;
  payoutFrequency: string;
  distributionType: string;
  units: number | null;
  status: string;
  openedAt: string | null;
  closesAt: string | null;
  createdAt: string;
  updatedAt: string;
  images: { id: string; url: string; alt: string | null; sortOrder: number }[];
}

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

export function FundEditor({ fund }: { fund: SerializedFund }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [confirmArchive, setConfirmArchive] = React.useState(false);
  const [archiving, setArchiving] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const totalSize = parseFloat(fund.totalSize);
  const raised = parseFloat(fund.raisedAmount);
  const progress = totalSize > 0 ? Math.min(100, (raised / totalSize) * 100) : 0;

  const handleArchive = async () => {
    setArchiving(true);
    try {
      const res = await fetch(`/api/admin/funds/${fund.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Archive failed");
      toast.success("Fund archived");
      router.push("/admin/funds");
    } catch (e: any) {
      toast.error(e?.message || "Failed to archive");
    } finally {
      setArchiving(false);
    }
  };

  const handleAddImage = async (file: File) => {
    setUploadingImage(true);
    try {
      const result = await uploadToCloudinary(file, {
        folder: `funds/${fund.slug}`,
      });
      const res = await fetch(`/api/admin/funds/${fund.id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: result.url, alt: fund.name }),
      });
      if (!res.ok) throw new Error("Failed to attach image");
      toast.success("Image added");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async (imageId: string) => {
    try {
      const res = await fetch(
        `/api/admin/funds/${fund.id}/images/${imageId}`,
        { method: "DELETE" },
      );
      if (!res.ok) throw new Error("Failed to remove");
      toast.success("Image removed");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Failed to remove");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/funds">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to funds
          </Link>
        </Button>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link
              href={`/investments/${fund.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              View public page
            </Link>
          </Button>
          <Button onClick={() => setEditing(true)} size="sm">
            <Edit className="mr-1 h-3.5 w-3.5" />
            Edit fund
          </Button>
          {fund.status !== "archived" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmArchive(true)}
            >
              <Archive className="mr-1 h-3.5 w-3.5" />
              Archive
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="relative aspect-[16/9] w-full bg-muted">
              {fund.coverImage && (
                <Image
                  src={fund.coverImage}
                  alt={fund.name}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 700px, 100vw"
                  priority
                />
              )}
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    {fund.name}
                  </h2>
                  {fund.tagline && (
                    <p className="mt-1 text-muted-foreground">{fund.tagline}</p>
                  )}
                </div>
                <StatusBadge status={fund.status} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>{fund.location}</span>
                <span>·</span>
                <span className="capitalize">
                  {fund.propertyType.replace("_", " ")}
                </span>
                <span>·</span>
                <span>/{fund.slug}</span>
              </div>
              <p className="mt-4 whitespace-pre-line text-sm text-foreground/80">
                {fund.description}
              </p>
            </div>
          </div>

          {/* Gallery management */}
          <div className="rounded-xl border bg-card">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h3 className="text-base font-semibold">Gallery images</h3>
                <p className="text-xs text-muted-foreground">
                  Additional photos shown on the public fund page.
                </p>
              </div>
              <Button
                size="sm"
                disabled={uploadingImage}
                onClick={() => fileInputRef.current?.click()}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                {uploadingImage ? "Uploading…" : "Add image"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleAddImage(f);
                  e.target.value = "";
                }}
              />
            </div>
            <div className="p-6">
              {fund.images.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No gallery images yet. Add some to enrich the fund page.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {fund.images.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square overflow-hidden rounded-lg border"
                    >
                      <Image
                        src={img.url}
                        alt={img.alt ?? fund.name}
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img.id)}
                        className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                        aria-label="Remove image"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Fundraising
            </h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Raised</span>
                <span className="font-medium">{usd(raised)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target</span>
                <span className="font-medium">{usd(totalSize)}</span>
              </div>
            </div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1 text-right text-xs text-muted-foreground">
              {progress.toFixed(1)}%
            </div>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Terms
            </h3>
            <dl className="space-y-2 text-sm">
              <Row
                label="Min. investment"
                value={usd(parseFloat(fund.minimumInvestment))}
              />
              <Row
                label="Target annual return"
                value={`${parseFloat(fund.targetAnnualReturnPercent).toFixed(1)}%`}
              />
              {fund.targetIrrPercent && (
                <Row
                  label="Target IRR"
                  value={`${parseFloat(fund.targetIrrPercent).toFixed(1)}%`}
                />
              )}
              {fund.equityMultiple && (
                <Row
                  label="Equity multiple"
                  value={`${parseFloat(fund.equityMultiple).toFixed(2)}x`}
                />
              )}
              <Row label="Hold period" value={`${fund.holdYears} years`} />
              <Row
                label="Payout"
                value={fund.payoutFrequency.replace(/^./, (c) => c.toUpperCase())}
              />
              <Row
                label="Distribution"
                value={fund.distributionType.replace("_", " ")}
              />
              {fund.units != null && (
                <Row label="Units" value={fund.units.toString()} />
              )}
            </dl>
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Lifecycle
            </h3>
            <dl className="space-y-2 text-sm">
              <Row
                label="Opened"
                value={
                  fund.openedAt
                    ? format(new Date(fund.openedAt), "MMM d, yyyy")
                    : "—"
                }
              />
              <Row
                label="Closes"
                value={
                  fund.closesAt
                    ? format(new Date(fund.closesAt), "MMM d, yyyy")
                    : "Open-ended"
                }
              />
              <Row
                label="Last updated"
                value={format(new Date(fund.updatedAt), "MMM d, yyyy")}
              />
            </dl>
          </div>
        </aside>
      </div>

      <FundFormDialog
        isOpen={editing}
        onClose={() => setEditing(false)}
        onSaved={() => {
          setEditing(false);
          router.refresh();
        }}
        fund={fund}
      />

      <ConfirmationDialog
        isOpen={confirmArchive}
        onClose={() => setConfirmArchive(false)}
        onConfirm={handleArchive}
        title="Archive this fund?"
        description="It will be hidden from investors and the public marketplace. Existing investments are preserved."
        confirmText={archiving ? "Archiving…" : "Archive fund"}
        confirmVariant="destructive"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium capitalize">{value}</dd>
    </div>
  );
}
