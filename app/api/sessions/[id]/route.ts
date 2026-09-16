// app/api/sessions/[id]/route.ts
import { db } from "@/db";
import { evaluations } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

// 1件取得（自分のだけ）
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "ログインしてください" }, { status: 401 });
  }

  const { id } = await params;
  const rows = await db
    .select()
    .from(evaluations)
    .where(and(eq(evaluations.id, Number(id)), eq(evaluations.adminId, userId)));

  if (rows.length === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(rows[0]);
}

// 1件更新（自分のだけ）
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "ログインしてください" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  await db
    .update(evaluations)
    .set({
      prompt: body.topic,
      answerText: body.answer,
      smileScore: body.smileScore,
      feedback: body.feedback,
    })
    .where(and(eq(evaluations.id, Number(id)), eq(evaluations.adminId, userId)));

  return Response.json({ ok: true });
}

// 1件削除（自分のだけ）
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "ログインしてください" }, { status: 401 });
  }

  const { id } = await params;

  await db
    .delete(evaluations)
    .where(and(eq(evaluations.id, Number(id)), eq(evaluations.adminId, userId)));

  return Response.json({ ok: true });
}
