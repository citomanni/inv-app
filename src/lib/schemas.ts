import { z } from "zod";

export type ActionResult<T = unknown> = {
  success: { reason: string } | null;
  error: { reason: string } | null;
  data?: T;
};

export const registerSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    }),
  name: z.string().min(2).max(100),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

// ────────────────────────────────────────────────────────────────────────────
// KYC submission
// ────────────────────────────────────────────────────────────────────────────

export const ID_TYPES = ["passport", "drivers_license", "national_id"] as const;
export const INCOME_BANDS = [
  "under_25k",
  "25k_50k",
  "50k_100k",
  "100k_250k",
  "250k_plus",
] as const;
export const SOURCES_OF_FUNDS = [
  "salary",
  "business",
  "savings",
  "investments",
  "inheritance",
  "other",
] as const;

export const kycSubmissionSchema = z.object({
  fullName: z.string().min(2, "Full legal name is required").max(120),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine(
      (v) => {
        const d = new Date(v);
        if (isNaN(d.getTime())) return false;
        const eighteen = new Date();
        eighteen.setFullYear(eighteen.getFullYear() - 18);
        return d <= eighteen;
      },
      { message: "You must be at least 18 years old" },
    ),
  nationality: z.string().min(2, "Nationality is required").max(60),
  phoneNumber: z.string().min(7, "Phone number is required").max(30),
  occupation: z.string().max(120).optional().or(z.literal("")),
  employer: z.string().max(120).optional().or(z.literal("")),
  addressLine1: z.string().min(2, "Address is required").max(200),
  addressLine2: z.string().max(200).optional().or(z.literal("")),
  city: z.string().min(1, "City is required").max(100),
  state: z.string().max(100).optional().or(z.literal("")),
  country: z.string().min(2, "Country is required").max(100),
  postalCode: z.string().min(2, "Postal code is required").max(30),
  annualIncomeBand: z.enum(INCOME_BANDS, {
    message: "Select an income band",
  }),
  sourceOfFunds: z.enum(SOURCES_OF_FUNDS, {
    message: "Select source of funds",
  }),
  accreditedInvestor: z.boolean(),
  idType: z.enum(ID_TYPES, { message: "Select an ID type" }),
  idNumber: z.string().min(2, "ID number is required").max(60),
  idFrontUrl: z.string().url("Upload the front of your ID"),
  idBackUrl: z.string().url().optional().or(z.literal("")),
  proofOfAddressUrl: z.string().url("Upload a proof of address"),
  selfieUrl: z.string().url().optional().or(z.literal("")),
});

export type KycSubmissionInput = z.infer<typeof kycSubmissionSchema>;

export const kycReviewSchema = z.object({
  decision: z.enum(["approve", "reject"]),
  rejectionReason: z.string().max(500).optional(),
});
export type KycReviewInput = z.infer<typeof kycReviewSchema>;

// ────────────────────────────────────────────────────────────────────────────
// Funds
// ────────────────────────────────────────────────────────────────────────────

export const PROPERTY_TYPES = [
  "multifamily",
  "mixed_use",
  "commercial",
  "hospitality",
] as const;

export const PAYOUT_FREQUENCIES = [
  "monthly",
  "quarterly",
  "annually",
] as const;

export const DISTRIBUTION_TYPES = [
  "cash_flow",
  "appreciation",
  "mixed",
] as const;

export const FUND_STATUSES = [
  "draft",
  "open",
  "closed",
  "oversubscribed",
  "archived",
] as const;

export const fundCreateSchema = z.object({
  name: z.string().min(2).max(120),
  slug: z.string().max(80).optional().or(z.literal("")),
  tagline: z.string().max(160).optional().or(z.literal("")),
  description: z.string().min(20),
  coverImage: z.string().min(1, "Cover image is required"),
  location: z.string().min(2).max(120),
  propertyType: z.enum(PROPERTY_TYPES),
  totalSize: z.coerce.number().positive(),
  minimumInvestment: z.coerce.number().positive(),
  targetAnnualReturnPercent: z.coerce.number().min(0).max(50),
  targetIrrPercent: z.coerce
    .number()
    .min(0)
    .max(100)
    .optional()
    .or(z.literal("")),
  equityMultiple: z.coerce
    .number()
    .min(0)
    .max(20)
    .optional()
    .or(z.literal("")),
  holdYears: z.coerce.number().int().min(1).max(30),
  payoutFrequency: z.enum(PAYOUT_FREQUENCIES),
  distributionType: z.enum(DISTRIBUTION_TYPES),
  units: z.coerce.number().int().min(0).optional().or(z.literal("")),
  status: z.enum(FUND_STATUSES).default("open"),
});
export type FundCreateSchema = z.infer<typeof fundCreateSchema>;

export const fundUpdateSchema = fundCreateSchema.partial().extend({
  raisedAmount: z.coerce.number().min(0).optional(),
});
export type FundUpdateSchema = z.infer<typeof fundUpdateSchema>;

// ────────────────────────────────────────────────────────────────────────────
// Investments (commit by investor)
// ────────────────────────────────────────────────────────────────────────────

export const investmentCreateSchema = z.object({
  fundId: z.string().min(1),
  amount: z.coerce.number().positive("Amount must be greater than zero"),
  paymentReference: z
    .string()
    .max(120)
    .optional()
    .or(z.literal("")),
  paymentProofUrl: z.string().url("Upload a payment proof to continue"),
});
export type InvestmentCreateInput = z.infer<typeof investmentCreateSchema>;

export const investmentReviewSchema = z.object({
  decision: z.enum(["approve", "reject"]),
  rejectionReason: z.string().max(500).optional(),
});
export type InvestmentReviewInput = z.infer<typeof investmentReviewSchema>;

// ────────────────────────────────────────────────────────────────────────────
// Payouts (admin-triggered return distribution)
// ────────────────────────────────────────────────────────────────────────────

export const payoutCreateSchema = z
  .object({
    fundId: z.string().min(1),
    periodStart: z.string().min(1),
    periodEnd: z.string().min(1),
    ratePercent: z.coerce.number().min(0).max(100),
    note: z.string().max(500).optional().or(z.literal("")),
  })
  .refine(
    (v) => {
      const s = new Date(v.periodStart);
      const e = new Date(v.periodEnd);
      return !isNaN(s.getTime()) && !isNaN(e.getTime()) && s <= e;
    },
    { message: "Period start must be on or before period end" },
  );
export type PayoutCreateInput = z.infer<typeof payoutCreateSchema>;

// ────────────────────────────────────────────────────────────────────────────
// Documents
// ────────────────────────────────────────────────────────────────────────────

export const DOCUMENT_TYPES = [
  "investment_agreement",
  "payment_receipt",
  "summary_statement",
  "tax_form",
  "other",
] as const;

export const documentCreateSchema = z.object({
  userId: z.string().min(1),
  investmentId: z.string().optional().or(z.literal("")),
  type: z.enum(DOCUMENT_TYPES),
  title: z.string().min(2).max(160),
  url: z.string().url("A valid file URL is required"),
});
export type DocumentCreateInput = z.infer<typeof documentCreateSchema>;
