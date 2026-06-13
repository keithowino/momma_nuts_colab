import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/common/ProductCard";
import { FiX, FiFilter } from "react-icons/fi";

const API_URL = "http://127.0.0.1:5000";

// Maps URL param values to human-readable labels and search keywords.
// Extend this as you add more collections/categories.
const FILTER_CONFIG = {
	collection: {
		summer: {
			label: "Summer Harvest Collection",
			description: "Light, fresh flavors perfect for the season.",
			keywords: ["honey", "spicy", "chili", "light", "roasted", "salted"],
		},
	},
	category: {
		bundles: {
			label: "Bundle Deals",
			description: "Multi-pack value bundles for family and gifting.",
			keywords: [
				"bundle",
				"pack",
				"family",
				"mix",
				"assorted",
				"variety",
			],
		},
	},
};

// Returns products that match at least one keyword in their name or description.
const applyFilter = (products, keywords) => {
	if (!keywords || keywords.length === 0) return products;
	return products.filter((p) =>
		keywords.some(
			(kw) =>
				p.name?.toLowerCase().includes(kw) ||
				p.description?.toLowerCase().includes(kw),
		),
	);
};

function ProductList() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [addingToCartId, setAddingToCartId] = useState(null);

	// Resolve the active filter from the URL on every render
	const activeParamKey = searchParams.has("collection")
		? "collection"
		: searchParams.has("category")
			? "category"
			: null;
	const activeParamValue = activeParamKey
		? searchParams.get(activeParamKey)
		: null;
	const activeFilter =
		activeParamKey && activeParamValue
			? (FILTER_CONFIG[activeParamKey]?.[activeParamValue] ?? null)
			: null;

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		try {
			const response = await axios.get(`${API_URL}/products`);
			setProducts(response.data);
			setError(null);
		} catch (err) {
			setError("Failed to load products");
			console.error(err);
		} finally {
			setLoading(false);
		}
	};

	const handleAddToCart = async (productId, productName) => {
		const token = localStorage.getItem("access_token");
		if (!token) {
			alert("Please login to add items to cart");
			return;
		}
		setAddingToCartId(productId);
		try {
			await axios.post(
				`${API_URL}/cart`,
				{ product_id: productId, quantity: 1 },
				{ headers: { Authorization: `Bearer ${token}` } },
			);
			window.dispatchEvent(
				new CustomEvent("cartUpdated", {
					detail: { productId, productName },
				}),
			);
		} catch (err) {
			console.error("Error adding to cart:", err);
			alert(err.response?.data?.error || "Failed to add to cart");
		} finally {
			setAddingToCartId(null);
		}
	};

	const clearFilter = () => {
		setSearchParams({});
	};

	const displayedProducts = activeFilter
		? applyFilter(products, activeFilter.keywords)
		: products;

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-momma-pink" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center text-red-600 py-8">
				<p>{error}</p>
				<button onClick={fetchProducts} className="btn-primary mt-4">
					Try Again
				</button>
			</div>
		);
	}

	return (
		<div>
			{/* Page header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-momma-brown">
					{activeFilter ? activeFilter.label : "Our Premium Peanuts"}
				</h1>
				{activeFilter && (
					<p className="text-gray-500 mt-1">
						{activeFilter.description}
					</p>
				)}
			</div>

			{/* Active filter banner */}
			{activeFilter && (
				<div className="flex items-center justify-between bg-momma-pink/10 border border-momma-pink/20 rounded-2xl px-5 py-3 mb-8">
					<div className="flex items-center gap-2 text-momma-brown text-sm">
						<FiFilter className="text-momma-pink" />
						<span>
							Showing{" "}
							<span className="font-semibold text-momma-pink">
								{activeFilter.label}
							</span>
							{" — "}
							{displayedProducts.length} product
							{displayedProducts.length !== 1 ? "s" : ""}
						</span>
					</div>
					<button
						onClick={clearFilter}
						className="flex items-center gap-1 text-sm text-gray-500 hover:text-momma-pink transition-colors"
					>
						<FiX className="text-base" />
						Clear filter
					</button>
				</div>
			)}

			{/* Products grid */}
			{displayedProducts.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{displayedProducts.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							onAddToCart={handleAddToCart}
							addingToCartId={addingToCartId}
						/>
					))}
				</div>
			) : (
				// Empty state — filter matched nothing
				<div className="text-center py-20">
					<p className="text-5xl mb-4">🥜</p>
					<h2 className="text-xl font-semibold text-momma-brown mb-2">
						No products found
					</h2>
					<p className="text-gray-500 mb-6">
						We couldn't find any products matching this filter right
						now.
					</p>
					<button onClick={clearFilter} className="btn-primary">
						View all products
					</button>
				</div>
			)}
		</div>
	);
}

export default ProductList;
