import "server-only";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { SessionUser } from "@/lib/auth-types";

/** Returns the session or null. Use in server components / route handlers. */
export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Redirects to login if no session. Returns the user. */
export async function requireUser(): Promise<SessionUser> {
  const session = await getSession();
  if (!session?.user) {
    redirect("/auth/login");
  }
  return session.user;
}

/**
 * Requires an authenticated user whose KYC has been approved.
 * - No session → /auth/login
 * - KYC not approved → /onboarding
 * - Banned → /auth/login (Better Auth blocks at session-level too)
 */
export async function requireApprovedUser(): Promise<SessionUser> {
  const user = await requireUser();
  const kyc = (user as SessionUser & { kycStatus?: string }).kycStatus;
  if (kyc !== "approved") {
    redirect("/onboarding");
  }
  return user;
}

/** Requires admin role. */
export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") {
    redirect("/dashboard");
  }
  return user;
}
