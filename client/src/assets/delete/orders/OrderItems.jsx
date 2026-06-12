import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./Orders.css";

const url = "http://127.0.0.1:5000";

const OrderItems = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetch(`${url}/orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch order details");
        return res.json();
      })
      .then((data) => setOrder(data))
      .catch((error) => {
        console.error("Error fetching order details:", error);
      })
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
  <div className="order-details-container">
    <h2>Order #{order.id} Details</h2>
    <p>Status: <span className="status-text">{order.status}</span></p>
    <p>Total Price: <span className="price-text">${order.total_price.toFixed(2)}</span></p>

    <h3>Items:</h3>
    <table className="order-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Product</th>
          <th>Quantity</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {order.items.map((item) => (
          <tr key={item.product_id}>
            <td><img src={item.image} alt={item.name} className="item-image" /></td>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <Link to="/orders" className="back-button">
      Back to Orders
    </Link>
  </div>
);
};

export default OrderItems;
