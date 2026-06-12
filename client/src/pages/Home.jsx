// import { Link } from "react-router-dom";
// import { FiShoppingCart, FiHeart, FiTruck } from "react-icons/fi";

// const Home = () => {
// 	return (
// 		<div>
// 			{/* Hero Section */}
// 			<section className="bg-gradient-to-r from-momma-brown to-momma-orange text-white rounded-2xl mb-16">
// 				<div className="max-w-4xl mx-auto px-6 py-16 md:py-24 text-center">
// 					<h1 className="text-4xl md:text-6xl font-bold mb-4">
// 						Welcome to{" "}
// 						<span className="text-momma-pink">Momma Nut</span>
// 					</h1>
// 					<p className="text-lg md:text-xl mb-8 opacity-90">
// 						Discover delicious peanut products, recipes, and more!
// 					</p>
// 					<Link
// 						to="/user-products"
// 						className="inline-block bg-momma-pink text-white px-8 py-3 rounded-full hover:bg-opacity-90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
// 					>
// 						Explore Now
// 					</Link>
// 				</div>
// 			</section>

// 			{/* Features Section */}
// 			<section className="mb-16">
// 				<h2 className="text-3xl font-bold text-center text-momma-brown mb-12">
// 					Why Choose Momma Nuts?
// 				</h2>
// 				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// 					<div className="card p-6 text-center hover:transform hover:-translate-y-1 transition-all duration-300">
// 						<div className="w-16 h-16 bg-momma-pink bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
// 							<FiTruck className="text-3xl text-momma-pink" />
// 						</div>
// 						<h3 className="text-xl font-semibold text-momma-brown mb-2">
// 							Fresh Peanuts
// 						</h3>
// 						<p className="text-gray-600">
// 							Handpicked, roasted, and delivered to your door.
// 						</p>
// 					</div>

// 					<div className="card p-6 text-center hover:transform hover:-translate-y-1 transition-all duration-300">
// 						<div className="w-16 h-16 bg-momma-orange bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
// 							<FiHeart className="text-3xl text-momma-orange" />
// 						</div>
// 						<h3 className="text-xl font-semibold text-momma-brown mb-2">
// 							Nutty Recipes
// 						</h3>
// 						<p className="text-gray-600">
// 							Try our favorite peanut-inspired recipes for every
// 							occasion.
// 						</p>
// 					</div>

// 					<div className="card p-6 text-center hover:transform hover:-translate-y-1 transition-all duration-300">
// 						<div className="w-16 h-16 bg-momma-gold bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
// 							<FiShoppingCart className="text-3xl text-momma-gold" />
// 						</div>
// 						<h3 className="text-xl font-semibold text-momma-brown mb-2">
// 							Healthy & Tasty
// 						</h3>
// 						<p className="text-gray-600">
// 							Enjoy snacks that are as nutritious as they are
// 							delicious.
// 						</p>
// 					</div>
// 				</div>
// 			</section>

// 			{/* Call to Action Section */}
// 			<section className="bg-gradient-to-r from-momma-pink to-momma-orange rounded-2xl p-8 md:p-12 text-center text-white">
// 				<h2 className="text-2xl md:text-3xl font-bold mb-4">
// 					Ready to Snack Healthy?
// 				</h2>
// 				<p className="mb-6 opacity-90">
// 					Browse our collection of premium peanut products
// 				</p>
// 				<Link
// 					to="/user-products"
// 					className="inline-block bg-white text-momma-brown px-8 py-3 rounded-full hover:bg-gray-100 transition-all duration-200 shadow-lg"
// 				>
// 					Shop Now
// 				</Link>
// 			</section>
// 		</div>
// 	);
// };

// export default Home;

// ---------------
// // grok instance
// import { Link } from "react-router-dom";
// import {
// 	FiShoppingCart,
// 	FiHeart,
// 	FiTruck,
// 	FiAward,
// 	FiUsers,
// } from "react-icons/fi";
// import { MdOutlineCookie, MdOutlineLocalOffer } from "react-icons/md";

// const Home = () => {
// 	return (
// 		<div className="overflow-hidden">
// 			{/* Hero Section - More Impactful */}
// 			<section className="relative bg-gradient-to-br from-momma-brown via-momma-orange to-momma-pink text-white min-h-[90vh] flex items-center rounded-b-[3rem]">
// 				{/* Background Pattern Overlay */}
// 				<div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>

// 				<div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center relative z-10">
// 					<div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full mb-6 text-sm font-medium">
// 						<span className="relative flex h-3 w-3">
// 							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-momma-pink opacity-75"></span>
// 							<span className="relative inline-flex rounded-full h-3 w-3 bg-momma-pink"></span>
// 						</span>
// 						Fresh from the Farm • Roasted with Love
// 					</div>

// 					<h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
// 						Welcome to{" "}
// 						<span className="text-momma-pink drop-shadow-lg">
// 							Momma Nut
// 						</span>
// 					</h1>

// 					<p className="max-w-2xl mx-auto text-xl md:text-2xl mb-10 opacity-95">
// 						Premium peanuts, handcrafted snacks, and irresistible
// 						recipes — bringing joy and nutrition to your table since
// 						day one.
// 					</p>

// 					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
// 						<Link
// 							to="/user-products"
// 							className="inline-flex items-center gap-3 bg-white text-momma-brown px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-momma-pink hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl group"
// 						>
// 							Shop Our Collection
// 							<FiShoppingCart className="group-hover:rotate-12 transition-transform" />
// 						</Link>

