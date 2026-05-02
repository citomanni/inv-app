import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { kycSubmissionSchema } from "@/lib/schemas";
import { createKycSubmission, getLatestKycForUser } from "@/utils/kyc";

export async function GET() {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const latest = await getLatestKycForUser(session.user.id);
  return NextResponse.json({ submission: latest });
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = kycSubmissionSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid submission", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Block duplicate while a submission is already pending or approved.
  const latest = await getLatestKycForUser(session.user.id);
  if (latest && (latest.status === "pending" || latest.status === "approved")) {
    return NextResponse.json(
      { error: "A submission is already on file" },
      { status: 409 },
    );
  }

  const id = await createKycSubmission(session.user.id, parsed.data);
  return NextResponse.json({ id, status: "pending" }, { status: 201 });
}
