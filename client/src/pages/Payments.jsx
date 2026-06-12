import React, { useEffect, useState } from "react";
import {
	FiCreditCard,
	FiSmartphone,
	FiCheckCircle,
	FiXCircle,
	FiClock,
	FiDownload,
	FiRefreshCw,
	FiAlertCircle,
} from "react-icons/fi";

const API_URL = "http://127.0.0.1:5000";

const Payments = () => {
	const [payments, setPayments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [stats, setStats] = useState({
		total: 0,
		completed: 0,
		failed: 0,
		totalAmount: 0,
	});

	useEffect(() => {
		fetchPayments();
	}, []);

	const fetchPayments = async () => {
		setLoading(true);
		try {
			const token = localStorage.getItem("access_token");
			if (!token) {
				setError("Please login to view payments");
				setLoading(false);
				return;
			}

			const response = await fetch(`${API_URL}/payments`, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error("Failed to fetch payments");
			}

			const data = await response.json();
			setPayments(Array.isArray(data) ? data : []);

			// Calculate stats
			const completed = data.filter(
				(p) => p.status === "Completed" || p.status === "completed",
			).length;
			const failed = data.filter(
				(p) => p.status === "Failed" || p.status === "failed",
			).length;
			const totalAmount = data.reduce(
				(sum, p) => sum + (p.amount || 0),
				0,
			);

			setStats({
				total: data.length,
				completed,
				failed,
				totalAmount,
			});
		} catch (err) {
			console.error("Error fetching payments:", err);
			setError(err.message || "Failed to load payments");
		} finally {
			setLoading(false);
		}
	};

	const exportToCSV = () => {
		const headers = [
			"Payment ID",
			"Order ID",
			"Phone Number",
			"Amount",
			"Status",
			"Receipt Number",
			"Date",
		];
		const csvData = payments.map((p) => [
			p.id,
			p.order_id,
			p.phone_number,
			p.amount,
			p.status,
			p.mpesa_receipt_number || "N/A",
			new Date(p.transaction_date).toLocaleString(),
		]);

		const csvContent = [headers, ...csvData]
			.map((row) => row.join(","))
			.join("\n");
		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `payments_${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const getStatusIcon = (status) => {
		const statusLower = status?.toLowerCase();
		if (statusLower === "completed")
			return <FiCheckCircle className="text-green-500" />;
		if (statusLower === "failed")
			return <FiXCircle className="text-red-500" />;
		return <FiClock className="text-yellow-500" />;
	};

	const getStatusBadge = (status) => {
		const statusLower = status?.toLowerCase();
		if (statusLower === "completed") return "bg-green-100 text-green-800";
		if (statusLower === "failed") return "bg-red-100 text-red-800";
		return "bg-yellow-100 text-yellow-800";
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
						<FiCreditCard className="text-momma-pink" />
						Payment History
					</h1>
					<p className="text-gray-600 mt-1">
						View all your M-Pesa transactions
					</p>
				</div>
				<div className="flex gap-3">
					<button
						onClick={fetchPayments}
						className="btn-secondary flex items-center gap-2 px-4 py-2"
					>
						<FiRefreshCw className="text-sm" />
						Refresh
					</button>
					{payments.length > 0 && (
						<button
							onClick={exportToCSV}
							className="btn-primary flex items-center gap-2 px-4 py-2"
						>
							<FiDownload className="text-sm" />
							Export CSV
						</button>
					)}
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
				<div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-500 text-sm">
								Total Transactions
							</p>
							<p className="text-2xl font-bold text-momma-brown">
								{stats.total}
							</p>
						</div>
						<div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center">
							<FiCreditCard className="text-momma-pink text-xl" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-500 text-sm">Completed</p>
							<p className="text-2xl font-bold text-green-600">
								{stats.completed}
							</p>
						</div>
						<div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
							<FiCheckCircle className="text-green-500 text-xl" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-500 text-sm">Failed</p>
							<p className="text-2xl font-bold text-red-600">
								{stats.failed}
							</p>
						</div>
						<div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
							<FiXCircle className="text-red-500 text-xl" />
						</div>
					</div>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-gray-500 text-sm">Total Spent</p>
							<p className="text-2xl font-bold text-momma-pink">
								KSh {stats.totalAmount.toLocaleString()}
							</p>
						</div>
						<div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
							<FiSmartphone className="text-momma-orange text-xl" />
						</div>
					</div>
				</div>
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
					<div className="flex items-center gap-3">
						<FiAlertCircle className="text-red-500 text-xl" />
						<p className="text-red-600">{error}</p>
					</div>
				</div>
			)}

			{/* Payments Table */}
			{!error && payments.length === 0 ? (
				<div className="bg-white rounded-xl shadow-sm p-12 text-center">
					<FiCreditCard className="text-6xl text-gray-300 mx-auto mb-4" />
					<p className="text-gray-500 text-lg">No payments found</p>
					<p className="text-gray-400 text-sm mt-1">
						Complete a purchase to see your payment history
					</p>
					<button
						onClick={() =>
							(window.location.href = "/user-products")
						}
						className="btn-primary mt-6 inline-flex items-center gap-2"
					>
						Start Shopping
					</button>
				</div>
			) : (
				payments.length > 0 && (
					<div className="bg-white rounded-xl shadow-sm overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50 border-b">
									<tr>
										<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Payment ID
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Order ID
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Phone Number
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Amount
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Status
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Receipt
										</th>
										<th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
											Date
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{payments.map((payment) => (
										<tr
											key={payment.id}
											className="hover:bg-gray-50 transition-colors"
										>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
												#{payment.id}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
												#{payment.order_id}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
												{payment.phone_number}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className="text-sm font-semibold text-momma-pink">
													KSh{" "}
													{payment.amount?.toLocaleString()}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center gap-2">
													{getStatusIcon(
														payment.status,
													)}
													<span
														className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(payment.status)}`}
													>
														{payment.status}
													</span>
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
												{payment.mpesa_receipt_number ||
													"—"}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(
													payment.transaction_date,
												).toLocaleDateString()}
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
									Showing {payments.length} payment
									{payments.length !== 1 ? "s" : ""}
								</p>
								<p className="text-sm text-gray-600">
									Total:{" "}
									<span className="font-semibold text-momma-pink">
										KSh {stats.totalAmount.toLocaleString()}
									</span>
								</p>
							</div>
						</div>
					</div>
				)
			)}
		</div>
	);
};

export default Payments;
