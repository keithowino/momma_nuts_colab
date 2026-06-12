import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Authorization from "./authorization/Authorization";
// import SignupForm from "./authorization/Signup";
// import LoginForm from "./authorization/Login";
// import AProduct from "./productAdmin/AProduct";
// import UProduct from "./productUser/UProduct";
import Orders from "./orders/Orders";
import OrderItems from "./orders/OrderItems";
import Payment from "./payments/Payments";
// import Mpesa from "./mpesa/Mpesa";
// import Profile from "./profile/Profile";
// import Logout from "./authorization/Logout";
// import ResetPassword from "./authorization/ResetPassword";
// import ForgotPassword from "./authorization/ForgotPassword";
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

function App() {
	const AuthenticatedApp = () => {
		return (
			<Router>
				<Routes>
					{/* No navbar */}
					{/* <Route path="/authorization" element={<Authorization />} /> */}
					{/* <Route path="/signup" element={<SignupForm />} /> */}
					<Route path="/signup" element={<Signup />} />
					{/* <Route path="/login" element={<LoginForm />} /> */}
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
						<Route path="users" element={<AdminUsers />} />
						<Route path="settings" element={<AdminSettings />} />
					</Route>

					{/* With navbar */}
					<Route path="/" element={<MainLayout />}>
						<Route index element={<Home />} />
						{/* <Route path="/admin-products" element={<AProduct />} /> */}
						<Route
							path="/user-products"
							element={<ProductList />}
						/>
						<Route path="/orders" element={<Orders />} />
						<Route
							path="/order-items/:orderId"
							element={<OrderItems />}
						/>
						<Route
							path="/product/:id"
							element={<ProductDetail />}
						/>
						<Route path="/payments" element={<Payment />} />
						<Route path="/cart" element={<Cart />} />
						{/* <Route path="/mpesa" element={<Mpesa />} /> */}
						<Route path="/mpesa" element={<Checkout />} />
						<Route path="/profile" element={<Profile />} />
						{/* <Route path="/logout" element={<Logout />} /> */}
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
