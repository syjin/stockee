import '../styles/Table.css';

const ShopifyTable = ({ products = [] }) => {
  // 제품과 변형 데이터를 평면화하여 각 행의 데이터를 준비합니다
  const flattenedRows = products.reduce((rows, product) => {
    return [
      ...rows,
      ...product.variants.map((variant, variantIndex) => ({
        product,
        variant,
        isFirstVariant: variantIndex === 0,
        variantCount: product.variants.length,
      })),
    ];
  }, []);

  return (
    <table className='table'>
      <thead>
        <tr className='table-header'>
          {/* <th className='table__sticky-col'>
            <div className='table__col-shop'>Shop</div>
            <div className='table__col-title'>Title</div>
            </th> */}
          <th className='thead__shop'>Shop</th>
          <th className='thead__title'>Title</th>
          <th>Variant</th>
          <th>SKU</th>
          <th>Available</th>
        </tr>
      </thead>
      <tbody>
        {flattenedRows.length === 0 ? (
          <tr>
            <td colSpan='5'>Loading products...</td>
          </tr>
        ) : (
          flattenedRows.map((row, index) => (
            <tr key={row.variant.id} className='ListTable__Row'>
              {row.isFirstVariant && (
                <>
                  <td rowSpan={row.variantCount} className='table__col-shop'>
                    <img
                      src='/shopify-logo.svg'
                      alt='Shopify'
                      className='table__shop-logo'
                    />
                  </td>
                  <td rowSpan={row.variantCount} className='table__col-title'>
                    {row.product.title}
                  </td>
                </>
              )}
              <td className='table__var-title'>{row.variant.title}</td>
              <td className='table__var-sku'>{row.variant.sku}</td>
              <td className='table__var-available'>
                <input
                  type='number'
                  value={row.variant.available}
                  onChange={(e) => {
                    // 여기에 변경 처리 로직 추가
                    console.log('수량 변경:', row.variant.id, e.target.value);
                  }}
                />
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ShopifyTable;
