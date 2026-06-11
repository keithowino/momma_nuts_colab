import { Link } from "react-router-dom";
import { FiShoppingCart, FiHeart, FiTruck } from "react-icons/fi";

const Home = () => {
	return (
		<div>
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-momma-brown to-momma-orange text-white rounded-2xl mb-16">
				<div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-4">
						Welcome to{" "}
						<span className="text-momma-pink">Momma Nut</span>
					</h1>
					<p className="text-lg md:text-xl mb-8 opacity-90">
						Discover delicious peanut products, recipes, and more!
					</p>
					<Link
						to="/user-products"
						className="inline-block bg-momma-pink text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
					>
						Explore Now
					</Link>
				</div>
			</section>

			{/* Features Section */}
			<section className="mb-16">
				<h2 className="text-3xl font-bold text-center text-momma-brown mb-12">
					Why Choose Momma Nuts?
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="card p-6 text-center hover:transform hover:-translate-y-1 transition-all duration-300">
						<div className="w-16 h-16 bg-momma-pink bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
							<FiTruck className="text-3xl text-momma-pink" />
						</div>
						<h3 className="text-xl font-semibold text-momma-brown mb-2">
							Fresh Peanuts
						</h3>
						<p className="text-gray-600">
							Handpicked, roasted, and delivered to your door.
						</p>
					</div>

					<div className="card p-6 text-center hover:transform hover:-translate-y-1 transition-all duration-300">
						<div className="w-16 h-16 bg-momma-orange bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
							<FiHeart className="text-3xl text-momma-orange" />
						</div>
						<h3 className="text-xl font-semibold text-momma-brown mb-2">
							Nutty Recipes
						</h3>
						<p className="text-gray-600">
							Try our favorite peanut-inspired recipes for every
							occasion.
						</p>
					</div>

					<div className="card p-6 text-center hover:transform hover:-translate-y-1 transition-all duration-300">
						<div className="w-16 h-16 bg-momma-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
							<FiShoppingCart className="text-3xl text-momma-gold" />
						</div>
						<h3 className="text-xl font-semibold text-momma-brown mb-2">
							Healthy & Tasty
						</h3>
						<p className="text-gray-600">
							Enjoy snacks that are as nutritious as they are
							delicious.
						</p>
					</div>
				</div>
			</section>

			{/* Call to Action Section */}
			<section className="bg-gradient-to-r from-momma-pink to-momma-orange rounded-2xl p-8 md:p-12 text-center text-white">
				<h2 className="text-2xl md:text-3xl font-bold mb-4">
					Ready to Snack Healthy?
				</h2>
				<p className="mb-6 opacity-90">
					Browse our collection of premium peanut products
				</p>
				<Link
					to="/user-products"
					className="inline-block bg-white text-momma-brown px-8 py-3 rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg"
				>
					Shop Now
				</Link>
			</section>
		</div>
	);
};

export default Home;
