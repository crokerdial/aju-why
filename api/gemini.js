export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let parsedBody = req.body;
  if (typeof req.body === 'string') {
    parsedBody = JSON.parse(req.body);
  }

  const { contents, system_instruction } = parsedBody;
  const API_KEY = process.env.GEMINI_API_KEY;
  // 가장 최신 버전이자 안정적인 2.5 flash 모델
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system_instruction, contents })
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("서버 에러:", error);
    return res.status(500).json({ error: { message: "서버 처리 중 오류가 발생했습니다." } });
  }
}
