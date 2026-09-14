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
      <main className="p-8">
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
    <main style={{ padding: 24, maxWidth: 640 }}>
      <Link href="/" style={{ display: "inline-block", marginBottom: 16 }}>
      ← AI練習コーチに戻る
      </Link>
      <h1>練習の記録（{rows.length}件）</h1>
      {rows.length === 0 ? (
        <p>まだありません。練習して「保存」しましょう。</p>
      ) : (
        <ul>
          {rows.map((row) => (
            <li key={row.id}>
              <Link href={`/history/${row.id}`}>
                {row.prompt} ／ 笑顔 {row.smileScore ?? 0}%
              </Link>
              <DeleteButton id={row.id} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
