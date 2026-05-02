// "use server";

// import { auth } from "@/lib/auth";
// import { APIError } from "better-auth/api";
// import { ActionResult } from "@/lib/schemas";
// import { registerSchema, RegisterSchema } from "@/lib/schemas";
// import { DEFAULT_LOGIN_REDIRECT } from "@/lib/config";

// export async function registerUser(
//   formData: RegisterSchema,
// ): Promise<ActionResult> {
//   const parsed = registerSchema.safeParse(formData);

//   if (!parsed.success) {
//     return {
//       success: null,
//       error: { reason: parsed.error.errors[0]?.message || "Invalid input" },
//     };
//   }

//   const { email, password, name } = parsed.data;

//   try {
//     const { user } = await auth.api.signUpEmail({
//       body: {
//         email,
//         password,
//         name,
//         callbackURL: DEFAULT_LOGIN_REDIRECT,
//       },
//     });

//     return {
//       success: {
//         reason:
//           "Registration successful! Check your email to confirm your account.",
//       },
//       error: null,
//       data: { user: { id: user.id, email: user.email } },
//     };
//   } catch (error) {
//     if (error instanceof APIError) {
//       switch (error.status) {
//         case "UNPROCESSABLE_ENTITY":
//           return { error: { reason: "User already exists." }, success: null };
//         case "BAD_REQUEST":
//           return { error: { reason: "Invalid email." }, success: null };
//         default:
//           return { error: { reason: "Something went wrong." }, success: null };
//       }
//     }

//     return { error: { reason: "Something went wrong." }, success: null };
//   }
// }

"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";
import { ActionResult } from "@/lib/schemas";
import { registerSchema, RegisterSchema } from "@/lib/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/config";

export async function registerUser(
  formData: RegisterSchema,
): Promise<ActionResult> {
  const parsed = registerSchema.safeParse(formData);

  if (!parsed.success) {
    console.error("❌ Validation error:", parsed.error.format());

    return {
      success: null,
      error: { reason: parsed.error.issues[0]?.message || "Invalid input" },
    };
  }

  const { email, password, name } = parsed.data;

  try {
    const { user } = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        callbackURL: DEFAULT_LOGIN_REDIRECT,
      },
    });

    return {
      success: {
        reason:
          "Registration successful! Check your email to confirm your account.",
      },
      error: null,
      data: { user: { id: user.id, email: user.email } },
    };
  } catch (error) {
    // 👇 LOG EVERYTHING FIRST
    console.error("🔥 Register user error:", error);

    // Better Auth specific error
    if (error instanceof APIError) {
      console.error("🧠 APIError details:", {
        status: error.status,
        message: error.message,
        cause: error.cause,
      });

      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return { error: { reason: "User already exists." }, success: null };

        case "BAD_REQUEST":
          return { error: { reason: error.message || "Invalid email." }, success: null };

        default:
          return {
            error: { reason: error.message || "Something went wrong." },
            success: null,
          };
      }
    }

    // 👇 Non-API errors (DB, config, env, etc.)
    if (error instanceof Error) {
      console.error("💥 Unknown Error:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }

    return { error: { reason: "Something went wrong." }, success: null };
  }
}

