// ══════════════════════════════════════════════════════
// api/chat.js  —  Vercel Serverless Function
// 배치 위치: 프로젝트 루트의 /api/chat.js
// ══════════════════════════════════════════════════════

export default async function handler(req, res) {
  // CORS 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // 환경변수 누락 시 Vercel 로그에 찍히도록 설정
    console.error("🚨 에러: Vercel 환경변수에 ANTHROPIC_API_KEY가 설정되지 않았습니다.");
    return res.status(500).json({ error: "ANTHROPIC_API_KEY 환경변수가 설정되지 않았어요." });
  }

  try {
    // req.body가 undefined인 경우를 대비해 기본값 {}를 줍니다.
    const body = req.body || {};
    const { model, max_tokens, messages, system } = body;

    if (!messages) {
      console.error("🚨 에러: 요청 바디에 messages 데이터가 없습니다.", body);
      return res.status(400).json({ error: "messages 데이터가 필요합니다." });
    }

    console.log("🔄 Anthropic API 요청 전송 중...", { model, messagesCount: messages.length });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: model || "claude-haiku-4-5-20251001",
        max_tokens: max_tokens || 1000,
        ...(system ? { system } : {}),
        messages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`🚨 Anthropic API 에러 발생 (${response.status}):`, errText);
      return res.status(response.status).json({ error: errText });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    // 이 코드가 있어야 Vercel 대시보드 로그에 진짜 범인이 누구인지 찍힙니다!
    console.error("🔥 서버 내부 스크립트 에러 발생:", err);
    return res.status(500).json({ error: err.message });
  }
}
