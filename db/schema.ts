// src/db/schema.ts
import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const evaluations = pgTable("evaluations", {
  id: serial("id").primaryKey(),                     // 通し番号（主キー・自動）
  adminId: text("admin_id").notNull(),               // 評価した管理者のID（Day4までは"demo"固定）
  prompt: text("prompt").notNull(),                  // 投げた質問・シチュエーション
  answerText: text("answer_text"),                   // スタッフの回答・受け答え内容
  smileScore: integer("smile_score"),                // 表情（笑顔）スコア
  feedback: text("feedback"),                        // AIによる評価コメント
  createdAt: timestamp("created_at").defaultNow().notNull(), // 評価日時
  memo: text("memo"),                                // 宿題2メモ
});
