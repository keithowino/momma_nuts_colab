import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiCheck } from "react-icons/fi";

const API_URL = "http://127.0.0.1:5000";

const ProductCard = ({ product, onAddToCart, addingToCartId }) => {
	const { id, name, description, price, image, stock } = product;
	const [liked, setLiked] = useState(false);
	const [likesCount, setLikesCount] = useState(0);
	const [isLiking, setIsLiking] = useState(false);
	const [currentUser, setCurrentUser] = useState(null);
	const [addedToCart, setAddedToCart] = useState(false);

	useEffect(() => {
		const user = localStorage.getItem("user");
		if (user) {
			setCurrentUser(JSON.parse(user));
		}
	}, []);

	useEffect(() => {
		if (currentUser) {
			fetchLikeStatus();
		}
	}, [id, currentUser]);

	const fetchLikeStatus = async () => {
		const token = localStorage.getItem("access_token");
		if (!token) return;

		try {
			const response = await fetch(`${API_URL}/products/${id}/likes`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await response.json();
			setLiked(data.liked || false);
			setLikesCount(data.likes_count || 0);
		} catch (error) {
			console.error("Error fetching like status:", error);
		}
	};

	const handleLikeToggle = async (e) => {
		e.preventDefault(); // Prevent navigation to product detail
		e.stopPropagation();

		const token = localStorage.getItem("access_token");
		if (!token) {
			alert("Please login to like products");
			return;
		}

		if (isLiking) return;
		setIsLiking(true);

		const method = liked ? "DELETE" : "POST";

		try {
			const response = await fetch(`${API_URL}/products/${id}/likes`, {
				method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				const data = await response.json();
				setLiked(!liked);
				setLikesCount(liked ? likesCount - 1 : likesCount + 1);
			}
		} catch (error) {
			console.error("Error toggling like:", error);
		} finally {
			setIsLiking(false);
		}
	};

	const handleAddToCartClick = async (e) => {
		e.preventDefault(); // Prevent navigation
		e.stopPropagation();

		if (onAddToCart) {
			await onAddToCart(id, name);
			setAddedToCart(true);
			setTimeout(() => setAddedToCart(false), 2000);
		}
	};

	const isAdding = addingToCartId === id;

	return (
		<div className="card group relative">
			<Link to={`/product/${id}`}>
				<div className="relative overflow-hidden h-48">
					{image ? (
						<img
							src={image}
							alt={name}
							className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
						/>
					) : (
						<div className="w-full h-full bg-gray-200 flex items-center justify-center">
							<span className="text-gray-400">No image</span>
						</div>
					)}
					{stock <= 0 && (
						<div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
							Out of Stock
						</div>
					)}
				</div>
				<div className="p-4">
					<h3 className="text-lg font-semibold text-momma-brown mb-1 line-clamp-1">
						{name}
					</h3>
					<p className="text-gray-600 text-sm mb-2 line-clamp-2">
						{description}
					</p>
					<div className="flex items-center justify-between mt-3">
						<span className="text-2xl font-bold text-momma-pink">
							KSh {price.toLocaleString()}
						</span>
					</div>
				</div>
			</Link>

			{/* Action Buttons */}
			<div className="absolute top-2 left-2 flex gap-2">
				{/* Like Button */}
				<button
					onClick={handleLikeToggle}
					disabled={isLiking}
					className={`bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all ${
						liked
							? "text-red-500"
							: "text-gray-400 hover:text-red-500"
					}`}
				>
					<FiHeart
						className={`text-lg ${liked ? "fill-current" : ""}`}
					/>
					{likesCount > 0 && (
						<span className="absolute -top-1 -right-1 bg-momma-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
							{likesCount}
						</span>
					)}
				</button>
			</div>

			{/* Add to Cart Button */}
			<div className="px-4 pb-4">
				<button
					onClick={handleAddToCartClick}
					className={`btn-primary w-full flex items-center justify-center gap-2 transition-all ${
						stock <= 0 ? "opacity-50 cursor-not-allowed" : ""
					}`}
					disabled={stock <= 0 || isAdding}
				>
					{isAdding ? (
						<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
					) : addedToCart ? (
						<>
							<FiCheck />
							Added!
						</>
					) : (
						<>
							<FiShoppingCart />
							{stock > 0 ? "Add to Cart" : "Sold Out"}
						</>
					)}
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
