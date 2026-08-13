function Product() {
  const product = JSON.parse(localStorage.getItem("product"));

  return (
    <div className="container mt-5">
      <h1>Product Page</h1>

      {product ? (
        <div className="card p-4 mt-3">

          <h3>{product.name}</h3>

          <img
            src={product.image}
            alt={product.name}
            width="250"
            className="my-3"
          />

          <p><strong>Price:</strong> {product.price}</p>

          <p><strong>Features:</strong> {product.features}</p>

        </div>
      ) : (
        <h3>No product selected</h3>
      )}
    </div>
  );
}

export default Product;