// app/history/[id]/page.tsx
import { db } from "@/db";
import { evaluations } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function HistoryDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await db.select().from(evaluations).where(eq(evaluations.id, Number(id)));
  const row = rows[0];

  if (!row) return <main style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>見つかりませんでした。</main>;

  return (
    <main style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <h1>{row.prompt}</h1>
      <p>😊 笑顔スコア {row.smileScore ?? 0}%</p>
      <p style={{ whiteSpace: "pre-wrap" }}>🗣 {row.answerText}</p>
      <p style={{ whiteSpace: "pre-wrap" }}>🤖 {row.feedback}</p>
      <p style={{ whiteSpace: "pre-wrap" }}>📝 メモ：{row.memo}</p>
    </main>
  );
}
