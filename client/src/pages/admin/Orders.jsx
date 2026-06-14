import React, { useState, useEffect } from "react";
import {
	FiEye,
	FiPackage,
	FiCheckCircle,
	FiXCircle,
	FiRefreshCw,
	FiDownload,
	FiSearch,
} from "react-icons/fi";
import { orderAPI } from "../../lib/config/api";

function Orders() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(""); // ← ADD THIS
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [showModal, setShowModal] = useState(false);
	const [updatingStatus, setUpdatingStatus] = useState(null); // ← ADD THIS

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		setLoading(true);
		try {
			const response = await orderAPI.getAll();
			setOrders(Array.isArray(response.data) ? response.data : []);
			setError("");
		} catch (err) {
			console.error("Error fetching orders:", err);
			setError(err.response?.data?.error || "Failed to fetch orders");
		} finally {
			setLoading(false);
		}
	};

	const updateOrderStatus = async (orderId, newStatus) => {
		setUpdatingStatus(orderId);
		try {
			const response = await orderAPI.cancel(orderId); // Reusing cancel endpoint for status update
			if (response.status === 200 || response.status === 201) {
				await fetchOrders(); // Refresh the list
				alert(`Order #${orderId} status updated to ${newStatus}`);
			}
		} catch (error) {
			console.error("Error updating order:", error);
			alert(
				error.response?.data?.error || "Failed to update order status",
			);
		} finally {
			setUpdatingStatus(null);
		}
	};

	const getStatusBadge = (status) => {
		const badges = {
			pending: "bg-yellow-100 text-yellow-800",
			completed: "bg-green-100 text-green-800",
			canceled: "bg-red-100 text-red-800",
			processing: "bg-blue-100 text-blue-800",
		};
		return badges[status] || "bg-gray-100 text-gray-800";
	};

	const exportToCSV = () => {
		const headers = [
			"Order ID",
			"Customer ID",
			"Total Amount",
			"Status",
			"Created At",
		];
		const csvData = filteredOrders.map((order) => [
			order.id,
			order.user_id,
			order.total_price,
			order.status,
			new Date(order.created_at).toLocaleDateString(),
		]);

		const csvContent = [headers, ...csvData]
			.map((row) => row.join(","))
			.join("\n");
		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const filteredOrders = orders.filter((order) => {
		const matchesSearch =
			order.id.toString().includes(searchTerm) ||
			(order.user_id && order.user_id.toString().includes(searchTerm));
		const matchesStatus =
			statusFilter === "all" || order.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	const stats = {
		total: orders.length,
		pending: orders.filter((o) => o.status === "pending").length,
		completed: orders.filter((o) => o.status === "completed").length,
		canceled: orders.filter((o) => o.status === "canceled").length,
		revenue: orders.reduce((sum, o) => sum + (o.total_price || 0), 0),
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-momma-pink"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-momma-brown">
					Orders Management
				</h1>
				<div className="flex gap-2">
					<button
						onClick={fetchOrders}
						className="btn-secondary flex items-center gap-2"
					>
						<FiRefreshCw /> Refresh
					</button>
					<button
						onClick={exportToCSV}
						className="btn-primary flex items-center gap-2"
					>
						<FiDownload /> Export CSV
					</button>
				</div>
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-xl p-4">
					<div className="flex items-center gap-3">
						<FiXCircle className="text-red-500" />
						<p className="text-red-600">{error}</p>
					</div>
				</div>
			)}

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-5 gap-4">
				<div className="bg-white rounded-lg p-4 shadow-sm border">
					<p className="text-gray-500 text-sm">Total Orders</p>
					<p className="text-2xl font-bold text-gray-800">
						{stats.total}
					</p>
				</div>
				<div className="bg-white rounded-lg p-4 shadow-sm border">
					<p className="text-yellow-600 text-sm">Pending</p>
					<p className="text-2xl font-bold text-yellow-600">
						{stats.pending}
					</p>
				</div>
				<div className="bg-white rounded-lg p-4 shadow-sm border">
					<p className="text-green-600 text-sm">Completed</p>
					<p className="text-2xl font-bold text-green-600">
						{stats.completed}
					</p>
				</div>
				<div className="bg-white rounded-lg p-4 shadow-sm border">
					<p className="text-red-600 text-sm">Canceled</p>
					<p className="text-2xl font-bold text-red-600">
						{stats.canceled}
					</p>
				</div>
				<div className="bg-white rounded-lg p-4 shadow-sm border">
					<p className="text-momma-pink text-sm">Revenue</p>
					<p className="text-2xl font-bold text-momma-pink">
						KSh {stats.revenue.toLocaleString()}
					</p>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-col md:flex-row gap-4">
				<div className="flex-1 relative">
					<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search by Order ID or Customer ID..."
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

			{/* Orders Table */}
			{filteredOrders.length === 0 ? (
				<div className="bg-white rounded-xl shadow-sm p-12 text-center">
					<FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
					<p className="text-gray-500 text-lg">No orders found</p>
					{searchTerm && (
						<button
							onClick={() => setSearchTerm("")}
							className="btn-secondary mt-4"
						>
							Clear Search
						</button>
					)}
				</div>
			) : (
				<div className="bg-white rounded-xl shadow-sm overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-gray-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Order ID
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Customer
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Amount
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Date
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{filteredOrders.map((order) => (
									<tr
										key={order.id}
										className="hover:bg-gray-50"
									>
										<td className="px-6 py-4 text-sm font-medium text-gray-900">
											#{order.id}
										</td>
										<td className="px-6 py-4 text-sm text-gray-600">
											User #{order.user_id}
										</td>
										<td className="px-6 py-4 text-sm font-medium text-momma-pink">
											KSh{" "}
											{order.total_price?.toLocaleString()}
										</td>
										<td className="px-6 py-4">
											<select
												value={order.status}
												onChange={(e) =>
													updateOrderStatus(
														order.id,
														e.target.value,
													)
												}
												disabled={
													updatingStatus === order.id
												}
												className={`px-2 py-1 text-xs rounded-full border-0 ${getStatusBadge(order.status)}`}
											>
												<option value="pending">
													Pending
												</option>
												<option value="processing">
													Processing
												</option>
												<option value="completed">
													Completed
												</option>
												<option value="canceled">
													Canceled
												</option>
											</select>
										</td>
										<td className="px-6 py-4 text-sm text-gray-500">
											{new Date(
												order.created_at,
											).toLocaleDateString()}
										</td>
										<td className="px-6 py-4">
											<button
												onClick={() => {
													setSelectedOrder(order);
													setShowModal(true);
												}}
												className="text-momma-pink hover:text-momma-red"
											>
												<FiEye />
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>

					{/* Footer with summary */}
					<div className="bg-gray-50 px-6 py-4 border-t">
						<div className="flex justify-between items-center">
							<p className="text-sm text-gray-500">
								Showing {filteredOrders.length} of{" "}
								{orders.length} orders
							</p>
							<p className="text-sm text-gray-600">
								Total Revenue:{" "}
								<span className="font-semibold text-momma-pink">
									KSh {stats.revenue.toLocaleString()}
								</span>
							</p>
						</div>
					</div>
				</div>
			)}

			{/* Order Details Modal */}
			{showModal && selectedOrder && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
						<div className="flex justify-between items-center p-6 border-b">
							<h2 className="text-xl font-bold text-momma-brown">
								Order Details #{selectedOrder.id}
							</h2>
							<button
								onClick={() => setShowModal(false)}
								className="p-1 hover:bg-gray-100 rounded-lg"
							>
								<FiXCircle />
							</button>
						</div>
						<div className="p-6 space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div>
									<p className="text-gray-500 text-sm">
										Customer ID
									</p>
									<p className="font-medium">
										#{selectedOrder.user_id}
									</p>
								</div>
								<div>
									<p className="text-gray-500 text-sm">
										Order Date
									</p>
									<p className="font-medium">
										{new Date(
											selectedOrder.created_at,
										).toLocaleString()}
									</p>
								</div>
								<div>
									<p className="text-gray-500 text-sm">
										Total Amount
									</p>
									<p className="font-bold text-momma-pink text-xl">
										KSh{" "}
										{selectedOrder.total_price?.toLocaleString()}
									</p>
								</div>
								<div>
									<p className="text-gray-500 text-sm">
										Status
									</p>
									<span
										className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadge(selectedOrder.status)}`}
									>
										{selectedOrder.status}
									</span>
								</div>
							</div>

							<div>
								<h3 className="font-semibold text-momma-brown mb-3">
									Order Items
								</h3>
								<div className="space-y-2">
									{selectedOrder.items?.map((item, idx) => (
										<div
											key={idx}
											className="flex justify-between items-center border-b pb-2"
										>
											<div>
												<p className="font-medium">
													{item.name}
												</p>
												<p className="text-sm text-gray-500">
													Quantity: {item.quantity}
												</p>
											</div>
											<p className="font-medium">
												KSh{" "}
												{(
													item.price * item.quantity
												).toLocaleString()}
											</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}

export default Orders;
