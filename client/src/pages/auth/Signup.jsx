import React, { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import {
	FiUser,
	FiMail,
	FiPhone,
	FiLock,
	FiEye,
	FiEyeOff,
	FiUserPlus,
} from "react-icons/fi";
import momma from "../../assets/mommanut.png";
import { authAPI } from "../../lib/config/api";

const API_URL = "http://127.0.0.1:5000";

function Signup() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
		confirm_password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [token, setToken] = useState(localStorage.getItem("access_token"));

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
		if (error) setError("");
	};

	const validateForm = () => {
		// Password match validation (from original)
		if (formData.password !== formData.confirm_password) {
			setError("Passwords do not match! Please try again.");
			return false;
		}

		// Password strength validation (from original)
		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
		if (!passwordRegex.test(formData.password)) {
			setError(
				"Password must be at least 8 characters long and contain both letters and numbers.",
			);
			return false;
		}

		// Email and phone presence (from original)
		if (!formData.email || !formData.phone) {
			setError("Please provide both an email and a phone number.");
			return false;
		}

		return true;
	};

	const handleSignup = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError("");

		if (!validateForm()) {
			setLoading(false);
			return;
		}

		try {
			const response = await authAPI.register({
				name: formData.name,
				email: formData.email,
				phone: formData.phone,
				password: formData.password,
				confirm_password: formData.confirm_password,
				role: "user",
			});

			const data = response.data;

			localStorage.setItem("access_token", data.create_token);
			localStorage.setItem("user", JSON.stringify(data.user));
			setToken(data.create_token);

			alert(
				`Welcome ${data.user.name}, your account has been created successfully.`,
			);
			navigate("/login");
		} catch (error) {
			console.error("Signup error:", error);
			const errorMsg =
				error.response?.data?.error ||
				"Network error. Please try again.";
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	if (token) {
		return <Navigate to="/login" />;
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl w-full">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="grid grid-cols-1 md:grid-cols-2">
						{/* Left Side - Image (from original) */}
						<div className="hidden md:flex bg-gradient-to-br from-momma-pink to-momma-orange items-center justify-center p-8">
							<div className="text-center">
								<img
									src={momma}
									alt="Momma Nut"
									className="w-48 h-48 object-contain mx-auto mb-4"
								/>
								<h2 className="text-white text-2xl font-bold mb-2">
									Join Us!
								</h2>
								<p className="text-white/80">
									Create an account to start shopping
								</p>
							</div>
						</div>

						{/* Right Side - Form */}
						<div className="p-8">
							<div className="text-center mb-6">
								<h1 className="text-2xl font-bold text-momma-brown">
									Create an Account
								</h1>
								<p className="text-gray-600 text-sm mt-1">
									Fill in your details to get started
								</p>
							</div>

							<form onSubmit={handleSignup} className="space-y-4">
								{/* Full Name */}
								<div>
									<label className="block text-gray-700 font-medium mb-1 text-sm">
										Full Name
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<FiUser className="text-gray-400" />
										</div>
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleChange}
											className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
											placeholder="Enter name..."
											required
											disabled={loading}
										/>
									</div>
								</div>

								{/* Email */}
								<div>
									<label className="block text-gray-700 font-medium mb-1 text-sm">
										Email Address
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<FiMail className="text-gray-400" />
										</div>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleChange}
											className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
											placeholder="Enter email..."
											required
											disabled={loading}
										/>
									</div>
								</div>

								{/* Phone */}
								<div>
									<label className="block text-gray-700 font-medium mb-1 text-sm">
										Phone Number
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<FiPhone className="text-gray-400" />
										</div>
										<input
											type="number"
											name="phone"
											value={formData.phone}
											onChange={handleChange}
											className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
											placeholder="Enter phone number..."
											required
											disabled={loading}
										/>
									</div>
								</div>

								{/* Password */}
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
											name="password"
											value={formData.password}
											onChange={handleChange}
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
												<FiEyeOff className="text-gray-400" />
											) : (
												<FiEye className="text-gray-400" />
											)}
										</button>
									</div>
									<p className="text-xs text-gray-500 mt-1">
										Minimum 8 characters with letters and
										numbers
									</p>
								</div>

								{/* Confirm Password */}
								<div>
									<label className="block text-gray-700 font-medium mb-1 text-sm">
										Confirm Password
									</label>
									<div className="relative">
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
											<FiLock className="text-gray-400" />
										</div>
										<input
											type={
												showConfirmPassword
													? "text"
													: "password"
											}
											name="confirm_password"
											value={formData.confirm_password}
											onChange={handleChange}
											className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
											placeholder="Confirm password..."
											required
											disabled={loading}
										/>
										<button
											type="button"
											onClick={() =>
												setShowConfirmPassword(
													!showConfirmPassword,
												)
											}
											className="absolute inset-y-0 right-0 pr-3 flex items-center"
										>
											{showConfirmPassword ? (
												<FiEyeOff className="text-gray-400" />
											) : (
												<FiEye className="text-gray-400" />
											)}
										</button>
									</div>
								</div>

								{/* Error Message */}
								{error && (
									<div className="bg-red-50 border border-red-200 rounded-lg p-2">
										<p className="text-red-600 text-sm">
											{error}
										</p>
									</div>
								)}

								{/* Signup Button */}
								<button
									type="submit"
									disabled={loading}
									className="w-full bg-momma-pink text-white py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
								>
									{loading ? (
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
									) : (
										<>
											<FiUserPlus />
											Sign Up
										</>
									)}
								</button>

								{/* Login Link */}
								<p className="text-center text-gray-600 text-sm">
									Already have an account?{" "}
									<Link
										to="/login"
										className="text-momma-pink hover:text-momma-red font-medium"
									>
										Log in
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

export default Signup;
