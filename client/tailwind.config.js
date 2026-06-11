/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				"momma-pink": "#FF3CB0",
				"momma-orange": "#F7941D",
				"momma-red": "#F1531C",
				"momma-gold": "#F7A720",
				"momma-brown": "#4B1E0E",
			},
			fontFamily: {
				sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
			},
		},
	},
	plugins: [],
};
