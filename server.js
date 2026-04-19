import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

// 상담 API 엔드포인트
app.post('/chat', async (req, res) => {
    try {
        // [수정] HTML에서 보낸 'history' 배열을 가져옵니다.
        const history = req.body.history; 
        const prompt = req.body.prompt; 

        // 서버 로그 확인용 (사용자가 이전에 무슨 말을 했는지 배열로 보입니다)
        console.log("대화 기록 수신:", history);

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", 
                messages: [
                    { role: "system", content: prompt },
                    ...history // [핵심] HTML에서 받은 대화 목록을 여기에 그대로 펼쳐넣습니다.
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

// 포트 설정
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`));
