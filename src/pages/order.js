
import { useState } from "react";

function Order() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const total = cart.reduce((sum, item) => {
    const price = Number(
      item.price.replace("₹", "").replace(",", "")
    );

    return sum + price * item.quantity;
  }, 0);

  const placeOrder = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://amazon-clone-td7b.onrender.com/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            address: address,
            total: total,

            // SEND CART PRODUCTS TO SERVER
            items: cart
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(
          "Order placed successfully! Order ID: " +
            data.orderId
        );

        // Clear cart after successful order
        localStorage.removeItem("cart");

        // Clear the form
        setName("");
        setEmail("");
        setPhone("");
        setAddress("");
      } else {
        alert(
          "Something went wrong: " +
            data.message
        );
      }
    } catch (error) {
      console.log("ERROR:", error);
      alert("Could not connect to the server.");
    }
  };

  return (
    <div className="container mt-5">

      <h2>Place Your Order</h2>

      <form
        onSubmit={placeOrder}
        className="mt-4"
      >

        <div className="mb-3">
          <label>Name</label>

          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Email</label>

          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Phone</label>

          <input
            type="text"
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Address</label>

          <textarea
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <h4>
          Total: ₹{total.toLocaleString()}
        </h4>

        <button
          type="submit"
          className="btn btn-success mt-3"
        >
          Place Order
        </button>

      </form>

    </div>
  );
}

export default Order;

