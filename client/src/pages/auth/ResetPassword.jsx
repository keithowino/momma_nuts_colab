import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
	FiLock,
	FiEye,
	FiEyeOff,
	FiCheckCircle,
	FiArrowLeft,
} from "react-icons/fi";
import momma from "../../assets/mommanut.png";

const API_URL = "http://127.0.0.1:5000";

function ResetPassword() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	const [loading, setLoading] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const validatePassword = () => {
		if (newPassword !== confirmPassword) {
			setError("Passwords do not match");
			return false;
		}

		const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
		if (!passwordRegex.test(newPassword)) {
			setError(
				"Password must be at least 8 characters long and contain both letters and numbers",
			);
			return false;
		}

		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		setError("");

		if (!validatePassword()) {
			setLoading(false);
			return;
		}

		try {
			const response = await authAPI.resetPassword({
				token,
				new_password: newPassword,
				confirm_password: confirmPassword,
			});

			const data = response.data;
			setMessage(data.message || "Password reset successfully!");

			// Redirect to login after 3 seconds
			setTimeout(() => navigate("/login"), 3000);
		} catch (err) {
			console.error("Reset password error:", err);
			const errorMsg =
				err.response?.data?.error || "Server error. Please try again.";
			setError(errorMsg);
		} finally {
			setLoading(false);
		}
	};

	if (!token) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
				<div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
					<div className="text-red-600 mb-4">
						<FiLock className="text-6xl mx-auto" />
					</div>
					<h2 className="text-2xl font-bold text-momma-brown mb-2">
						Invalid Reset Link
					</h2>
					<p className="text-gray-600 mb-6">
						The password reset token is missing or invalid.
					</p>
					<Link
						to="/forgot-password"
						className="btn-primary inline-block"
					>
						Request New Reset Link
					</Link>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl w-full">
				<div className="bg-white rounded-2xl shadow-xl overflow-hidden">
					<div className="grid grid-cols-1 md:grid-cols-2">
						{/* Left Side - Image */}
						<div className="hidden md:flex bg-gradient-to-br from-momma-pink to-momma-orange items-center justify-center p-8">
							<div className="text-center">
								<img
									src={momma}
									alt="Momma Nut"
									className="w-48 h-48 object-contain mx-auto mb-4"
								/>
								<h2 className="text-white text-2xl font-bold mb-2">
									Create New Password
								</h2>
								<p className="text-white/80">
									Choose a strong password
								</p>
							</div>
						</div>

						{/* Right Side - Form */}
						<div className="p-8">
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
									Enter your new password below
								</p>
							</div>

							<form onSubmit={handleSubmit} className="space-y-5">
								{/* New Password */}
								<div>
									<label className="block text-gray-700 font-medium mb-1 text-sm">
										New Password
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
											value={newPassword}
											onChange={(e) =>
												setNewPassword(e.target.value)
											}
											className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
											placeholder="Enter new password"
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
										Confirm New Password
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
											value={confirmPassword}
											onChange={(e) =>
												setConfirmPassword(
													e.target.value,
												)
											}
											className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
											placeholder="Confirm new password"
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

								{/* Success Message */}
								{message && (
									<div className="bg-green-50 border border-green-200 rounded-lg p-3">
										<div className="flex items-center gap-2">
											<FiCheckCircle className="text-green-500" />
											<p className="text-green-600 text-sm">
												{message}
											</p>
										</div>
										<p className="text-green-600 text-xs mt-1">
											Redirecting to login...
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
											<FiCheckCircle />
											Reset Password
										</>
									)}
								</button>

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

export default ResetPassword;
