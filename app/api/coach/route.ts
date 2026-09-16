// src/app/api/coach/route.ts
export async function POST(request: Request) {
  const { topic, answer, smileScore } = await request.json(); // ← smileScore 追加

  const prompt = `あなたはプレゼン/面接の練習コーチです。
次の「お題」への「回答」と、話している時の「笑顔率」を踏まえ、
良かった点と改善点を、やさしく具体的に、200文字くらいで日本語でフィードバックしてください。
（笑顔率が低いときは、表情の柔らかさについても一言ふれてください）
お題: ${topic}
回答: ${answer}
笑顔率: ${smileScore}%`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const data = await res.json();
  const feedback = data.choices[0].message.content;
  return Response.json({ feedback });
}