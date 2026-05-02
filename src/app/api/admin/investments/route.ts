import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { listInvestments } from "@/utils/investments";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sp = request.nextUrl.searchParams;
  const result = await listInvestments({
    page: parseInt(sp.get("page") || "1"),
    limit: parseInt(sp.get("limit") || "10"),
    status: sp.get("status") || undefined,
    search: sp.get("search") || undefined,
    fundId: sp.get("fundId") || undefined,
    userId: sp.get("userId") || undefined,
  });
  return NextResponse.json(result);
}