// 						<Link
// 							to="/recipes"
// 							className="inline-flex items-center gap-3 border-2 border-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-momma-brown transition-all duration-300"
// 						>
// 							Discover Recipes
// 						</Link>
// 					</div>

// 					<div className="mt-16 flex flex-wrap justify-center gap-8 text-sm opacity-90">
// 						<div className="flex items-center gap-2">
// 							<FiTruck className="text-2xl" /> Free Shipping on
// 							orders $50+
// 						</div>
// 						<div className="flex items-center gap-2">
// 							<FiAward className="text-2xl" /> 100% Natural
// 							Ingredients
// 						</div>
// 						<div className="flex items-center gap-2">
// 							<FiHeart className="text-2xl" /> Loved by 10,000+
// 							Customers
// 						</div>
// 					</div>
// 				</div>

// 				{/* Floating Product Tease */}
// 				<div className="hidden lg:block absolute -bottom-12 right-12 bg-white text-momma-brown rounded-3xl p-6 shadow-2xl max-w-[220px]">
// 					<div className="text-center">
// 						<div className="mx-auto w-20 h-20 bg-momma-orange/10 rounded-2xl flex items-center justify-center mb-3">
// 							🥜
// 						</div>
// 						<p className="font-semibold">
// 							Momma's Classic Roasted Peanuts
// 						</p>
// 						<p className="text-sm text-momma-pink">
// 							$8.99 • In Stock
// 						</p>
// 						<Link
// 							to="/user-products"
// 							className="text-xs mt-3 inline-block underline"
// 						>
// 							Shop now →
// 						</Link>
// 					</div>
// 				</div>
// 			</section>

// 			{/* Trust Bar */}
// 			<div className="bg-white py-6 border-b">
// 				<div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-sm text-gray-500">
// 					<div className="flex items-center gap-3">
// 						<FiTruck className="text-3xl text-momma-orange" />
// 						<div>
// 							<p className="font-medium text-momma-brown">
// 								Fast Delivery
// 							</p>
// 							<p className="text-xs">2-4 days nationwide</p>
// 						</div>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<FiAward className="text-3xl text-momma-pink" />
// 						<div>
// 							<p className="font-medium text-momma-brown">
// 								Premium Quality
// 							</p>
// 							<p className="text-xs">Sourced from family farms</p>
// 						</div>
// 					</div>
// 					<div className="flex items-center gap-3">
// 						<MdOutlineLocalOffer className="text-3xl text-momma-gold" />
// 						<div>
// 							<p className="font-medium text-momma-brown">
// 								Seasonal Specials
// 							</p>
// 							<p className="text-xs">Limited-time flavors</p>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			{/* Features Section - Enhanced with Icons & Better Copy */}
// 			<section className="max-w-6xl mx-auto px-6 py-20">
// 				<h2 className="text-4xl font-bold text-center text-momma-brown mb-4">
// 					Why Families Love Momma Nut
// 				</h2>
// 				<p className="text-center text-gray-600 max-w-md mx-auto mb-16">
// 					From our family to yours — quality you can taste in every
// 					bite.
// 				</p>

// 				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
// 					<div className="group bg-white border border-gray-100 rounded-3xl p-8 hover:border-momma-pink/30 hover:shadow-xl transition-all duration-300">
// 						<div className="w-20 h-20 bg-momma-pink/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
// 							<FiTruck className="text-5xl text-momma-pink" />
// 						</div>
// 						<h3 className="text-2xl font-semibold text-momma-brown mb-3">
// 							Farm to Table Fresh
// 						</h3>
// 						<p className="text-gray-600 leading-relaxed">
// 							Hand-selected Virginia peanuts roasted daily in
// 							small batches. Never frozen, never compromised.
// 						</p>
// 						<div className="mt-6 text-momma-pink text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
// 							Learn about our farms →
// 						</div>
// 					</div>

// 					<div className="group bg-white border border-gray-100 rounded-3xl p-8 hover:border-momma-orange/30 hover:shadow-xl transition-all duration-300">
// 						<div className="w-20 h-20 bg-momma-orange/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
// 							<MdOutlineCookie className="text-5xl text-momma-orange" />
// 						</div>
// 						<h3 className="text-2xl font-semibold text-momma-brown mb-3">
// 							Creative Recipes
// 						</h3>
// 						<p className="text-gray-600 leading-relaxed">
// 							Mouthwatering ideas for peanut butter cookies, spicy
// 							snacks, energy bars, and wholesome family meals.
// 						</p>
// 						<Link
// 							to="/recipes"
// 							className="mt-6 text-momma-orange text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
// 						>
// 							Browse all recipes →
// 						</Link>
// 					</div>

// 					<div className="group bg-white border border-gray-100 rounded-3xl p-8 hover:border-momma-gold/30 hover:shadow-xl transition-all duration-300">
// 						<div className="w-20 h-20 bg-momma-gold/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
// 							<FiHeart className="text-5xl text-momma-gold" />
// 						</div>
// 						<h3 className="text-2xl font-semibold text-momma-brown mb-3">
// 							Guilt-Free Goodness
// 						</h3>
// 						<p className="text-gray-600 leading-relaxed">
// 							High in protein, healthy fats, and natural energy.
// 							Perfect for kids, athletes, and everyone in between.
// 						</p>
// 						<div className="mt-6 text-momma-gold text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
// 							Nutrition facts →
// 						</div>
// 					</div>
// 				</div>
// 			</section>

