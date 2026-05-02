"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Building2, CheckCircle2, Copy, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUpload } from "@/components/ui/file-upload";
import {
  investmentCreateSchema,
  type InvestmentCreateInput,
} from "@/lib/schemas";

const BANK_DETAILS = {
  bankName: "First Commerce Bank",
  accountName: "Cardone Capital Holdings, LLC",
  accountNumber: "9981 0042 7613",
  routing: "031000503",
  swift: "FCBKUS33",
};

interface InvestFormProps {
  fund: {
    id: string;
    name: string;
    coverImage: string;
    location: string;
    propertyType: string;
    minimumInvestment: number;
    targetAnnualReturnPercent: number;
    holdYears: number;
    payoutFrequency: string;
    slug: string;
  };
}

export function InvestForm({ fund }: InvestFormProps) {
  const router = useRouter();
  const [confirmedTransfer, setConfirmedTransfer] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<InvestmentCreateInput>({
    resolver: zodResolver(investmentCreateSchema) as any,
    defaultValues: {
      fundId: fund.id,
      amount: fund.minimumInvestment as any,
      paymentReference: "",
      paymentProofUrl: "",
    },
  });

  const amount = Number(watch("amount") || 0);

  const onSubmit = async (data: InvestmentCreateInput) => {
    if (data.amount < fund.minimumInvestment) {
      toast.error(
        `Minimum investment is $${fund.minimumInvestment.toLocaleString("en-US")}`,
      );
      return;
    }
    if (!confirmedTransfer) {
      toast.error("Please confirm you have made the bank transfer");
      return;
    }
    try {
      const res = await fetch("/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Submission failed");
      toast.success("Submitted — we'll verify and notify you shortly");
      router.push("/transactions");
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong");
    }
  };

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied");
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register("fundId")} />

      {/* Step 1 — amount */}
      <Section
        step={1}
        title="Choose your investment amount"
        description={`Minimum $${fund.minimumInvestment.toLocaleString("en-US")}.`}
      >
        <div className="flex flex-col gap-2">
          <Label htmlFor="amount">Amount (USD)</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="amount"
              type="number"
              step="any"
              className="pl-7 text-lg font-medium"
              {...register("amount")}
            />
          </div>
          {errors.amount?.message && (
            <span className="text-xs text-destructive">
              {errors.amount.message as string}
            </span>
          )}
          {amount > 0 && amount >= fund.minimumInvestment && (
            <div className="rounded-md border bg-muted/50 px-3 py-2 text-sm">
              <span className="text-muted-foreground">
                Estimated annual income at {fund.targetAnnualReturnPercent.toFixed(1)}%:
              </span>{" "}
              <span className="font-semibold text-foreground">
                $
                {(
                  (amount * fund.targetAnnualReturnPercent) / 100
                ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </div>
          )}
        </div>
      </Section>

      {/* Step 2 — bank instructions */}
      <Section
        step={2}
        title="Transfer funds via bank"
        description={
          <>
            Use the wire details below.{" "}
            <strong>
              Include your email as the reference so we can match the transfer.
            </strong>
          </>
        }
      >
        <div className="overflow-hidden rounded-lg border">
          <BankRow
            label="Bank"
            value={BANK_DETAILS.bankName}
            onCopy={() => copy(BANK_DETAILS.bankName)}
          />
          <BankRow
            label="Account name"
            value={BANK_DETAILS.accountName}
            onCopy={() => copy(BANK_DETAILS.accountName)}
          />
          <BankRow
            label="Account number"
            value={BANK_DETAILS.accountNumber}
            mono
            onCopy={() => copy(BANK_DETAILS.accountNumber.replace(/\s/g, ""))}
          />
          <BankRow
            label="Routing"
            value={BANK_DETAILS.routing}
            mono
            onCopy={() => copy(BANK_DETAILS.routing)}
          />
          <BankRow
            label="SWIFT"
            value={BANK_DETAILS.swift}
            mono
            onCopy={() => copy(BANK_DETAILS.swift)}
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-muted/30 p-3 text-sm">
          <input
            type="checkbox"
            checked={confirmedTransfer}
            onChange={(e) => setConfirmedTransfer(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border"
          />
          <span>
            I have completed the bank transfer for the amount above. I understand
            my investment becomes active only after our team verifies the
            transfer.
          </span>
        </label>
      </Section>

      {/* Step 3 — proof */}
      <Section
        step={3}
        title="Upload payment proof"
        description="A screenshot or PDF of your bank confirmation."
      >
        <Controller
          name="paymentProofUrl"
          control={control}
          render={({ field }) => (
            <FileUpload
              value={field.value}
              onChange={field.onChange}
              folder="investments/proofs"
              label="Payment proof"
              description="JPEG / PNG / PDF — max 10MB"
            />
          )}
        />
        {errors.paymentProofUrl?.message && (
          <span className="text-xs text-destructive">
            {errors.paymentProofUrl.message as string}
          </span>
        )}
        <div className="flex flex-col gap-2">
          <Label htmlFor="paymentReference">
            Bank reference / transaction ID{" "}
            <span className="text-xs text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="paymentReference"
            placeholder="e.g. TXN-2024-A1B2C3"
            {...register("paymentReference")}
          />
        </div>
      </Section>

      <div className="flex items-center justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || !confirmedTransfer}
          size="lg"
          className="min-w-48"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Submit investment
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

function Section({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card">
      <header className="flex items-start gap-4 border-b px-5 py-4">
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {step}
        </span>
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </header>
      <div className="space-y-4 p-5">{children}</div>
    </section>
  );
}

function BankRow({
  label,
  value,
  mono,
  onCopy,
}: {
  label: string;
  value: string;
  mono?: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b px-4 py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={
            "text-sm font-medium " + (mono ? "font-mono tracking-wider" : "")
          }
        >
          {value}
        </span>
        <button
          type="button"
          onClick={onCopy}
          className="text-muted-foreground transition-colors hover:text-foreground"
          aria-label={`Copy ${label}`}
        >
          <Copy className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
