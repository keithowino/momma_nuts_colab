import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrderDetails from "./pages/order/OrderDetails";
import Payment from "./pages/Payments";
import MainLayout from "./components/Layout";
import { CommonProvider } from "./lib/context/CommonContext";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Profile from "./pages/Profile";
import AdminLayout from "./pages/admin/Layout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Settings";
import AdminPayments from "./pages/admin/Payments";
import Orders from "./pages/order/Orders";
import About from "./pages/About";

function App() {
	const AuthenticatedApp = () => {
		return (
			<Router>
				<Routes>
					<Route path="/signup" element={<Signup />} />
					<Route path="/login" element={<Login />} />
					<Route path="/reset-password" element={<ResetPassword />} />
					<Route
						path="/forgot-password"
						element={<ForgotPassword />}
					/>

					<Route path="/admin" element={<AdminLayout />}>
						<Route index element={<AdminDashboard />} />
						<Route path="products" element={<AdminProducts />} />
						<Route path="orders" element={<AdminOrders />} />
						<Route path="payments" element={<AdminPayments />} />
						<Route path="users" element={<AdminUsers />} />
						<Route path="settings" element={<AdminSettings />} />
					</Route>

					<Route path="/" element={<MainLayout />}>
						<Route index element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route
							path="/user-products"
							element={<ProductList />}
						/>
						<Route path="/orders" element={<Orders />} />
						<Route
							path="/order-items/:orderId"
							element={<OrderDetails />}
						/>
						<Route
							path="/product/:id"
							element={<ProductDetail />}
						/>
						<Route path="/payments" element={<Payment />} />
						<Route path="/cart" element={<Cart />} />
						<Route path="/mpesa" element={<Checkout />} />
						<Route path="/profile" element={<Profile />} />
					</Route>
				</Routes>
			</Router>
		);
	};

	return (
		<CommonProvider>
			<AuthenticatedApp />
		</CommonProvider>
	);
}

export default App;
