import React, { useState, useEffect } from "react";
import {
	FiUser,
	FiMail,
	FiPhone,
	FiShield,
	FiShieldOff,
	FiTrash2,
	FiSearch,
	FiDownload,
} from "react-icons/fi";
import { userAPI } from "../../lib/config/api";

const API_URL = "http://127.0.0.1:5000";

function Users() {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);
	const [updatingUserId, setUpdatingUserId] = useState(null);
	const [deletingUserId, setDeletingUserId] = useState(null);

	useEffect(() => {
		fetchUsers();
	}, []);

	const fetchUsers = async () => {
		try {
			const response = await userAPI.getAll();
			const data = response.data; // ← FIX: use response.data, not response.json()
			setUsers(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	// const toggleUserRole = async (userId, currentRole) => {
	// 	const token = localStorage.getItem("access_token");
	// 	const newRole = currentRole === "admin" ? "user" : "admin";

	// 	try {
	// 		const response = await fetch(`${API_URL}/users/${userId}`, {
	// 			method: "PATCH",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Authorization: `Bearer ${token}`,
	// 			},
	// 			body: JSON.stringify({ role: newRole }),
	// 		});

	// 		if (response.ok) {
	// 			fetchUsers();
	// 			alert(`User role updated to ${newRole}`);
	// 		}
	// 	} catch (error) {
	// 		console.error("Error updating user role:", error);
	// 	}
	// };

	// const deleteUser = async (userId) => {
	// 	if (!window.confirm("Are you sure you want to delete this user?"))
	// 		return;

	// 	const token = localStorage.getItem("access_token");
	// 	try {
	// 		const response = await fetch(`${API_URL}/delete`, {
	// 			method: "DELETE",
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Authorization: `Bearer ${token}`,
	// 			},
	// 			body: JSON.stringify({ user_id: userId }),
	// 		});

	// 		if (response.ok) {
	// 			fetchUsers();
	// 			alert("User deleted successfully");
	// 		}
	// 	} catch (error) {
	// 		console.error("Error deleting user:", error);
	// 	}
	// };

	const toggleUserRole = async (userId, currentRole) => {
		const newRole = currentRole === "admin" ? "user" : "admin";
		setUpdatingUserId(userId);

		try {
			await userAPI.updateRole(userId, newRole);
			await fetchUsers(); // Refresh the list
			alert(`User role updated to ${newRole}`);
		} catch (error) {
			console.error("Error updating user role:", error);
			alert(error.response?.data?.error || "Failed to update user role");
		} finally {
			setUpdatingUserId(null);
		}
	};

	const deleteUser = async (userId) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this user? This action cannot be undone!",
			)
		)
			return;

		setDeletingUserId(userId);
		try {
			await userAPI.deleteAccount(userId);
			await fetchUsers(); // Refresh the list
			alert("User deleted successfully");
		} catch (error) {
			console.error("Error deleting user:", error);
			alert(error.response?.data?.error || "Failed to delete user");
		} finally {
			setDeletingUserId(null);
		}
	};

	const exportToCSV = () => {
		const headers = ["ID", "Name", "Email", "Phone", "Role", "Status"];
		const csvData = filteredUsers.map((user) => [
			user.id,
			user.name,
			user.email,
			user.phone,
			user.role,
			user.is_active !== false ? "Active" : "Inactive",
		]);

		const csvContent = [headers, ...csvData]
			.map((row) => row.join(","))
			.join("\n");
		const blob = new Blob([csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};

	const filteredUsers = users.filter(
		(user) =>
			user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
			user.phone?.includes(searchTerm),
	);

	const stats = {
		total: users.length,
		admins: users.filter((u) => u.role === "admin").length,
		customers: users.filter((u) => u.role === "user").length,
		active: users.filter((u) => u.is_active !== false).length,
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
					User Management
				</h1>
				<div className="flex gap-2">
					<button
						onClick={fetchUsers}
						className="btn-secondary flex items-center gap-2"
					>
						Refresh
					</button>
					<button
						onClick={exportToCSV}
						className="btn-primary flex items-center gap-2"
					>
						<FiDownload /> Export CSV
					</button>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-white rounded-lg p-4 shadow-sm border">
					<p className="text-gray-500 text-sm">Total Users</p>
					<p className="text-2xl font-bold text-gray-800">
						{stats.total}
					</p>
				</div>
				<div className="bg-white rounded-lg p-4 shadow-sm border">
					<p className="text-momma-pink text-sm">Admins</p>
					<p className="text-2xl font-bold text-momma-pink">
						{stats.admins}
					</p>
				</div>
				<div className="bg-white rounded-lg p-4 shadow-sm border">
					<p className="text-blue-600 text-sm">Customers</p>
					<p className="text-2xl font-bold text-blue-600">
						{stats.customers}
					</p>
				</div>
				<div className="bg-white rounded-lg p-4 shadow-sm border">
					<p className="text-green-600 text-sm">Active</p>
					<p className="text-2xl font-bold text-green-600">
						{stats.active}
					</p>
				</div>
			</div>

			{/* Search */}
			<div className="relative">
				<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					placeholder="Search by name, email, or phone..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
				/>
			</div>

			{/* Users Table */}
			<div className="bg-white rounded-xl shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									ID
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Email
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Phone
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Role
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{filteredUsers.map((user) => (
								<tr key={user.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 text-sm text-gray-900">
										#{user.id}
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-2">
											<div className="w-8 h-8 rounded-full bg-gradient-to-r from-momma-pink to-momma-orange flex items-center justify-center text-white font-bold text-sm">
												{user.name
													?.charAt(0)
													.toUpperCase()}
											</div>
											<span className="font-medium text-gray-900">
												{user.name}
											</span>
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-gray-600">
										{user.email}
									</td>
									<td className="px-6 py-4 text-sm text-gray-600">
										{user.phone}
									</td>
									<td className="px-6 py-4">
										<span
											className={`px-2 py-1 text-xs rounded-full ${
												user.role === "admin"
													? "bg-purple-100 text-purple-800"
													: "bg-blue-100 text-blue-800"
											}`}
										>
											{user.role}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex gap-2">
											<button
												onClick={() =>
													toggleUserRole(
														user.id,
														user.role,
													)
												}
												className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
												title={
													user.role === "admin"
														? "Remove admin"
														: "Make admin"
												}
											>
												{user.role === "admin" ? (
													<FiShieldOff />
												) : (
													<FiShield />
												)}
											</button>
											<button
												onClick={() =>
													deleteUser(user.id)
												}
												className="p-1 text-red-600 hover:bg-red-50 rounded"
												title="Delete user"
											>
												<FiTrash2 />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}

export default Users;
