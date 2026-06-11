import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCommon } from "../../lib/context/CommonContext";
import { FiLogOut } from "react-icons/fi";

const Header = () => {
	const { isMenuOpen, setIsMenuOpen, navItems } = useCommon();

	const location = useLocation();

	return (
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
	);
};

export default Header;
