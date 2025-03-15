// import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

import Main from './pages/Main';
import Cafe24Stock from './pages/Cafe24Stock';
import ShopifyStock from './pages/ShopifyStock';

// import { library } from '@fortawesome/fontawesome-svg-core';
// import { faS } from '@fortawesome/free-solid-svg-icons';
// import { faUser } from '@fortawesome/free-regular-svg-icons';

// library.add(faS, faUser);

function App() {
  // const [products, setProducts] = useState([]);

  // // ✅ 상품 목록 불러오기
  // useEffect(() => {
  //   fetch('http://localhost:5001/api/get-products')
  //     .then((res) => res.json())
  //     .then((data) => setProducts(data))
  //     .catch((error) => console.error('Error fetching products:', error));
  // }, []);

  // // ✅ 재고 업데이트 함수
  // const updateStock = async (inventoryLevelId, quantity) => {
  //   const response = await fetch('http://localhost:5001/api/update-inventory', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ inventoryLevelId, quantity }),
  //   });

  //   if (response.ok) {
  //     setProducts((prevProducts) =>
  //       prevProducts.map((product) => ({
  //         ...product,
  //         variants: product.variants.map((variant) =>
  //           variant.inventoryLevelId === inventoryLevelId
  //             ? { ...variant, available: variant.available + quantity }
  //             : variant
  //         ),
  //       }))
  //     );
  //   } else {
  //     console.error('Failed to update inventory');
  //   }
  // };

  // return (
  //   <div style={{ padding: '20px' }}>
  //     <h1>Shopify Inventory Manager</h1>
  //     {products.length === 0 ? (
  //       <p>Loading products...</p>
  //     ) : (
  //       products.map((product) => (
  //         <div
  //           key={product.id}
  //           style={{
  //             border: '1px solid #ddd',
  //             padding: '10px',
  //             margin: '10px 0',
  //           }}
  //         >
  //           <h2>{product.title}</h2>
  //           {product.variants.map((variant) => (
  //             <div key={variant.id} style={{ paddingLeft: '20px' }}>
  //               <p>
  //                 <strong>{variant.title}</strong> (SKU: {variant.sku})
  //               </p>
  //               <p>Stock: {variant.available}</p>
  //               <button
  //                 onClick={() => updateStock(variant.inventoryLevelId, 5)}
  //               >
  //                 +5
  //               </button>
  //               <button
  //                 onClick={() => updateStock(variant.inventoryLevelId, -5)}
  //                 style={{ marginLeft: '5px' }}
  //               >
  //                 -5
  //               </button>
  //             </div>
  //           ))}
  //         </div>
  //       ))
  //     )}
  //   </div>
  // );

  // return <Test products={products} updateStock={updateStock} />;

  return (
    <Router>
      <Routes>
        {/* Layout을 부모로 설정하고 그 안에 자식 Route를 배치 */}
        <Route path='/' element={<Layout />}>
          <Route index element={<Main />} /> {/* / 경로에서 Main 렌더링 */}
          <Route path='cafe24-inventory' element={<Cafe24Stock />} />
          <Route path='shopify-inventory' element={<ShopifyStock />} />
          {/* /shopify-inventory 경로에서 ShopifyStock 렌더링 */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
