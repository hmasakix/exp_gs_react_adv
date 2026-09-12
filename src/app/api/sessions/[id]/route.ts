// app/api/sessions/[id]/route.ts
import { db } from "@/db";
import { evaluations } from "@/db/schema";
import { eq } from "drizzle-orm";

// 1件取得
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const rows = await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.id, Number(id)));

  if (rows.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(rows[0]);
}

// 1件更新
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  await db
    .update(evaluations)
    .set({
      staffName: body.staffName,
      prompt: body.topic,
      answerText: body.answer,
      smileScore: body.smileScore,
      feedback: body.feedback,
    })
    .where(eq(evaluations.id, Number(id)));

  return Response.json({ ok: true });
}

// 1件削除
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await db.delete(evaluations).where(eq(evaluations.id, Number(id)));

  return Response.json({ ok: true });
}
