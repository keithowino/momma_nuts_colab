import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	FiUser,
	FiMail,
	FiPhone,
	FiLock,
	FiSave,
	FiTrash2,
	FiArrowLeft,
} from "react-icons/fi";
import { userAPI } from "../lib/config/api";

function Profile() {
	const navigate = useNavigate();
	const [user, setUser] = useState({
		name: "",
		email: "",
		phone: "",
		id: "",
	});
	const [currentPassword, setCurrentPassword] = useState("");
	const [newName, setNewName] = useState("");
	const [newEmail, setNewEmail] = useState("");
	const [newPhone, setNewPhone] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		const loggedInUser = JSON.parse(localStorage.getItem("user"));
		if (loggedInUser) {
			setUser(loggedInUser);
			setNewName(loggedInUser.name);
			setNewEmail(loggedInUser.email);
			setNewPhone(loggedInUser.phone);
		}
	}, []);

	const handleUpdate = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");
		setError("");

		if (!user.id) {
			setError("User ID is missing. Please log in again.");
			setLoading(false);
			return;
		}

		const requestBody = {
			name: newName,
			email: newEmail,
			phone: newPhone,
		};

		if (newPassword.trim()) {
			if (!currentPassword) {
				setError("Current password is required to set a new password");
				setLoading(false);
				return;
			}
			requestBody.current_password = currentPassword;
			requestBody.new_password = newPassword;
		}

		try {
			await userAPI.updateProfile(requestBody);

			// Update localStorage with new user data
			localStorage.setItem(
				"user",
				JSON.stringify({
					...user,
					name: newName,
					email: newEmail,
					phone: newPhone,
				}),
			);

			setMessage("Profile updated successfully!");
			setCurrentPassword("");
			setNewPassword("");
			setUser({
				...user,
				name: newName,
				email: newEmail,
				phone: newPhone,
			});

			setTimeout(() => {
				window.location.reload();
			}, 1000);
		} catch (err) {
			console.error("Update error:", err);
			setError(
				err.response?.data?.error ||
					"Something went wrong. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async () => {
		if (
			!window.confirm(
				"Are you sure you want to delete your account? This action cannot be undone!",
			)
		) {
			return;
		}

		setLoading(true);
		try {
			await userAPI.deleteAccount();
			alert("Account deleted successfully!");
			localStorage.removeItem("user");
			localStorage.removeItem("access_token");
			localStorage.removeItem("refresh_token");
			navigate("/login");
		} catch (error) {
			console.error("Delete error:", error);
			alert(
				error.response?.data?.error ||
					"Something went wrong. Please try again.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-4xl mx-auto px-4 py-8">
			<div className="flex items-center gap-4 mb-8">
				<button
					onClick={() => navigate(-1)}
					className="p-2 rounded-full hover:bg-gray-100 transition-colors"
				>
					<FiArrowLeft className="text-xl text-momma-brown" />
				</button>
				<h1 className="text-3xl font-bold text-momma-brown flex items-center gap-3">
					<FiUser className="text-momma-pink" />
					My Profile
				</h1>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<div className="lg:col-span-2">
					<div className="bg-white rounded-2xl shadow-lg p-6">
						<h2 className="text-xl font-semibold text-momma-brown mb-6">
							Edit Profile Information
						</h2>

						<form onSubmit={handleUpdate} className="space-y-5">
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
										value={newName}
										onChange={(e) =>
											setNewName(e.target.value)
										}
										className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
										placeholder="Your name"
										required
										disabled={loading}
									/>
								</div>
							</div>

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
										value={newEmail}
										onChange={(e) =>
											setNewEmail(e.target.value)
										}
										className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
										placeholder="Your email"
										required
										disabled={loading}
									/>
								</div>
							</div>

							<div>
								<label className="block text-gray-700 font-medium mb-1 text-sm">
									Phone Number
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FiPhone className="text-gray-400" />
									</div>
									<input
										type="tel"
										value={newPhone}
										onChange={(e) =>
											setNewPhone(e.target.value)
										}
										className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
										placeholder="Your phone number"
										required
										disabled={loading}
									/>
								</div>
							</div>

							<div className="border-t border-gray-200 my-6"></div>

							<h3 className="text-lg font-semibold text-momma-brown mb-4">
								Change Password
							</h3>

							<div>
								<label className="block text-gray-700 font-medium mb-1 text-sm">
									Current Password
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FiLock className="text-gray-400" />
									</div>
									<input
										type="password"
										value={currentPassword}
										onChange={(e) =>
											setCurrentPassword(e.target.value)
										}
										className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
										placeholder="Enter current password"
										disabled={loading}
									/>
								</div>
							</div>

							<div>
								<label className="block text-gray-700 font-medium mb-1 text-sm">
									New Password (optional)
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<FiLock className="text-gray-400" />
									</div>
									<input
										type="password"
										value={newPassword}
										onChange={(e) =>
											setNewPassword(e.target.value)
										}
										className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink focus:border-transparent"
										placeholder="Enter new password"
										disabled={loading}
									/>
								</div>
								<p className="text-xs text-gray-500 mt-1">
									Leave blank to keep current password.
									Minimum 8 characters with letters and
									numbers.
								</p>
							</div>

							{message && (
								<div className="bg-green-50 border border-green-200 rounded-lg p-3">
									<p className="text-green-600 text-sm">
										{message}
									</p>
								</div>
							)}

							{error && (
								<div className="bg-red-50 border border-red-200 rounded-lg p-3">
									<p className="text-red-600 text-sm">
										{error}
									</p>
								</div>
							)}

							<button
								type="submit"
								disabled={loading}
								className="w-full bg-momma-pink text-white py-2 rounded-lg hover:bg-opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
							>
								{loading ? (
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
								) : (
									<>
										<FiSave />
										Update Profile
									</>
								)}
							</button>
						</form>
					</div>
				</div>

				<div className="lg:col-span-1">
					<div className="bg-red-50 rounded-2xl border border-red-200 p-6 sticky top-24">
						<h3 className="text-lg font-semibold text-red-700 mb-3">
							Danger Zone
						</h3>
						<p className="text-sm text-red-600 mb-4">
							Once you delete your account, there is no going
							back. All your data will be permanently removed.
						</p>
						<button
							onClick={handleDelete}
							disabled={loading}
							className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center justify-center gap-2"
						>
							<FiTrash2 />
							Delete Account
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
