# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project context

A simulated **fund-based real-estate investment platform** modeled after Cardone Capital, built on top of the Zexa Better-Auth Next.js starter. Users invest in pooled funds (not individual properties), with a complete lifecycle: signup → KYC → fund commitment → admin verification → returns distribution.

Public marketing pages (`/`, `/investments`, `/ira-info`, `/overview`, `/contact`) sit alongside the authenticated investor area (`/dashboard`, `/portfolio`, `/transactions`, `/documents`, `/notifications`, `/onboarding`) and the admin shell (`/admin/*`).

## Commands

Package manager is **pnpm** (CI pins Node 24.12.0, see `.github/workflows/pr.yml`).

- `pnpm dev` — Next.js dev server with Turbopack
- `pnpm build` — production build
- `pnpm lint` — `next lint`
- `pnpm db:generate` / `db:migrate` / `db:push` / `db:studio` — drizzle-kit against `DATABASE_URL`
- `pnpm db:seed` — seed 10 demo funds backed by photos in `public/2025/07/` (idempotent — skips already-seeded slugs)

There is no test runner configured.

## Architecture

**Stack:** Next.js 16 (App Router, React 19), Better Auth + Drizzle ORM + PostgreSQL, Tailwind v4, shadcn/ui (`new-york`, zinc), Resend for email, Cloudinary for client-side file uploads.

**Path alias:** `@/*` → `./src/*`.

### Auth & access gating

- Server config: `src/lib/auth.ts` — email/password + verification, GitHub + Google OAuth, `admin` plugin, `nextCookies`. Adds `kycStatus` as a Better-Auth additional field (`not_submitted | pending | approved | rejected`) — denormalized onto the `user` table.
- Client config: `src/lib/auth-client.ts` — uses `inferAdditionalFields<typeof auth>()` so client code sees `kycStatus` on `session.user`.
- All auth HTTP traffic flows through `src/app/api/auth/[...all]/route.ts`.
- `src/proxy.ts` is the Next 16 **proxy** (the renamed-from-`middleware` request guard — Next 16 deprecated `middleware.ts`). It blocks unauthenticated users from non-public paths and bounces logged-in users away from `/auth/*`.
- Layout-level gates use `src/lib/session.ts` helpers:
  - `getSession()` — raw session
  - `requireUser()` — redirects to `/auth/login` if no session
  - `requireApprovedUser()` — additionally redirects to `/onboarding` until `kycStatus === "approved"`
  - `requireAdmin()` — redirects non-admins to `/dashboard`
- Public-path allowlist: `src/lib/public-paths.ts`. Marketing pages live in `exactPaths`/`prefixes` so the proxy lets them through.

### Database schema (`src/db/schema.ts`)

Better-Auth tables (`user`, `session`, `account`, `verification`) plus the domain model:

- **`kyc_submission`** — investor identity submission (full name, address, ID type/number, Cloudinary URLs for ID/proof-of-address/selfie). Status `pending | approved | rejected`. Reviewed by admin.
- **`fund`** — investment products with full economic terms (totalSize, raisedAmount, minimumInvestment, targetAnnualReturnPercent, targetIrrPercent, equityMultiple, holdYears, payoutFrequency, distributionType). Status `draft | open | closed | oversubscribed | archived`.
- **`fund_image`** — additional gallery photos per fund (sortable).
- **`investment`** — a user's commitment to a fund. Status `pending_payment | pending_verification | active | matured | rejected`. Stores Cloudinary `paymentProofUrl` and bank reference. Each new contribution is a **separate row** (no top-ups).
- **`transaction`** — append-only ledger of every financial event. Types: `investment_commit | investment_active | payout | refund`.
- **`payout`** — admin-triggered distribution run for a fund/period at a given `ratePercent`.
- **`payout_distribution`** — per-investor split of a payout run, FK'd to its transaction.
- **`notification`** — in-app messages fired from KYC review, investment review, payout runs, document uploads.
- **`document`** — files admin uploads to a specific user/investment (Cloudinary URLs). Types: `investment_agreement | payment_receipt | summary_statement | tax_form | other`.

### Server-side helpers (`src/utils/`)

Each domain has a server-only module with the canonical query/mutation functions used by both API routes and Server Components:

