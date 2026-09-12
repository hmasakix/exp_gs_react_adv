// app/history/page.tsx
import { db } from "@/db";
import { evaluations } from "@/db/schema";
import { desc } from "drizzle-orm";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

// このページは毎回サーバーで作り直す（DBの最新を必ず出すため）
export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const rows = await db.select().from(evaluations).orderBy(desc(evaluations.createdAt));

  return (
    <main style={{ padding: 24, maxWidth: 640 }}>
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
