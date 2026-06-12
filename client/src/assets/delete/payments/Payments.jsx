import React, { useEffect, useState } from "react";
import axios from "axios";

const url = "http://127.0.0.1:5000"

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem("access_token");

        const response = await axios.get(`${url}/payments`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPayments(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Payment History</h2>

      {loading && <p>Loading payments...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && payments.length === 0 && <p>No payments found.</p>}

      {!loading && !error && payments.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Receipt</th>
                <th className="px-4 py-2 border">Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="text-center border-b">
                  <td className="px-4 py-2 border">{payment.order_id}</td>
                  <td className="px-4 py-2 border">{payment.phone_number}</td>
                  <td className="px-4 py-2 border">Ksh {payment.amount.toFixed(2)}</td>
                  <td className={`px-4 py-2 border ${payment.status === "Completed" ? "text-green-600" : "text-red-500"}`}>
                    {payment.status}
                  </td>
                  <td className="px-4 py-2 border">{payment.mpesa_receipt_number || "N/A"}</td>
                  <td className="px-4 py-2 border">{new Date(payment.transaction_date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Payment;
