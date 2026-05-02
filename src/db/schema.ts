import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ────────────────────────────────────────────────────────────────────────────
// Better Auth core tables
// ────────────────────────────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  // KYC denormalized status (latest kyc_submission's status mirrored here for fast lookup)
  // Values: 'not_submitted' | 'pending' | 'approved' | 'rejected'
  kycStatus: text("kyc_status").default("not_submitted").notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

// ────────────────────────────────────────────────────────────────────────────
// KYC
// ────────────────────────────────────────────────────────────────────────────

export const kycSubmission = pgTable(
  "kyc_submission",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // Personal
    fullName: text("full_name").notNull(),
    dateOfBirth: timestamp("date_of_birth").notNull(),
    nationality: text("nationality").notNull(),
    phoneNumber: text("phone_number").notNull(),
    occupation: text("occupation"),
    employer: text("employer"),
    // Address
    addressLine1: text("address_line_1").notNull(),
    addressLine2: text("address_line_2"),
    city: text("city").notNull(),
    state: text("state"),
    country: text("country").notNull(),
    postalCode: text("postal_code").notNull(),
    // Financial
    annualIncomeBand: text("annual_income_band").notNull(),
    sourceOfFunds: text("source_of_funds").notNull(),
    accreditedInvestor: boolean("accredited_investor").default(false).notNull(),
    // ID
    idType: text("id_type").notNull(), // 'passport' | 'drivers_license' | 'national_id'
    idNumber: text("id_number").notNull(),
    idFrontUrl: text("id_front_url").notNull(),
    idBackUrl: text("id_back_url"),
    proofOfAddressUrl: text("proof_of_address_url").notNull(),
    selfieUrl: text("selfie_url"),
    // Review
    status: text("status").default("pending").notNull(), // 'pending' | 'approved' | 'rejected'
    rejectionReason: text("rejection_reason"),
    reviewedBy: text("reviewed_by").references(() => user.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index("kyc_user_idx").on(t.userId),
    statusIdx: index("kyc_status_idx").on(t.status),
  }),
);

// ────────────────────────────────────────────────────────────────────────────
// Funds (the investment products)
// ────────────────────────────────────────────────────────────────────────────

export const fund = pgTable(
  "fund",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    tagline: text("tagline"),
    description: text("description").notNull(),
    coverImage: text("cover_image").notNull(),
    location: text("location").notNull(),
    propertyType: text("property_type").notNull(), // 'multifamily' | 'mixed_use' | 'commercial' | 'hospitality'
    // Financial terms
    totalSize: numeric("total_size", { precision: 14, scale: 2 }).notNull(), // target raise
    raisedAmount: numeric("raised_amount", { precision: 14, scale: 2 })
      .default("0")
      .notNull(),
    minimumInvestment: numeric("minimum_investment", {
      precision: 14,
      scale: 2,
    }).notNull(),
    targetAnnualReturnPercent: numeric("target_annual_return_percent", {
      precision: 5,
      scale: 2,
    }).notNull(),
    targetIrrPercent: numeric("target_irr_percent", { precision: 5, scale: 2 }),
    equityMultiple: numeric("equity_multiple", { precision: 5, scale: 2 }),
    holdYears: integer("hold_years").notNull(),
    payoutFrequency: text("payout_frequency").notNull(), // 'monthly' | 'quarterly' | 'annually'
    distributionType: text("distribution_type").notNull(), // 'cash_flow' | 'appreciation' | 'mixed'
    units: integer("units"), // residential units in the asset/portfolio
    // Lifecycle
    status: text("status").default("open").notNull(), // 'draft' | 'open' | 'closed' | 'oversubscribed' | 'archived'
    openedAt: timestamp("opened_at"),
    closesAt: timestamp("closes_at"),
    createdBy: text("created_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    slugIdx: uniqueIndex("fund_slug_idx").on(t.slug),
    statusIdx: index("fund_status_idx").on(t.status),
  }),
);

export const fundImage = pgTable(
  "fund_image",
  {
    id: text("id").primaryKey(),
    fundId: text("fund_id")
      .notNull()
      .references(() => fund.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    alt: text("alt"),
    sortOrder: integer("sort_order").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    fundIdx: index("fund_image_fund_idx").on(t.fundId),
  }),
);

// ────────────────────────────────────────────────────────────────────────────
// Investments
// ────────────────────────────────────────────────────────────────────────────

export const investment = pgTable(
  "investment",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    fundId: text("fund_id")
      .notNull()
      .references(() => fund.id, { onDelete: "restrict" }),
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
    // Lifecycle: 'pending_payment' | 'pending_verification' | 'active' | 'matured' | 'rejected'
    status: text("status").default("pending_payment").notNull(),
    paymentProofUrl: text("payment_proof_url"),
    paymentReference: text("payment_reference"),
    bankTransferAt: timestamp("bank_transfer_at"),
    activatedAt: timestamp("activated_at"),
    maturityDate: timestamp("maturity_date"),
    rejectionReason: text("rejection_reason"),
    totalReturnsCredited: numeric("total_returns_credited", {
      precision: 14,
      scale: 2,
    })
      .default("0")
      .notNull(),
    reviewedBy: text("reviewed_by").references(() => user.id, {
      onDelete: "set null",
    }),
    reviewedAt: timestamp("reviewed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index("investment_user_idx").on(t.userId),
    fundIdx: index("investment_fund_idx").on(t.fundId),
    statusIdx: index("investment_status_idx").on(t.status),
  }),
);

// ────────────────────────────────────────────────────────────────────────────
// Transactions (ledger of every financial event)
// ────────────────────────────────────────────────────────────────────────────

