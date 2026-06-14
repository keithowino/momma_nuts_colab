import { createContext, useContext, useState, useEffect } from "react";
import {
	FiShoppingCart,
	FiUser,
	FiHome,
	FiPackage,
	FiCreditCard,
	FiSettings,
	FiShield,
	FiBookOpen,
} from "react-icons/fi";

const CommonContext = createContext();

export const CommonProvider = ({ children }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [user, setUser] = useState(null);
	const [navItems, setNavItems] = useState([
		{ path: "/", label: "Home", icon: FiHome },
		{ path: "/user-products", label: "Shop", icon: FiPackage },
		{ path: "/about", label: "About", icon: FiBookOpen },
		{ path: "/cart", label: "Cart", icon: FiShoppingCart },
	]);
	const [heroCarousel, setHeroCarousel] = useState([
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
			ctaLink: "/product/4",
			image: "🍫",
		},
	]);
	const [quizQuestions, setQuizQuestions] = useState([
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
	]);

	// Get user from localStorage
	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) {
			const userData = JSON.parse(storedUser);
			setUser(userData);
		}
	}, []);

	// Profile menu items that depend on user role
	const getProfileMenuItems = () => {
		const baseItems = [
			{ path: "/profile", label: "My Profile", icon: FiUser },
			{ path: "/orders", label: "My Orders", icon: FiPackage },
			{ path: "/payments", label: "Payments", icon: FiCreditCard },
		];

		// Add Admin link if user is admin
		if (user && user.role === "admin") {
			baseItems.push({
				path: "/admin",
				label: "Admin Dashboard",
				icon: FiShield,
			});
		}

		return baseItems;
	};

	const CommonContextFeatures = {
		isMenuOpen,
		setIsMenuOpen,
		navItems,
		setNavItems,
		profileMenuItems: getProfileMenuItems(),
		user,
		setUser,
		heroCarousel,
		setHeroCarousel,
		quizQuestions,
		setQuizQuestions,
	};

	return (
		<CommonContext.Provider value={CommonContextFeatures}>
			{children}
		</CommonContext.Provider>
	);
};

export const useCommon = () => {
	const ctx = useContext(CommonContext);
	if (!ctx) {
		throw new Error("useCommon must be used within a CommonProvider.");
	}
	return ctx;
};
