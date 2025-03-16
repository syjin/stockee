import 'dotenv/config';

const CAFE24_AUTH_CODE_URL = process.env.CAFE24_AUTH_CODE_URL;

const Cafe24Stock = () => {
  const handleAuthClick = () => {
    // 카페24 인증 코드 요청 URL로 리디렉션
    window.location.href = `${CAFE24_AUTH_CODE_URL}/auth/cafe24`; // 서버에서 인증 URL로 리디렉션
  };

  return (
    <div>
      <h1>카페24 상품 조회</h1>
      <button onClick={handleAuthClick}>카페24 로그인</button>
    </div>
  );
};

export default Cafe24Stock;
