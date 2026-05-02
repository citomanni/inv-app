"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  kycSubmissionSchema,
  type KycSubmissionInput,
  ID_TYPES,
  INCOME_BANDS,
  SOURCES_OF_FUNDS,
} from "@/lib/schemas";

const ID_TYPE_LABELS: Record<(typeof ID_TYPES)[number], string> = {
  passport: "Passport",
  drivers_license: "Driver's License",
  national_id: "National ID",
};

const INCOME_LABELS: Record<(typeof INCOME_BANDS)[number], string> = {
  under_25k: "Under $25,000",
  "25k_50k": "$25,000 – $50,000",
  "50k_100k": "$50,000 – $100,000",
  "100k_250k": "$100,000 – $250,000",
  "250k_plus": "$250,000+",
};

const SOURCE_LABELS: Record<(typeof SOURCES_OF_FUNDS)[number], string> = {
  salary: "Salary / Employment",
  business: "Business Income",
  savings: "Savings",
  investments: "Investment Returns",
  inheritance: "Inheritance",
  other: "Other",
};

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="rounded-xl border bg-card shadow-xs">
      <header className="border-b px-6 py-4">
        <h2 className="text-base font-semibold">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
        )}
      </header>
      <div className="p-6">{children}</div>
    </section>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-xs text-destructive">{message}</span>;
}

export function KycForm({
  defaultValues,
}: {
  defaultValues?: Partial<KycSubmissionInput>;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<KycSubmissionInput>({
    resolver: zodResolver(kycSubmissionSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      nationality: "",
      phoneNumber: "",
      occupation: "",
      employer: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      accreditedInvestor: false,
      idNumber: "",
      idFrontUrl: "",
      idBackUrl: "",
      proofOfAddressUrl: "",
      selfieUrl: "",
      ...defaultValues,
    },
  });

  const onSubmit = async (data: KycSubmissionInput) => {
    try {
      const res = await fetch("/api/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(json?.error || "Submission failed");
        return;
      }
      toast.success("Submission received — we'll review shortly");
      router.refresh();
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Section
        title="Personal Information"
        description="Use the name shown on your government-issued ID."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2 flex flex-col gap-2">
            <Label htmlFor="fullName">Full legal name</Label>
            <Input id="fullName" {...register("fullName")} />
            <FieldError message={errors.fullName?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="dateOfBirth">Date of birth</Label>
            <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
            <FieldError message={errors.dateOfBirth?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              placeholder="e.g. American"
              {...register("nationality")}
            />
            <FieldError message={errors.nationality?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phoneNumber">Phone number</Label>
            <Input
              id="phoneNumber"
              placeholder="+1 555 0100"
              {...register("phoneNumber")}
            />
            <FieldError message={errors.phoneNumber?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="occupation">
              Occupation{" "}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Input id="occupation" {...register("occupation")} />
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <Label htmlFor="employer">
              Employer{" "}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Input id="employer" {...register("employer")} />
          </div>
        </div>
      </Section>

      <Section title="Residential Address">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="md:col-span-2 flex flex-col gap-2">
            <Label htmlFor="addressLine1">Address line 1</Label>
            <Input id="addressLine1" {...register("addressLine1")} />
            <FieldError message={errors.addressLine1?.message} />
          </div>
          <div className="md:col-span-2 flex flex-col gap-2">
            <Label htmlFor="addressLine2">
              Address line 2{" "}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Input id="addressLine2" {...register("addressLine2")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} />
            <FieldError message={errors.city?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="state">
              State / Region{" "}
              <span className="text-xs text-muted-foreground">(optional)</span>
            </Label>
            <Input id="state" {...register("state")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register("country")} />
            <FieldError message={errors.country?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="postalCode">Postal code</Label>
            <Input id="postalCode" {...register("postalCode")} />
            <FieldError message={errors.postalCode?.message} />
          </div>
        </div>
      </Section>

      <Section
        title="Financial Profile"
        description="Required for regulatory compliance — your data is private."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="annualIncomeBand">Annual income</Label>
            <Controller
              name="annualIncomeBand"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="annualIncomeBand" className="w-full">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    {INCOME_BANDS.map((b) => (
                      <SelectItem key={b} value={b}>
                        {INCOME_LABELS[b]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.annualIncomeBand?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="sourceOfFunds">Source of funds</Label>
            <Controller
              name="sourceOfFunds"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="sourceOfFunds" className="w-full">
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    {SOURCES_OF_FUNDS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {SOURCE_LABELS[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.sourceOfFunds?.message} />
          </div>
          <div className="md:col-span-2 mt-2 flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-3">
            <div className="flex flex-col">
              <Label htmlFor="accreditedInvestor" className="cursor-pointer">
                I am an accredited investor
              </Label>
              <span className="text-xs text-muted-foreground">
                Net worth over $1M (excluding home), or income over $200k for the
                last two years.
              </span>
            </div>
            <Controller
              name="accreditedInvestor"
              control={control}
              render={({ field }) => (
                <Switch
                  id="accreditedInvestor"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
        </div>
      </Section>

      <Section
        title="Identity Verification"
        description="Upload clear, full-page photos. Documents are encrypted and only visible to compliance reviewers."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="idType">ID document type</Label>
            <Controller
              name="idType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="idType" className="w-full">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    {ID_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {ID_TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError message={errors.idType?.message} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="idNumber">ID number</Label>
            <Input id="idNumber" {...register("idNumber")} />
            <FieldError message={errors.idNumber?.message} />
          </div>
          <Controller
            name="idFrontUrl"
            control={control}
            render={({ field }) => (
              <FileUpload
                value={field.value}
                onChange={field.onChange}
                folder="kyc/id"
                label="Front of ID"
                description="JPEG / PNG"
                compact
              />
            )}
          />
          <Controller
            name="idBackUrl"
            control={control}
            render={({ field }) => (
              <FileUpload
                value={field.value}
                onChange={field.onChange}
                folder="kyc/id"
                label="Back of ID (optional)"
                description="JPEG / PNG"
                compact
              />
            )}
          />
          <Controller
            name="proofOfAddressUrl"
            control={control}
            render={({ field }) => (
              <FileUpload
                value={field.value}
                onChange={field.onChange}
                folder="kyc/address"
                label="Proof of address"
                description="Utility bill or bank statement"
                compact
              />
            )}
          />
          <Controller
            name="selfieUrl"
            control={control}
            render={({ field }) => (
              <FileUpload
                value={field.value}
                onChange={field.onChange}
                folder="kyc/selfie"
                label="Selfie holding ID (optional)"
                description="JPEG / PNG"
                compact
              />
            )}
          />
          <div className="md:col-span-2">
            <FieldError message={errors.idFrontUrl?.message} />
            <FieldError message={errors.proofOfAddressUrl?.message} />
          </div>
        </div>
      </Section>

      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={isSubmitting} className="min-w-40">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            "Submit for review"
          )}
        </Button>
      </div>
    </form>
  );
}
