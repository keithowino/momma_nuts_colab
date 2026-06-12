import React from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiAward, FiUsers, FiTruck, FiStar } from "react-icons/fi";
import { LeafIcon } from "lucide-react";

const About = () => {
	const teamMembers = [
		{
			name: "Sarah Johnson",
			role: "Founder & CEO",
			image: "👩‍🍳",
			bio: "Started Momma Nut from her family kitchen with a passion for quality snacks.",
		},
		{
			name: "Michael Chen",
			role: "Master Roaster",
			image: "👨‍🍳",
			bio: "15+ years of experience perfecting the art of peanut roasting.",
		},
		{
			name: "Emma Rodriguez",
			role: "Product Developer",
			image: "👩‍🔬",
			bio: "Creates delicious new flavors that families love.",
		},
	];

	return (
		<div className="overflow-hidden">
			{/* Hero Section */}
			<section className="bg-gradient-to-r from-momma-brown to-momma-orange text-white py-20">
				<div className="max-w-6xl mx-auto px-6 text-center">
					<div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full mb-6">
						<span className="text-5xl">🥜</span>
					</div>
					<h1 className="text-4xl md:text-6xl font-bold mb-4">
						Our Story
					</h1>
					<p className="text-xl max-w-2xl mx-auto opacity-90">
						From a small family farm to your table — bringing joy
						and nutrition through premium peanuts since 2015.
					</p>
				</div>
			</section>

			{/* Mission Section */}
			<section className="py-20">
				<div className="max-w-6xl mx-auto px-6">
					<div className="grid md:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-3xl md:text-4xl font-bold text-momma-brown mb-4">
								Our Mission
							</h2>
							<p className="text-gray-600 text-lg mb-6">
								To create the highest-quality, most delicious
								peanut products while supporting sustainable
								farming and giving back to our community.
							</p>
							<div className="space-y-3">
								<div className="flex items-center gap-3">
									<FiHeart className="text-momma-pink text-xl" />
									<span>
										100% natural ingredients, no
										preservatives
									</span>
								</div>
								<div className="flex items-center gap-3">
									<FiAward className="text-momma-pink text-xl" />
									<span>Sourced from family-owned farms</span>
								</div>
								<div className="flex items-center gap-3">
									<FiUsers className="text-momma-pink text-xl" />
									<span>Supporting local communities</span>
								</div>
							</div>
						</div>
						<div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl h-96 flex items-center justify-center text-9xl">
							🌱
						</div>
					</div>
				</div>
			</section>

			{/* Values Section */}
			<section className="bg-momma-brown/5 py-20">
				<div className="max-w-6xl mx-auto px-6">
					<h2 className="text-3xl md:text-4xl font-bold text-center text-momma-brown mb-12">
						Our Core Values
					</h2>
					<div className="grid md:grid-cols-3 gap-8">
						<div className="text-center">
							<div className="w-20 h-20 bg-momma-pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<LeafIcon className="text-3xl text-momma-pink" />
							</div>
							<h3 className="text-xl font-semibold text-momma-brown mb-2">
								Quality First
							</h3>
							<p className="text-gray-600">
								We never compromise on quality. Every batch is
								taste-tested and inspected.
							</p>
						</div>
						<div className="text-center">
							<div className="w-20 h-20 bg-momma-orange/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<FiUsers className="text-3xl text-momma-orange" />
							</div>
							<h3 className="text-xl font-semibold text-momma-brown mb-2">
								Community
							</h3>
							<p className="text-gray-600">
								We give back 5% of profits to family farms and
								local schools.
							</p>
						</div>
						<div className="text-center">
							<div className="w-20 h-20 bg-momma-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
								<FiHeart className="text-3xl text-momma-gold" />
							</div>
							<h3 className="text-xl font-semibold text-momma-brown mb-2">
								Sustainability
							</h3>
							<p className="text-gray-600">
								Eco-friendly packaging and responsible sourcing
								practices.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Team Section */}
			<section className="py-20">
				<div className="max-w-6xl mx-auto px-6">
					<h2 className="text-3xl md:text-4xl font-bold text-center text-momma-brown mb-12">
						Meet Our Team
					</h2>
					<div className="grid md:grid-cols-3 gap-8">
						{teamMembers.map((member, idx) => (
							<div
								key={idx}
								className="text-center bg-white rounded-3xl p-6 shadow-sm"
							>
								<div className="text-7xl mb-4">
									{member.image}
								</div>
								<h3 className="text-xl font-semibold text-momma-brown">
									{member.name}
								</h3>
								<p className="text-momma-pink text-sm mb-3">
									{member.role}
								</p>
								<p className="text-gray-600 text-sm">
									{member.bio}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Stats Section */}
			<section className="bg-gradient-to-r from-momma-brown to-momma-orange text-white py-16">
				<div className="max-w-6xl mx-auto px-6">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						<div>
							<p className="text-4xl font-bold">10K+</p>
							<p className="text-sm opacity-90">
								Happy Customers
							</p>
						</div>
						<div>
							<p className="text-4xl font-bold">50+</p>
							<p className="text-sm opacity-90">
								Unique Products
							</p>
						</div>
						<div>
							<p className="text-4xl font-bold">15</p>
							<p className="text-sm opacity-90">Family Farms</p>
						</div>
						<div>
							<p className="text-4xl font-bold">4.9⭐</p>
							<p className="text-sm opacity-90">
								Customer Rating
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className="py-20 text-center">
				<div className="max-w-6xl mx-auto px-6">
					<h2 className="text-3xl md:text-4xl font-bold text-momma-brown mb-4">
						Ready to Taste the Difference?
					</h2>
					<p className="text-gray-600 max-w-md mx-auto mb-8">
						Join thousands of happy families who choose Momma Nut
						for their daily snacks.
					</p>
					<Link
						to="/user-products"
						className="btn-primary inline-block"
					>
						Shop Our Collection
					</Link>
				</div>
			</section>
		</div>
	);
};

export default About;
