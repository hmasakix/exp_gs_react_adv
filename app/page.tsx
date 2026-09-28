"use client";
// src/app/page.tsx

import { useState, useRef } from "react";
import FaceMeter from "./FaceMeter";
import Recorder from "./Recorder";

export default function Home() {
  const [answer, setAnswer] = useState("");
  const [memo, setMemo] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [smileScore, setSmileScore] = useState(0);
  const [speaking, setSpeaking] = useState(false);
  // 今日の伝達事項3つ（仮：あとで管理者画面から入力する予定）
  const items = [
    "イベント開始は10時、終了は18時",
    "お客様には笑顔で対応",
    "雨予報の為、傘袋の配布あり。控室に設置。各自で使用する",
  ];
  const topic = "今日の伝達事項：" + items.join(" / ");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setFeedback("");

    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, answer, smileScore }),
    });
    const data = await res.json();
    setFeedback(
      data.feedback ?? "エラーが起きました。もう一度お試しください。",
    );
    setLoading(false);
  }
  async function save() {
    await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, answer, smileScore, feedback, memo }),
    });
    alert("保存しました");
  }

  async function deliver() {
    const res = await fetch("/api/deliver", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    });
    if (res.ok) alert("メールを送りました");
    else
      alert(
        "メール送信に失敗しました（無料枠では自分の登録メール宛のみ送れます）",
      );
  }

  async function speak() {
    audioRef.current?.pause();
    setSpeaking(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: feedback }),
      });
      const data = await res.json();
      const audio = new Audio("data:audio/mp3;base64," + data.audio);
      audioRef.current = audio;
      audio.play();
    } finally {
      setSpeaking(false);
    }
  }

  function stopSpeak() {
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-2">
        おはようございます！
        <br className="sm:hidden" />
        朝礼をはじめましょう
      </h2>
      <FaceMeter onScore={setSmileScore} />
      <p className="text-sm text-gray-600 mt-2">いまの笑顔率：{smileScore}%</p>

      <div className="mt-3">
        <label className="font-bold">お名前</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="例：山田"
          className="w-full mt-1 p-3 border border-gray-300 rounded-lg"
        />
      </div>

      <div className="mt-3 p-4 border border-gray-300 rounded-lg">
        <p className="font-bold mb-2">今日の伝達事項（3つ）</p>
        <ol className="list-decimal pl-5 space-y-1">
          {items.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </div>
      <p className="font-bold mt-3">
        笑顔で、3つを声に出して復唱してください
      </p>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        rows={5}
        className="w-full mt-3 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="録音すると、ここに復唱した内容が入ります"
      />

      <div className="mt-3">
        <Recorder onText={(t) => setAnswer(t)} />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
      >
        {loading ? "確認中…" : "復唱をチェックしてもらう"}
      </button>

      {feedback && (
        <div className="mt-6 bg-gray-50 text-gray-900 border border-gray-200 rounded-lg p-4">
          <p className="whitespace-pre-wrap">{feedback}</p>

          <div className="mt-4 flex gap-2">
            <button
              onClick={speak}
              disabled={speaking}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {speaking ? "準備中…" : "🔊 読み上げ"}
            </button>
            <button
              onClick={stopSpeak}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ⏹ 停止
            </button>
            <button
              onClick={save}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              💾 朝礼完了（保存）
            </button>
            <button
              onClick={deliver}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ✉ メールで受け取る
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
