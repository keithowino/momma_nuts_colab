import React, { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from "react-icons/fi";

const API_URL = "http://127.0.0.1:5000";

function Products() {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
		price: "",
		stock: "",
		image: "",
	});
	const [uploading, setUploading] = useState(false);

	useEffect(() => {
		fetchProducts();
	}, []);

	const fetchProducts = async () => {
		const token = localStorage.getItem("access_token");
		try {
			const response = await fetch(`${API_URL}/products`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const data = await response.json();
			setProducts(Array.isArray(data) ? data : []);
		} catch (error) {
			console.error("Error fetching products:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleImageUpload = async (e) => {
		const file = e.target.files[0];
		if (!file) return;

		setUploading(true);
		const formData = new FormData();
		formData.append("file", file);
		formData.append("upload_preset", "react_uploads");

		try {
			const response = await fetch(
				`https://api.cloudinary.com/v1_1/dvjkvk71s/image/upload`,
				{
					method: "POST",
					body: formData,
				},
			);
			const data = await response.json();
			setFormData((prev) => ({ ...prev, image: data.secure_url }));
		} catch (error) {
			console.error("Image upload failed:", error);
		} finally {
			setUploading(false);
		}
	};

	// const handleSubmit = async (e) => {
	// 	e.preventDefault();
	// 	const token = localStorage.getItem("access_token");
	// 	const url = editingProduct
	// 		? `${API_URL}/products/${editingProduct.id}`
	// 		: `${API_URL}/products`;
	// 	const method = editingProduct ? "PATCH" : "POST";

	// 	try {
	// 		const response = await fetch(url, {
	// 			method,
	// 			headers: {
	// 				"Content-Type": "application/json",
	// 				Authorization: `Bearer ${token}`,
	// 			},
	// 			body: JSON.stringify(formData),
	// 		});

	// 		if (response.ok) {
	// 			fetchProducts();
	// 			setShowModal(false);
	// 			resetForm();
	// 			alert(editingProduct ? "Product updated!" : "Product created!");
	// 		}
	// 	} catch (error) {
	// 		console.error("Error saving product:", error);
	// 	}
	// };

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate form data
		if (
			!formData.name ||
			!formData.description ||
			!formData.price ||
			!formData.stock
		) {
			alert("Please fill in all required fields");
			return;
		}

		setLoading(true);
		const token = localStorage.getItem("access_token");

		console.log("Token exists:", !!token);
		console.log("Form data being sent:", formData);

		if (!token) {
			alert("You are not logged in. Please login again.");
			setLoading(false);
			return;
		}

		const url = editingProduct
			? `${API_URL}/products/${editingProduct.id}`
			: `${API_URL}/products`;
		const method = editingProduct ? "PATCH" : "POST";

		try {
			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					name: formData.name,
					description: formData.description,
					price: parseFloat(formData.price),
					stock: parseInt(formData.stock),
					image: formData.image || "https://via.placeholder.com/400",
				}),
			});

			console.log("Response status:", response.status);

			if (response.status === 401) {
				alert("Session expired. Please login again.");
				localStorage.clear();
				window.location.href = "/login";
				return;
			}

			if (response.status === 403) {
				alert(
					"You don't have permission to add products. Admin access required.",
				);
				return;
			}

			const data = await response.json();
			console.log("Response data:", data);

			if (response.ok) {
				fetchProducts();
				setShowModal(false);
				resetForm();
				alert(editingProduct ? "Product updated!" : "Product created!");
			} else {
				alert(data.error || "Failed to save product");
			}
		} catch (error) {
			console.error("Error saving product:", error);
			alert("Network error. Please check if backend is running.");
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Are you sure you want to delete this product?"))
			return;

		const token = localStorage.getItem("access_token");

		// Debug: Check if token exists
		console.log("Token exists:", !!token);
		console.log("Token:", token);

		if (!token) {
			alert("You are not logged in. Please login again.");
			window.location.href = "/login";
			return;
		}

		try {
			const response = await fetch(`${API_URL}/products/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			console.log("Response status:", response.status);

			if (response.status === 401) {
				alert("Session expired. Please login again.");
				localStorage.clear();
				window.location.href = "/login";
				return;
			}

			if (response.ok) {
				fetchProducts(); // Refresh the list
				alert("Product deleted successfully!");
			} else {
				const error = await response.json();
				alert(error.error || "Failed to delete product");
			}
		} catch (error) {
			console.error("Error deleting product:", error);
			alert("Network error. Please try again.");
		}
	};

	const resetForm = () => {
		setFormData({
			name: "",
			description: "",
			price: "",
			stock: "",
			image: "",
		});
		setEditingProduct(null);
	};

	const filteredProducts = products.filter((p) =>
		p.name?.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-momma-pink"></div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold text-momma-brown">
					Products
				</h1>
				<button
					onClick={() => {
						resetForm();
						setShowModal(true);
					}}
					className="btn-primary flex items-center gap-2"
				>
					<FiPlus /> Add Product
				</button>
			</div>

			{/* Search */}
			<div className="relative">
				<FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
				<input
					type="text"
					placeholder="Search products..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
				/>
			</div>

			{/* Products Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{filteredProducts.map((product) => (
					<div
						key={product.id}
						className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
					>
						<div className="h-48 bg-gray-100 overflow-hidden">
							{product.image ? (
								<img
									src={product.image}
									alt={product.name}
									className="w-full h-full object-cover"
								/>
							) : (
								<div className="w-full h-full flex items-center justify-center text-gray-400">
									No image
								</div>
							)}
						</div>
						<div className="p-4">
							<h3 className="font-semibold text-momma-brown text-lg mb-1">
								{product.name}
							</h3>
							<p className="text-gray-600 text-sm mb-2 line-clamp-2">
								{product.description}
							</p>
							<div className="flex justify-between items-center mb-3">
								<span className="text-2xl font-bold text-momma-pink">
									KSh {product.price?.toLocaleString()}
								</span>
								<span
									className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}
								>
									Stock: {product.stock}
								</span>
							</div>
							<div className="flex gap-2">
								<button
									onClick={() => {
										setEditingProduct(product);
										setFormData({
											name: product.name,
											description: product.description,
											price: product.price,
											stock: product.stock,
											image: product.image || "",
										});
										setShowModal(true);
									}}
									className="flex-1 px-3 py-2 border border-momma-pink text-momma-pink rounded-lg hover:bg-pink-50 transition-colors flex items-center justify-center gap-1"
								>
									<FiEdit2 /> Edit
								</button>
								<button
									onClick={() => handleDelete(product.id)}
									className="px-3 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
								>
									<FiTrash2 /> Delete
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Modal */}
			{showModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
						<div className="flex justify-between items-center p-6 border-b">
							<h2 className="text-xl font-bold text-momma-brown">
								{editingProduct
									? "Edit Product"
									: "Add New Product"}
							</h2>
							<button
								onClick={() => setShowModal(false)}
								className="p-1 hover:bg-gray-100 rounded-lg"
							>
								<FiX />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="p-6 space-y-4">
							<div>
								<label className="block text-gray-700 font-medium mb-1">
									Product Name
								</label>
								<input
									type="text"
									value={formData.name}
									onChange={(e) =>
										setFormData({
											...formData,
											name: e.target.value,
										})
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
									required
								/>
							</div>

							<div>
								<label className="block text-gray-700 font-medium mb-1">
									Description
								</label>
								<textarea
									value={formData.description}
									onChange={(e) =>
										setFormData({
											...formData,
											description: e.target.value,
										})
									}
									rows="3"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
									required
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-gray-700 font-medium mb-1">
										Price (KSh)
									</label>
									<input
										type="number"
										value={formData.price}
										onChange={(e) =>
											setFormData({
												...formData,
												price: e.target.value,
											})
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
										required
									/>
								</div>
								<div>
									<label className="block text-gray-700 font-medium mb-1">
										Stock
									</label>
									<input
										type="number"
										value={formData.stock}
										onChange={(e) =>
											setFormData({
												...formData,
												stock: e.target.value,
											})
										}
										className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-momma-pink"
										required
									/>
								</div>
							</div>

							<div>
								<label className="block text-gray-700 font-medium mb-1">
									Product Image
								</label>
								<input
									type="file"
									onChange={handleImageUpload}
									accept="image/*"
									className="w-full px-3 py-2 border border-gray-300 rounded-lg"
								/>
								{uploading && (
									<p className="text-sm text-gray-500 mt-1">
										Uploading...
									</p>
								)}
								{formData.image && (
									<img
										src={formData.image}
										alt="Preview"
										className="mt-2 w-32 h-32 object-cover rounded-lg"
									/>
								)}
							</div>

							<button
								type="submit"
								className="btn-primary w-full py-2"
								disabled={uploading}
							>
								{editingProduct
									? "Update Product"
									: "Create Product"}
							</button>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default Products;
