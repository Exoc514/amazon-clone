import { Link } from "react-router-dom";
import { useState } from "react";

function Cart() {
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem("cart")) || []
  );

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const total = cart.reduce((sum, item) => {
    const price = Number(item.price.replace("₹", "").replace(",", ""));
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="container mt-5">
      <h2>🛒 My Cart</h2>

      {cart.length === 0 ? (
        <h4 className="mt-4">Your cart is empty</h4>
      ) : (
        <>
          {cart.map((item) => (
            <div className="card p-3 mt-3" key={item.id}>
              <div className="d-flex align-items-center">

                <img
                  src={item.image}
                  alt={item.name}
                  width="100"
                />

                <div className="ms-4">
                  <h4>{item.name}</h4>

                  <p>Price: {item.price}</p>

                  <p>Quantity: {item.quantity}</p>

                  <button
                    className="btn btn-danger"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>

              </div>
            </div>
          ))}

          <h3 className="mt-4">
            Total: ₹{total.toLocaleString()}
          </h3>

          <Link to="/order" className="btn btn-primary">
             Buy Now
          </Link>
        </>
      )}
    </div>
  );
}

export default Cart;