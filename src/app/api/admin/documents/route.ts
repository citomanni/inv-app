import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { documentCreateSchema } from "@/lib/schemas";
import { createDocument, listDocuments } from "@/utils/documents";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const sp = request.nextUrl.searchParams;
  const result = await listDocuments({
    page: parseInt(sp.get("page") || "1"),
    limit: parseInt(sp.get("limit") || "20"),
    type: sp.get("type") || undefined,
    search: sp.get("search") || undefined,
    userId: sp.get("userId") || undefined,
  });
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await request.json().catch(() => null);
  const parsed = documentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const id = await createDocument({
    userId: parsed.data.userId,
    investmentId: parsed.data.investmentId || null,
    type: parsed.data.type,
    title: parsed.data.title,
    url: parsed.data.url,
    uploadedBy: session.user.id,
  });
  return NextResponse.json({ id }, { status: 201 });
}
