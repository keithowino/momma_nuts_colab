import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/common/ProductCard";
import { FiX, FiFilter } from "react-icons/fi";

const API_URL = "http://127.0.0.1:5000";

// Human-readable labels for URL param values.
// Only needed for display — the backend does the actual filtering.
const FILTER_LABELS = {
	collection: {
		summer: {
			label: "Summer Harvest Collection",
			description: "Light, fresh flavors perfect for the season.",
		},
	},
	category: {
		bundles: {
			label: "Bundle Deals",
			description: "Multi-pack value bundles for family and gifting.",
		},
	},
};

function ProductList() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [addingToCartId, setAddingToCartId] = useState(null);

	// Resolve which filter (if any) is active from the URL
	const activeParamKey = searchParams.has("collection")
		? "collection"
		: searchParams.has("category")
			? "category"
			: null;
	const activeParamValue = activeParamKey
		? searchParams.get(activeParamKey)
		: null;

	// Look up display info — falls back gracefully if the value isn't in FILTER_LABELS
	const activeFilter =
		activeParamKey && activeParamValue
			? (FILTER_LABELS[activeParamKey]?.[activeParamValue] ?? {
					label: activeParamValue, // fallback: show the raw param value
					description: null,
				})
			: null;

	// Re-fetch whenever the URL params change — clicking a carousel link
	// updates searchParams, which triggers this effect, which re-fetches.
	useEffect(() => {
		fetchProducts();
	}, [searchParams]);

	const fetchProducts = async () => {
		setLoading(true);
		try {
			// Build the params object from the URL — only include keys that are present
			const params = {};
			if (searchParams.get("collection"))
				params.collection = searchParams.get("collection");
			if (searchParams.get("category"))
				params.category = searchParams.get("category");

			// Axios serializes { collection: 'summer' } into ?collection=summer for us
			const response = await axios.get(`${API_URL}/products`, { params });
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
				{activeFilter?.description && (
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
							{products.length} product
							{products.length !== 1 ? "s" : ""}
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
			{products.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{products.map((product) => (
						<ProductCard
							key={product.id}
							product={product}
							onAddToCart={handleAddToCart}
							addingToCartId={addingToCartId}
						/>
					))}
				</div>
			) : (
				<div className="text-center py-20">
					<p className="text-5xl mb-4">🥜</p>
					<h2 className="text-xl font-semibold text-momma-brown mb-2">
						No products found
					</h2>
					<p className="text-gray-500 mb-6">
						{activeFilter
							? "No products have been tagged with this filter yet."
							: "No products available right now."}
					</p>
					{activeFilter && (
						<button onClick={clearFilter} className="btn-primary">
							View all products
						</button>
					)}
				</div>
			)}
		</div>
	);
}

export default ProductList;
