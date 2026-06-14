import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
	FiHeart,
	FiAward,
	FiUsers,
	FiTruck,
	FiShield,
	FiPackage,
	FiPhone,
	FiChevronDown,
	FiChevronUp,
	FiStar,
	FiCheck,
} from "react-icons/fi";
import { productAPI } from "../lib/config/api";

// --- Animated counter hook ---
const useCountUp = (end, duration = 1500) => {
	const [count, setCount] = useState(0);
	const ref = useRef(null);
	const started = useRef(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !started.current) {
					started.current = true;
					const startTime = performance.now();

					const tick = (now) => {
						const elapsed = now - startTime;
						const progress = Math.min(elapsed / duration, 1);
						const eased = 1 - Math.pow(1 - progress, 3);
						setCount(Math.floor(eased * end));
						if (progress < 1) requestAnimationFrame(tick);
					};

					requestAnimationFrame(tick);
				}
			},
			{ threshold: 0.3 },
		);

		if (ref.current) observer.observe(ref.current);
		return () => observer.disconnect();
	}, [end, duration]);

	return { count, ref };
};

// --- Individual stat with its own counter ---
const AnimatedStat = ({ end, suffix = "", label }) => {
	const { count, ref } = useCountUp(end);
	return (
		<div ref={ref} className="text-center">
			<p className="text-4xl md:text-5xl font-bold">
				{count}
				{suffix}
			</p>
			<p className="text-sm opacity-80 mt-1">{label}</p>
		</div>
	);
};

// --- FAQ accordion item ---
const FAQItem = ({ question, answer }) => {
	const [open, setOpen] = useState(false);
	return (
		<div className="border border-gray-100 rounded-2xl overflow-hidden">
			<button
				onClick={() => setOpen(!open)}
				className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-momma-brown/5 transition-colors"
			>
				<span className="font-semibold text-momma-brown">
					{question}
				</span>
				{open ? (
					<FiChevronUp className="text-momma-pink shrink-0" />
				) : (
					<FiChevronDown className="text-gray-400 shrink-0" />
				)}
			</button>
			{open && (
				<div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
					{answer}
				</div>
			)}
		</div>
	);
};

