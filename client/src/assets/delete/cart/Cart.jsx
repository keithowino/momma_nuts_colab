import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./cart.css";

const url = "http://127.0.0.1:5000";

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = () => {
    axios
      .get(`${url}/cart`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      })
      .then((response) => setCartItems(response.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to fetch cart")
      );
  };

  const updateQuantity = (productId, change) => {
    axios
      .post(
        `${url}/cart`,
        { product_id: productId, quantity: change }, // ✅ Send only the change (+1 or -1)
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      )
      .then(() => fetchCart()) // ✅ Refresh cart after update
      .catch((err) => alert(err.response?.data?.error || "Failed to update quantity"));
  };

  const removeItem = (cartId) => {
    axios
      .delete(`${url}/cart/${cartId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
      })
      .then((response) => {
        console.log(response.data); // ✅ Debug: Check if message is returned
        setCartItems(cartItems.filter(item => item.id !== cartId)); // ✅ Update state without fetchCart()
      })
      .catch((err) => {
        console.error("Error removing item:", err.response?.data || err.message); // ✅ Log actual error
        alert(err.response?.data?.error || "Failed to remove item");
      });
  };

  const handleCheckout = () => {
    axios
      .post(
        `${url}/checkout`,
        {}, // No need to send cart data here, backend will process it
        { headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` } }
      )
      .then((response) => {
        alert("Checkout successful! Proceed to payment.");
        
        // Pass orderId and amount using state
        console.log("Navigating to Mpesa with:", response.data);
        navigate("/mpesa", { state: { orderId: response.data.order_id, amount: response.data.total_amount } });

      })
      .catch((err) => alert(err.response?.data?.error || "Checkout failed"));
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {error && <p className="error">{error}</p>}
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-image" />
              <div className="cart-details">
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <div className="cart-controls">
                  <button onClick={() => updateQuantity(item.product_id, 1)}>+</button>
                  <button onClick={() => item.quantity > 1 && updateQuantity(item.product_id, -1)}>-</button>
                  <button onClick={() => removeItem(item.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
          <button className="checkout-btn" onClick={handleCheckout}>
            Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default CartPage;