// 			{/* Best Sellers / Popular Products Teaser */}
// 			<section className="bg-momma-brown/5 py-20">
// 				<div className="max-w-6xl mx-auto px-6">
// 					<div className="flex flex-col md:flex-row justify-between items-end mb-12">
// 						<div>
// 							<h2 className="text-4xl font-bold text-momma-brown">
// 								Best Sellers
// 							</h2>
// 							<p className="text-gray-600">
// 								Our customers can't get enough of these
// 							</p>
// 						</div>
// 						<Link
// 							to="/user-products"
// 							className="text-momma-pink hover:underline flex items-center gap-2 mt-4 md:mt-0"
// 						>
// 							View all products <span aria-hidden="true">→</span>
// 						</Link>
// 					</div>

// 					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
// 						{/* Product Card 1 */}
// 						<div className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition-all group">
// 							<div className="h-56 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">
// 								🥜
// 							</div>
// 							<div className="p-6">
// 								<p className="font-semibold text-momma-brown">
// 									Classic Roasted Peanuts
// 								</p>
// 								<p className="text-sm text-gray-500">
// 									16oz • Lightly salted
// 								</p>
// 								<div className="flex justify-between items-end mt-4">
// 									<p className="text-2xl font-bold text-momma-pink">
// 										$8.99
// 									</p>
// 									<Link
// 										to="/user-products"
// 										className="bg-momma-pink text-white px-5 py-2 rounded-2xl text-sm hover:bg-momma-orange transition-colors"
// 									>
// 										Add to cart
// 									</Link>
// 								</div>
// 							</div>
// 						</div>

// 						{/* Product Card 2 */}
// 						<div className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition-all group">
// 							<div className="h-56 bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">
// 								🥜🍫
// 							</div>
// 							<div className="p-6">
// 								<p className="font-semibold text-momma-brown">
// 									Peanut Butter Chocolate Bark
// 								</p>
// 								<p className="text-sm text-gray-500">
// 									Limited Edition
// 								</p>
// 								<div className="flex justify-between items-end mt-4">
// 									<p className="text-2xl font-bold text-momma-pink">
// 										$12.49
// 									</p>
// 									<Link
// 										to="/user-products"
// 										className="bg-momma-pink text-white px-5 py-2 rounded-2xl text-sm hover:bg-momma-orange transition-colors"
// 									>
// 										Add to cart
// 									</Link>
// 								</div>
// 							</div>
// 						</div>

// 						{/* Product Card 3 */}
// 						<div className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition-all group">
// 							<div className="h-56 bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">
// 								🌶️🥜
// 							</div>
// 							<div className="p-6">
// 								<p className="font-semibold text-momma-brown">
// 									Spicy Honey Peanuts
// 								</p>
// 								<p className="text-sm text-gray-500">
// 									12oz • Kick of heat
// 								</p>
// 								<div className="flex justify-between items-end mt-4">
// 									<p className="text-2xl font-bold text-momma-pink">
// 										$9.99
// 									</p>
// 									<Link
// 										to="/user-products"
// 										className="bg-momma-pink text-white px-5 py-2 rounded-2xl text-sm hover:bg-momma-orange transition-colors"
// 									>
// 										Add to cart
// 									</Link>
// 								</div>
// 							</div>
// 						</div>

// 						{/* Product Card 4 */}
// 						<div className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition-all group">
// 							<div className="h-56 bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">
// 								🥜🍯
// 							</div>
// 							<div className="p-6">
// 								<p className="font-semibold text-momma-brown">
// 									Honey Roasted Cashew Mix
// 								</p>
// 								<p className="text-sm text-gray-500">
// 									Family size
// 								</p>
// 								<div className="flex justify-between items-end mt-4">
// 									<p className="text-2xl font-bold text-momma-pink">
// 										$14.99
// 									</p>
// 									<Link
// 										to="/user-products"
// 										className="bg-momma-pink text-white px-5 py-2 rounded-2xl text-sm hover:bg-momma-orange transition-colors"
// 									>
// 										Add to cart
// 									</Link>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</section>

// 			{/* Testimonials */}
// 			<section className="max-w-6xl mx-auto px-6 py-20">
// 				<h2 className="text-4xl font-bold text-center text-momma-brown mb-16">
// 					Real Love from Real Families
// 				</h2>

// 				<div className="grid md:grid-cols-3 gap-8">
// 					<div className="bg-white p-8 rounded-3xl border border-gray-100">
// 						<div className="flex text-momma-pink mb-4">★★★★★</div>
// 						<p className="italic text-gray-700">
// 							"The best peanuts we've ever had. My kids actually
// 							ask for these instead of chips!"
// 						</p>
// 						<div className="mt-8 flex items-center gap-3">
// 							<div className="w-10 h-10 bg-momma-orange rounded-full"></div>
// 							<div>
// 								<p className="font-medium">Sarah M.</p>
// 								<p className="text-xs text-gray-500">
// 									Atlanta, GA
// 								</p>
// 							</div>
// 						</div>
// 					</div>

// 					<div className="bg-white p-8 rounded-3xl border border-gray-100">
// 						<div className="flex text-momma-pink mb-4">★★★★☆</div>
// 						<p className="italic text-gray-700">
// 							"Their spicy honey peanuts are addictive. Great for
// 							game nights and hiking snacks."
// 						</p>
// 						<div className="mt-8 flex items-center gap-3">
// 							<div className="w-10 h-10 bg-momma-brown rounded-full"></div>
// 							<div>
// 								<p className="font-medium">Marcus T.</p>
// 								<p className="text-xs text-gray-500">
// 									Denver, CO
// 								</p>
// 							</div>
// 						</div>
// 					</div>

