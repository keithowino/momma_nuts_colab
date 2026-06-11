import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Orders.css";

const url = "http://127.0.0.1:5000";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("access_token");
  const userRole = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${url}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch orders");
        return res.json();
      })
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleCancelOrder = (orderId, status) => {
    if (status === "completed" && userRole !== "admin") {
      alert("Only an admin can cancel a completed order.");
      return;
    }

    fetch(`${url}/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to cancel order");
        return res.json();
      })
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: "canceled" } : order
          )
        );
      })
      .catch((error) => {
        console.error("Error canceling order:", error);
      });
  };

  const handlePayment = (orderId, amount) => {
    navigate("/mpesa", { state: { orderId, amount } });
  };

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="orders-container">
      <h2>Your Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Status</th>
            <th>Total Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.status}</td>
              <td>${order.total_price.toFixed(2)}</td>
              <td>
                <Link to={`/order-items/${order.id}`} className="view-link">View</Link>
                {order.status === "pending" && (
                  <button
                    onClick={() => handlePayment(order.id, order.total_price)}
                    className="pay-button"
                  >
                    Pay
                  </button>
                )}
                {(order.status === "pending" || (order.status === "completed" && userRole === "admin")) && (
                  <button
                    onClick={() => handleCancelOrder(order.id, order.status)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
