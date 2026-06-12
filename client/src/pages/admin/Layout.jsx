import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
	FiGrid,
	FiPackage,
	FiShoppingCart,
	FiUsers,
	FiSettings,
	FiLogOut,
	FiMenu,
	FiX,
	FiBell,
	FiUser,
} from "react-icons/fi";

const Layout = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [sidebarOpen, setSidebarOpen] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			const userData = JSON.parse(storedUser);
			if (userData.role !== "admin") {
				navigate("/user-products");
			}
			setUser(userData);
		} else {
			navigate("/login");
		}
	}, [navigate]);

	const navItems = [
		{ path: "/admin", label: "Dashboard", icon: FiGrid },
		{ path: "/admin/products", label: "Products", icon: FiPackage },
		{ path: "/admin/orders", label: "Orders", icon: FiShoppingCart },
		{ path: "/admin/users", label: "Users", icon: FiUsers },
		{ path: "/admin/settings", label: "Settings", icon: FiSettings },
	];

	const handleLogout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("user");
		navigate("/login");
	};

	if (!user || user.role !== "admin") {
		return null;
	}

	return (
		<div className="min-h-screen bg-gray-100">
			{/* Sidebar */}
			<aside
				className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 bg-white shadow-xl ${
					sidebarOpen ? "w-64" : "w-20"
				}`}
			>
				{/* Logo */}
				<div className="flex items-center justify-between p-4 border-b">
					<div
						className={`flex items-center gap-2 ${!sidebarOpen && "justify-center w-full"}`}
					>
						<div className="w-8 h-8 bg-gradient-to-r from-momma-pink to-momma-orange rounded-lg flex items-center justify-center">
							<span className="text-white font-bold">MN</span>
						</div>
						{sidebarOpen && (
							<span className="font-bold text-momma-brown text-lg">
								Admin Panel
							</span>
						)}
					</div>
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className="p-1 rounded-lg hover:bg-gray-100"
					>
						{sidebarOpen ? <FiX /> : <FiMenu />}
					</button>
				</div>

				{/* Navigation */}
				<nav className="p-4 space-y-2">
					{navItems.map((item) => {
						const Icon = item.icon;
						const isActive = location.pathname === item.path;
						return (
							<Link
								key={item.path}
								to={item.path}
								className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
									isActive
										? "bg-momma-pink text-white"
										: "text-gray-700 hover:bg-gray-100"
								}`}
							>
								<Icon className="text-lg" />
								{sidebarOpen && <span>{item.label}</span>}
							</Link>
						);
					})}
				</nav>

				{/* User Info */}
				<div className="absolute bottom-0 left-0 right-0 p-4 border-t">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full bg-gradient-to-r from-momma-pink to-momma-orange flex items-center justify-center text-white font-bold">
							{user?.name?.charAt(0).toUpperCase()}
						</div>
						{sidebarOpen && (
							<div className="flex-1">
								<p className="font-medium text-momma-brown text-sm">
									{user?.name}
								</p>
								<p className="text-xs text-gray-500">
									Administrator
								</p>
							</div>
						)}
						<button
							onClick={handleLogout}
							className="p-2 rounded-lg hover:bg-red-50 text-red-500"
						>
							<FiLogOut />
						</button>
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<div
				className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}
			>
				{/* Top Bar */}
				<header className="bg-white shadow-sm sticky top-0 z-30">
					<div className="flex items-center justify-between px-6 py-4">
						<h1 className="text-xl font-semibold text-momma-brown">
							{navItems.find(
								(item) => item.path === location.pathname,
							)?.label || "Dashboard"}
						</h1>
						<div className="flex items-center gap-4">
							<button className="p-2 rounded-lg hover:bg-gray-100 relative">
								<FiBell />
								<span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
							</button>
							<div className="flex items-center gap-2">
								<FiUser className="text-gray-500" />
								<span className="text-sm text-gray-700">
									{user?.name}
								</span>
							</div>
						</div>
					</div>
				</header>

				{/* Page Content */}
				<main className="p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default Layout;
