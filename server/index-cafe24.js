import express from 'express';
import 'dotenv/config';
import { fetchProducts } from './api-cafe24.js';

const app = express();
const PORT = process.env.PORT || 4000;

// 카페24 인증 URL로 리디렉션
app.get('/auth/cafe24', (req, res) => {
  const redirectUri = `https://${process.env.MALL_ID}.cafe24.com/api/v2/oauth/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&state=state&redirect_uri=${process.env.REDIRECT_URI}&scope=mall.read_product`;
  res.redirect(redirectUri);
});

// 카페24 인증 후 리디렉션 받은 콜백
app.get('/auth/cafe24/callback', async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send('❌ 인증 코드가 필요합니다.');
  }

  console.log('📌 인증 코드:', code);
  console.log('📌 요청할 MALL_ID:', process.env.MALL_ID);

  try {
    await fetchProducts(code);
    res.send('상품 목록 조회 완료');
  } catch (error) {
    res.status(500).send('❌ 상품 목록 조회 실패');
  }
});

app.listen(PORT, () => {
  console.log('📌 REDIRECT_URI:', process.env.REDIRECT_URI);

  console.log(`Server running on http://localhost:${PORT}`);
});
