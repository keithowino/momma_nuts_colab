import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./Mpesa.css";

const url = "http://127.0.0.1:5000"

function Mpesa() {
  const location = useLocation();
  const [phone, setPhone] = useState("254");
  const [amount, setAmount] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Location State:", location.state); // Debugging
    if (location.state?.amount && location.state?.orderId) {
      setAmount(location.state.amount);
      setOrderId(location.state.orderId);
    } else {
      setError("Order ID or amount missing. Please try again.");
    }
  }, [location.state]);  

  const handlePhoneChange = (e) => {
    let input = e.target.value;
    if (!input.startsWith("254")) {
      input = "254";
    } else if (input.length > 12) {
      input = input.slice(0, 12);
    }
    setPhone(input);
  };

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");
    setReceipt(null);

    if (!phone || phone.length !== 12 || !amount || !orderId) {
      setError("Please enter a valid phone number and ensure order ID exists.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");

      // Send Mpesa payment request
      const response = await axios.post(
        `${url}/mpesa/pay`,
        { phone_number: phone, order_id: orderId },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Payment Response:", response.data);

      if (response.data.message === "STK push initiated successfully") {
        // 🛑 **Get receipt immediately (since backend generates it)**
        const fakeReceipt = response.data.data.mpesa_receipt_number || "No Receipt Found";
        setReceipt(fakeReceipt);
        alert(`Payment Successful! Receipt: ${fakeReceipt}`);
      } else {
        setError(response.data.error || "Payment initiation failed.");
      }

    } catch (error) {
      console.error("Error:", error);
      setError(error.response?.data?.error || "Payment failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Moringa Hostels</h2>
      <p className="subtitle">
        Pay with <span className="mpesa-text">M<span className="hyphen">-</span>pesa</span>
      </p>

      {error && <p className="error-message">{error}</p>}
      {receipt && <p className="receipt-message">Receipt: {receipt}</p>}

      <form className="payment-form" onSubmit={handlePay}>
        <input
          type="text"
          value={phone}
          onChange={handlePhoneChange}
          className="input-field"
          placeholder="2547XXXXXXXX"
          required
        />

        <input
          type="number"
          value={amount}
          className="input-field"
          placeholder="Enter amount"
          readOnly
        />

        <button type="submit" className="pay-button" disabled={loading}>
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
}

export default Mpesa;