const About = () => {
	const [productCount, setProductCount] = useState(null);
	const [loading, setLoading] = useState(true);

	// Fetch real product count from your API using centralized API
	useEffect(() => {
		fetchProductCount();
	}, []);

	const fetchProductCount = async () => {
		try {
			const response = await productAPI.getAll();
			const products = response.data;
			if (Array.isArray(products)) {
				setProductCount(products.length);
			}
		} catch (error) {
			console.error("Error fetching product count:", error);
			setProductCount(null);
		} finally {
			setLoading(false);
		}
	};

	const values = [
		{
			icon: <FiShield className="text-3xl text-momma-pink" />,
			bg: "bg-momma-pink/10",
			title: "Quality First",
			text: "Every batch is taste-tested before it leaves our hands. No shortcuts, no compromises.",
		},
		{
			icon: <FiUsers className="text-3xl text-momma-orange" />,
			bg: "bg-momma-orange/10",
			title: "Community",
			text: "We source directly from local farmers, keeping money within Kenyan communities.",
		},
		{
			icon: <FiHeart className="text-3xl text-momma-gold" />,
			bg: "bg-momma-gold/10",
			title: "Natural Goodness",
			text: "No artificial additives, no preservatives. Just peanuts and real ingredients.",
		},
		{
			icon: <FiTruck className="text-3xl text-momma-brown" />,
			bg: "bg-momma-brown/10",
			title: "Fast Delivery",
			text: "Order today, delivered to your door. Nationwide delivery across Kenya.",
		},
		{
			icon: <FiPackage className="text-3xl text-momma-pink" />,
			bg: "bg-momma-pink/10",
			title: "Secure Packaging",
			text: "Sealed fresh at the source. Our packaging locks in crunch and flavour.",
		},
		{
			icon: <FiAward className="text-3xl text-momma-orange" />,
			bg: "bg-momma-orange/10",
			title: "Trusted Brand",
			text: "Thousands of happy customers across Kenya choose Momma Nut every week.",
		},
	];

	const faqs = [
		{
			question:
				"What makes Momma Nut different from supermarket peanuts?",
			answer: "Supermarket peanuts are often sourced in bulk, stored for months, and loaded with artificial preservatives. Ours are roasted in small batches and packed fresh — you can taste the difference in the first handful.",
		},
		{
			question: "How do I pay for my order?",
			answer: "We accept M-Pesa payments directly through the site. Once you checkout, you'll receive an STK push to your phone. No card needed.",
		},
		{
			question: "Do you deliver nationwide?",
			answer: "Yes — we deliver across Kenya. Delivery timelines depend on your location but are typically 2–4 business days. Nairobi orders are often faster.",
		},
		{
			question: "What is the shelf life of your products?",
			answer: "Our products stay fresh for up to 3 months when stored in a cool, dry place. We recommend keeping them sealed until you're ready to snack.",
		},
		{
			question: "Can I order in bulk for events or gifting?",
			answer: "Absolutely. We do bulk and corporate orders. Reach out via WhatsApp and we'll sort you out with pricing and custom packaging options.",
		},
		{
			question:
				"Are your products suitable for people with nut allergies?",
			answer: "Our products contain peanuts and are processed in a facility that handles tree nuts. We do not recommend them for people with nut allergies.",
		},
	];

	return (
		<div className="overflow-hidden">
			{/* Hero Section */}
			<section className="bg-gradient-to-br from-momma-brown via-momma-brown to-momma-orange text-white py-24 relative">
				<div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:32px_32px]" />
				<div className="max-w-4xl mx-auto px-6 text-center relative z-10">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 text-4xl">
						🥜
					</div>
					<h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
						Kenya's Favourite{" "}
						<span className="text-momma-pink">Peanut Brand</span>
					</h1>
					<p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
						Momma Nut started with a simple belief — Kenyans deserve
						premium peanut snacks made with real ingredients, not
						factory shortcuts. We roast small batches, pack fresh,
						and deliver straight to your door.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
						<Link
							to="/user-products"
							className="inline-flex items-center gap-2 bg-momma-pink text-white px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all shadow-lg"
						>
							Shop Now →
						</Link>
						<a
							href="https://wa.me/254700000000"
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-momma-brown transition-all"
						>
							<FiPhone /> Chat on WhatsApp
						</a>
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="bg-gradient-to-r from-momma-pink to-momma-orange text-white py-14">
				<div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
					<AnimatedStat
						end={10000}
						suffix="+"
						label="Happy Customers"
					/>
					<AnimatedStat
						end={productCount ?? (loading ? 0 : 20)}
						suffix="+"
						label="Products Available"
					/>
					<AnimatedStat
						end={47}
						suffix=""
						label="Counties We Deliver To"
					/>
					<AnimatedStat
						end={99}
						suffix="%"
						label="Positive Reviews"
					/>
				</div>
			</section>

			{/* Our Story Section */}
			<section className="py-20">
				<div className="max-w-6xl mx-auto px-6">
					<div className="grid md:grid-cols-2 gap-14 items-center">
						<div>
							<span className="text-momma-pink font-semibold text-sm uppercase tracking-widest">
								Our Story
							</span>
							<h2 className="text-3xl md:text-4xl font-bold text-momma-brown mt-2 mb-5">
								Born from a love of real food
							</h2>
							<div className="space-y-4 text-gray-600 leading-relaxed">
								<p>
									Momma Nut began the way most good things do
									— at home. A passion for well-made snacks,
									frustration with what was available on
									shelves, and a conviction that we could do
									better.
								</p>
								<p>
									We partnered with local peanut farmers,
									invested in small- batch roasting, and
									obsessed over flavour until we got it right.
									Today we're proud to serve thousands of
									Kenyan families who've made Momma Nut part
									of their daily routine.
								</p>
								<p>
									Every bag that leaves our hands is something
									we'd be happy to eat ourselves. That
									standard hasn't changed and it never will.
								</p>
							</div>
							<div className="mt-8 space-y-3">
								{[
									"Small-batch roasted for maximum freshness",
									"Sourced directly from Kenyan farmers",
									"No artificial preservatives or additives",
									"Nationwide delivery with M-Pesa payment",
								].map((point) => (
									<div
										key={point}
										className="flex items-center gap-3"
									>
										<div className="w-5 h-5 rounded-full bg-momma-pink/20 flex items-center justify-center shrink-0">
											<FiCheck className="text-momma-pink text-xs" />
										</div>
										<span className="text-gray-700 text-sm">
											{point}
										</span>
									</div>
								))}
							</div>
						</div>
						<div className="relative">
							<div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl h-96 flex items-center justify-center text-9xl">
								🥜
							</div>
							{/* Floating badge */}
							<div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
								<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
									<FiStar className="text-green-600" />
								</div>
								<div>
									<p className="font-bold text-momma-brown text-sm">
										4.9 / 5 rating
									</p>
									<p className="text-xs text-gray-500">
										from verified buyers
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Values Grid Section */}
			<section className="bg-momma-brown/5 py-20">
				<div className="max-w-6xl mx-auto px-6">
					<div className="text-center mb-14">
						<span className="text-momma-pink font-semibold text-sm uppercase tracking-widest">
							What We Stand For
						</span>
						<h2 className="text-3xl md:text-4xl font-bold text-momma-brown mt-2">
							Our Core Values
						</h2>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{values.map((v) => (
							<div
								key={v.title}
								className="bg-white rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300"
							>
								<div
									className={`w-14 h-14 ${v.bg} rounded-2xl flex items-center justify-center mb-4`}
								>
									{v.icon}
								</div>
								<h3 className="font-semibold text-momma-brown text-lg mb-2">
									{v.title}
								</h3>
								<p className="text-gray-600 text-sm leading-relaxed">
									{v.text}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-20">
				<div className="max-w-3xl mx-auto px-6">
					<div className="text-center mb-12">
						<span className="text-momma-pink font-semibold text-sm uppercase tracking-widest">
							Got Questions?
						</span>
						<h2 className="text-3xl md:text-4xl font-bold text-momma-brown mt-2">
							Frequently Asked
						</h2>
					</div>
					<div className="space-y-3">
						{faqs.map((faq) => (
							<FAQItem key={faq.question} {...faq} />
						))}
					</div>
				</div>
			</section>

			{/* Contact / WhatsApp CTA Section */}
			<section className="bg-momma-brown/5 py-20">
				<div className="max-w-4xl mx-auto px-6">
					<div className="bg-gradient-to-r from-momma-brown to-momma-orange rounded-3xl p-8 md:p-12 text-white text-center">
						<div className="text-5xl mb-4">💬</div>
						<h2 className="text-2xl md:text-3xl font-bold mb-3">
							Have a question or bulk order?
						</h2>
						<p className="opacity-90 mb-8 max-w-lg mx-auto">
							We're real people who actually read our messages.
							Reach us on WhatsApp — we typically respond within
							the hour during business hours.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="https://wa.me/254700000000"
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-2 bg-white text-momma-brown px-8 py-3 rounded-full font-semibold hover:bg-momma-pink hover:text-white transition-all"
							>
								<FiPhone /> WhatsApp Us
							</a>
							<Link
								to="/user-products"
								className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-momma-brown transition-all"
							>
								Browse Products →
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA Section */}
			<section className="py-20 text-center">
				<div className="max-w-2xl mx-auto px-6">
					<h2 className="text-3xl md:text-4xl font-bold text-momma-brown mb-4">
						Ready to taste the difference?
					</h2>
					<p className="text-gray-500 mb-8">
						Join thousands of Kenyan families who choose Momma Nut
						every week. Free delivery on orders over KSh 2,000.
					</p>
					<Link
						to="/user-products"
						className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-3"
					>
						Shop Our Collection →
					</Link>
				</div>
			</section>
		</div>
	);
};

export default About;
