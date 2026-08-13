```jsx
import React, { useEffect, useState } from "react";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("https://amazon-clone-td7b.onrender.com/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load products");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Could not load products");
        setLoading(false);
      });
  }, []);

  const openProduct = (product) => {
    localStorage.setItem("product", JSON.stringify(product));
    window.location.href = "/product";
  };

  const addToCart = (product) => {
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

  if (loading) {
    return (
      <div className="container mt-5">
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5">

      <h1>Amazon Clone</h1>

      <div className="row mt-4">

        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>

            <div className="card p-3 h-100">

              <img
                src={product.image}
                alt={product.name}
                className="card-img-top"
                style={{
                  height: "250px",
                  objectFit: "contain"
                }}
              />

              <div className="card-body">

                <h3>{product.name}</h3>

                <h4>{product.price}</h4>

                <p>{product.features}</p>

                <button
                  className="btn btn-primary me-2"
                  onClick={() => openProduct(product)}
                >
                  View Product
                </button>

                <button
                  className="btn btn-success"
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Home;
```
