import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const api = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 30000, // 30 second timeout
});

// Request interceptor - Add token to every request
api.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("access_token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error),
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
	(response) => response,
	(error) => {
		// Handle 401 Unauthorized - token expired or invalid
		if (error.response?.status === 401) {
			localStorage.removeItem("access_token");
			localStorage.removeItem("refresh_token");
			localStorage.removeItem("user");

			// Only redirect if not already on login page
			if (!window.location.pathname.includes("/login")) {
				window.location.href = "/login";
			}
		}

		// Handle 403 Forbidden
		if (error.response?.status === 403) {
			console.error("Access forbidden:", error.response?.data?.error);
		}

		// Handle 500 Server Error
		if (error.response?.status === 500) {
			console.error("Server error:", error.response?.data?.error);
		}

		return Promise.reject(error);
	},
);

// ============= ADMIN APIs =============
export const adminAPI = {
	getStats: () =>
		Promise.all([productAPI.getAll(), orderAPI.getAll(), userAPI.getAll()]),
};

// ============= AUTH APIs =============
export const authAPI = {
	login: (credentials) => api.post("/login", credentials),
	register: (userData) => api.post("/signup", userData),
	getMe: () => api.get("/me"),
	forgotPassword: (email) => api.post("/forgot-password", { email }),
	resetPassword: (data) => api.post("/reset-password", data),
	logout: () => {
		localStorage.removeItem("access_token");
		localStorage.removeItem("refresh_token");
		localStorage.removeItem("user");
	},
};

// ============= PRODUCT APIs =============
export const productAPI = {
	getAll: (params) => api.get("/products", { params }),
	getById: (id) => api.get(`/products/${id}`),
	create: (data) => api.post("/products", data),
	update: (id, data) => api.patch(`/products/${id}`, data),
	delete: (id) => api.delete(`/products/${id}`),
	like: (id) => api.post(`/products/${id}/likes`),
	unlike: (id) => api.delete(`/products/${id}/likes`),
	getLikes: (id) => api.get(`/products/${id}/likes`),
};

// ============= CART APIs =============
export const cartAPI = {
	getCart: () => api.get("/cart"),
	addItem: (productId, quantity = 1) =>
		api.post("/cart", { product_id: productId, quantity }),
	updateQuantity: (productId, change) =>
		api.post("/cart", { product_id: productId, quantity: change }),
	removeItem: (cartId) => api.delete(`/cart/${cartId}`),
	clearCart: () => api.delete("/cart"),
};

// ============= ORDER APIs =============
export const orderAPI = {
	getAll: () => api.get("/orders"),
	getById: (orderId) => api.get(`/orders/${orderId}`),
	create: (items) => api.post("/orders", { items }),
	checkout: () => api.post("/checkout"),
	cancel: (orderId) => api.patch(`/orders/${orderId}`),
};

// ============= PAYMENT APIs =============
export const paymentAPI = {
	getAll: () => api.get("/payments"),
	payWithMpesa: (phoneNumber, orderId) =>
		api.post("/mpesa/pay", {
			phone_number: phoneNumber,
			order_id: orderId,
		}),
};

// ============= COMMENT APIs =============
export const commentAPI = {
	getByProduct: (productId) => api.get(`/comments/product/${productId}`),
	create: (content, productId) =>
		api.post("/comments", { content, product_id: productId }),
	delete: (commentId) => api.delete(`/comments/${commentId}`),
	addReply: (commentId, content) =>
		api.post(`/comments/${commentId}/replies`, { content }),
	deleteReply: (commentId, replyId) =>
		api.delete(`/comments/${commentId}/replies/${replyId}`),
};

// ============= USER APIs =============
export const userAPI = {
	getAll: () => api.get("/users"),
	updateProfile: (data) => api.patch("/users", data),
	deleteAccount: () => api.delete("/delete"),
	updateRole: (userId, role) => api.patch(`/users/${userId}/role`, { role }),
};

// ============= RECOMMENDATION APIs =============
export const recommendationAPI = {
	getRecommendations: (quizAnswers) =>
		api.get("/recommendations", { params: { quiz_answers: quizAnswers } }),
};

export default api;
