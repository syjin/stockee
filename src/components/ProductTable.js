// import ProductRow from './ProductRow.js';

function ProductTable({ products }) {
  return (
    <table className='ListTable'>
      <thead>
        <tr>
          <th>Shop</th>
          <th>Title</th>
          <th>Variant</th>
          <th>SKU</th>
          <th>Available</th>
        </tr>
      </thead>
      <tbody>
        {products.length === 0 ? (
          <tr>
            <td colSpan='5'>Loading products...</td>
          </tr>
        ) : (
          products.map((product) =>
            product.variants.map((variant, index) => (
              <tr key={variant.id} className='ListTable__Row'>
                {/* 첫 번째 variant일 때만 rowSpan 적용 */}
                {index === 0 && (
                  <td
                    rowSpan={product.variants.length}
                    className='shop-cell'
                  ></td>
                )}
                {index === 0 && (
                  <td rowSpan={product.variants.length} className='title-cell'>
                    {product.title}
                  </td>
                )}
                <td>{variant.title}</td>
                <td>{variant.sku}</td>
                <td>{variant.available}</td>
              </tr>
            ))
          )
        )}
      </tbody>
    </table>
  );
}

export default ProductTable;