- `users.ts` — Better Auth `listUsers` + accounts/sessions aggregation
- `kyc.ts` — `createKycSubmission`, `reviewKycSubmission`, `listKycSubmissions`
- `funds.ts` — `createFund`, `updateFund`, `archiveFund`, `getFundBySlug`, `listFundsWithImages`, `addFundImage`/`removeFundImage`, plus `slugify`/`ensureUniqueSlug` and a `toNumber` helper for `numeric` columns
- `investments.ts` — `commitInvestment` (transactional: investment + ledger row), `reviewInvestment` (transactional: status + raisedAmount += amount + ledger entry + notification), `listInvestments`, `getUserPortfolioStats`
- `payouts.ts` — `distributePayoutRun` (single transaction that calculates each active investor's share, writes payout + payout_distributions + transaction + notification rows, increments `investment.totalReturnsCredited`), `previewPayout`
- `transactions.ts` — `listTransactions`, `listUserPositions`
- `documents.ts` — `createDocument` (also fires a notification), `listDocuments`, `deleteDocument`
- `notifications.ts` — `listUserNotifications`, `unreadCountForUser`, `markNotificationRead`, `markAllRead`

### Admin module (`/admin/*`)

Layout: `src/components/admin/dashboard-layout.tsx` (sidebar + breadcrumb header). Sidebar groups: **Investor Operations** (KYC, Investments, Payouts), **Catalog** (Funds), **User Management** (Users, Documents, Notifications). All admin routes are role-gated in `src/app/admin/layout.tsx`.

The canonical CRUD pattern across admin tables is identical: SWR-backed table component (`*-table.tsx`) + Sheet-based detail/review dialog (`*-review-dialog.tsx` or `*-form-dialog.tsx`). `users-table.tsx` is the gold standard; `kyc-table.tsx`, `funds-table.tsx`, `investments-table.tsx`, `payouts-table.tsx`, `documents-table.tsx` all mirror it.

### Investor experience

- `/onboarding` — KYC submission form (RHF + Zod, Cloudinary uploads). Status-aware: shows form for `not_submitted/rejected`, "in review" panel for `pending`, redirects to `/dashboard` for `approved`.
- `/investments` — public marketplace, server-rendered from DB.
- `/investments/[slug]` — public fund detail with gallery + economic terms + Invest CTA (linking into `/dashboard/invest/[slug]`).
- `/dashboard/invest/[slug]` — three-step commit flow: amount → bank instructions + transfer confirmation → payment-proof upload (Cloudinary).
- `/dashboard` — DB-backed SectionCards (Portfolio Value, Active Investments, Total Returns, Available Funds) plus active-positions list and recommended-funds grid.
- `/portfolio`, `/transactions`, `/documents`, `/notifications` — all server-rendered from per-user data via the `requireApprovedUser()` gate.
- Notifications bell in `SiteHeader` polls `/api/notifications` every 60s.

### File uploads (Cloudinary)

Client-side **unsigned** uploads via `src/lib/cloudinary.ts` (`uploadToCloudinary`). Wrapper component is `src/components/ui/file-upload.tsx`. Required env vars: `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` (must be configured as **Unsigned** in the Cloudinary dashboard). Uploads are organized by folder per use case: `kyc/id`, `kyc/address`, `kyc/selfie`, `investments/proofs`, `funds/covers`, `funds/<slug>`, `documents`.

### Conventions

- ID generation: `src/lib/id.ts` (`crypto.randomUUID`).
- Money columns are Drizzle `numeric` → strings in TS; convert with `toNumber()` from `src/utils/funds.ts`.
- Form pattern: react-hook-form + Zod resolver. When a Zod schema uses `z.coerce.number()`, you may need `as any` on `zodResolver(...)` — there's a known Zod v4 input/output type mismatch with the resolver (see `invest-form.tsx`, `fund-form-dialog.tsx`).
- `next.config.ts` allows images from any HTTPS host (`remotePatterns: [{ hostname: "**" }]`).
- ESLint config (`eslint.config.mjs`) explicitly disables `@typescript-eslint/no-explicit-any` — `any` is tolerated.
- Toaster is mounted globally in `src/app/layout.tsx` (`react-hot-toast`).
- shadcn/ui aliases: components at `@/components`, ui at `@/components/ui`, hooks at `@/hooks`, utils at `@/lib/utils`.

### Pre-existing tech debt (not introduced by recent work)

- `src/components/auth/signup-form.tsx`, `src/components/mode-toggle.tsx`, `src/components/theme-provider.tsx`, `src/app/(dashboard)/dashboard/setting/page.tsx`, and `src/app/contact/components/ContactPageClient.tsx` reference modules that don't exist (`next-themes`, `@/components/data-table`, etc.). These are inherited dead code from the starter and don't affect the live routes.
- `src/app/auth/register/action.ts` uses `ZodError.errors` — Zod v4 renamed it to `.issues`. Won't crash unless registration fails validation.
