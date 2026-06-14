import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(() => {
	return {
		server: {
			port: 3000,
			host: "0.0.0.0",
			proxy: {
				"/api": {
					target: process.env.VITE_API_URL || "http://127.0.0.1:3000",
					changeOrigin: true,
				},
			},
		},
		build: {
			outDir: "dist",
			// Increase chunk size warning limit
			chunkSizeWarningLimit: 1000,
			rollupOptions: {
				output: {
					// manualChunks should be a function in Vite 8/Rolldown
					manualChunks(id) {
						// React core
						if (
							id.includes("node_modules/react") ||
							id.includes("node_modules/react-dom") ||
							id.includes("node_modules/react-router-dom")
						) {
							return "react-vendor";
						}
						// Lucide icons
						if (id.includes("node_modules/lucide-react")) {
							return "icons";
						}
						// Axios
						if (id.includes("node_modules/axios")) {
							return "axios";
						}
						// Everything else goes to vendor
						if (id.includes("node_modules")) {
							return "vendor";
						}
					},
				},
			},
		},
		plugins: [react()],
	};
});
