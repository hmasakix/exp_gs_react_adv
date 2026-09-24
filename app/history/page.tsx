// app/history/page.tsx
import { db } from "@/db";
import { evaluations } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const { userId } = await auth();
  if (!userId) {
    return (
      <main className="p-8 text-center">
        <p>履歴を見るにはログインしてください。</p>
      </main>
    );
  }

  const rows = await db
    .select()
    .from(evaluations)
    .where(eq(evaluations.adminId, userId))
    .orderBy(desc(evaluations.createdAt));

  return (
    <main style={{ padding: 24, maxWidth: 640, margin: "0 auto", width: "100%" }}>
      <h1>練習の記録（{rows.length}件）</h1>
      {rows.length === 0 ? (
        <p>まだありません。練習して「保存」しましょう。</p>
      ) : (
        <div className="mt-4 space-y-3">
          {rows.map((row) => (
            <div key={row.id} className="border border-gray-300 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <Link
                  href={`/history/${row.id}`}
                  className="font-medium text-blue-600"
                >
                  {row.prompt}
                </Link>
                <DeleteButton id={row.id} />
              </div>
              <p className="text-sm text-gray-600 mt-1">
                笑顔率：{row.smileScore ?? 0}%
              </p>
              <p className="text-sm text-gray-600">
                作成日時：{row.createdAt.toLocaleString("ja-JP")}
              </p>
              <p className="text-xs text-gray-400 mt-1">id：{row.id}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
