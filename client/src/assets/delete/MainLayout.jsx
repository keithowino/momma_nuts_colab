import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
	FiShoppingCart,
	FiUser,
	FiHome,
	FiPackage,
	FiLogOut,
} from "react-icons/fi";

const MainLayout = ({ children }) => {
	const location = useLocation();
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const navItems = [
		{ path: "/", label: "Home", icon: FiHome },
		{ path: "/user-products", label: "Shop", icon: FiPackage },
		{ path: "/cart", label: "Cart", icon: FiShoppingCart },
		{ path: "/profile", label: "Profile", icon: FiUser },
	];

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Navbar */}
			<nav className="bg-white shadow-md sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo */}
						<Link
							to="/"
							className="text-2xl font-bold text-momma-brown"
						>
							Momma<span className="text-momma-pink">Nuts</span>
						</Link>

						{/* Desktop Navigation */}
						<div className="hidden md:flex space-x-8">
							{navItems.map((item) => {
								const Icon = item.icon;
								return (
									<Link
										key={item.path}
										to={item.path}
										className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
											location.pathname === item.path
												? "text-momma-pink bg-pink-50"
												: "text-gray-700 hover:text-momma-pink hover:bg-gray-100"
										}`}
									>
										<Icon className="text-lg" />
										<span>{item.label}</span>
									</Link>
								);
							})}
							<Link
								to="/logout"
								className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
							>
								<FiLogOut />
								<span>Logout</span>
							</Link>
						</div>

						{/* Mobile menu button */}
						<button
							onClick={() => setIsMenuOpen(!isMenuOpen)}
							className="md:hidden p-2 rounded-lg hover:bg-gray-100"
						>
							<svg
								className="w-6 h-6"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								{isMenuOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								)}
							</svg>
						</button>
					</div>
				</div>

				{/* Mobile Navigation */}
				{isMenuOpen && (
					<div className="md:hidden bg-white border-t">
						<div className="px-2 pt-2 pb-3 space-y-1">
							{navItems.map((item) => {
								const Icon = item.icon;
								return (
									<Link
										key={item.path}
										to={item.path}
										onClick={() => setIsMenuOpen(false)}
										className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
											location.pathname === item.path
												? "text-momma-pink bg-pink-50"
												: "text-gray-700 hover:text-momma-pink hover:bg-gray-100"
										}`}
									>
										<Icon />
										<span>{item.label}</span>
									</Link>
								);
							})}
							<Link
								to="/logout"
								onClick={() => setIsMenuOpen(false)}
								className="flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
							>
								<FiLogOut />
								<span>Logout</span>
							</Link>
						</div>
					</div>
				)}
			</nav>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{children}
			</main>

			{/* Footer */}
			<footer className="bg-momma-brown text-white mt-16">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					<div className="text-center">
						<p>&copy; 2024 Momma Nuts. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
};

export default MainLayout;
