import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // React와 통신 허용

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const ADMIN_ACCESS_TOKEN = process.env.ADMIN_ACCESS_TOKEN;

// ✅ 상품 목록 불러오기 API
app.get('/api/get-products', async (req, res) => {
  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/products.json`,
      {
        headers: { 'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN },
      }
    );

    const data = await response.json();
    const products = data.products.map((product) => ({
      id: product.id,
      title: product.title,
      variants: product.variants.map((variant) => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        available: variant.inventory_quantity,
        inventoryLevelId: variant.inventory_item_id, // 재고 수정할 때 필요
      })),
    }));

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ 재고 업데이트 API
app.post('/api/update-inventory', async (req, res) => {
  const { inventoryLevelId, quantity } = req.body;

  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/inventory_levels/adjust.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location_id: process.env.LOCATION_ID, // Shopify Admin에서 확인 가능
          inventory_item_id: inventoryLevelId,
          available_adjustment: quantity,
        }),
      }
    );

    if (!response.ok) throw new Error('Failed to update inventory');

    res.json({ success: true });
  } catch (error) {
    console.error('Inventory update error:', error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
