import React from "react";
import Footer from "./common/Footer";
import Header from "./common/Header";
import { Outlet } from "react-router-dom";

const Layout = () => {
	return (
		<div className="min-h-screen bg-gray-50">
			<Header />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Outlet />
			</main>

			<Footer />
		</div>
	);
};

export default Layout;