export const transaction = pgTable(
  "transaction",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    investmentId: text("investment_id").references(() => investment.id, {
      onDelete: "set null",
    }),
    type: text("type").notNull(), // 'investment_commit' | 'investment_active' | 'payout' | 'refund'
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(), // signed
    status: text("status").default("completed").notNull(), // 'pending' | 'completed' | 'failed'
    description: text("description"),
    referenceId: text("reference_id"), // payoutId etc.
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index("transaction_user_idx").on(t.userId),
    investmentIdx: index("transaction_investment_idx").on(t.investmentId),
    typeIdx: index("transaction_type_idx").on(t.type),
  }),
);

// ────────────────────────────────────────────────────────────────────────────
// Payouts (return distributions)
// ────────────────────────────────────────────────────────────────────────────

export const payout = pgTable(
  "payout",
  {
    id: text("id").primaryKey(),
    fundId: text("fund_id")
      .notNull()
      .references(() => fund.id, { onDelete: "cascade" }),
    periodStart: timestamp("period_start").notNull(),
    periodEnd: timestamp("period_end").notNull(),
    ratePercent: numeric("rate_percent", { precision: 5, scale: 4 }).notNull(), // % of invested capital paid this period
    totalDistributed: numeric("total_distributed", { precision: 14, scale: 2 })
      .default("0")
      .notNull(),
    status: text("status").default("draft").notNull(), // 'draft' | 'distributed'
    note: text("note"),
    distributedBy: text("distributed_by").references(() => user.id, {
      onDelete: "set null",
    }),
    distributedAt: timestamp("distributed_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    fundIdx: index("payout_fund_idx").on(t.fundId),
    statusIdx: index("payout_status_idx").on(t.status),
  }),
);

export const payoutDistribution = pgTable(
  "payout_distribution",
  {
    id: text("id").primaryKey(),
    payoutId: text("payout_id")
      .notNull()
      .references(() => payout.id, { onDelete: "cascade" }),
    investmentId: text("investment_id")
      .notNull()
      .references(() => investment.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
    transactionId: text("transaction_id").references(() => transaction.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    payoutIdx: index("payout_dist_payout_idx").on(t.payoutId),
    investmentIdx: index("payout_dist_investment_idx").on(t.investmentId),
  }),
);

// ────────────────────────────────────────────────────────────────────────────
// Notifications
// ────────────────────────────────────────────────────────────────────────────

export const notification = pgTable(
  "notification",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    url: text("url"),
    readAt: timestamp("read_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index("notification_user_idx").on(t.userId),
    readIdx: index("notification_read_idx").on(t.readAt),
  }),
);

// ────────────────────────────────────────────────────────────────────────────
// Documents (files admin uploads to a user's investment)
// ────────────────────────────────────────────────────────────────────────────

export const document = pgTable(
  "document",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    investmentId: text("investment_id").references(() => investment.id, {
      onDelete: "set null",
    }),
    type: text("type").notNull(), // 'investment_agreement' | 'payment_receipt' | 'summary_statement' | 'tax_form' | 'other'
    title: text("title").notNull(),
    url: text("url").notNull(),
    uploadedBy: text("uploaded_by").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index("document_user_idx").on(t.userId),
    investmentIdx: index("document_investment_idx").on(t.investmentId),
  }),
);

// ────────────────────────────────────────────────────────────────────────────
// Relations
// ────────────────────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ many }) => ({
  kycSubmissions: many(kycSubmission),
  investments: many(investment),
  transactions: many(transaction),
  notifications: many(notification),
  documents: many(document),
}));

export const fundRelations = relations(fund, ({ many }) => ({
  images: many(fundImage),
  investments: many(investment),
  payouts: many(payout),
}));

export const fundImageRelations = relations(fundImage, ({ one }) => ({
  fund: one(fund, { fields: [fundImage.fundId], references: [fund.id] }),
}));

export const investmentRelations = relations(investment, ({ one, many }) => ({
  user: one(user, { fields: [investment.userId], references: [user.id] }),
  fund: one(fund, { fields: [investment.fundId], references: [fund.id] }),
  transactions: many(transaction),
  payoutDistributions: many(payoutDistribution),
  documents: many(document),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
  user: one(user, { fields: [transaction.userId], references: [user.id] }),
  investment: one(investment, {
    fields: [transaction.investmentId],
    references: [investment.id],
  }),
}));

export const payoutRelations = relations(payout, ({ one, many }) => ({
  fund: one(fund, { fields: [payout.fundId], references: [fund.id] }),
  distributions: many(payoutDistribution),
}));

export const payoutDistributionRelations = relations(
  payoutDistribution,
  ({ one }) => ({
    payout: one(payout, {
      fields: [payoutDistribution.payoutId],
      references: [payout.id],
    }),
    investment: one(investment, {
      fields: [payoutDistribution.investmentId],
      references: [investment.id],
    }),
    user: one(user, {
      fields: [payoutDistribution.userId],
      references: [user.id],
    }),
  }),
);

export const documentRelations = relations(document, ({ one }) => ({
  user: one(user, { fields: [document.userId], references: [user.id] }),
  investment: one(investment, {
    fields: [document.investmentId],
    references: [investment.id],
  }),
}));

export const kycSubmissionRelations = relations(kycSubmission, ({ one }) => ({
  user: one(user, { fields: [kycSubmission.userId], references: [user.id] }),
  reviewer: one(user, {
    fields: [kycSubmission.reviewedBy],
    references: [user.id],
  }),
}));

export const notificationRelations = relations(notification, ({ one }) => ({
  user: one(user, { fields: [notification.userId], references: [user.id] }),
}));
