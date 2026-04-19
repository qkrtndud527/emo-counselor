import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 고민 상담 API 엔드포인트
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  // ✅ 프론트엔드(HTML)에서 보낸 수영님의 긴 프롬프트를 수신합니다.
  const systemPrompt = req.body.system_prompt; 

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // 성능이 좋은 최신 모델입니다.
        messages: [
          {
            role: "system",
            // ✅ HTML에서 전달받은 프롬프트를 AI에게 주입합니다.
            // 만약 값이 없으면 기본 문구가 작동하도록 방어 코드를 넣었습니다.
            content: systemPrompt || "너는 공감 중심의 심리 상담사다" 
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error("에러 발생:", error);
    res.status(500).json({ error: "서버 오류가 발생했습니다." });
  }
});

// Render.com 환경에서는 process.env.PORT를 사용하기도 하지만, 
// 기존 설정대로 3000번 포트를 유지합니다.
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`));