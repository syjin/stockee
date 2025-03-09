function Test({ products, updateStock }) {
  return (
    <div style={{ padding: '20px' }}>
      {products.length === 0 ? (
        <p>Loading products...</p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ddd',
              padding: '10px',
              margin: '10px 0',
            }}
          >
            <h2>{product.title}</h2>
            {product.variants.map((variant) => (
              <div key={variant.id} style={{ paddingLeft: '20px' }}>
                <p>
                  <strong>{variant.title}</strong> (SKU: {variant.sku})
                </p>
                <p>Stock: {variant.available}</p>
                <button
                  onClick={() => updateStock(variant.inventoryLevelId, 5)}
                >
                  +5
                </button>
                <button
                  onClick={() => updateStock(variant.inventoryLevelId, -5)}
                  style={{ marginLeft: '5px' }}
                >
                  -5
                </button>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Test;
