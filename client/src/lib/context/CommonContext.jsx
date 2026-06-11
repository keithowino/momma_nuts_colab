import { createContext, useContext, useState } from "react";
import { FiShoppingCart, FiUser, FiHome, FiPackage } from "react-icons/fi";

const CommonContext = createContext();

export const CommonProvider = ({ children }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [navItems, setNavItems] = useState([
		{ path: "/", label: "Home", icon: FiHome },
		{ path: "/user-products", label: "Shop", icon: FiPackage },
		{ path: "/cart", label: "Cart", icon: FiShoppingCart },
		{ path: "/profile", label: "Profile", icon: FiUser },
	]);

	const CommonContextFeatures = {
		isMenuOpen,
		setIsMenuOpen,
		navItems,
		setNavItems,
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
