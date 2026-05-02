import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/session";
import { addFundImage } from "@/utils/funds";

const addImageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().max(160).optional().or(z.literal("")),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  const parsed = addImageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { id } = await params;
  const imageId = await addFundImage(
    id,
    parsed.data.url,
    parsed.data.alt || null,
  );
  return NextResponse.json({ id: imageId }, { status: 201 });
}
