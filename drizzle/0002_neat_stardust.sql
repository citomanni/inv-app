CREATE TABLE "document" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"investment_id" text,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"url" text NOT NULL,
	"uploaded_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fund" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"tagline" text,
	"description" text NOT NULL,
	"cover_image" text NOT NULL,
	"location" text NOT NULL,
	"property_type" text NOT NULL,
	"total_size" numeric(14, 2) NOT NULL,
	"raised_amount" numeric(14, 2) DEFAULT '0' NOT NULL,
	"minimum_investment" numeric(14, 2) NOT NULL,
	"target_annual_return_percent" numeric(5, 2) NOT NULL,
	"target_irr_percent" numeric(5, 2),
	"equity_multiple" numeric(5, 2),
	"hold_years" integer NOT NULL,
	"payout_frequency" text NOT NULL,
	"distribution_type" text NOT NULL,
	"units" integer,
	"status" text DEFAULT 'open' NOT NULL,
	"opened_at" timestamp,
	"closes_at" timestamp,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fund_image" (
	"id" text PRIMARY KEY NOT NULL,
	"fund_id" text NOT NULL,
	"url" text NOT NULL,
	"alt" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "investment" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"fund_id" text NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"status" text DEFAULT 'pending_payment' NOT NULL,
	"payment_proof_url" text,
	"payment_reference" text,
	"bank_transfer_at" timestamp,
	"activated_at" timestamp,
	"maturity_date" timestamp,
	"rejection_reason" text,
	"total_returns_credited" numeric(14, 2) DEFAULT '0' NOT NULL,
	"reviewed_by" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kyc_submission" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"full_name" text NOT NULL,
	"date_of_birth" timestamp NOT NULL,
	"nationality" text NOT NULL,
	"phone_number" text NOT NULL,
	"occupation" text,
	"employer" text,
	"address_line_1" text NOT NULL,
	"address_line_2" text,
	"city" text NOT NULL,
	"state" text,
	"country" text NOT NULL,
	"postal_code" text NOT NULL,
	"annual_income_band" text NOT NULL,
	"source_of_funds" text NOT NULL,
	"accredited_investor" boolean DEFAULT false NOT NULL,
	"id_type" text NOT NULL,
	"id_number" text NOT NULL,
	"id_front_url" text NOT NULL,
	"id_back_url" text,
	"proof_of_address_url" text NOT NULL,
	"selfie_url" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"reviewed_by" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"body" text,
	"url" text,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payout" (
	"id" text PRIMARY KEY NOT NULL,
	"fund_id" text NOT NULL,
	"period_start" timestamp NOT NULL,
	"period_end" timestamp NOT NULL,
	"rate_percent" numeric(5, 4) NOT NULL,
	"total_distributed" numeric(14, 2) DEFAULT '0' NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"note" text,
	"distributed_by" text,
	"distributed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payout_distribution" (
	"id" text PRIMARY KEY NOT NULL,
	"payout_id" text NOT NULL,
	"investment_id" text NOT NULL,
	"user_id" text NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"transaction_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"investment_id" text,
	"type" text NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"status" text DEFAULT 'completed' NOT NULL,
	"description" text,
	"reference_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "kyc_status" text DEFAULT 'not_submitted' NOT NULL;--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_investment_id_investment_id_fk" FOREIGN KEY ("investment_id") REFERENCES "public"."investment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document" ADD CONSTRAINT "document_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fund" ADD CONSTRAINT "fund_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fund_image" ADD CONSTRAINT "fund_image_fund_id_fund_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."fund"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment" ADD CONSTRAINT "investment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment" ADD CONSTRAINT "investment_fund_id_fund_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."fund"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "investment" ADD CONSTRAINT "investment_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_submission" ADD CONSTRAINT "kyc_submission_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kyc_submission" ADD CONSTRAINT "kyc_submission_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout" ADD CONSTRAINT "payout_fund_id_fund_id_fk" FOREIGN KEY ("fund_id") REFERENCES "public"."fund"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout" ADD CONSTRAINT "payout_distributed_by_user_id_fk" FOREIGN KEY ("distributed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout_distribution" ADD CONSTRAINT "payout_distribution_payout_id_payout_id_fk" FOREIGN KEY ("payout_id") REFERENCES "public"."payout"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout_distribution" ADD CONSTRAINT "payout_distribution_investment_id_investment_id_fk" FOREIGN KEY ("investment_id") REFERENCES "public"."investment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout_distribution" ADD CONSTRAINT "payout_distribution_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payout_distribution" ADD CONSTRAINT "payout_distribution_transaction_id_transaction_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."transaction"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_investment_id_investment_id_fk" FOREIGN KEY ("investment_id") REFERENCES "public"."investment"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "document_user_idx" ON "document" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "document_investment_idx" ON "document" USING btree ("investment_id");--> statement-breakpoint
CREATE UNIQUE INDEX "fund_slug_idx" ON "fund" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "fund_status_idx" ON "fund" USING btree ("status");--> statement-breakpoint
CREATE INDEX "fund_image_fund_idx" ON "fund_image" USING btree ("fund_id");--> statement-breakpoint
CREATE INDEX "investment_user_idx" ON "investment" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "investment_fund_idx" ON "investment" USING btree ("fund_id");--> statement-breakpoint
CREATE INDEX "investment_status_idx" ON "investment" USING btree ("status");--> statement-breakpoint
CREATE INDEX "kyc_user_idx" ON "kyc_submission" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "kyc_status_idx" ON "kyc_submission" USING btree ("status");--> statement-breakpoint
CREATE INDEX "notification_user_idx" ON "notification" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "notification_read_idx" ON "notification" USING btree ("read_at");--> statement-breakpoint
CREATE INDEX "payout_fund_idx" ON "payout" USING btree ("fund_id");--> statement-breakpoint
CREATE INDEX "payout_status_idx" ON "payout" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payout_dist_payout_idx" ON "payout_distribution" USING btree ("payout_id");--> statement-breakpoint
CREATE INDEX "payout_dist_investment_idx" ON "payout_distribution" USING btree ("investment_id");--> statement-breakpoint
CREATE INDEX "transaction_user_idx" ON "transaction" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "transaction_investment_idx" ON "transaction" USING btree ("investment_id");--> statement-breakpoint
CREATE INDEX "transaction_type_idx" ON "transaction" USING btree ("type");