import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// CORS 설정 업데이트
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-Shopify-Access-Token', 'Authorization'],
  })
);

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const ADMIN_ACCESS_TOKEN = process.env.ADMIN_ACCESS_TOKEN;
const GRAPHQL_ENDPOINT = `https://${SHOPIFY_STORE}.myshopify.com/admin/api/2024-01/graphql.json`;

// ✅ 상품 목록 불러오기 API (GraphQL 버전)
app.get('/api/get-products', async (req, res) => {
  try {
    const graphqlQuery = {
      query: `
        {
          products(first: 50) {
            edges {
              node {
                id
                title
                images(first: 10) {
                  edges {
                    node {
                      id
                      url
                      altText
                    }
                  }
                }
                variants(first: 50) {
                  edges {
                    node {
                      id
                      title
                      sku
                      inventoryQuantity
                      inventoryItem {
                        id
                      }
                      image {
                        id
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
    };

    console.log('Fetching products from Shopify...');

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlQuery),
    });

    // 응답 상태 로깅
    console.log('Shopify API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error:', errorText);
      throw new Error(`Shopify API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error('GraphQL errors:', data.errors);
      throw new Error(data.errors[0].message);
    }

    const products = data.data.products.edges.map(({ node }) => ({
      id: node.id.split('/').pop(), // GraphQL ID에서 숫자 ID 추출
      title: node.title,
      images: node.images.edges.map(({ node: image }) => ({
        id: image.id.split('/').pop(),
        url: image.url,
        alt: image.altText,
      })),
      variants: node.variants.edges.map(({ node: variant }) => ({
        id: variant.id.split('/').pop(),
        title: variant.title,
        sku: variant.sku,
        available: variant.inventoryQuantity,
        inventoryLevelId: variant.inventoryItem.id.split('/').pop(),
        image: variant.image
          ? {
              id: variant.image.id.split('/').pop(),
              url: variant.image.url,
              alt: variant.image.altText,
            }
          : null,
      })),
    }));

    console.log(`Successfully fetched ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res
      .status(500)
      .json({ error: 'Failed to fetch products', details: error.message });
  }
});

// ✅ 재고 업데이트 API (GraphQL 버전)
app.post('/api/update-inventory', async (req, res) => {
  const { inventoryLevelId, quantity } = req.body;

  try {
    // GraphQL에서는 ID가 "gid://shopify/InventoryItem/12345678" 형식을 사용합니다
    const inventoryItemGid = `gid://shopify/InventoryItem/${inventoryLevelId}`;
    const locationGid = `gid://shopify/Location/${process.env.LOCATION_ID}`;

    console.log(
      `Updating inventory for item ${inventoryLevelId} to ${quantity}`
    );

    const graphqlMutation = {
      query: `
        mutation adjustInventory($input: InventoryAdjustQuantityInput!) {
          inventoryAdjustQuantity(input: $input) {
            inventoryLevel {
              available
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          inventoryItemId: inventoryItemGid,
          locationId: locationGid,
          availableDelta: parseInt(quantity, 10),
        },
      },
    };

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': ADMIN_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(graphqlMutation),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error:', errorText);
      throw new Error(`Shopify API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();

    if (
      data.errors ||
      (data.data && data.data.inventoryAdjustQuantity.userErrors.length > 0)
    ) {
      const errorMessage = data.errors
        ? data.errors[0].message
        : data.data.inventoryAdjustQuantity.userErrors[0].message;
      console.error('GraphQL error:', errorMessage);
      throw new Error(errorMessage);
    }

    console.log('Inventory updated successfully');
    res.json({
      success: true,
      available: data.data.inventoryAdjustQuantity.inventoryLevel.available,
    });
  } catch (error) {
    console.error('Inventory update error:', error);
    res
      .status(500)
      .json({ error: 'Failed to update inventory', details: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
