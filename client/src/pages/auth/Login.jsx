import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import momma from "../../assets/mommanut.png";

const API_URL = "http://127.0.0.1:5000";

function Login() {
	const navigate = useNavigate();
	const [identifier, setIdentifier] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [token, setToken] = useState(localStorage.getItem("access_token"));
	const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

	const handleLogin = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		try {
			const response = await fetch(`${API_URL}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ identifier, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Invalid credentials");
				setLoading(false);
				return;
			}

			localStorage.setItem("access_token", data.create_token);
			localStorage.setItem("refresh_token", data.refresh_token);
			localStorage.setItem(
				"user",
				JSON.stringify({
					id: data.user.id,
					name: data.user.name,
					email: data.user.email,
					phone: data.user.phone,
					role: data.user.role,
				}),
			);

			window.dispatchEvent(new Event("storage"));

			setToken(data.create_token);
			setUser({ name: data.user.name, role: data.user.role });

			// Use alert as in original
			alert(`Welcome ${data.user.name}, you are logged in successfully.`);

			setTimeout(() => {
				navigate(
					data.user.role === "admin" ? "/admin" : "/user-products",
				);
			}, 100);
		} catch (error) {
			console.error("Login error:", error);
			setError("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (token && user) {
		return user.role === "admin" ? (
			<Navigate to="/admin" />
		) : (
			<Navigate to="/user-products" />
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl w-full">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="grid grid-cols-1 md:grid-cols-2">
						{/* Left Side - Image (from original) */}
						<div className="hidden md:flex bg-gradient-to-br from-momma-brown to-momma-orange items-center justify-center p-8">
							<div className="text-center">
								<img
									src={momma}
									alt="Momma Nut"
									className="w-48 h-48 object-contain mx-auto mb-4"
								/>
								<h2 className="text-white text-2xl font-bold mb-2">
									Welcome Back!
								</h2>
								<p className="text-white/80">
									Sign in to continue shopping
								</p>
							</div>
						</div>

						{/* Right Side - Form */}
						<div className="p-8">
							<div className="text-center mb-6">
								<h1 className="text-2xl font-bold text-momma-brown">
									Log in to your account
								</h1>
								<p className="text-gray-600 text-sm mt-1">
									Enter your credentials to access your
									account
								</p>
							</div>

							<form onSubmit={handleLogin} className="space-y-5">
								{/* Email/Phone Field */}
								<div>
									<label className="block text-gray-700 font-medium mb-1 text-sm">
										Email or Phone Number
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<FiMail className="text-gray-400" />
										</div>
										<input
											type="text"
											value={identifier}
											onChange={(e) =>
												setIdentifier(e.target.value)
											}
											className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
											placeholder="Enter email or phone..."
											required
											disabled={loading}
										/>
									</div>
								</div>

								{/* Password Field */}
								<div>
									<label className="block text-gray-700 font-medium mb-1 text-sm">
										Password
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<FiLock className="text-gray-400" />
										</div>
										<input
											type={
												showPassword
													? "text"
													: "password"
											}
											value={password}
											onChange={(e) =>
												setPassword(e.target.value)
											}
											className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
											placeholder="Enter password..."
											required
											disabled={loading}
										/>
										<button
											type="button"
											onClick={() =>
												setShowPassword(!showPassword)
											}
											className="absolute inset-y-0 right-0 pr-3 flex items-center"
										>
											{showPassword ? (
												<FiEyeOff className="text-gray-400 hover:text-gray-600" />
											) : (
												<FiEye className="text-gray-400 hover:text-gray-600" />
											)}
										</button>
									</div>
								</div>

								{/* Forgot Password Link */}
								<div className="text-right">
									<Link
										to="/forgot-password"
										className="text-sm text-momma-pink hover:text-momma-red"
									>
										Forgot Password?
									</Link>
								</div>

								{/* Error Message */}
								{error && (
									<div className="bg-red-50 border border-red-200 rounded-lg p-2">
										<p className="text-red-600 text-sm">
											{error}
										</p>
									</div>
								)}

								{/* Login Button */}
								<button
									type="submit"
									disabled={loading}
									className="w-full bg-momma-pink text-white py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
								>
									{loading ? (
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
									) : (
										<>
											<FiLogIn />
											Log In
										</>
									)}
								</button>

								{/* Sign Up Link */}
								<p className="text-center text-gray-600 text-sm">
									Don't have an account?{" "}
									<Link
										to="/signup"
										className="text-momma-pink hover:text-momma-red font-medium"
									>
										Sign up
									</Link>
								</p>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
