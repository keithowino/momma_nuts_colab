import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCommon } from "../../lib/context/CommonContext";
import { FiLogOut, FiUser, FiChevronDown, FiLogIn } from "react-icons/fi";

const Header = () => {
	const { isMenuOpen, setIsMenuOpen, navItems, profileMenuItems } =
		useCommon();
	const location = useLocation();
	const navigate = useNavigate();
	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [user, setUser] = useState(null);

	// Get user from localStorage
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
	}, []);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (isProfileOpen && !event.target.closest(".profile-dropdown")) {
				setIsProfileOpen(false);
			}
		};
		document.addEventListener("click", handleClickOutside);
		return () => document.removeEventListener("click", handleClickOutside);
	}, [isProfileOpen]);

	const handleLogout = () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("user");
		window.dispatchEvent(new Event("storage"));
		navigate("/login");
	};

	const handleNavigate = (path) => {
		navigate(path);
	};

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
					<div className="hidden md:flex items-center space-x-8">
						{navItems.map((item) => {
							const Icon = item.icon;
							// Don't show Profile in navItems since we have dropdown
							if (item.label === "Profile") return null;
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

						{/* Profile Dropdown */}
						<div className="relative profile-dropdown">
							<button
								onClick={() => setIsProfileOpen(!isProfileOpen)}
								className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
									isProfileOpen
										? "text-momma-pink bg-pink-50"
										: "text-gray-700 hover:text-momma-pink hover:bg-gray-100"
								}`}
							>
								<FiUser className="text-lg" />
								<div
									className={`${user ? "w-8 h-8 rounded-full bg-gradient-to-r from-momma-pink to-momma-orange flex items-center justify-center text-white font-semibold" : ""}`}
								>
									{user
										? user.name.charAt(0).toUpperCase()
										: ""}
								</div>
								<FiChevronDown
									className={`text-sm transition-transform duration-200 ${
										isProfileOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							{/* Dropdown Menu */}
							{isProfileOpen && (
								<div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-fade-in">
									{user && (
										<>
											{/* User Info */}
											<div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
												<p className="font-semibold text-momma-brown text-sm">
													{user.name}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													{user.email}
												</p>
											</div>

											{/* Menu Items */}
											{profileMenuItems.map((item) => {
												const Icon = item.icon;
												return (
													<Link
														key={item.path}
														to={item.path}
														onClick={() =>
															setIsProfileOpen(
																false,
															)
														}
														className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-momma-pink transition-colors"
													>
														<Icon className="text-lg" />
														<span>
															{item.label}
														</span>
													</Link>
												);
											})}
										</>
									)}

									{/* Divider */}
									<div className="border-t border-gray-100"></div>

									{user ? (
										<>
											<button
												onClick={handleLogout}
												className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
											>
												<FiLogOut className="text-lg" />
												<span>Logout</span>
											</button>
										</>
									) : (
										<>
											<button
												onClick={() => {
													handleNavigate("/login");
												}}
												className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
											>
												<FiLogIn className="text-lg" />
												<span>Login</span>
											</button>
										</>
									)}
								</div>
							)}
						</div>
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
							if (item.label === "Profile") return null;
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

						{/* Mobile Profile Section */}
						<div className="border-t border-gray-200 pt-2 mt-2">
							{user && (
								<>
									<div className="px-3 py-2 text-sm text-gray-500">
										Logged in as{" "}
										<span className="font-medium text-momma-brown">
											{user.name}
										</span>
									</div>

									{profileMenuItems.map((item) => {
										const Icon = item.icon;
										return (
											<Link
												key={item.path}
												to={item.path}
												onClick={() =>
													setIsMenuOpen(false)
												}
												className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:text-momma-pink hover:bg-gray-100"
											>
												<Icon />
												<span>{item.label}</span>
											</Link>
										);
									})}
								</>
							)}

							{user ? (
								<>
									<button
										onClick={() => {
											setIsMenuOpen(false);
											handleLogout();
										}}
										className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50"
									>
										<FiLogOut />
										<span>Logout</span>
									</button>
								</>
							) : (
								<>
									<button
										onClick={() => {
											setIsMenuOpen(false);
											handleNavigate("/login");
										}}
										className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
									>
										<FiLogIn className="text-lg" />
										<span>Login</span>
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Add animation CSS */}
			<style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
		</nav>
	);
};

export default Header;
