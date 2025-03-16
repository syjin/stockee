import { getAccessToken } from './auth-cafe24.js';

// 카페24 상품 목록 조회
export const fetchProducts = async (authCode) => {
  const accessToken = await getAccessToken(authCode);
  if (!accessToken) return;

  const url = `https://${process.env.MALL_ID}.cafe24api.com/api/v2/admin/products?limit=10`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'X-Cafe24-Client-Id': process.env.CLIENT_ID,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    // 📌 상품 목록을 콘솔에 출력
    console.log('📌 상품 목록:', data.products); // ✅ 추가된 코드
  } catch (error) {
    console.error('❌ 상품 조회 실패:', error);
  }
};
