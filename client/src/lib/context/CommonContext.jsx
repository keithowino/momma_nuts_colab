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
		{ path: "/cart", label: "Cart", icon: FiShoppingCart },
		{ path: "/about", label: "About", icon: FiBookOpen },
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
