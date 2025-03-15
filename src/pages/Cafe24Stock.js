import { useState, useEffect } from 'react';

const Cafe24Stock = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const mallId = process.env.REACT_APP_CAFE24_MALL_ID;
      const url = `https://${mallId}.cafe24api.com/api/v2/admin/products?limit=10`;

      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_CAFE24_ACCESS_TOKEN}`,
            'X-Cafe24-Client-Id': process.env.REACT_APP_CAFE24_CLIENT_ID,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch products');

        const data = await response.json();
        console.log('Products:', data.products);
        setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return <div>Check the console for product data.</div>;
};

export default Cafe24Stock;
