import React, { useState } from "react";
import {
	FiSave,
	FiInfo,
	FiMail,
	FiCreditCard,
	FiGlobe,
	FiShield,
} from "react-icons/fi";

function Settings() {
	const [storeSettings, setStoreSettings] = useState({
		storeName: "Momma Nuts",
		storeEmail: "hello@momanuts.com",
		storePhone: "254700000000",
		currency: "KES",
		taxRate: "16",
		freeShippingThreshold: "2000",
	});

	const [mpesaSettings, setMpesaSettings] = useState({
		consumerKey: "••••••••••••••••",
		consumerSecret: "••••••••••••••••",
		shortcode: "174379",
		environment: "sandbox",
	});

	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");

	const handleStoreSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		setMessage("");

		// Simulate API call - replace with actual backend endpoint
		setTimeout(() => {
			setMessage("Store settings saved successfully!");
			setSaving(false);
			setTimeout(() => setMessage(""), 3000);
		}, 1000);
	};

	const handleMpesaSave = async (e) => {
		e.preventDefault();
		setSaving(true);
		setMessage("");

		// Simulate API call - replace with actual backend endpoint
		setTimeout(() => {
			setMessage("M-Pesa settings saved successfully!");
			setSaving(false);
			setTimeout(() => setMessage(""), 3000);
		}, 1000);
	};

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold text-momma-brown">Settings</h1>

			{message && (
				<div className="bg-green-50 border border-green-200 rounded-lg p-3">
					<p className="text-green-600 text-sm">{message}</p>
				</div>
			)}

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Store Settings */}
				<div className="bg-white rounded-xl shadow-sm p-6">
					<div className="flex items-center gap-2 mb-6">
						<FiInfo className="text-momma-pink text-xl" />
						<h2 className="text-xl font-semibold text-momma-brown">
							Store Information
						</h2>
					</div>

					<form onSubmit={handleStoreSave} className="space-y-4">
						<div>
							<label className="block text-gray-700 font-medium mb-1">
								Store Name
							</label>
							<input
								type="text"
								value={storeSettings.storeName}
								onChange={(e) =>
									setStoreSettings({
										...storeSettings,
										storeName: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
							/>
						</div>

						<div>
							<label className="block text-gray-700 font-medium mb-1">
								Store Email
							</label>
							<div className="relative">
								<FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
								<input
									type="email"
									value={storeSettings.storeEmail}
									onChange={(e) =>
										setStoreSettings({
											...storeSettings,
											storeEmail: e.target.value,
										})
									}
									className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
								/>
							</div>
						</div>

						<div>
							<label className="block text-gray-700 font-medium mb-1">
								Store Phone
							</label>
							<input
								type="tel"
								value={storeSettings.storePhone}
								onChange={(e) =>
									setStoreSettings({
										...storeSettings,
										storePhone: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div>
								<label className="block text-gray-700 font-medium mb-1">
									Currency
								</label>
								<select
									value={storeSettings.currency}
									onChange={(e) =>
										setStoreSettings({
											...storeSettings,
											currency: e.target.value,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
								>
									<option value="KES">
										Kenyan Shilling (KES)
									</option>
									<option value="USD">US Dollar (USD)</option>
									<option value="EUR">Euro (EUR)</option>
								</select>
							</div>
							<div>
								<label className="block text-gray-700 font-medium mb-1">
									Tax Rate (%)
								</label>
								<input
									type="number"
									value={storeSettings.taxRate}
									onChange={(e) =>
										setStoreSettings({
											...storeSettings,
											taxRate: e.target.value,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
								/>
							</div>
						</div>

						<div>
							<label className="block text-gray-700 font-medium mb-1">
								Free Shipping Threshold (KSh)
							</label>
							<input
								type="number"
								value={storeSettings.freeShippingThreshold}
								onChange={(e) =>
									setStoreSettings({
										...storeSettings,
										freeShippingThreshold: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
							/>
						</div>

						<button
							type="submit"
							disabled={saving}
							className="btn-primary w-full flex items-center justify-center gap-2"
						>
							<FiSave />{" "}
							{saving ? "Saving..." : "Save Store Settings"}
						</button>
					</form>
				</div>

				{/* M-Pesa Settings */}
				<div className="bg-white rounded-xl shadow-sm p-6">
					<div className="flex items-center gap-2 mb-6">
						<FiCreditCard className="text-momma-pink text-xl" />
						<h2 className="text-xl font-semibold text-momma-brown">
							M-Pesa Configuration
						</h2>
					</div>

					<form onSubmit={handleMpesaSave} className="space-y-4">
						<div>
							<label className="block text-gray-700 font-medium mb-1">
								Consumer Key
							</label>
							<input
								type="text"
								value={mpesaSettings.consumerKey}
								onChange={(e) =>
									setMpesaSettings({
										...mpesaSettings,
										consumerKey: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
							/>
						</div>

						<div>
							<label className="block text-gray-700 font-medium mb-1">
								Consumer Secret
							</label>
							<input
								type="password"
								value={mpesaSettings.consumerSecret}
								onChange={(e) =>
									setMpesaSettings({
										...mpesaSettings,
										consumerSecret: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
							/>
						</div>

						<div>
							<label className="block text-gray-700 font-medium mb-1">
								Shortcode
							</label>
							<input
								type="text"
								value={mpesaSettings.shortcode}
								onChange={(e) =>
									setMpesaSettings({
										...mpesaSettings,
										shortcode: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
							/>
						</div>

						<div>
							<label className="block text-gray-700 font-medium mb-1">
								Environment
							</label>
							<select
								value={mpesaSettings.environment}
								onChange={(e) =>
									setMpesaSettings({
										...mpesaSettings,
										environment: e.target.value,
									})
								}
								className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
							>
								<option value="sandbox">
									Sandbox (Testing)
								</option>
								<option value="production">
									Production (Live)
								</option>
							</select>
						</div>

						<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
							<div className="flex items-start gap-2">
								<FiShield className="text-yellow-600 mt-0.5" />
								<p className="text-xs text-yellow-800">
									Store M-Pesa credentials securely. Never
									commit these to version control. Use
									environment variables in production.
								</p>
							</div>
						</div>

						<button
							type="submit"
							disabled={saving}
							className="btn-primary w-full flex items-center justify-center gap-2"
						>
							<FiSave />{" "}
							{saving ? "Saving..." : "Save M-Pesa Settings"}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Settings;
