import '../styles/Table.css';

function Table({ products }) {
  return (
    <table className='table'>
      <thead>
        <tr className='table-header'>
          <th className='table__sticky-col'>
            <div className='table__col-shop'>Shop</div>
            <div className='table__col-title'>Title</div>
          </th>
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
                {index === 0 && (
                  <td rowSpan={product.variants.length}>
                    <img
                      src='/shopify-logo.svg'
                      alt='Shopify'
                      className='table__shop-logo'
                    />
                  </td>
                )}
                {index === 0 && (
                  <td
                    rowSpan={product.variants.length}
                    className='table__product-title'
                  >
                    {product.title}
                  </td>
                )}
                <td className='table__var-title'>{variant.title}</td>
                <td className='table__var-sku'>{variant.sku}</td>
                <td className='table__var-available'>
                  <input type='number' value={variant.available} />
                </td>
              </tr>
            ))
          )
        )}
      </tbody>
    </table>
  );
}

export default Table;
