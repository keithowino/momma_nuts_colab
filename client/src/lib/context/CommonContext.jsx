import { createContext, useContext, useState } from "react";
import {
	FiShoppingCart,
	FiUser,
	FiHome,
	FiPackage,
	FiCreditCard,
} from "react-icons/fi";

const CommonContext = createContext();

export const CommonProvider = ({ children }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [navItems, setNavItems] = useState([
		{ path: "/", label: "Home", icon: FiHome },
		{ path: "/user-products", label: "Shop", icon: FiPackage },
		{ path: "/cart", label: "Cart", icon: FiShoppingCart },
	]);
	const [profileMenuItems, setProfileMenuItems] = useState([
		{ path: "/profile", label: "My Profile", icon: FiUser },
		{ path: "/orders", label: "My Orders", icon: FiPackage },
		{ path: "/payments", label: "Payments", icon: FiCreditCard },
	]);

	const CommonContextFeatures = {
		isMenuOpen,
		setIsMenuOpen,
		navItems,
		setNavItems,
		profileMenuItems,
		setProfileMenuItems,
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
