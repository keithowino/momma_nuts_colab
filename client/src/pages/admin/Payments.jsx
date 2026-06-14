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
	FiSearch,
	FiUser,
} from "react-icons/fi";
import { paymentAPI } from "../../lib/config/api";

const Payments = () => {
	const [payments, setPayments] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [stats, setStats] = useState({
		total: 0,
		completed: 0,
		failed: 0,
		totalAmount: 0,
		uniqueCustomers: 0,
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

			// paymentAPI.getAll() returns axios response - data is in response.data
			const response = await paymentAPI.getAll();
			const data = response.data;

			const paymentsArray = Array.isArray(data) ? data : [];
			setPayments(paymentsArray);

			// Calculate admin stats
			const completed = paymentsArray.filter(
				(p) => p.status === "Completed" || p.status === "completed",
			).length;
			const failed = paymentsArray.filter(
				(p) => p.status === "Failed" || p.status === "failed",
			).length;
			const totalAmount = paymentsArray.reduce(
				(sum, p) => sum + (p.amount || 0),
				0,
			);
			const uniqueCustomers = new Set(paymentsArray.map((p) => p.user_id))
				.size;

			setStats({
				total: paymentsArray.length,
				completed,
				failed,
				totalAmount,
				uniqueCustomers,
			});
			setError("");
		} catch (err) {
			console.error("Error fetching payments:", err);
			setError(
				err.response?.data?.error ||
					err.message ||
					"Failed to load payments",
			);
		} finally {
			setLoading(false);
		}
	};

	const exportToCSV = () => {
		const headers = [
			"Payment ID",
			"Order ID",
			"User ID",
			"Phone Number",
			"Amount",
			"Status",
			"Receipt Number",
			"Date",
		];
		const csvData = filteredPayments.map((p) => [
			p.id,
			p.order_id,
			p.user_id,
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
		a.download = `admin_payments_${new Date().toISOString().split("T")[0]}.csv`;
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

	const filteredPayments = payments.filter((payment) => {
		const matchesSearch =
			payment.id.toString().includes(searchTerm) ||
			payment.order_id?.toString().includes(searchTerm) ||
			payment.user_id?.toString().includes(searchTerm) ||
			payment.phone_number?.includes(searchTerm);

		const matchesStatus =
			statusFilter === "all" ||
			payment.status?.toLowerCase() === statusFilter.toLowerCase();

		return matchesSearch && matchesStatus;
	});

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
			<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
				<div>
					<h1 className="text-2xl font-bold text-momma-brown flex items-center gap-3">
						<FiCreditCard className="text-momma-pink" />
						Payment Management
					</h1>
					<p className="text-gray-600 text-sm mt-1">
						View and manage all customer transactions
					</p>
				</div>
				<div className="flex gap-3">
					<button
						onClick={fetchPayments}
						className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
					>
						<FiRefreshCw className="text-sm" />
						Refresh
					</button>
					{payments.length > 0 && (
						<button
							onClick={exportToCSV}
							className="btn-primary flex items-center gap-2 px-4 py-2 text-sm"
						>
							<FiDownload className="text-sm" />
							Export CSV
						</button>
					)}
				</div>
			</div>

			{/* Admin Stats Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
				<div className="bg-white rounded-xl shadow-sm p-4 border">
					<p className="text-gray-500 text-xs uppercase tracking-wide">
						Total Transactions
					</p>
					<p className="text-2xl font-bold text-momma-brown">
						{stats.total}
					</p>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-4 border">
					<p className="text-gray-500 text-xs uppercase tracking-wide">
						Completed
					</p>
					<p className="text-2xl font-bold text-green-600">
						{stats.completed}
					</p>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-4 border">
					<p className="text-gray-500 text-xs uppercase tracking-wide">
						Failed
					</p>
					<p className="text-2xl font-bold text-red-600">
						{stats.failed}
					</p>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-4 border">
					<p className="text-gray-500 text-xs uppercase tracking-wide">
						Total Revenue
					</p>
					<p className="text-2xl font-bold text-momma-pink">
						KSh {stats.totalAmount.toLocaleString()}
					</p>
				</div>

				<div className="bg-white rounded-xl shadow-sm p-4 border">
					<p className="text-gray-500 text-xs uppercase tracking-wide">
						Unique Customers
					</p>
					<p className="text-2xl font-bold text-momma-orange">
						{stats.uniqueCustomers}
					</p>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-col md:flex-row gap-4">
				<div className="flex-1 relative">
					<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
					<input
						type="text"
						placeholder="Search by Payment ID, Order ID, User ID, or Phone..."
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
					<option value="completed">Completed</option>
					<option value="failed">Failed</option>
					<option value="pending">Pending</option>
				</select>
			</div>

			{/* Error Message */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-xl p-4">
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
				</div>
			) : (
				payments.length > 0 && (
					<div className="bg-white rounded-xl shadow-sm overflow-hidden">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead className="bg-gray-50 border-b">
									<tr>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Payment ID
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Order ID
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											User ID
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Phone
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Amount
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Status
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Receipt
										</th>
										<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
											Date
										</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-200">
									{filteredPayments.map((payment) => (
										<tr
											key={payment.id}
											className="hover:bg-gray-50 transition-colors"
										>
											<td className="px-4 py-3 text-sm font-medium text-gray-900">
												#{payment.id}
											</td>
											<td className="px-4 py-3 text-sm text-gray-600">
												#{payment.order_id}
											</td>
											<td className="px-4 py-3 text-sm text-gray-600">
												#{payment.user_id}
											</td>
											<td className="px-4 py-3 text-sm text-gray-600">
												{payment.phone_number}
											</td>
											<td className="px-4 py-3 text-sm font-semibold text-momma-pink">
												KSh{" "}
												{payment.amount?.toLocaleString()}
											</td>
											<td className="px-4 py-3">
												<div className="flex items-center gap-2">
													{getStatusIcon(
														payment.status,
													)}
													<span
														className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getStatusBadge(payment.status)}`}
													>
														{payment.status}
													</span>
												</div>
											</td>
											<td className="px-4 py-3 text-sm font-mono text-gray-600">
												{payment.mpesa_receipt_number ||
													"—"}
											</td>
											<td className="px-4 py-3 text-sm text-gray-500">
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
						<div className="bg-gray-50 px-4 py-3 border-t">
							<div className="flex justify-between items-center text-sm">
								<p className="text-gray-500">
									Showing {filteredPayments.length} of{" "}
									{payments.length} payments
								</p>
								<p className="text-gray-600">
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
