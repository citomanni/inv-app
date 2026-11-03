import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
      user: schema.user,
    },
  }),
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    // TEMPORARY: accounts are auto-verified on signup (see databaseHooks below),
    // so verification is not required to log in. To revert, set this back to true,
    // set emailVerification.sendOnSignUp to true, and remove the databaseHooks block.
    requireEmailVerification: false,
    resetPasswordTokenExpiresIn: 60 * 60, // 1 hour
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address",
        text: `Click the link to verify your email: ${url}`,
      });
    },
    // TEMPORARY: no verification email on signup since accounts are auto-verified.
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
  },
  // TEMPORARY: mark every newly created user as email-verified by default.
  // Remove this block (and restore the two flags above) to re-enable real verification.
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({ data: { ...user, emailVerified: true } }),
      },
    },
  },
  user: {
    additionalFields: {
      kycStatus: {
        type: "string",
        required: false,
        defaultValue: "not_submitted",
        input: false,
      },
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      prompt: "select_account",
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    nextCookies(),
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
});
