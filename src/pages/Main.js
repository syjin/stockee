import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons/faMagnifyingGlass';
import '../ProductList.css';
import Test from '../components/test';
import Table from '../components/Table';
import ShopifyTable from '../components/ShopifyTable';

import ShopifyInventoryTable from '../components/ShopifyInventoryTable';
import '../styles/Main.css';

function Main() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  // ✅ 상품 목록 불러오기
  useEffect(() => {
    fetch('http://localhost:5001/api/get-products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  // ✅ 재고 업데이트 함수
  const updateStock = async (inventoryLevelId, quantity) => {
    const response = await fetch('http://localhost:5001/api/update-inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inventoryLevelId, quantity }),
    });

    if (response.ok) {
      setProducts((prevProducts) =>
        prevProducts.map((product) => ({
          ...product,
          variants: product.variants.map((variant) =>
            variant.inventoryLevelId === inventoryLevelId
              ? { ...variant, available: variant.available + quantity }
              : variant
          ),
        }))
      );
    } else {
      console.error('Failed to update inventory');
    }
  };

  return (
    <div>
      <h2 className='inventory-title'>Inventory</h2>

      <div className='table-container'>
        <div className='table-controls'>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type='text'
            className='search-input'
            placeholder='Searching all inventory'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className='save-button'>Save</button>
        </div>
        {/* <Table products={products} updateStock={updateStock} /> */}
        <div className='table-wrapper'>
          {/* <ShopifyTable products={products} updateStock={updateStock} /> */}
        </div>
      </div>
    </div>
  );
}
export default Main;
