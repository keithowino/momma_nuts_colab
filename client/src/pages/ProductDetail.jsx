import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
	FiShoppingCart,
	FiHeart,
	FiShare2,
	FiMinus,
	FiPlus,
	FiCheck,
	FiAlertCircle,
} from "react-icons/fi";
import CommentSection from "../components/common/comments/CommentSection";

const API_URL = "http://127.0.0.1:5000";

const ProductDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [quantity, setQuantity] = useState(1);
	const [addingToCart, setAddingToCart] = useState(false);
	const [addedToCart, setAddedToCart] = useState(false);
	const [liked, setLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);
	const [isLiking, setIsLiking] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		fetchProduct();
	}, [id]);

	useEffect(() => {
		if (product && localStorage.getItem("access_token")) {
			fetchLikeStatus();
		}
	}, [product]);

	const fetchProduct = async () => {
		setLoading(true);
		try {
			// First try the single product endpoint
			let productData = null;

			try {
				const response = await axios.get(`${API_URL}/products/${id}`);
				productData = response.data;
			} catch (singleErr) {
				console.log(
					"Single product endpoint failed, fetching all products...",
				);
				// Fallback: get all products and find by ID
				const allProducts = await axios.get(`${API_URL}/products`);
				const found = allProducts.data.find(
					(p) => p.id === parseInt(id),
				);
				if (found) {
					productData = found;
				} else {
					throw new Error("Product not found");
				}
			}

			setProduct(productData);
			setError(null);
		} catch (err) {
			console.error("Fetch error:", err);
			setError(err.response?.data?.message || "Failed to load product");
		} finally {
			setLoading(false);
		}
	};

	const fetchLikeStatus = async () => {
		const token = localStorage.getItem("access_token");
		if (!token) return;

		try {
			const response = await fetch(
				`${API_URL}/products/${product.id}/likes`,
				{
					headers: { Authorization: `Bearer ${token}` },
				},
			);
			const data = await response.json();
			setLiked(data.liked || false);
			setLikesCount(data.likes_count || 0);
		} catch (error) {
			console.error("Error fetching like status:", error);
		}
	};

	const handleLikeToggle = async () => {
		const token = localStorage.getItem("access_token");
		if (!token) {
			alert("Please login to like products");
			return;
		}

		if (isLiking) return;
		setIsLiking(true);

		const method = liked ? "DELETE" : "POST";

		try {
			const response = await fetch(
				`${API_URL}/products/${product.id}/likes`,
				{
					method,
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (response.ok) {
				setLiked(!liked);
				setLikesCount(liked ? likesCount - 1 : likesCount + 1);
			}
		} catch (error) {
			console.error("Error toggling like:", error);
		} finally {
			setIsLiking(false);
		}
	};

	const addToCart = async () => {
		setAddingToCart(true);
		try {
			const token = localStorage.getItem("access_token");
			console.log("Token exists:", !!token);

			if (!token) {
				alert("Please login to add items to cart");
				navigate("/login");
				return;
			}

			// Verify token structure
			const tokenParts = token.split(".");
			if (tokenParts.length !== 3) {
				console.error("Invalid token format");
				localStorage.clear();
				alert("Session expired. Please login again.");
				navigate("/login");
				return;
			}

			const payload = {
				product_id: parseInt(product.id),
				quantity: parseInt(quantity),
			};

			console.log("Sending to cart:", payload);

			const response = await axios.post(`${API_URL}/cart`, payload, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			console.log("Cart response:", response.data);
			setAddedToCart(true);
			setTimeout(() => setAddedToCart(false), 3000);
		} catch (err) {
			console.error("Cart error:", err.response?.data || err.message);

			// Handle specific error cases
			if (err.response?.status === 422) {
				const errorMsg =
					err.response?.data?.msg ||
					"Invalid token. Please login again.";
				alert(errorMsg);
				if (
					errorMsg.includes("signature") ||
					errorMsg.includes("token")
				) {
					localStorage.clear();
					alert("Session expired. Please login again.");
					navigate("/login");
				}
			} else {
				alert(
					err.response?.data?.error ||
						err.response?.data?.message ||
						"Failed to add to cart",
				);
			}
		} finally {
			setAddingToCart(false);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-96">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-momma-pink"></div>
			</div>
		);
	}

	if (error || !product) {
		return (
			<div className="text-center py-12">
				<FiAlertCircle className="text-6xl text-red-500 mx-auto mb-4" />
				<p className="text-red-600 mb-4">
					{error || "Product not found"}
				</p>
				<button
					onClick={() => navigate("/user-products")}
					className="btn-primary"
				>
					Back to Shop
				</button>
			</div>
		);
	}

	const isInStock = product.stock > 0;

	return (
		<div className="max-w-6xl mx-auto px-4 py-8">
			{/* Breadcrumb */}
			<div className="text-sm text-gray-500 mb-6">
				<span
					onClick={() => navigate("/")}
					className="hover:text-momma-pink cursor-pointer"
				>
					Home
				</span>
				{" > "}
				<span
					onClick={() => navigate("/user-products")}
					className="hover:text-momma-pink cursor-pointer"
				>
					Shop
				</span>
				{" > "}
				<span className="text-momma-brown">{product.name}</span>
			</div>

			{/* Product Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
				{/* Product Image */}
				<div className="card p-4">
					<div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
						{product.image && product.image.startsWith("http") ? (
							<img
								src={product.image}
								alt={product.name}
								className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
							/>
						) : (
							<div className="text-center">
								{/* <FiShoppingCart className="text-6xl text-gray-300 mx-auto mb-2" /> */}
								<img
									src="https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400"
									alt={product.name}
									className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
								/>
								<p className="text-gray-400 text-sm">
									{product.name}
								</p>
							</div>
						)}
					</div>
				</div>

				{/* Product Info */}
				<div>
					<h1 className="text-3xl md:text-4xl font-bold text-momma-brown mb-4">
						{product.name}
					</h1>

					<div className="text-3xl font-bold text-momma-pink mb-4">
						KSh {product.price.toLocaleString()}
					</div>

					<div className="mb-6">
						<span
							className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
								isInStock
									? "bg-green-100 text-green-800"
									: "bg-red-100 text-red-800"
							}`}
						>
							{isInStock
								? `${product.stock} in stock`
								: "Out of stock"}
						</span>
					</div>

					<p className="text-gray-700 mb-6 leading-relaxed">
						{product.description || "No description available."}
					</p>

					{/* Quantity Selector */}
					{isInStock && (
						<div className="mb-6">
							<label className="block text-gray-700 font-medium mb-2">
								Quantity:
							</label>
							<div className="flex items-center gap-3">
								<button
									onClick={() =>
										setQuantity(Math.max(1, quantity - 1))
									}
									disabled={quantity <= 1}
									className="p-2 rounded-lg border border-gray-300 hover:border-momma-pink disabled:opacity-50 transition-colors"
								>
									<FiMinus />
								</button>
								<span className="w-12 text-center font-medium text-lg">
									{quantity}
								</span>
								<button
									onClick={() =>
										setQuantity(
											Math.min(
												product.stock,
												quantity + 1,
											),
										)
									}
									disabled={quantity >= product.stock}
									className="p-2 rounded-lg border border-gray-300 hover:border-momma-pink disabled:opacity-50 transition-colors"
								>
									<FiPlus />
								</button>
							</div>
						</div>
					)}

					{/* Action Buttons */}
					<div className="flex gap-4">
						<button
							onClick={addToCart}
							disabled={!isInStock || addingToCart}
							className="btn-primary flex-1 py-3 text-lg disabled:opacity-50 flex items-center justify-center gap-2"
						>
							{addingToCart ? (
								<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
							) : addedToCart ? (
								<>
									<FiCheck /> Added to Cart!
								</>
							) : (
								<>
									<FiShoppingCart /> Add to Cart
								</>
							)}
						</button>

						<button
							onClick={handleLikeToggle}
							disabled={isLiking}
							className={`px-4 py-3 rounded-full border transition-colors ${
								liked
									? "border-red-500 bg-red-50 text-red-500"
									: "border-gray-300 hover:border-red-500 hover:text-red-500"
							}`}
						>
							<FiHeart
								className={`text-lg ${liked ? "fill-current" : ""}`}
							/>
							{likesCount > 0 && (
								<span className="ml-1 text-sm">
									{likesCount}
								</span>
							)}
						</button>

						<button className="px-4 py-3 rounded-full border border-gray-300 hover:border-momma-pink hover:text-momma-pink transition-colors">
							<FiShare2 />
						</button>
					</div>

					{/* Additional Info */}
					<div className="mt-8 pt-6 border-t">
						<h3 className="font-semibold text-momma-brown mb-2">
							Product Details:
						</h3>
						<ul className="text-sm text-gray-600 space-y-1">
							<li>✓ Premium quality peanuts</li>
							<li>✓ Freshly roasted</li>
							<li>✓ Free shipping on orders over KSh 2000</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="mt-12">
				<CommentSection productId={id} />
			</div>
		</div>
	);
};

export default ProductDetail;
