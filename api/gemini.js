export default async function handler(req, res) {
  // 1. POST 요청이 아니면 차단
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Vercel은 JSON.parse가 필요 없이 req.body로 바로 내용을 꺼냅니다.
  const { contents, system_instruction } = req.body;

  // 3. Vercel 환경 변수에 등록한 API 키 꺼내기
  const API_KEY = process.env.GEMINI_API_KEY;

  // 4. 안정적인 gemini-1.5-flash 모델 사용
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system_instruction, contents })
    });

    const data = await response.json();

    // 5. Vercel 방식으로 프론트엔드에 정답 전달하기
    return res.status(200).json(data);

  } catch (error) {
    console.error("서버 에러:", error);
    return res.status(500).json({ error: { message: "서버 처리 중 오류가 발생했습니다." } });
  }
}