// 					<div className="bg-white p-8 rounded-3xl border border-gray-100">
// 						<div className="flex text-momma-pink mb-4">★★★★★</div>
// 						<p className="italic text-gray-700">
// 							"Momma Nut has become our go-to gift for holidays.
// 							Everyone loves the quality and packaging."
// 						</p>
// 						<div className="mt-8 flex items-center gap-3">
// 							<div className="w-10 h-10 bg-momma-gold rounded-full"></div>
// 							<div>
// 								<p className="font-medium">Elena Rodriguez</p>
// 								<p className="text-xs text-gray-500">
// 									Miami, FL
// 								</p>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</section>

// 			{/* Final CTA + Newsletter */}
// 			<section className="bg-gradient-to-r from-momma-pink to-momma-orange text-white rounded-3xl mx-6 mb-16 py-16 px-8 md:px-16 text-center">
// 				<div className="max-w-2xl mx-auto">
// 					<h2 className="text-4xl font-bold mb-4">
// 						Join the Momma Nut Family
// 					</h2>
// 					<p className="text-xl mb-10 opacity-90">
// 						Get exclusive recipes, early access to new flavors, and
// 						10% off your first order.
// 					</p>

// 					<div className="max-w-md mx-auto">
// 						<form className="flex flex-col sm:flex-row gap-3">
// 							<input
// 								type="email"
// 								placeholder="your@email.com"
// 								className="flex-1 px-6 py-4 rounded-2xl text-momma-brown placeholder:text-gray-400 focus:outline-none"
// 							/>
// 							<button
// 								type="submit"
// 								className="bg-white text-momma-pink font-semibold px-10 py-4 rounded-2xl hover:bg-momma-gold hover:text-white transition-all whitespace-nowrap"
// 							>
// 								Subscribe
// 							</button>
// 						</form>
// 						<p className="text-xs opacity-75 mt-4">
// 							We respect your inbox as much as we respect our
// 							peanuts.
// 						</p>
// 					</div>
// 				</div>
// 			</section>
// 		</div>
// 	);
// };

// export default Home;

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
	FiShoppingCart,
	FiHeart,
	FiTruck,
	FiAward,
	FiUsers,
	FiStar,
	FiChevronLeft,
	FiChevronRight,
	FiX,
	FiEye,
	FiClock,
	FiGift,
	FiMessageCircle,
	FiPlay,
	FiPause,
} from "react-icons/fi";
import { MdOutlineCookie, MdOutlineLocalOffer } from "react-icons/md";

const API_URL = "http://127.0.0.1:5000";

