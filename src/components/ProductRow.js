function ProductRow({ product }) {
  return product.variants.map((variant, index) => (
    <tr key={variant.id} className='ListTable__Row'>
      {index === 0 && (
        <td rowSpan={product.variants.length} className='shop-cell'></td>
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
  ));
}

export default ProductRow;
