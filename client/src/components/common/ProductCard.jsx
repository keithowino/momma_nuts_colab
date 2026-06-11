import { Link } from "react-router-dom";
import { FiShoppingCart, FiHeart } from "react-icons/fi";

const ProductCard = ({ product }) => {
	const { id, name, description, price, image, stock } = product;

	return (
		<div className="card group">
			<Link to={`/product/${product.id}`}>
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
						{/* <button
						className="btn-primary px-4 py-2 text-sm flex items-center gap-2"
						disabled={stock <= 0}
					>
						<FiShoppingCart />
						{stock > 0 ? "Add to Cart" : "Sold Out"}
					</button> */}
					</div>
				</div>
			</Link>

			{/* Keep Add to Cart button outside Link */}
			<div className="px-4 pb-4">
				{/* <button className="btn-primary w-full">Add to Cart</button> */}
				<button
					className="btn-primary text-sm flex items-center gap-2"
					disabled={stock <= 0}
				>
					<FiShoppingCart />
					{stock > 0 ? "Add to Cart" : "Sold Out"}
				</button>
			</div>
		</div>
	);
};

export default ProductCard;
