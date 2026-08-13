```jsx
import React from "react";

function Product() {
  const product = JSON.parse(localStorage.getItem("product"));

  const addToCart = () => {
    const oldCart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = oldCart.find(
      (item) => item.id === product.id
    );

    let newCart;

    if (existingProduct) {
      newCart = oldCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      newCart = [
        ...oldCart,
        {
          ...product,
          quantity: 1
        }
      ];
    }

    localStorage.setItem("cart", JSON.stringify(newCart));

    alert(`${product.name} added to cart!`);
  };

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

          <p>
            <strong>Price:</strong> {product.price}
          </p>

          <p>
            <strong>Features:</strong> {product.features}
          </p>

          <button
            className="btn btn-success"
            onClick={addToCart}
          >
            Add to Cart
          </button>

        </div>

      ) : (

        <h3>No product selected</h3>

      )}

    </div>
  );
}

export default Product;
```
