import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { fundCreateSchema } from "@/lib/schemas";
import { createFund, listFunds } from "@/utils/funds";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const sp = request.nextUrl.searchParams;
  const result = await listFunds({
    page: parseInt(sp.get("page") || "1"),
    limit: parseInt(sp.get("limit") || "20"),
    status: sp.get("status") || undefined,
    propertyType: sp.get("propertyType") || undefined,
    search: sp.get("search") || undefined,
    includeArchived: sp.get("includeArchived") === "true",
  });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = fundCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const id = await createFund({
    ...parsed.data,
    slug: parsed.data.slug || parsed.data.name,
    tagline: parsed.data.tagline || null,
    targetIrrPercent:
      typeof parsed.data.targetIrrPercent === "number"
        ? parsed.data.targetIrrPercent
        : null,
    equityMultiple:
      typeof parsed.data.equityMultiple === "number"
        ? parsed.data.equityMultiple
        : null,
    units: typeof parsed.data.units === "number" ? parsed.data.units : null,
    createdBy: session.user.id,
  });
  return NextResponse.json({ id }, { status: 201 });
}