const Home = () => {
	const navigate = useNavigate();
	const [currentSlide, setCurrentSlide] = useState(0);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [showQuickView, setShowQuickView] = useState(false);
	const [countdown, setCountdown] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});
	const [featuredProducts, setFeaturedProducts] = useState([]);
	const [addingToCart, setAddingToCart] = useState(null);
	const [showChat, setShowChat] = useState(false);
	const [chatMessage, setChatMessage] = useState("");
	const [chatMessages, setChatMessages] = useState([
		{ type: "bot", text: "Hi there! 👋 How can I help you today?" },
	]);
	const [newsletterEmail, setNewsletterEmail] = useState("");
	const [newsletterStatus, setNewsletterStatus] = useState("");
	const [quizStep, setQuizStep] = useState(0);
	const [showQuiz, setShowQuiz] = useState(false);
	const [quizAnswers, setQuizAnswers] = useState({});

	// Hero carousel slides
	const slides = [
		{
			id: 1,
			title: "Summer Harvest Collection",
			subtitle: "Limited Edition Flavors",
			description:
				"Discover our new honey cinnamon and spicy mango peanuts",
			bgGradient: "from-momma-brown to-momma-orange",
			ctaText: "Shop Summer Collection",
			ctaLink: "/user-products?collection=summer",
			image: "🌞",
		},
		{
			id: 2,
			title: "Family Bundle Sale",
			subtitle: "Save 25%",
			description:
				"Get the ultimate snack pack for game nights and parties",
			bgGradient: "from-momma-pink to-momma-orange",
			ctaText: "Shop Bundles",
			ctaLink: "/user-products?category=bundles",
			image: "👨‍👩‍👧‍👦",
		},
		{
			id: 3,
			title: "New! Peanut Butter Cups",
			subtitle: "Customer Favorite",
			description: "Creamy peanut butter wrapped in rich dark chocolate",
			bgGradient: "from-momma-brown to-momma-pink",
			ctaText: "Try Now",
			ctaLink: "/product/3",
			image: "🍫",
		},
	];

	// Fetch real products from backend
	useEffect(() => {
		fetchProducts();
		startCountdown();
	}, []);

	const fetchProducts = async () => {
		try {
			const response = await fetch(`${API_URL}/products`);
			const data = await response.json();
			setFeaturedProducts(Array.isArray(data) ? data.slice(0, 4) : []);
		} catch (error) {
			console.error("Error fetching products:", error);
			// Fallback demo products if backend not available
			setFeaturedProducts([
				{
					id: 1,
					name: "Classic Roasted Peanuts",
					price: 8.99,
					image: "🥜",
					stock: 50,
					description: "Lightly salted, perfectly roasted",
				},
				{
					id: 2,
					name: "Honey Roasted Cashews",
					price: 14.99,
					image: "🍯",
					stock: 30,
					description: "Sweet and crunchy family favorite",
				},
				{
					id: 3,
					name: "Spicy Chili Peanuts",
					price: 9.99,
					image: "🌶️",
					stock: 45,
					description: "A kick of heat in every bite",
				},
				{
					id: 4,
					name: "Dark Chocolate Peanut Butter Cups",
					price: 12.49,
					image: "🍫",
					stock: 25,
					description: "Decadent and satisfying",
				},
			]);
		}
	};

	// Countdown timer for limited offer
	const startCountdown = () => {
		const targetDate = new Date();
		targetDate.setDate(targetDate.getDate() + 7); // 7 days from now

		const interval = setInterval(() => {
			const now = new Date();
			const difference = targetDate - now;

			if (difference <= 0) {
				clearInterval(interval);
				setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
				return;
			}

			setCountdown({
				days: Math.floor(difference / (1000 * 60 * 60 * 24)),
				hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
				minutes: Math.floor((difference / 1000 / 60) % 60),
				seconds: Math.floor((difference / 1000) % 60),
			});
		}, 1000);

		return () => clearInterval(interval);
	};

	// Carousel controls
	const nextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % slides.length);
	};

	const prevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
	};

	// Add to cart function
	const handleAddToCart = async (productId, productName) => {
		const token = localStorage.getItem("access_token");
		if (!token) {
			alert("Please login to add items to cart");
			navigate("/login");
			return;
		}

		setAddingToCart(productId);
		try {
			const response = await fetch(`${API_URL}/cart`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ product_id: productId, quantity: 1 }),
			});

			if (response.ok) {
				// Show success feedback without alert
				const event = new CustomEvent("cartUpdated", {
					detail: { productId, productName },
				});
				window.dispatchEvent(event);
			} else {
				const error = await response.json();
				alert(error.error || "Failed to add to cart");
			}
		} catch (error) {
			console.error("Error adding to cart:", error);
			alert("Network error. Please try again.");
		} finally {
			setTimeout(() => setAddingToCart(null), 1000);
		}
	};

	// Newsletter subscription
	const handleNewsletter = async (e) => {
		e.preventDefault();
		if (!newsletterEmail) return;

		setNewsletterStatus("sending");
		// Simulate API call - replace with actual endpoint
		setTimeout(() => {
			setNewsletterStatus("success");
			setNewsletterEmail("");
			setTimeout(() => setNewsletterStatus(""), 3000);
		}, 1000);
	};

	// Live chat functions
	const sendChatMessage = () => {
		if (!chatMessage.trim()) return;

		setChatMessages([...chatMessages, { type: "user", text: chatMessage }]);
		setChatMessage("");

		// Simulate bot response
		setTimeout(() => {
			const botResponses = [
				"Thanks for your message! Our team will get back to you shortly.",
				"Great question! You can find our shipping policy in the footer.",
				"Yes, we offer free shipping on orders over KSh 2000!",
				"We're here to help! What else can I assist you with?",
			];
			const randomResponse =
				botResponses[Math.floor(Math.random() * botResponses.length)];
			setChatMessages((prev) => [
				...prev,
				{ type: "bot", text: randomResponse },
			]);
		}, 1000);
	};

	// Gift Finder Quiz
	const quizQuestions = [
		{
			question: "Who are you shopping for?",
			options: ["Dad", "Mom", "Friend", "Colleague", "Myself"],
		},
		{
			question: "What's their flavor preference?",
			options: [
				"Classic & Savory",
				"Sweet & Honey",
				"Spicy & Bold",
				"Chocolate Lover",
			],
		},
		{
			question: "What's your budget?",
			options: ["Under $15", "$15-$25", "$25-$40", "$40+"],
		},
	];

	const handleQuizAnswer = (answer) => {
		const newAnswers = { ...quizAnswers, [quizStep]: answer };
		setQuizAnswers(newAnswers);

		if (quizStep < quizQuestions.length - 1) {
			setQuizStep(quizStep + 1);
		} else {
			// Quiz complete - show recommendation
			localStorage.setItem("quizAnswers", JSON.stringify(newAnswers));
			setShowQuiz(false);
			setQuizStep(0);
			setQuizAnswers({});
			navigate("/user-products?recommended=true");
		}
	};

	return (
		<div className="overflow-hidden">
			{/* Hero Carousel */}
			<section className="relative">
				<div
					className={`bg-gradient-to-r ${slides[currentSlide].bgGradient} text-white min-h-[85vh] flex items-center transition-all duration-500`}
				>
					<div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>

					<div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center relative z-10">
						<div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full mb-6 text-sm font-medium">
							<span className="relative flex h-3 w-3">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-momma-pink opacity-75"></span>
								<span className="relative inline-flex rounded-full h-3 w-3 bg-momma-pink"></span>
							</span>
							{slides[currentSlide].subtitle}
						</div>

						<h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
							{slides[currentSlide].title}
						</h1>

						<p className="max-w-2xl mx-auto text-xl md:text-2xl mb-10 opacity-95">
							{slides[currentSlide].description}
						</p>

						<Link
							to={slides[currentSlide].ctaLink}
							className="inline-flex items-center gap-3 bg-white text-momma-brown px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-momma-pink hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl group"
						>
							{slides[currentSlide].ctaText}
							<FiShoppingCart className="group-hover:rotate-12 transition-transform" />
						</Link>
					</div>

					{/* Floating emoji */}
					<div className="hidden lg:block absolute -bottom-12 right-12 bg-white text-momma-brown rounded-3xl p-6 shadow-2xl text-8xl">
						{slides[currentSlide].image}
					</div>
				</div>

				{/* Carousel Controls */}
				<button
					onClick={prevSlide}
					className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 backdrop-blur-sm transition-all"
				>
					<FiChevronLeft className="text-white text-2xl" />
				</button>
				<button
					onClick={nextSlide}
					className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-3 backdrop-blur-sm transition-all"
				>
					<FiChevronRight className="text-white text-2xl" />
				</button>

				{/* Slide Indicators */}
				<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
					{slides.map((_, idx) => (
						<button
							key={idx}
							onClick={() => setCurrentSlide(idx)}
							className={`w-2 h-2 rounded-full transition-all ${
								currentSlide === idx
									? "bg-white w-8"
									: "bg-white/50"
							}`}
						/>
					))}
				</div>
			</section>

			{/* Countdown Timer Banner */}
			<div className="bg-gradient-to-r from-momma-pink to-momma-orange py-3 text-white text-center">
				<div className="flex items-center justify-center gap-2 flex-wrap px-4">
					<FiClock className="animate-pulse" />
					<span className="font-semibold">Limited Time Offer:</span>
					<span>Summer Harvest Sale ends in</span>
					<div className="flex gap-2 font-mono">
						<span className="bg-white/20 px-2 py-1 rounded">
							{countdown.days}d
						</span>
						<span className="bg-white/20 px-2 py-1 rounded">
							{countdown.hours}h
						</span>
						<span className="bg-white/20 px-2 py-1 rounded">
							{countdown.minutes}m
						</span>
						<span className="bg-white/20 px-2 py-1 rounded">
							{countdown.seconds}s
						</span>
					</div>
				</div>
			</div>

			{/* Trust Bar */}
			<div className="bg-white py-6 border-b">
				<div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-sm text-gray-500">
					<div className="flex items-center gap-3">
						<FiTruck className="text-3xl text-momma-orange" />
						<div>
							<p className="font-medium text-momma-brown">
								Fast Delivery
							</p>
							<p className="text-xs">2-4 days nationwide</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<FiAward className="text-3xl text-momma-pink" />
						<div>
							<p className="font-medium text-momma-brown">
								Premium Quality
							</p>
							<p className="text-xs">Sourced from family farms</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<MdOutlineLocalOffer className="text-3xl text-momma-gold" />
						<div>
							<p className="font-medium text-momma-brown">
								Seasonal Specials
							</p>
							<p className="text-xs">Limited-time flavors</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<FiHeart className="text-3xl text-momma-pink" />
						<div>
							<p className="font-medium text-momma-brown">
								Loved by Many
							</p>
							<p className="text-xs">10,000+ happy customers</p>
						</div>
					</div>
				</div>
			</div>

			{/* Features Section */}
			<section className="max-w-6xl mx-auto px-6 py-20">
				<h2 className="text-4xl font-bold text-center text-momma-brown mb-4">
					Why Families Love Momma Nut
				</h2>
				<p className="text-center text-gray-600 max-w-md mx-auto mb-16">
					From our family to yours — quality you can taste in every
					bite.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					<div className="group bg-white border border-gray-100 rounded-3xl p-8 hover:border-momma-pink/30 hover:shadow-xl transition-all duration-300">
						<div className="w-20 h-20 bg-momma-pink/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
							<FiTruck className="text-5xl text-momma-pink" />
						</div>
						<h3 className="text-2xl font-semibold text-momma-brown mb-3">
							Farm to Table Fresh
						</h3>
						<p className="text-gray-600 leading-relaxed">
							Hand-selected Virginia peanuts roasted daily in
							small batches. Never frozen, never compromised.
						</p>
					</div>

					<div className="group bg-white border border-gray-100 rounded-3xl p-8 hover:border-momma-orange/30 hover:shadow-xl transition-all duration-300">
						<div className="w-20 h-20 bg-momma-orange/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
							<MdOutlineCookie className="text-5xl text-momma-orange" />
						</div>
						<h3 className="text-2xl font-semibold text-momma-brown mb-3">
							Creative Recipes
						</h3>
						<p className="text-gray-600 leading-relaxed">
							Mouthwatering ideas for peanut butter cookies, spicy
							snacks, energy bars, and wholesome family meals.
						</p>
					</div>

					<div className="group bg-white border border-gray-100 rounded-3xl p-8 hover:border-momma-gold/30 hover:shadow-xl transition-all duration-300">
						<div className="w-20 h-20 bg-momma-gold/10 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
							<FiHeart className="text-5xl text-momma-gold" />
						</div>
						<h3 className="text-2xl font-semibold text-momma-brown mb-3">
							Guilt-Free Goodness
						</h3>
						<p className="text-gray-600 leading-relaxed">
							High in protein, healthy fats, and natural energy.
							Perfect for kids, athletes, and everyone in between.
						</p>
					</div>
				</div>
			</section>

			{/* Best Sellers with Quick View */}
			<section className="bg-momma-brown/5 py-20">
				<div className="max-w-6xl mx-auto px-6">
					<div className="flex flex-col md:flex-row justify-between items-end mb-12">
						<div>
							<h2 className="text-4xl font-bold text-momma-brown">
								Best Sellers
							</h2>
							<p className="text-gray-600">
								Our customers can't get enough of these
							</p>
						</div>
						<Link
							to="/user-products"
							className="text-momma-pink hover:underline flex items-center gap-2 mt-4 md:mt-0"
						>
							View all products <span aria-hidden="true">→</span>
						</Link>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
						{featuredProducts.map((product) => (
							<div
								key={product.id}
								className="bg-white rounded-3xl overflow-hidden shadow hover:shadow-2xl transition-all group relative"
							>
								<div className="h-56 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform cursor-pointer">
									{product.image || "🥜"}
								</div>
								<div className="p-6">
									<h3
										className="font-semibold text-momma-brown cursor-pointer hover:text-momma-pink"
										onClick={() =>
											navigate(`/product/${product.id}`)
										}
									>
										{product.name}
									</h3>
									<p className="text-sm text-gray-500 mt-1 line-clamp-1">
										{product.description}
									</p>
									<div className="flex justify-between items-end mt-4">
										<div>
											<p className="text-2xl font-bold text-momma-pink">
												${product.price}
											</p>
											{product.stock < 10 &&
												product.stock > 0 && (
													<p className="text-xs text-orange-500">
														Only {product.stock}{" "}
														left!
													</p>
												)}
										</div>
										<div className="flex gap-2">
											<button
												onClick={() => {
													setSelectedProduct(product);
													setShowQuickView(true);
												}}
												className="text-gray-400 hover:text-momma-pink transition-colors p-2"
												title="Quick View"
											>
												<FiEye />
											</button>
											<button
												onClick={() =>
													handleAddToCart(
														product.id,
														product.name,
													)
												}
												disabled={
													addingToCart === product.id
												}
												className="bg-momma-pink text-white px-5 py-2 rounded-2xl text-sm hover:bg-momma-orange transition-colors disabled:opacity-50"
											>
												{addingToCart === product.id
													? "Adding..."
													: "Add to cart"}
											</button>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Recipe of the Week */}
			<section className="max-w-6xl mx-auto px-6 py-20">
				<div className="bg-gradient-to-r from-momma-brown/10 to-momma-pink/10 rounded-3xl overflow-hidden">
					<div className="grid md:grid-cols-2">
						<div className="p-8 md:p-12">
							<span className="text-momma-pink font-semibold text-sm uppercase tracking-wide">
								Recipe of the Week
							</span>
							<h2 className="text-3xl md:text-4xl font-bold text-momma-brown mt-2 mb-4">
								Spicy Honey Peanut Glazed Chicken
							</h2>
							<p className="text-gray-600 mb-6">
								A family-favorite dinner that comes together in
								30 minutes. Sweet, spicy, and absolutely
								irresistible.
							</p>
							<div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
								<span>⏱️ 30 mins</span>
								<span>👨‍🍳 Easy</span>
								<span>🍗 Serves 4</span>
							</div>
							<button className="btn-primary inline-flex items-center gap-2">
								Get the Recipe <span>→</span>
							</button>
						</div>
						<div className="h-64 md:h-auto bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center text-8xl">
							🍗🥜
						</div>
					</div>
				</div>
			</section>

			{/* Gift Finder Quiz Teaser */}
			<section className="py-20 bg-momma-pink/5">
				<div className="max-w-6xl mx-auto px-6 text-center">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-momma-pink/20 rounded-full mb-6">
						<FiGift className="text-4xl text-momma-pink" />
					</div>
					<h2 className="text-3xl md:text-4xl font-bold text-momma-brown mb-4">
						Not sure what to gift?
					</h2>
					<p className="text-gray-600 max-w-md mx-auto mb-8">
						Take our 30-second quiz and we'll recommend the perfect
						gift for any occasion.
					</p>
					<button
						onClick={() => setShowQuiz(true)}
						className="btn-primary inline-flex items-center gap-2"
					>
						Start Gift Finder Quiz
					</button>
				</div>
			</section>

			{/* Loyalty Program Banner */}
			<div className="bg-gradient-to-r from-momma-gold to-momma-orange py-12">
				<div className="max-w-6xl mx-auto px-6 text-center text-white">
					<h3 className="text-2xl md:text-3xl font-bold mb-2">
						Earn Points With Every Purchase
					</h3>
					<p className="text-white/90 mb-6">
						Join our loyalty program and get exclusive rewards,
						early access to sales, and free birthday treats!
					</p>
					<button className="bg-white text-momma-brown px-8 py-3 rounded-full font-semibold hover:bg-momma-pink hover:text-white transition-all">
						Learn More
					</button>
				</div>
			</div>

			{/* Newsletter CTA */}
			<section className="bg-gradient-to-r from-momma-pink to-momma-orange text-white rounded-3xl mx-6 my-16 py-16 px-8 md:px-16 text-center">
				<div className="max-w-2xl mx-auto">
					<h2 className="text-4xl font-bold mb-4">
						Join the Momma Nut Family
					</h2>
					<p className="text-xl mb-10 opacity-90">
						Get exclusive recipes, early access to new flavors, and
						10% off your first order.
					</p>

					<form
						onSubmit={handleNewsletter}
						className="max-w-md mx-auto"
					>
						<div className="flex flex-col sm:flex-row gap-3">
							<input
								type="email"
								value={newsletterEmail}
								onChange={(e) =>
									setNewsletterEmail(e.target.value)
								}
								placeholder="your@email.com"
								className="flex-1 px-6 py-4 rounded-2xl text-momma-brown placeholder:text-gray-400 focus:outline-none"
								required
							/>
							<button
								type="submit"
								disabled={newsletterStatus === "sending"}
								className="bg-white text-momma-pink font-semibold px-10 py-4 rounded-2xl hover:bg-momma-gold hover:text-white transition-all whitespace-nowrap disabled:opacity-50"
							>
								{newsletterStatus === "sending"
									? "Sending..."
									: "Subscribe"}
							</button>
						</div>
						{newsletterStatus === "success" && (
							<p className="text-sm mt-4 text-green-200">
								✓ Subscribed successfully!
							</p>
						)}
						<p className="text-xs opacity-75 mt-4">
							We respect your inbox as much as we respect our
							peanuts.
						</p>
					</form>
				</div>
			</section>

			{/* Quick View Modal */}
			{showQuickView && selectedProduct && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
						<button
							onClick={() => setShowQuickView(false)}
							className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
						>
							<FiX />
						</button>
						<div className="p-6">
							<div className="grid md:grid-cols-2 gap-6">
								<div className="h-64 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-8xl">
									{selectedProduct.image || "🥜"}
								</div>
								<div>
									<h3 className="text-2xl font-bold text-momma-brown">
										{selectedProduct.name}
									</h3>
									<p className="text-gray-600 mt-2">
										{selectedProduct.description}
									</p>
									<p className="text-3xl font-bold text-momma-pink mt-4">
										${selectedProduct.price}
									</p>
									<p
										className={`text-sm mt-2 ${
											selectedProduct.stock > 0
												? "text-green-600"
												: "text-red-600"
										}`}
									>
										{selectedProduct.stock > 0
											? `✓ ${selectedProduct.stock} in stock`
											: "Out of stock"}
									</p>
									<button
										onClick={() => {
											handleAddToCart(
												selectedProduct.id,
												selectedProduct.name,
											);
											setShowQuickView(false);
										}}
										disabled={selectedProduct.stock <= 0}
										className="btn-primary w-full mt-6 py-3"
									>
										Add to Cart
									</button>
									<button
										onClick={() => {
											setShowQuickView(false);
											navigate(
												`/product/${selectedProduct.id}`,
											);
										}}
										className="w-full mt-3 text-momma-pink hover:underline"
									>
										View Full Details
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Gift Finder Quiz Modal */}
			{showQuiz && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-3xl max-w-md w-full p-8">
						<div className="flex justify-between items-center mb-6">
							<h3 className="text-2xl font-bold text-momma-brown">
								Gift Finder Quiz
							</h3>
							<button
								onClick={() => setShowQuiz(false)}
								className="p-2"
							>
								<FiX />
							</button>
						</div>
						<div className="mb-6">
							<div className="flex gap-2 mb-6">
								{quizQuestions.map((_, idx) => (
									<div
										key={idx}
										className={`h-1 flex-1 rounded-full ${
											idx <= quizStep
												? "bg-momma-pink"
												: "bg-gray-200"
										}`}
									/>
								))}
							</div>
							<p className="text-xl font-semibold text-momma-brown mb-6">
								{quizQuestions[quizStep].question}
							</p>
							<div className="space-y-3">
								{quizQuestions[quizStep].options.map(
									(option) => (
										<button
											key={option}
											onClick={() =>
												handleQuizAnswer(option)
											}
											className="w-full text-left px-4 py-3 border border-gray-200 rounded-xl hover:border-momma-pink hover:bg-pink-50 transition-all"
										>
											{option}
										</button>
									),
								)}
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Live Chat Button */}
			<div className="fixed bottom-6 right-6 z-40">
				{showChat && (
					<div className="bg-white rounded-2xl shadow-2xl w-80 mb-4 overflow-hidden">
						<div className="bg-gradient-to-r from-momma-pink to-momma-orange p-4 text-white">
							<div className="flex justify-between items-center">
								<div className="flex items-center gap-2">
									<span className="text-2xl">🥜</span>
									<span className="font-semibold">
										Momma Nut Support
									</span>
								</div>
								<button onClick={() => setShowChat(false)}>
									<FiX />
								</button>
							</div>
						</div>
						<div className="h-80 overflow-y-auto p-4 space-y-3">
							{chatMessages.map((msg, idx) => (
								<div
									key={idx}
									className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
								>
									<div
										className={`max-w-[80%] p-3 rounded-2xl ${
											msg.type === "user"
												? "bg-momma-pink text-white"
												: "bg-gray-100 text-gray-700"
										}`}
									>
										{msg.text}
									</div>
								</div>
							))}
						</div>
						<div className="border-t p-4 flex gap-2">
							<input
								type="text"
								value={chatMessage}
								onChange={(e) => setChatMessage(e.target.value)}
								onKeyPress={(e) =>
									e.key === "Enter" && sendChatMessage()
								}
								placeholder="Type your message..."
								className="flex-1 px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-momma-pink"
							/>
							<button
								onClick={sendChatMessage}
								className="bg-momma-pink text-white p-2 rounded-xl"
							>
								<FiMessageCircle />
							</button>
						</div>
					</div>
				)}
				<button
					onClick={() => setShowChat(!showChat)}
					className="bg-gradient-to-r from-momma-pink to-momma-orange text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
				>
					<FiMessageCircle className="text-2xl" />
				</button>
			</div>

			{/* Instagram Feed Placeholder */}
			<div className="text-center py-12 bg-white">
				<h3 className="text-2xl font-semibold text-momma-brown mb-8">
					Follow us @mommanut
				</h3>
				<div className="flex justify-center gap-4">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="w-20 h-20 bg-gray-200 rounded-xl flex items-center justify-center text-3xl"
						>
							📸
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Home;
