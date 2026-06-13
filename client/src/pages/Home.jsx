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
import { useCommon } from "../lib/context/CommonContext";

const API_URL = "http://127.0.0.1:5000";

const Home = () => {
	const { heroCarousel, quizQuestions } = useCommon();
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
		setCurrentSlide((prev) => (prev + 1) % heroCarousel.length);
	};

	const prevSlide = () => {
		setCurrentSlide(
			(prev) => (prev - 1 + heroCarousel.length) % heroCarousel.length,
		);
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
					className={`bg-gradient-to-r ${heroCarousel[currentSlide].bgGradient} text-white min-h-[85vh] flex items-center transition-all duration-500`}
				>
					<div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>

					<div className="max-w-6xl mx-auto px-6 py-20 md:py-28 text-center relative z-10">
						<div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-2 rounded-full mb-6 text-sm font-medium">
							<span className="relative flex h-3 w-3">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-momma-pink opacity-75"></span>
								<span className="relative inline-flex rounded-full h-3 w-3 bg-momma-pink"></span>
							</span>
							{heroCarousel[currentSlide].subtitle}
						</div>

						<h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
							{heroCarousel[currentSlide].title}
						</h1>

						<p className="max-w-2xl mx-auto text-xl md:text-2xl mb-10 opacity-95">
							{heroCarousel[currentSlide].description}
						</p>

						<Link
							to={heroCarousel[currentSlide].ctaLink}
							className="inline-flex items-center gap-3 bg-white text-momma-brown px-10 py-4 rounded-2xl font-semibold text-lg hover:bg-momma-pink hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl group"
						>
							{heroCarousel[currentSlide].ctaText}
							<FiShoppingCart className="group-hover:rotate-12 transition-transform" />
						</Link>
					</div>

					{/* Floating emoji */}
					<div className="hidden lg:block absolute -bottom-12 right-12 bg-white text-momma-brown rounded-3xl p-6 shadow-2xl text-8xl">
						{heroCarousel[currentSlide].image}
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
					{heroCarousel.map((_, idx) => (
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
							Variety You'll Love
						</h3>
						<p className="text-gray-600 leading-relaxed">
							From lightly salted classics to bold spiced blends
							and sweet honey roasts — there's a Momma Nut flavor
							for every mood and occasion.
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
								className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
							>
								{/* Clickable image */}
								<div
									onClick={() =>
										navigate(`/product/${product.id}`)
									}
									className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center cursor-pointer overflow-hidden"
								>
									<img
										src={product.image}
										alt={product.name}
										className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
									{/* Quick View overlay on hover */}
									<div className="absolute inset-0 bg-momma-brown/0 group-hover:bg-momma-brown/20 transition-all duration-300 flex items-end justify-center pb-4">
										<button
											onClick={(e) => {
												e.stopPropagation(); // prevent navigating to product page
												setSelectedProduct(product);
												setShowQuickView(true);
											}}
											className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-momma-brown text-xs font-semibold px-4 py-2 rounded-full shadow-md hover:bg-momma-pink hover:text-white"
										>
											Quick View
										</button>
									</div>
								</div>

								{/* Card body — name + description only */}
								<div className="p-5 flex flex-col flex-1">
									<h3
										onClick={() =>
											navigate(`/product/${product.id}`)
										}
										className="font-semibold text-momma-brown cursor-pointer hover:text-momma-pink transition-colors leading-snug"
									>
										{product.name}
									</h3>
									<p className="text-sm text-gray-400 mt-1 line-clamp-2 flex-1">
										{product.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Why Peanuts */}
			<section className="max-w-6xl mx-auto px-6 py-20">
				<div className="bg-gradient-to-r from-momma-brown/10 to-momma-pink/10 rounded-3xl overflow-hidden">
					<div className="grid md:grid-cols-2">
						{/* Text side */}
						<div className="p-8 md:p-12 flex flex-col justify-center">
							<span className="text-momma-pink font-semibold text-sm uppercase tracking-wide">
								Did You Know?
							</span>
							<h2 className="text-3xl md:text-4xl font-bold text-momma-brown mt-2 mb-4">
								Peanuts — Nature's Perfect Snack
							</h2>
							<p className="text-gray-600 mb-6 leading-relaxed">
								Packed with protein, healthy fats, and essential
								vitamins, peanuts are one of the most
								nutrient-dense snacks on the planet. A single
								handful covers up to 15% of your daily protein
								needs.
							</p>

							<ul className="space-y-3 mb-8">
								{[
									{
										emoji: "💪",
										text: "High in plant-based protein",
									},
									{
										emoji: "❤️",
										text: "Heart-healthy unsaturated fats",
									},
									{
										emoji: "⚡",
										text: "Sustained natural energy",
									},
									{
										emoji: "🌿",
										text: "No artificial additives — ever",
									},
								].map(({ emoji, text }) => (
									<li
										key={text}
										className="flex items-center gap-3 text-gray-700 text-sm"
									>
										<span className="text-xl">{emoji}</span>
										{text}
									</li>
								))}
							</ul>

							<Link
								to="/user-products"
								className="btn-primary inline-flex items-center gap-2 self-start"
							>
								Shop Our Range <span aria-hidden="true">→</span>
							</Link>
						</div>

						{/* Visual side */}
						<div className="h-64 md:h-auto bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center text-8xl select-none">
							🥜
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
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
					onClick={() => setShowQuickView(false)} // close on backdrop click
				>
					<div
						className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="grid md:grid-cols-2">
							{/* Image side */}
							<div className="h-64 md:h-auto bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center relative">
								{selectedProduct.image ? (
									<img
										src={selectedProduct.image}
										alt={selectedProduct.name}
										className="h-full w-full object-cover"
									/>
								) : (
									<span className="text-8xl">🥜</span>
								)}
							</div>

							{/* Details side */}
							<div className="p-8 flex flex-col justify-between">
								<div>
									<button
										onClick={() => setShowQuickView(false)}
										className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
									>
										<FiX className="text-gray-500" />
									</button>

									<h3 className="text-2xl font-bold text-momma-brown leading-tight">
										{selectedProduct.name}
									</h3>
									<p className="text-gray-500 mt-3 text-sm leading-relaxed">
										{selectedProduct.description}
									</p>

									<p className="text-3xl font-bold text-momma-pink mt-6">
										${selectedProduct.price}
									</p>

									{/* Stock status */}
									<div className="mt-3">
										{selectedProduct.stock <= 0 ? (
											<span className="inline-flex items-center gap-1 text-sm text-red-500 font-medium bg-red-50 px-3 py-1 rounded-full">
												✕ Out of stock
											</span>
										) : selectedProduct.stock < 10 ? (
											<span className="inline-flex items-center gap-1 text-sm text-orange-500 font-medium bg-orange-50 px-3 py-1 rounded-full">
												⚠ Only {selectedProduct.stock}{" "}
												left!
											</span>
										) : (
											<span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
												✓ In stock
											</span>
										)}
									</div>
								</div>

								<div className="mt-8 space-y-3">
									<button
										onClick={() => {
											handleAddToCart(
												selectedProduct.id,
												selectedProduct.name,
											);
											setShowQuickView(false);
										}}
										disabled={
											selectedProduct.stock <= 0 ||
											addingToCart === selectedProduct.id
										}
										className="w-full bg-momma-pink text-white py-3 rounded-2xl font-semibold hover:bg-momma-orange transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
									>
										{addingToCart === selectedProduct.id
											? "Adding..."
											: "Add to Cart"}
									</button>
									<button
										onClick={() => {
											setShowQuickView(false);
											navigate(
												`/product/${selectedProduct.id}`,
											);
										}}
										className="w-full border border-momma-brown/20 text-momma-brown py-3 rounded-2xl font-medium hover:bg-momma-brown/5 transition-colors text-sm"
									>
										View Full Details →
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
