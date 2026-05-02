"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileUpload } from "@/components/ui/file-upload";
import {
  PROPERTY_TYPES,
  PAYOUT_FREQUENCIES,
  DISTRIBUTION_TYPES,
  FUND_STATUSES,
  fundCreateSchema,
  type FundCreateSchema,
} from "@/lib/schemas";

interface FundFormValues extends Omit<FundCreateSchema, "status"> {
  status: (typeof FUND_STATUSES)[number];
}

interface FundFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  /** When provided, dialog operates in edit mode. */
  fund?: any | null;
}

const PROPERTY_LABELS: Record<string, string> = {
  multifamily: "Multifamily",
  mixed_use: "Mixed Use",
  commercial: "Commercial",
  hospitality: "Hospitality",
};
const PAYOUT_LABELS: Record<string, string> = {
  monthly: "Monthly",
  quarterly: "Quarterly",
  annually: "Annually",
};
const DISTRIBUTION_LABELS: Record<string, string> = {
  cash_flow: "Cash Flow",
  appreciation: "Appreciation",
  mixed: "Mixed",
};
const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  open: "Open",
  closed: "Closed",
  oversubscribed: "Oversubscribed",
  archived: "Archived",
};

export function FundFormDialog({
  isOpen,
  onClose,
  onSaved,
  fund,
}: FundFormDialogProps) {
  const isEdit = !!fund?.id;

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FundFormValues>({
    resolver: zodResolver(fundCreateSchema) as any,
    defaultValues: {
      name: "",
      slug: "",
      tagline: "",
      description: "",
      coverImage: "",
      location: "",
      propertyType: "multifamily",
      totalSize: 1_000_000 as any,
      minimumInvestment: 5_000 as any,
      targetAnnualReturnPercent: 8 as any,
      targetIrrPercent: "" as any,
      equityMultiple: "" as any,
      holdYears: 5 as any,
      payoutFrequency: "monthly",
      distributionType: "mixed",
      units: "" as any,
      status: "open",
    },
  });

  React.useEffect(() => {
    if (isOpen && fund) {
      reset({
        name: fund.name ?? "",
        slug: fund.slug ?? "",
        tagline: fund.tagline ?? "",
        description: fund.description ?? "",
        coverImage: fund.coverImage ?? "",
        location: fund.location ?? "",
        propertyType: fund.propertyType ?? "multifamily",
        totalSize: parseFloat(fund.totalSize) as any,
        minimumInvestment: parseFloat(fund.minimumInvestment) as any,
        targetAnnualReturnPercent: parseFloat(
          fund.targetAnnualReturnPercent,
        ) as any,
        targetIrrPercent: fund.targetIrrPercent
          ? (parseFloat(fund.targetIrrPercent) as any)
          : ("" as any),
        equityMultiple: fund.equityMultiple
          ? (parseFloat(fund.equityMultiple) as any)
          : ("" as any),
        holdYears: fund.holdYears as any,
        payoutFrequency: fund.payoutFrequency ?? "monthly",
        distributionType: fund.distributionType ?? "mixed",
        units: fund.units ?? ("" as any),
        status: fund.status ?? "open",
      });
    } else if (isOpen && !fund) {
      reset();
    }
  }, [isOpen, fund, reset]);

  const onSubmit = async (data: FundFormValues) => {
    try {
      const url = isEdit ? `/api/admin/funds/${fund.id}` : "/api/admin/funds";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json?.error || "Save failed");
      toast.success(isEdit ? "Fund updated" : "Fund created");
      onSaved();
    } catch (e: any) {
      toast.error(e?.message || "Failed to save fund");
    }
  };

  const FieldErr = ({ message }: { message?: string }) =>
    message ? (
      <span className="text-xs text-destructive">{message}</span>
    ) : null;

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
          <SheetHeader>
            <SheetTitle>
              {isEdit ? "Edit fund" : "Create new fund"}
            </SheetTitle>
            <SheetDescription>
              All fields are required unless marked optional.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 space-y-4 px-4 pb-4">
            {/* Cover */}
            <Controller
              name="coverImage"
              control={control}
              render={({ field }) => (
                <FileUpload
                  value={field.value}
                  onChange={field.onChange}
                  folder="funds/covers"
                  label="Cover image"
                  description="High-quality landscape photo (16:9)"
                />
              )}
            />
            <FieldErr message={errors.coverImage?.message} />

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="name">Fund name</Label>
                <Input id="name" {...register("name")} />
                <FieldErr message={errors.name?.message} />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="tagline">
                  Tagline{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input id="tagline" {...register("tagline")} />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="slug">
                  URL slug{" "}
                  <span className="text-xs text-muted-foreground">
                    (auto-generated if blank)
                  </span>
                </Label>
                <Input
                  id="slug"
                  placeholder="10x-some-fund"
                  {...register("slug")}
                />
              </div>
              <div className="col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  {...register("description")}
                />
                <FieldErr message={errors.description?.message} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="location">Location</Label>
                <Input id="location" {...register("location")} />
                <FieldErr message={errors.location?.message} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="propertyType">Property type</Label>
                <Controller
                  name="propertyType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROPERTY_TYPES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {PROPERTY_LABELS[p]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="totalSize">Target raise (USD)</Label>
                <Input
                  id="totalSize"
                  type="number"
                  step="any"
                  {...register("totalSize")}
                />
                <FieldErr message={errors.totalSize?.message as any} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="minimumInvestment">Minimum investment (USD)</Label>
                <Input
                  id="minimumInvestment"
                  type="number"
                  step="any"
                  {...register("minimumInvestment")}
                />
                <FieldErr message={errors.minimumInvestment?.message as any} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="targetAnnualReturnPercent">
                  Target annual return (%)
                </Label>
                <Input
                  id="targetAnnualReturnPercent"
                  type="number"
                  step="0.1"
                  {...register("targetAnnualReturnPercent")}
                />
                <FieldErr
                  message={errors.targetAnnualReturnPercent?.message as any}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="targetIrrPercent">
                  Target IRR (%){" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="targetIrrPercent"
                  type="number"
                  step="0.1"
                  {...register("targetIrrPercent")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="equityMultiple">
                  Equity multiple{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="equityMultiple"
                  type="number"
                  step="0.01"
                  {...register("equityMultiple")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="holdYears">Hold period (years)</Label>
                <Input
                  id="holdYears"
                  type="number"
                  step="1"
                  {...register("holdYears")}
                />
                <FieldErr message={errors.holdYears?.message as any} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="payoutFrequency">Payout frequency</Label>
                <Controller
                  name="payoutFrequency"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAYOUT_FREQUENCIES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {PAYOUT_LABELS[p]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="distributionType">Distribution type</Label>
                <Controller
                  name="distributionType"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DISTRIBUTION_TYPES.map((d) => (
                          <SelectItem key={d} value={d}>
                            {DISTRIBUTION_LABELS[d]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="units">
                  Units{" "}
                  <span className="text-xs text-muted-foreground">
                    (optional)
                  </span>
                </Label>
                <Input
                  id="units"
                  type="number"
                  step="1"
                  {...register("units")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FUND_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <SheetFooter className="border-t">
            <div className="flex w-full gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isEdit ? "Save changes" : "Create fund"}
              </Button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
