import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

// CORS 설정 및 JSON 파싱
app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { history, prompt } = req.body;

        // OpenAI로 보낼 메시지 구성
        const messages = [
            { role: "system", content: prompt },
            ...history
        ];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: messages
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || "OpenAI API 호출 실패");
        }

        res.json(data);

    } catch (error) {
        console.error("서버 에러:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 작동 중입니다.`);
});
