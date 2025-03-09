import './ProductList.css';

function ProductList() {
  return (
    <table className='ListTable'>
      <tr>
        <th>Shop</th>
        <th>Title</th>
        <th>Variant</th>
        <th>SKU</th>
        <th>Available</th>
      </tr>
    </table>
  );
}

export default ProductList;
