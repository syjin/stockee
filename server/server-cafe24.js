import express from 'express';
import { query, param, body, validationResult } from 'express-validator';
import axios from 'axios';
import logger from './logger.js';

const router = express.Router();

// 유효성 검사 결과 처리 미들웨어
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 카페24 API 클라이언트 생성 함수
const createCafe24Client = (mallId, accessToken) => {
  return axios.create({
    baseURL: `https://${mallId}.cafe24api.com`,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      'X-Cafe24-Api-Version': process.env.CAFE24_API_VERSION || '2025-03-01',
    },
  });
};

// 토큰 저장소 (실제 환경에서는 데이터베이스 사용 권장)
const tokenStore = {};

// 토큰 확인 미들웨어
const checkToken = async (req, res, next) => {
  const { mallId } = req.query;

  if (!mallId) {
    return res.status(400).json({ error: '몰 아이디가 필요합니다.' });
  }

  const token = tokenStore[mallId];

  if (!token) {
    return res
      .status(401)
      .json({ error: '인증되지 않은 몰입니다. 인증을 먼저 진행해주세요.' });
  }

  // 토큰 만료 체크
  const now = Math.floor(Date.now() / 1000);
  if (token.expiresAt < now) {
    // 토큰 갱신 시도
    try {
      const refreshResponse = await axios.post(
        `https://${mallId}.cafe24api.com/api/oauth/token`,
        null,
        {
          params: {
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken,
            client_id: process.env.CAFE24_CLIENT_ID,
            client_secret: process.env.CAFE24_CLIENT_SECRET,
          },
        }
      );

      const { access_token, refresh_token, expires_at } = refreshResponse.data;

      // 토큰 저장
      tokenStore[mallId] = {
        accessToken: access_token,
        refreshToken: refresh_token || token.refreshToken,
        expiresAt: expires_at,
      };

      req.accessToken = access_token;
    } catch (error) {
      logger.error('토큰 갱신 실패:', error.response?.data || error.message);
      return res
        .status(401)
        .json({ error: '인증 토큰이 만료되었습니다. 다시 인증해주세요.' });
    }
  } else {
    req.accessToken = token.accessToken;
  }

  next();
};

// 상품 목록 조회 (몰 아이디를 변수로 사용)
router.get(
  '/products',
  [query('mallId').notEmpty().withMessage('몰 아이디는 필수입니다')],
  validate,
  checkToken,
  async (req, res) => {
    const { mallId } = req.query;
    const params = { ...req.query };
    delete params.mallId;

    try {
      const apiClient = createCafe24Client(mallId, req.accessToken);
      const response = await apiClient.get('/api/v2/products', { params });
      res.json(response.data);
    } catch (error) {
      logger.error('상품 조회 오류:', error.response?.data || error.message);

      res.status(error.response?.status || 500).json({
        error: error.response?.data?.error || '상품 조회 실패',
      });
    }
  }
);

// 상품 상세 조회
router.get(
  '/products/:productId',
  [
    param('productId').isNumeric().withMessage('유효한 상품 ID가 필요합니다'),
    query('mallId').notEmpty().withMessage('몰 아이디는 필수입니다'),
  ],
  validate,
  checkToken,
  async (req, res) => {
    const { productId } = req.params;
    const { mallId } = req.query;

    try {
      const apiClient = createCafe24Client(mallId, req.accessToken);
      const response = await apiClient.get(`/api/v2/products/${productId}`);
      res.json(response.data);
    } catch (error) {
      logger.error(
        '상품 상세 조회 오류:',
        error.response?.data || error.message
      );

      res.status(error.response?.status || 500).json({
        error: error.response?.data?.error || '상품 상세 조회 실패',
      });
    }
  }
);

// 상품 재고 옵션 조회
router.get(
  '/products/:productId/variants',
  [
    param('productId').isNumeric().withMessage('유효한 상품 ID가 필요합니다'),
    query('mallId').notEmpty().withMessage('몰 아이디는 필수입니다'),
  ],
  validate,
  checkToken,
  async (req, res) => {
    const { productId } = req.params;
    const { mallId } = req.query;

    try {
      const apiClient = createCafe24Client(mallId, req.accessToken);
      const response = await apiClient.get(
        `/api/v2/products/${productId}/variants`
      );
      res.json(response.data);
    } catch (error) {
      logger.error(
        '상품 옵션 조회 오류:',
        error.response?.data || error.message
      );

      res.status(error.response?.status || 500).json({
        error: error.response?.data?.error || '상품 옵션 조회 실패',
      });
    }
  }
);

// 상품 재고 옵션 수정
router.put(
  '/products/:productId/variants/:variantId',
  [
    param('productId').isNumeric().withMessage('유효한 상품 ID가 필요합니다'),
    param('variantId').isNumeric().withMessage('유효한 옵션 ID가 필요합니다'),
    query('mallId').notEmpty().withMessage('몰 아이디는 필수입니다'),
    body('variant').notEmpty().withMessage('옵션 데이터는 필수입니다'),
    body('variant.quantity')
      .isNumeric()
      .withMessage('재고 수량은 숫자여야 합니다'),
  ],
  validate,
  checkToken,
  async (req, res) => {
    const { productId, variantId } = req.params;
    const { mallId } = req.query;
    const updateData = req.body;

    try {
      const apiClient = createCafe24Client(mallId, req.accessToken);
      const response = await apiClient.put(
        `/api/v2/products/${productId}/variants/${variantId}`,
        updateData
      );
      res.json(response.data);
    } catch (error) {
      logger.error(
        '상품 옵션 수정 오류:',
        error.response?.data || error.message
      );

      res.status(error.response?.status || 500).json({
        error: error.response?.data?.error || '상품 옵션 수정 실패',
      });
    }
  }
);

export default router;
