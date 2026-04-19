const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

// 상담 API 엔드포인트
app.post('/chat', async (req, res) => {
    try {
        const message = req.body.message;
        const prompt = req.body.prompt; // HTML에서 보낸 긴 규칙을 받습니다.

        // 서버 로그에 찍히게 설정 (이제 Render 로그에서 확인 가능!)
        console.log("사용자 메시지:", message);
        console.log("전달된 프롬프트:", prompt);

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", 
                messages: [
                    { role: "system", content: prompt }, // 수영님의 규칙 적용
                    { role: "user", content: message }
                ]
            })
        });

        const data = await response.json();
        res.json(data);

    } catch (error) {
        console.error("에러 발생:", error);
        res.status(500).json({ error: "서버 에러입니다." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`));
