import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
	FiSmartphone,
	FiCheckCircle,
	FiAlertCircle,
	FiArrowLeft,
	FiLock,
} from "react-icons/fi";

const API_URL = "http://127.0.0.1:5000";

function Checkout() {
	const location = useLocation();
	const navigate = useNavigate();
	const [phone, setPhone] = useState("254");
	const [amount, setAmount] = useState("");
	const [orderId, setOrderId] = useState(null);
	const [loading, setLoading] = useState(false);
	const [paymentStatus, setPaymentStatus] = useState(null); // 'success', 'error', null
	const [receipt, setReceipt] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		console.log("Location State:", location.state);
		if (location.state?.amount && location.state?.orderId) {
			setAmount(location.state.amount);
			setOrderId(location.state.orderId);
		} else {
			setError(
				"Order ID or amount missing. Please return to cart and try again.",
			);
		}
	}, [location.state]);

	const handlePhoneChange = (e) => {
		let input = e.target.value.replace(/\D/g, ""); // Remove non-digits
		if (!input.startsWith("254")) {
			input = "254" + input;
		}
		if (input.length > 12) {
			input = input.slice(0, 12);
		}
		setPhone(input);
	};

	const formatPhoneForDisplay = (phoneNum) => {
		if (phoneNum.length === 12 && phoneNum.startsWith("254")) {
			return `0${phoneNum.slice(3)}`;
		}
		return phoneNum;
	};

	const handlePay = async (e) => {
		e.preventDefault();
		setError("");
		setPaymentStatus(null);
		setReceipt(null);

		// Validate phone number
		if (!phone || phone.length !== 12 || !phone.startsWith("254")) {
			setError(
				"Please enter a valid phone number starting with 254 (e.g., 254712345678)",
			);
			return;
		}

		if (!amount || !orderId) {
			setError(
				"Missing payment information. Please return to cart and try again.",
			);
			return;
		}

		setLoading(true);

		try {
			const token = localStorage.getItem("access_token");
			if (!token) {
				setError("Please login again to complete payment.");
				navigate("/login");
				return;
			}

			const response = await axios.post(
				`${API_URL}/mpesa/pay`,
				{ phone_number: phone, order_id: orderId },
				{
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			console.log("Payment Response:", response.data);

			if (response.data.message === "STK push initiated successfully") {
				const fakeReceipt =
					response.data.data?.mpesa_receipt_number ||
					`MPESA-${Date.now()}`;
				setReceipt(fakeReceipt);
				setPaymentStatus("success");

				// Auto-redirect after 3 seconds
				setTimeout(() => {
					navigate("/orders");
				}, 3000);
			} else {
				setPaymentStatus("error");
				setError(
					response.data.error ||
						"Payment initiation failed. Please try again.",
				);
			}
		} catch (error) {
			console.error("Payment Error:", error);
			setPaymentStatus("error");
			setError(
				error.response?.data?.error ||
					"Payment failed! Please check your connection and try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	const formatAmount = (amt) => {
		return new Intl.NumberFormat("en-KE", {
			style: "currency",
			currency: "KES",
			minimumFractionDigits: 0,
		}).format(amt);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
			<div className="max-w-md mx-auto">
				{/* Back Button */}
				<button
					onClick={() => navigate("/cart")}
					className="flex items-center gap-2 text-momma-brown hover:text-momma-pink transition-colors mb-6"
				>
					<FiArrowLeft />
					Back to Cart
				</button>

				{/* Payment Card */}
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					{/* Header */}
					<div className="bg-gradient-to-r from-momma-brown to-momma-orange px-6 py-8 text-white text-center">
						<div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
							<FiSmartphone className="text-4xl" />
						</div>
						<h1 className="text-2xl font-bold mb-2">
							M-Pesa Payment
						</h1>
						<p className="text-white/90">
							Complete your purchase securely
						</p>
					</div>

					{/* Payment Details */}
					<div className="p-6">
						{/* Order Summary */}
						<div className="bg-gray-50 rounded-xl p-4 mb-6">
							<h3 className="font-semibold text-momma-brown mb-3">
								Order Summary
							</h3>
							<div className="space-y-2">
								<div className="flex justify-between">
									<span className="text-gray-600">
										Order ID:
									</span>
									<span className="font-medium text-momma-brown">
										#{orderId}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">
										Amount to Pay:
									</span>
									<span className="text-2xl font-bold text-momma-pink">
										{formatAmount(amount)}
									</span>
								</div>
							</div>
						</div>

						{/* Success Message */}
						{paymentStatus === "success" && (
							<div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 animate-fade-in">
								<div className="flex items-center gap-3">
									<FiCheckCircle className="text-green-500 text-xl" />
									<div>
										<p className="font-semibold text-green-800">
											Payment Successful!
										</p>
										<p className="text-sm text-green-600">
											Receipt: {receipt}
										</p>
										<p className="text-sm text-green-600 mt-1">
											Redirecting to orders...
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Error Message */}
						{error && (
							<div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
								<div className="flex items-start gap-3">
									<FiAlertCircle className="text-red-500 text-xl flex-shrink-0 mt-0.5" />
									<div>
										<p className="font-semibold text-red-800">
											Payment Failed
										</p>
										<p className="text-sm text-red-600">
											{error}
										</p>
									</div>
								</div>
							</div>
						)}

						{/* Payment Form */}
						{!paymentStatus && (
							<form onSubmit={handlePay} className="space-y-6">
								{/* Phone Number Input */}
								<div>
									<label className="block text-gray-700 font-medium mb-2">
										M-Pesa Phone Number
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<FiSmartphone className="text-gray-400" />
										</div>
										<input
											type="tel"
											value={phone}
											onChange={handlePhoneChange}
											className="input-field pl-10"
											placeholder="254712345678"
											required
											disabled={loading}
										/>
									</div>
									<p className="text-xs text-gray-500 mt-1">
										Enter the M-Pesa registered phone number
										(format: 254XXXXXXXXX)
									</p>
								</div>

								{/* Amount Display */}
								<div>
									<label className="block text-gray-700 font-medium mb-2">
										Amount
									</label>
									<div className="bg-gray-100 rounded-lg px-4 py-3 text-gray-700 font-medium">
										{formatAmount(amount)}
									</div>
									<p className="text-xs text-gray-500 mt-1">
										You will receive an STK push on your
										phone
									</p>
								</div>

								{/* Security Note */}
								<div className="flex items-center justify-center gap-2 text-xs text-gray-500">
									<FiLock />
									<span>Secured by M-Pesa Express</span>
								</div>

								{/* Pay Button */}
								<button
									type="submit"
									disabled={loading}
									className="btn-primary w-full py-3 text-lg disabled:opacity-50"
								>
									{loading ? (
										<div className="flex items-center justify-center gap-2">
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
											<span>Processing...</span>
										</div>
									) : (
										`Pay ${formatAmount(amount)}`
									)}
								</button>
							</form>
						)}

						{/* After Payment Actions */}
						{paymentStatus === "success" && (
							<button
								onClick={() => navigate("/orders")}
								className="btn-primary w-full py-3 text-lg"
							>
								View My Orders
							</button>
						)}

						{paymentStatus === "error" && (
							<button
								onClick={() => window.location.reload()}
								className="btn-primary w-full py-3 text-lg"
							>
								Try Again
							</button>
						)}
					</div>
				</div>

				{/* Help Text */}
				<div className="text-center mt-6 text-sm text-gray-500">
					<p>
						Having trouble? Contact support at support@momanuts.com
					</p>
				</div>
			</div>

			{/* Add animation CSS */}
			<style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
		</div>
	);
}

export default Checkout;
