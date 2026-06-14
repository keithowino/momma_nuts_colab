import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiTrash2, FiPlus, FiMinus, FiShoppingCart } from "react-icons/fi";
import { cartAPI, orderAPI } from "../lib/config/api";

const API_URL = "http://127.0.0.1:5000";

const Cart = () => {
	const [cartItems, setCartItems] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [checkoutLoading, setCheckoutLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		fetchCart();
	}, []);

	const fetchCart = async () => {
		setLoading(true);
		try {
			// const response = await axios.get(`${API_URL}/cart`, {
			// 	headers: {
			// 		Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			// 	},
			// });
			const response = await cartAPI.getCart();
			// Handle both { items: [...] } and plain array responses
			const items = Array.isArray(response.data)
				? response.data
				: (response.data.items ?? response.data.cart_items ?? []);
			setCartItems(items);
			setError(null);
		} catch (err) {
			setError(err.response?.data?.message || "Failed to fetch cart");
			setCartItems([]); // prevent map crash on error
		} finally {
			setLoading(false);
		}
	};

	const updateQuantity = async (productId, change) => {
		try {
			// await axios.post(
			// 	`${API_URL}/cart`,
			// 	{ product_id: productId, quantity: change },
			// 	{
			// 		headers: {
			// 			Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			// 		},
			// 	},
			// );

			await cartAPI.updateQuantity(productId, change);
			await fetchCart(); // Refresh after update
		} catch (err) {
			alert(err.response?.data?.error || "Failed to update quantity");
		}
	};

	const removeItem = async (cartId) => {
		try {
			// await axios.delete(`${API_URL}/cart/${cartId}`, {
			// 	headers: {
			// 		Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			// 	},
			// });
			await cartAPI.removeItem(cartId);
			setCartItems(cartItems.filter((item) => item.id !== cartId));
		} catch (err) {
			console.error(
				"Error removing item:",
				err.response?.data || err.message,
			);
			alert(err.response?.data?.error || "Failed to remove item");
		}
	};

	const handleCheckout = async () => {
		setCheckoutLoading(true);
		try {
			// const response = await axios.post(
			// 	`${API_URL}/checkout`,
			// 	{},
			// 	{
			// 		headers: {
			// 			Authorization: `Bearer ${localStorage.getItem("access_token")}`,
			// 		},
			// 	},
			// );

			const response = await orderAPI.checkout();

			console.log("Checkout response:", response.data); // Debug log

			alert("Checkout successful! Proceed to payment.");
			navigate("/mpesa", {
				state: {
					orderId: response.data.order_id,
					amount: response.data.total_price, // ← FIX: use total_price
				},
			});
		} catch (err) {
			alert(err.response?.data?.error || "Checkout failed");
		} finally {
			setCheckoutLoading(false);
		}
	};

	const calculateTotal = () => {
		return cartItems.reduce(
			(total, item) => total + item.price * item.quantity,
			0,
		);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-momma-pink"></div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			<h1 className="text-3xl font-bold text-momma-brown mb-8 flex items-center gap-3">
				<FiShoppingCart className="text-momma-pink" />
				Your Shopping Cart
			</h1>

			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
					{error}
				</div>
			)}

			{cartItems.length === 0 ? (
				<div className="text-center py-12 bg-gray-50 rounded-2xl">
					<FiShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
					<p className="text-gray-600 text-lg">Your cart is empty</p>
					<button
						onClick={() => navigate("/user-products")}
						className="btn-primary mt-4 inline-block"
					>
						Continue Shopping
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* Cart Items - 2/3 width on desktop */}
					<div className="lg:col-span-2 space-y-4">
						{cartItems.map((item) => (
							<div
								key={item.id}
								className="card p-4 flex gap-4 hover:shadow-lg transition-shadow"
							>
								{/* Product Image */}
								<div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
									{item.image ? (
										<img
											src={item.image}
											alt={item.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center text-gray-400">
											<FiShoppingCart />
										</div>
									)}
								</div>

								{/* Product Details */}
								<div className="flex-grow">
									<h3 className="font-semibold text-momma-brown text-lg">
										{item.name}
									</h3>
									<p className="text-gray-600 text-sm mb-2">
										KSh {item.price.toLocaleString()}
									</p>

									{/* Quantity Controls */}
									<div className="flex items-center gap-2">
										<button
											onClick={() =>
												updateQuantity(
													item.product_id,
													-1,
												)
											}
											disabled={item.quantity <= 1}
											className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
										>
											<FiMinus className="text-gray-600" />
										</button>
										<span className="w-8 text-center font-medium">
											{item.quantity}
										</span>
										<button
											onClick={() =>
												updateQuantity(
													item.product_id,
													1,
												)
											}
											className="p-1 rounded-lg hover:bg-gray-100"
										>
											<FiPlus className="text-gray-600" />
										</button>
										<button
											onClick={() => removeItem(item.id)}
											className="ml-4 text-red-500 hover:text-red-700 transition-colors"
										>
											<FiTrash2 />
										</button>
									</div>
								</div>

								{/* Item Total */}
								<div className="text-right">
									<p className="font-bold text-momma-pink">
										KSh{" "}
										{(
											item.price * item.quantity
										).toLocaleString()}
									</p>
								</div>
							</div>
						))}
					</div>

					{/* Order Summary - 1/3 width on desktop */}
					<div className="lg:col-span-1">
						<div className="card p-6 sticky top-24">
							<h2 className="text-xl font-bold text-momma-brown mb-4">
								Order Summary
							</h2>

							<div className="space-y-3 mb-4">
								<div className="flex justify-between">
									<span className="text-gray-600">
										Subtotal
									</span>
									<span className="font-medium">
										KSh {calculateTotal().toLocaleString()}
									</span>
								</div>
								<div className="flex justify-between">
									<span className="text-gray-600">
										Shipping
									</span>
									<span className="font-medium">Free</span>
								</div>
								<div className="border-t pt-3">
									<div className="flex justify-between font-bold text-lg">
										<span>Total</span>
										<span className="text-momma-pink">
											KSh{" "}
											{calculateTotal().toLocaleString()}
										</span>
									</div>
								</div>
							</div>

							<button
								onClick={handleCheckout}
								disabled={checkoutLoading}
								className="btn-primary w-full py-3 text-lg disabled:opacity-50"
							>
								{checkoutLoading ? (
									<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
								) : (
									"Proceed to Checkout"
								)}
							</button>

							<button
								onClick={() => navigate("/user-products")}
								className="w-full mt-3 text-momma-pink hover:text-momma-red transition-colors"
							>
								Continue Shopping
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Cart;
