import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	FiPackage,
	FiEye,
	FiCreditCard,
	FiXCircle,
	FiRefreshCw,
	FiSearch,
	FiClock,
	FiCheckCircle,
	FiAlertCircle,
} from "react-icons/fi";
import { orderAPI } from "../../lib/config/api";

const Orders = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [cancellingOrderId, setCancellingOrderId] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		setLoading(true);
		const token = localStorage.getItem("access_token");

		if (!token) {
			setError("Please login to view orders");
			setLoading(false);
			return;
		}

		try {
			// orderAPI.getAll() returns axios response - data is in response.data
			const response = await orderAPI.getAll();
			const data = response.data;

			setOrders(Array.isArray(data) ? data : []);
			setError("");
		} catch (err) {
			console.error("Error fetching orders:", err);
			setError(
				err.response?.data?.error ||
					err.message ||
					"Failed to load orders",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleCancelOrder = async (orderId, orderStatus) => {
		const user = JSON.parse(localStorage.getItem("user") || "{}");

		if (orderStatus === "completed" && user.role !== "admin") {
			alert(
				"Only an admin can cancel a completed order. Please contact support.",
			);
			return;
		}

		if (
			!window.confirm(
				`Are you sure you want to cancel order #${orderId}?`,
			)
		)
			return;

		setCancellingOrderId(orderId);
		try {
			await orderAPI.cancel(orderId);

			// Update local state
			setOrders((prevOrders) =>
				prevOrders.map((order) =>
					order.id === orderId
						? { ...order, status: "canceled" }
						: order,
				),
			);
			alert(`Order #${orderId} has been canceled.`);
		} catch (err) {
			console.error("Error canceling order:", err);
			alert(err.response?.data?.error || "Failed to cancel order");
		} finally {
			setCancellingOrderId(null);
		}
	};

	const handlePayment = (orderId, amount) => {
		navigate("/mpesa", { state: { orderId, amount } });
	};

	const getStatusBadge = (status) => {
		const statusLower = status?.toLowerCase();
		if (statusLower === "completed")
			return {
				icon: FiCheckCircle,
				color: "bg-green-100 text-green-800",
				label: "Completed",
			};
		if (statusLower === "canceled")
			return {
				icon: FiXCircle,
				color: "bg-red-100 text-red-800",
				label: "Canceled",
			};
		if (statusLower === "pending")
			return {
				icon: FiClock,
				color: "bg-yellow-100 text-yellow-800",
				label: "Pending",
			};
		if (statusLower === "processing")
			return {
				icon: FiPackage,
				color: "bg-blue-100 text-blue-800",
				label: "Processing",
			};
		return {
			icon: FiAlertCircle,
			color: "bg-gray-100 text-gray-800",
			label: status,
		};
	};

	const filteredOrders = orders.filter((order) => {
		const matchesSearch = order.id.toString().includes(searchTerm);
		const matchesStatus =
			statusFilter === "all" ||
			order.status?.toLowerCase() === statusFilter.toLowerCase();
		return matchesSearch && matchesStatus;
	});

	const stats = {
		total: orders.length,
		pending: orders.filter((o) => o.status === "pending").length,
		completed: orders.filter((o) => o.status === "completed").length,
		canceled: orders.filter((o) => o.status === "canceled").length,
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-momma-pink"></div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			{/* Header */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
				<div>
					<h1 className="text-3xl font-bold text-momma-brown flex items-center gap-3">
						<FiPackage className="text-momma-pink" />
						My Orders
					</h1>
					<p className="text-gray-600 mt-1">
						Track and manage your purchases
					</p>
				</div>
				<button
					onClick={fetchOrders}
					className="btn-secondary flex items-center gap-2 px-4 py-2"
				>
					<FiRefreshCw className="text-sm" />
					Refresh
				</button>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<div className="bg-white rounded-xl shadow-sm p-4 border">
					<p className="text-gray-500 text-sm">Total Orders</p>
					<p className="text-2xl font-bold text-momma-brown">
						{stats.total}
					</p>
				</div>
				<div className="bg-white rounded-xl shadow-sm p-4 border">
					<p className="text-yellow-600 text-sm">Pending</p>
					<p className="text-2xl font-bold text-yellow-600">
						{stats.pending}
					</p>
				</div>
				<div className="bg-white rounded-xl shadow-sm p-4 border">
					<p className="text-green-600 text-sm">Completed</p>
					<p className="text-2xl font-bold text-green-600">
						{stats.completed}
					</p>
				</div>
				<div className="bg-white rounded-xl shadow-sm p-4 border">
					<p className="text-red-600 text-sm">Canceled</p>
					<p className="text-2xl font-bold text-red-600">
						{stats.canceled}
					</p>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-col md:flex-row gap-4 mb-6">
				<div className="flex-1 relative">
					<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search by Order ID..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
					/>
				</div>
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
				>
					<option value="all">All Status</option>
					<option value="pending">Pending</option>
					<option value="processing">Processing</option>
					<option value="completed">Completed</option>
					<option value="canceled">Canceled</option>
				</select>
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
					<p className="text-red-600">{error}</p>
				</div>
			)}

			{/* Orders List */}
			{!error && filteredOrders.length === 0 ? (
				<div className="bg-white rounded-xl shadow-sm p-12 text-center">
					<FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
					<p className="text-gray-500 text-lg">No orders found</p>
					<p className="text-gray-400 text-sm mt-1">
						{searchTerm || statusFilter !== "all"
							? "Try adjusting your filters"
							: "Start shopping to see your orders here"}
					</p>
					{searchTerm || statusFilter !== "all" ? (
						<button
							onClick={() => {
								setSearchTerm("");
								setStatusFilter("all");
							}}
							className="btn-secondary mt-6"
						>
							Clear Filters
						</button>
					) : (
						<button
							onClick={() => navigate("/user-products")}
							className="btn-primary mt-6"
						>
							Start Shopping
						</button>
					)}
				</div>
			) : (
				<div className="space-y-4">
					{filteredOrders.map((order) => {
						const StatusIcon = getStatusBadge(order.status).icon;
						const statusStyle = getStatusBadge(order.status);

						return (
							<div
								key={order.id}
								className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
							>
								{/* Order Header */}
								<div className="bg-gray-50 px-6 py-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
									<div className="flex items-center gap-4">
										<span className="font-semibold text-momma-brown">
											Order #{order.id}
										</span>
										<div
											className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyle.color}`}
										>
											<StatusIcon className="text-sm" />
											<span>{statusStyle.label}</span>
										</div>
									</div>
									<div className="flex flex-wrap gap-2">
										<Link
											to={`/order-items/${order.id}`}
											className="flex items-center gap-1 px-3 py-1.5 text-sm text-momma-pink hover:bg-pink-50 rounded-lg transition-colors"
										>
											<FiEye />
											View Details
										</Link>
										{order.status === "pending" && (
											<button
												onClick={() =>
													handlePayment(
														order.id,
														order.total_price,
													)
												}
												className="flex items-center gap-1 px-3 py-1.5 text-sm bg-momma-pink text-white rounded-lg hover:bg-opacity-90 transition-colors"
											>
												<FiCreditCard />
												Pay Now
											</button>
										)}
										{(order.status === "pending" ||
											order.status === "processing") && (
											<button
												onClick={() =>
													handleCancelOrder(
														order.id,
														order.status,
													)
												}
												disabled={
													cancellingOrderId ===
													order.id
												}
												className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
											>
												{cancellingOrderId ===
												order.id ? (
													<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
												) : (
													<FiXCircle />
												)}
												Cancel
											</button>
										)}
									</div>
								</div>

								{/* Order Body */}
								<div className="px-6 py-4">
									<div className="flex justify-between items-center">
										<div>
											<p className="text-sm text-gray-500">
												Order Date
											</p>
											<p className="text-sm text-gray-700">
												{new Date(
													order.created_at,
												).toLocaleDateString()}
											</p>
										</div>
										<div className="text-right">
											<p className="text-sm text-gray-500">
												Total Amount
											</p>
											<p className="text-xl font-bold text-momma-pink">
												KSh{" "}
												{order.total_price?.toLocaleString()}
											</p>
										</div>
									</div>

									{/* Items Preview */}
									{order.items && order.items.length > 0 && (
										<div className="mt-4 pt-4 border-t">
											<p className="text-sm text-gray-500 mb-2">
												Items ({order.items.length})
											</p>
											<div className="flex flex-wrap gap-2">
												{order.items
													.slice(0, 3)
													.map((item, idx) => (
														<span
															key={idx}
															className="text-sm text-gray-600"
														>
															{item.quantity}x{" "}
															{item.name}
														</span>
													))}
												{order.items.length > 3 && (
													<span className="text-sm text-gray-400">
														+
														{order.items.length - 3}{" "}
														more
													</span>
												)}
											</div>
										</div>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};

export default Orders;
