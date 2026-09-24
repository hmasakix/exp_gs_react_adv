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
  const rows = await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.id, Number(id)));
  const row = rows[0];

  if (!row)
    return (
      <main style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
        見つかりませんでした。
      </main>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{row.prompt}</h1>

      <p className="text-sm text-gray-600 mb-4">
        😊 笑顔スコア {row.smileScore ?? 0}%
      </p>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <p className="text-xs text-gray-500 mb-1">🗣 回答</p>
        <p className="whitespace-pre-wrap">{row.answerText}</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-xs text-gray-500 mb-1">🤖 フィードバック</p>
        <p className="whitespace-pre-wrap">{row.feedback}</p>
      </div>

      <p className="text-sm text-gray-500 border-t border-gray-200 pt-4">
        📝 メモ：{row.memo}
      </p>
    </div>
  );
}
