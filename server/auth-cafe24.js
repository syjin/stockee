import 'dotenv/config';

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const MALL_ID = process.env.MALL_ID;

export const getAccessToken = async (authCode) => {
  const tokenUrl = `https://${MALL_ID}.cafe24api.com/api/v2/oauth/token`;

  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization:
      'Basic ' +
      Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
  };

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: authCode,
    redirect_uri: REDIRECT_URI,
  });

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers,
      body,
    });

    const data = await response.json();

    console.log('📌 토큰 API 응답:', data); // 응답 확인용 로그

    if (data.access_token) {
      console.log('📌 Access Token:', data.access_token);
      return data.access_token;
    } else {
      throw new Error(
        `Failed to get access token: ${
          data.error_description || 'Unknown error'
        }`
      );
    }
  } catch (error) {
    console.error('❌ 토큰 발급 실패:', error);
  }
};
