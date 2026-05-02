import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listKycSubmissions } from "@/utils/kyc";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sp = request.nextUrl.searchParams;
  const page = Math.max(1, parseInt(sp.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(sp.get("limit") || "10")));
  const status = sp.get("status") || undefined;
  const search = sp.get("search") || undefined;

  const result = await listKycSubmissions({ page, limit, status, search });
  return NextResponse.json(result);
}
