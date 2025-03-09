import '../styles/Table.css';
import { useState } from 'react';

const ShopifyTable = ({ products = [], onInventoryUpdate }) => {
  // 재고 변경 상태 관리
  const [inventoryChanges, setInventoryChanges] = useState({});

  // 제품과 변형 데이터를 평면화하여 각 행의 데이터를 준비합니다
  const flattenedRows = products.reduce(
    (rows, product) => [
      ...rows,
      ...product.variants.map((variant, variantIndex) => ({
        product,
        variant,
        isFirstVariant: variantIndex === 0,
        variantCount: product.variants.length,
      })),
    ],
    []
  );

  // 재고 변경 처리 함수
  const handleQuantityChange = (variantId, newValue) => {
    setInventoryChanges({
      ...inventoryChanges,
      [variantId]: newValue,
    });
  };

  // 재고 업데이트 제출 함수
  const handleSubmitUpdate = (variantId, inventoryLevelId) => {
    const newQuantity = inventoryChanges[variantId];
    if (newQuantity !== undefined) {
      onInventoryUpdate(inventoryLevelId, newQuantity);
      // 변경 사항 상태 초기화
      const updatedChanges = { ...inventoryChanges };
      delete updatedChanges[variantId];
      setInventoryChanges(updatedChanges);
    }
  };

  return (
    <table className='table'>
      <thead>
        <tr className='table-header'>
          <th className='thead__shop'>Shop</th>
          <th className='thead__image'>Image</th>
          <th className='thead__title'>Title</th>
          <th>Variant</th>
          <th>SKU</th>
          <th>Available</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {flattenedRows.length === 0 ? (
          <tr>
            <td colSpan='7'>Loading products...</td>
          </tr>
        ) : (
          flattenedRows.map((row) => (
            <tr key={row.variant.id} className='table__row'>
              {row.isFirstVariant && (
                <>
                  <td
                    rowSpan={row.variantCount}
                    className='table__col-shop table__col-top'
                  >
                    <img
                      src='/shopify-logo.svg'
                      alt='Shopify'
                      className='table__shop-logo'
                    />
                  </td>
                  <td
                    rowSpan={row.variantCount}
                    className='table__col-image table__col-top'
                  >
                    {row.product.images && row.product.images.length > 0 ? (
                      <div className='table__image-wrapper'>
                        <img
                          src={row.product.images[0].url}
                          alt={row.product.title}
                          className='table__product-image'
                        />
                      </div>
                    ) : (
                      <div className='table__no-image'>No Image</div>
                    )}
                  </td>
                  <td
                    rowSpan={row.variantCount}
                    className='table__col-title table__col-top'
                  >
                    {row.product.title}
                  </td>
                </>
              )}
              <td className='table__var-title'>{row.variant.title}</td>
              <td className='table__var-sku'>{row.variant.sku}</td>
              <td className='table__var-available'>
                <input
                  type='number'
                  value={
                    inventoryChanges[row.variant.id] !== undefined
                      ? inventoryChanges[row.variant.id]
                      : row.variant.available
                  }
                  onChange={(e) => {
                    handleQuantityChange(
                      row.variant.id,
                      parseInt(e.target.value, 10)
                    );
                  }}
                  min='0'
                  className='table__quantity-input'
                />
              </td>
              <td className='table__var-actions'>
                {inventoryChanges[row.variant.id] !== undefined && (
                  <button
                    onClick={() =>
                      handleSubmitUpdate(
                        row.variant.id,
                        row.variant.inventoryLevelId
                      )
                    }
                    className='table__update-button'
                  >
                    Update
                  </button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default ShopifyTable;
