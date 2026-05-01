export default async function handler(req, res) {
  // 1. POST 요청이 아니면 차단
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 💡 2. (추가된 부분) 버셀이 데이터를 단순 글자(String)로 오해했다면, 다시 예쁘게 포장(JSON)해줍니다!
  let parsedBody = req.body;
  if (typeof req.body === 'string') {
    parsedBody = JSON.parse(req.body);
  }

  // 3. 포장지 안에서 질문(contents)과 설정(system_instruction) 꺼내기
  const { contents, system_instruction } = parsedBody;

  // 4. Vercel 환경 변수에 등록한 API 키 꺼내기
  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

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
