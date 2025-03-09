import { useState, useEffect } from 'react';
import ShopifyInventoryTable from '../components/ShopifyInventoryTable';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const ShopifyStock = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState({
    isUpdating: false,
    success: null,
    message: '',
  });

  // 상품 목록 불러오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/get-products`);

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 재고 업데이트 함수
  const updateInventory = async (inventoryLevelId, quantity) => {
    try {
      setUpdateStatus({
        isUpdating: true,
        success: null,
        message: 'Updating inventory...',
      });

      const response = await fetch(`${API_BASE_URL}/api/get-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inventoryLevelId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update inventory');
      }

      const result = await response.json();

      // 업데이트 성공 시 상품 목록 다시 불러오기
      const updatedResponse = await fetch(`${API_BASE_URL}/api/get-products`);
      const updatedData = await updatedResponse.json();
      setProducts(updatedData);

      setUpdateStatus({
        isUpdating: false,
        success: true,
        message: `Inventory updated successfully! New quantity: ${
          result.available || quantity
        }`,
      });

      // 성공 메시지 3초 후 사라짐
      setTimeout(
        () =>
          setUpdateStatus((prev) => ({ ...prev, success: null, message: '' })),
        3000
      );
    } catch (err) {
      console.error('Error updating inventory:', err);
      setUpdateStatus({
        isUpdating: false,
        success: false,
        message: 'Failed to update inventory. Please try again.',
      });

      // 에러 메시지 5초 후 사라짐
      setTimeout(
        () =>
          setUpdateStatus((prev) => ({ ...prev, success: null, message: '' })),
        5000
      );
    }
  };

  return (
    <div className='app-container'>
      <h2>Shopify Inventory</h2>

      <main className='app-content'>
        {loading ? (
          <div className='loading-container'>
            <div className='loading-spinner'></div>
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className='error-message'>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        ) : (
          <>
            {updateStatus.message && (
              <div
                className={`status-message ${
                  updateStatus.success === true
                    ? 'success'
                    : updateStatus.success === false
                    ? 'error'
                    : 'info'
                }`}
              >
                {updateStatus.message}
              </div>
            )}

            <ShopifyInventoryTable
              products={products}
              onInventoryUpdate={updateInventory}
            />

            <div className='product-count'>
              <p>Total Products: {products.length}</p>
              <p>
                Total Variants:{' '}
                {products.reduce(
                  (count, product) => count + product.variants.length,
                  0
                )}
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ShopifyStock;
