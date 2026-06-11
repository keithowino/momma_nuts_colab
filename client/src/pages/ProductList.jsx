import { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../components/common/ProductCard";

const ProductList = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				// Update this URL to match your backend
				const response = await axios.get(
					"http://localhost:5000/products",
				);
				setProducts(response.data);
				setLoading(false);
			} catch (err) {
				setError("Failed to load products");
				setLoading(false);
				console.error(err);
			}
		};

		fetchProducts();
	}, []);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-momma-pink"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center text-red-600 py-8">
				<p>{error}</p>
				<button
					onClick={() => window.location.reload()}
					className="btn-primary mt-4"
				>
					Try Again
				</button>
			</div>
		);
	}

	return (
		<div>
			<h1 className="text-3xl font-bold text-momma-brown mb-8">
				Our Premium Peanuts
			</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{products.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</div>
	);
};

export default ProductList;
