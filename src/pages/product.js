
import React from "react";

function Product() {
  const product = JSON.parse(localStorage.getItem("product"));

  const addToCart = () => {
    if (!product) {
      return;
    }

    const cart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = cart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      existingProduct.quantity =
        (existingProduct.quantity || 1) + 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

    alert(product.name + " added to cart!");
  };

  if (!product) {
    return (
      <div className="container mt-5">
        <h3>No product selected</h3>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>Product Page</h1>

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
    </div>
  );
}

export default Product;

