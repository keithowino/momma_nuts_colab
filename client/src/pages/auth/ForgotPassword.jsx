import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiArrowLeft, FiSend } from "react-icons/fi";
import momma from "../../assets/mommanut.png";

const API_URL = "http://127.0.0.1:5000";

function ForgotPassword() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		setError("");

		try {
			const response = await fetch(`${API_URL}/forgot-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			const data = await response.json();

			if (!response.ok) {
				setError(data.error || "Something went wrong");
			} else {
				setMessage(
					data.message || "Password reset link sent to your email!",
				);
				setEmail(""); // Clear email on success
			}
		} catch (err) {
			setError("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl w-full">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="grid grid-cols-1 md:grid-cols-2">
						{/* Left Side - Image */}
						<div className="hidden md:flex bg-gradient-to-br from-momma-brown to-momma-orange items-center justify-center p-8">
							<div className="text-center">
								<img
									src={momma}
									alt="Momma Nut"
									className="w-48 h-48 object-contain mx-auto mb-4"
								/>
								<h2 className="text-white text-2xl font-bold mb-2">
									Forgot Password?
								</h2>
								<p className="text-white/80">
									We'll help you reset it
								</p>
							</div>
						</div>

						{/* Right Side - Form */}
						<div className="p-8">
							{/* Back to Login */}
							<button
								onClick={() => navigate("/login")}
								className="flex items-center gap-2 text-momma-brown hover:text-momma-pink transition-colors mb-6"
							>
								<FiArrowLeft />
								Back to Login
							</button>

							<div className="text-center mb-6">
								<h1 className="text-2xl font-bold text-momma-brown">
									Reset Password
								</h1>
								<p className="text-gray-600 text-sm mt-1">
									Enter your email and we'll send you a reset
									link
								</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-5">
								{/* Email Field */}
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
											value={email}
											onChange={(e) =>
												setEmail(e.target.value)
											}
											className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
											placeholder="Enter your email address"
											required
											disabled={loading}
										/>
									</div>
								</div>

								{/* Success Message */}
								{message && (
									<div className="bg-green-50 border border-green-200 rounded-lg p-3">
										<p className="text-green-600 text-sm">
											{message}
										</p>
									</div>
								)}

								{/* Error Message */}
								{error && (
									<div className="bg-red-50 border border-red-200 rounded-lg p-3">
										<p className="text-red-600 text-sm">
											{error}
										</p>
									</div>
								)}

								{/* Submit Button */}
								<button
									type="submit"
									disabled={loading}
									className="w-full bg-momma-pink text-white py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
								>
									{loading ? (
										<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
									) : (
										<>
											<FiSend />
											Send Reset Link
										</>
									)}
								</button>

								{/* Login Link */}
								<p className="text-center text-gray-600 text-sm">
									Remember your password?{" "}
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

export default ForgotPassword;
