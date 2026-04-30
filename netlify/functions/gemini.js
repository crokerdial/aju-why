exports.handler = async (event, context) => {
  // POST 요청이 아니면 차단
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { contents, system_instruction } = JSON.parse(event.body);
  
  // 💡 Netlify 금고에 숨겨둔 API 키를 여기서 몰래 꺼내옵니다!
  const API_KEY = process.env.GEMINI_API_KEY; 

  // 가장 안정적인 gemini-1.5-flash 모델로 고정
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system_instruction, contents })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
