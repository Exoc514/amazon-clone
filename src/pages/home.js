```javascript
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/product.json")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.log("Error loading products:", error));
  }, []);

  const addToCart = (product) => {
    const oldCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = oldCart.find(
      (item) => item.id === product.id
    );

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      oldCart.push({
        ...product,
        quantity: 1,
      });
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(oldCart)
    );

    alert(product.name + " added to cart!");
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">
        Amazon Clone Products
      </h2>

      <Link
        to="/cart"
        className="btn btn-dark mb-4"
      >
        🛒 View Cart
      </Link>

      <div className="row">
        {products.map((item) => (
          <div
            className="col-md-3 mb-3"
            key={item.id}
          >
            <div
              className="card"
              style={{ width: "18rem" }}
            >
              <img
                src={item.image}
                className="card-img-top"
                alt={item.name}
                height="200"
              />

              <div className="card-body">
                <h5>{item.name}</h5>

                <p>{item.price}</p>

                <Link
                  to="/product"
                  onClick={() =>
                    localStorage.setItem(
                      "product",
                      JSON.stringify(item)
                    )
                  }
                  className="btn btn-primary me-2"
                >
                  View Product
                </Link>

                <button
                  className="btn btn-success mt-2"
                  onClick={() => addToCart(item)}
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
