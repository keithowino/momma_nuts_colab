import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
	FiPackage,
	FiArrowLeft,
	FiCreditCard,
	FiClock,
	FiCheckCircle,
	FiXCircle,
	FiTruck,
} from "react-icons/fi";
import { orderAPI } from "../../lib/config/api";

const API_URL = "http://127.0.0.1:5000";

const OrderDetails = () => {
	const { orderId } = useParams();
	const navigate = useNavigate();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		fetchOrderDetails();
	}, [orderId]);

	const fetchOrderDetails = async () => {
		const token = localStorage.getItem("access_token");
		if (!token) {
			setError("Please login to view order details");
			setLoading(false);
			return;
		}

		try {
			// const response = await fetch(`${API_URL}/orders/${orderId}`, {
			// 	headers: { Authorization: `Bearer ${token}` },
			// });
			const response = await orderAPI.getById({ orderId });

			if (!response.ok) throw new Error("Failed to fetch order details");

			const data = await response.json();
			setOrder(data);
		} catch (err) {
			console.error("Error fetching order details:", err);
			setError(err.message || "Failed to load order details");
		} finally {
			setLoading(false);
		}
	};

	const handlePayment = () => {
		navigate("/mpesa", {
			state: { orderId: order.id, amount: order.total_price },
		});
	};

	const getStatusConfig = (status) => {
		const statusLower = status?.toLowerCase();
		if (statusLower === "completed") {
			return {
				icon: FiCheckCircle,
				color: "text-green-600",
				bg: "bg-green-100",
				label: "Completed",
				step: 3,
			};
		}
		if (statusLower === "canceled") {
			return {
				icon: FiXCircle,
				color: "text-red-600",
				bg: "bg-red-100",
				label: "Canceled",
				step: -1,
			};
		}
		if (statusLower === "processing") {
			return {
				icon: FiTruck,
				color: "text-blue-600",
				bg: "bg-blue-100",
				label: "Processing",
				step: 2,
			};
		}
		return {
			icon: FiClock,
			color: "text-yellow-600",
			bg: "bg-yellow-100",
			label: "Pending",
			step: 1,
		};
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-momma-pink"></div>
			</div>
		);
	}

	if (error || !order) {
		return (
			<div className="max-w-4xl mx-auto px-4 py-8 text-center">
				<FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
				<p className="text-red-600 mb-4">
					{error || "Order not found"}
				</p>
				<Link to="/orders" className="btn-primary inline-block">
					Back to Orders
				</Link>
			</div>
		);
	}

	const statusConfig = getStatusConfig(order.status);

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			{/* Back Button */}
			<div className="mb-6">
				<Link
					to="/orders"
					className="flex items-center gap-2 text-momma-brown hover:text-momma-pink transition-colors"
				>
					<FiArrowLeft />
					Back to Orders
				</Link>
			</div>

			{/* Order Header */}
			<div className="bg-white rounded-xl shadow-sm border overflow-hidden">
				<div className="bg-gradient-to-r from-momma-brown to-momma-orange px-6 py-6 text-white">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
						<div>
							<h1 className="text-2xl font-bold">
								Order #{order.id}
							</h1>
							<p className="text-white/80 text-sm mt-1">
								Placed on{" "}
								{new Date(
									order.created_at,
								).toLocaleDateString()}
							</p>
						</div>
						<div
							className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.color}`}
						>
							<statusConfig.icon />
							<span>{statusConfig.label}</span>
						</div>
					</div>
				</div>

				{/* Order Status Timeline */}
				{order.status !== "canceled" && (
					<div className="px-6 py-6 border-b">
						<h3 className="font-semibold text-momma-brown mb-4">
							Order Status
						</h3>
						<div className="flex items-center justify-between">
							{[
								{
									label: "Order Placed",
									step: 1,
									completed: statusConfig.step >= 1,
								},
								{
									label: "Processing",
									step: 2,
									completed: statusConfig.step >= 2,
								},
								{
									label: "Completed",
									step: 3,
									completed: statusConfig.step >= 3,
								},
							].map((step, idx) => (
								<div
									key={step.label}
									className="flex-1 text-center"
								>
									<div
										className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
											step.completed
												? "bg-green-500 text-white"
												: "bg-gray-200 text-gray-400"
										}`}
									>
										{step.completed ? (
											<FiCheckCircle />
										) : (
											step.step
										)}
									</div>
									<p
										className={`text-sm ${step.completed ? "text-green-600 font-medium" : "text-gray-400"}`}
									>
										{step.label}
									</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Order Items */}
				<div className="px-6 py-6 border-b">
					<h3 className="font-semibold text-momma-brown mb-4">
						Order Items
					</h3>
					<div className="space-y-3">
						{order.items?.map((item, idx) => (
							<div
								key={idx}
								className="flex items-center gap-4 py-3 border-b last:border-0"
							>
								<div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
									{item.image ? (
										<img
											src={item.image}
											alt={item.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<FiPackage />
										</div>
									)}
								</div>
								<div className="flex-1">
									<p className="font-medium text-momma-brown">
										{item.name}
									</p>
									<p className="text-sm text-gray-500">
										Quantity: {item.quantity}
									</p>
								</div>
								<div className="text-right">
									<p className="font-semibold text-momma-pink">
										KSh{" "}
										{(
											item.price * item.quantity
										).toLocaleString()}
									</p>
									<p className="text-xs text-gray-500">
										KSh {item.price.toLocaleString()} each
									</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Order Summary */}
				<div className="px-6 py-6">
					<div className="flex justify-between items-center mb-2">
						<span className="text-gray-600">Subtotal</span>
						<span className="text-gray-800">
							KSh {order.total_price?.toLocaleString()}
						</span>
					</div>
					<div className="flex justify-between items-center mb-2">
						<span className="text-gray-600">Shipping</span>
						<span className="text-green-600">Free</span>
					</div>
					<div className="border-t pt-3 mt-3">
						<div className="flex justify-between items-center">
							<span className="font-bold text-momma-brown text-lg">
								Total
							</span>
							<span className="font-bold text-momma-pink text-2xl">
								KSh {order.total_price?.toLocaleString()}
							</span>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				{order.status === "pending" && (
					<div className="px-6 py-4 bg-gray-50 border-t">
						<button
							onClick={handlePayment}
							className="btn-primary w-full flex items-center justify-center gap-2 py-3"
						>
							<FiCreditCard />
							Complete Payment
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default OrderDetails;
