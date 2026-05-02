import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Clock4, ShieldCheck, XCircle } from "lucide-react";
import { format } from "date-fns";

import { KycForm } from "@/components/kyc/kyc-form";
import { requireUser } from "@/lib/session";
import { getLatestKycForUser } from "@/utils/kyc";
import LogoutButton from "@/components/auth/logout-button";

export const metadata = { title: "Identity Verification" };

export default async function OnboardingPage() {
  const sessionUser = await requireUser();

  // Admins skip KYC.
  if (sessionUser.role === "admin") {
    redirect("/admin");
  }

  const status = (sessionUser as any).kycStatus as
    | "not_submitted"
    | "pending"
    | "approved"
    | "rejected"
    | undefined;

  if (status === "approved") {
    redirect("/dashboard");
  }

  const latest = await getLatestKycForUser(sessionUser.id);

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-background/80 px-6 py-4 backdrop-blur md:px-10">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/cardonenobg_logo.png"
            alt="Cardone Capital"
            width={36}
            height={36}
            className="rounded"
          />
          <span className="text-base font-semibold tracking-tight">
            Cardone Capital
          </span>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <span className="hidden text-muted-foreground sm:inline">
            {sessionUser.email}
          </span>
          <LogoutButton />
        </div>
      </header>

      {/* Hero strip */}
      <section className="relative overflow-hidden border-b">
        <Image
          src="/2025/07/10x-investment-bg-ipad-3.jpg"
          alt=""
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="relative mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
            <ShieldCheck className="h-3.5 w-3.5" />
            Step 1 of 1 · Identity Verification
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            Verify your identity to start investing
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            We're a regulated platform — every investor must complete a one-time
            KYC review before participating in any fund. This usually takes
            under a business day.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        {status === "pending" ? (
          <StatusCard
            tone="info"
            icon={<Clock4 className="h-6 w-6" />}
            title="Submission received"
            subtitle={
              latest?.createdAt
                ? `Submitted on ${format(new Date(latest.createdAt), "MMM d, yyyy 'at' h:mm a")}`
                : "We've received your details."
            }
          >
            <p>
              Our compliance team is reviewing your information. You'll receive
              an email and an in-app notification as soon as a decision is
              made.
            </p>
            <p className="text-muted-foreground">
              Most submissions are reviewed within one business day. While you
              wait, feel free to{" "}
              <Link
                href="/investments"
                className="underline-offset-4 hover:underline"
              >
                browse our open funds
              </Link>
              .
            </p>
          </StatusCard>
        ) : status === "rejected" ? (
          <>
            <StatusCard
              tone="error"
              icon={<XCircle className="h-6 w-6" />}
              title="Submission needs attention"
              subtitle={
                latest?.reviewedAt
                  ? `Reviewed on ${format(new Date(latest.reviewedAt), "MMM d, yyyy")}`
                  : undefined
              }
            >
              {latest?.rejectionReason && (
                <div className="rounded-md bg-background p-3 text-sm">
                  <span className="font-medium">Reviewer note: </span>
                  <span className="text-muted-foreground">
                    {latest.rejectionReason}
                  </span>
                </div>
              )}
              <p className="text-muted-foreground">
                Please correct the issues below and resubmit.
              </p>
            </StatusCard>
            <div className="mt-8">
              <KycForm />
            </div>
          </>
        ) : (
          <KycForm />
        )}
      </main>

      <footer className="mx-auto max-w-5xl border-t px-6 py-6 text-xs text-muted-foreground md:px-10">
        Need help? Contact{" "}
        <Link href="/contact" className="underline-offset-4 hover:underline">
          support
        </Link>
        .
      </footer>
    </div>
  );
}

function StatusCard({
  tone,
  icon,
  title,
  subtitle,
  children,
}: {
  tone: "info" | "success" | "error";
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const palette =
    tone === "success"
      ? "bg-green-50 text-green-900 border-green-200 dark:bg-green-950/40 dark:text-green-200 dark:border-green-900"
      : tone === "error"
        ? "bg-red-50 text-red-900 border-red-200 dark:bg-red-950/40 dark:text-red-200 dark:border-red-900"
        : "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-950/40 dark:text-blue-200 dark:border-blue-900";

  return (
    <div className={`flex gap-4 rounded-xl border p-6 ${palette}`}>
      <div className="shrink-0">{icon}</div>
      <div className="flex flex-1 flex-col gap-2">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
        </div>
        <div className="space-y-2 text-sm">{children}</div>
      </div>
    </div>
  );
}

