import React, { useState, useEffect } from "react";
import {
	FiPackage,
	FiShoppingCart,
	FiUsers,
	FiDollarSign,
	FiTrendingUp,
	FiTrendingDown,
} from "react-icons/fi";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import { orderAPI, productAPI, userAPI } from "../../lib/config/api";

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color }) => (
	<div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
		<div className="flex items-center justify-between">
			<div>
				<p className="text-gray-500 text-sm mb-1">{title}</p>
				<p className="text-2xl font-bold text-gray-800">{value}</p>
				{trend && (
					<div className="flex items-center gap-1 mt-2">
						{trend === "up" ? (
							<FiTrendingUp className="text-green-500 text-sm" />
						) : (
							<FiTrendingDown className="text-red-500 text-sm" />
						)}
						<span
							className={`text-xs ${trend === "up" ? "text-green-600" : "text-red-600"}`}
						>
							{trendValue}
						</span>
					</div>
				)}
			</div>
			<div
				className={`w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center`}
			>
				<Icon className={`text-${color}-500 text-xl`} />
			</div>
		</div>
	</div>
);

function Dashboard() {
	const [stats, setStats] = useState({
		products: 0,
		orders: 0,
		users: 0,
		revenue: 0,
	});
	const [recentOrders, setRecentOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	// Sample data for charts
	const salesData = [
		{ month: "Jan", sales: 4000 },
		{ month: "Feb", sales: 3000 },
		{ month: "Mar", sales: 5000 },
		{ month: "Apr", sales: 7000 },
		{ month: "May", sales: 6000 },
		{ month: "Jun", sales: 8000 },
	];

	const orderStatusData = [
		{ name: "Completed", value: stats.completed || 0, color: "#10B981" },
		{ name: "Pending", value: stats.pending || 0, color: "#F59E0B" },
		{ name: "Canceled", value: stats.canceled || 0, color: "#EF4444" },
	];

	useEffect(() => {
		fetchDashboardData();
	}, []);

	const fetchDashboardData = async () => {
		try {
			// Fetch all data in parallel
			const [productsRes, ordersRes, usersRes] = await Promise.all([
				productAPI.getAll(),
				orderAPI.getAll(),
				userAPI.getAll(),
			]);

			// Axios returns data in response.data
			const products = productsRes.data;
			const orders = ordersRes.data;
			const users = usersRes.data;

			const totalRevenue = Array.isArray(orders)
				? orders.reduce(
						(sum, order) => sum + (order.total_price || 0),
						0,
					)
				: 0;

			// Calculate order status counts
			const completed = Array.isArray(orders)
				? orders.filter((o) => o.status === "completed").length
				: 0;
			const pending = Array.isArray(orders)
				? orders.filter((o) => o.status === "pending").length
				: 0;
			const canceled = Array.isArray(orders)
				? orders.filter((o) => o.status === "canceled").length
				: 0;

			setStats({
				products: Array.isArray(products) ? products.length : 0,
				orders: Array.isArray(orders) ? orders.length : 0,
				users: Array.isArray(users) ? users.length : 0,
				revenue: totalRevenue,
				completed,
				pending,
				canceled,
			});

			setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
		} finally {
			setLoading(false);
		}
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
			{/* Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				<StatCard
					title="Total Products"
					value={stats.products}
					icon={FiPackage}
					color="pink"
				/>
				<StatCard
					title="Total Orders"
					value={stats.orders}
					icon={FiShoppingCart}
					trend="up"
					trendValue="+12%"
					color="orange"
				/>
				<StatCard
					title="Total Customers"
					value={stats.users}
					icon={FiUsers}
					color="blue"
				/>
				<StatCard
					title="Total Revenue"
					value={`KSh ${stats.revenue.toLocaleString()}`}
					icon={FiDollarSign}
					trend="up"
					trendValue="+8%"
					color="green"
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Sales Trend Chart */}
				<div className="bg-white rounded-xl shadow-sm p-6">
					<h3 className="text-lg font-semibold text-momma-brown mb-4">
						Sales Trend
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<LineChart data={salesData}>
							<CartesianGrid strokeDasharray="3 3" />
							<XAxis dataKey="month" />
							<YAxis />
							<Tooltip />
							<Legend />
							<Line
								type="monotone"
								dataKey="sales"
								stroke="#FF3CB0"
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</div>

				{/* Order Status Distribution */}
				<div className="bg-white rounded-xl shadow-sm p-6">
					<h3 className="text-lg font-semibold text-momma-brown mb-4">
						Order Status
					</h3>
					<ResponsiveContainer width="100%" height={300}>
						<PieChart>
							<Pie
								data={orderStatusData}
								cx="50%"
								cy="50%"
								labelLine={false}
								label={({ name, percent }) =>
									`${name}: ${(percent * 100).toFixed(0)}%`
								}
								outerRadius={80}
								fill="#8884d8"
								dataKey="value"
							>
								{orderStatusData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={entry.color}
									/>
								))}
							</Pie>
							<Tooltip />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* Recent Orders */}
			<div className="bg-white rounded-xl shadow-sm">
				<div className="p-6 border-b">
					<h2 className="text-lg font-semibold text-momma-brown">
						Recent Orders
					</h2>
				</div>
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
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{recentOrders.map((order) => (
								<tr key={order.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 text-sm font-medium text-gray-900">
										#{order.id}
									</td>
									<td className="px-6 py-4 text-sm text-gray-600">
										User #{order.user_id}
									</td>
									<td className="px-6 py-4 text-sm text-gray-600">
										KSh{" "}
										{order.total_price?.toLocaleString()}
									</td>
									<td className="px-6 py-4">
										<span
											className={`px-2 py-1 text-xs rounded-full ${
												order.status === "completed"
													? "bg-green-100 text-green-800"
													: order.status === "pending"
														? "bg-yellow-100 text-yellow-800"
														: "bg-red-100 text-red-800"
											}`}
										>
											{order.status}
										</span>
									</td>
								</tr>
							))}
							{recentOrders.length === 0 && (
								<tr>
									<td
										colSpan="4"
										className="px-6 py-8 text-center text-gray-500"
									>
										No orders found
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
