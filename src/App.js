import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Product from "./pages/product";
import Cart from "./pages/cart";
import Order from "./pages/order";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order" element={<Order />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;