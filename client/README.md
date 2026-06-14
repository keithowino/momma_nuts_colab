## 📄 Client `README.md` (`client/README.md`)

# 🎨 Momma Nuts – React Frontend

This is the **React + Vite** frontend for the Momma Nuts e‑commerce platform.
It provides a modern, responsive user interface with full shopping flow, admin dashboard, and real‑time API integration.

---

## 🚀 Tech Stack

- **React 19** with functional components & hooks
- **Vite** – fast build tool & development server
- **Tailwind CSS** – utility‑first styling (custom Momma Nuts color palette)
- **React Router DOM v7** – client‑side routing
- **Axios** – API client with interceptors
- **Recharts** – dashboard charts
- **React Icons / Lucide** – clean icon set

---

## 📁 Project Structure (Selected)

```

client/
├── public/ # Static assets
├── src/
│ ├── pages/
│ │ ├── auth/ # Login, Signup, Forgot/Reset Password
│ │ ├── admin/ # Admin Dashboard, Products, Orders, Users, Payments
│ │ ├── Home.jsx
│ │ ├── ProductList.jsx
│ │ ├── ProductDetail.jsx
│ │ ├── Cart.jsx
│ │ ├── Checkout.jsx
│ │ ├── Orders.jsx
│ │ ├── Payments.jsx
│ │ ├── Profile.jsx
│ │ └── About.jsx
│ ├── components/
│ │ ├── common/ # Header, Footer, ProductCard, CommentSection
│ │ └── admin/ # Sidebar, StatCard, etc.
│ ├── lib/config/
│ │ ├── api.js # Centralized Axios instance with all API methods
│ │ └── context/ # CommonContext (nav, user, carousel, quiz)
│ ├── assets/ # Images,
│ ├── App.jsx
│ ├── main.jsx
│ └── index.css
├── .env.development
├── .env.production
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json

```

---

## 🔧 Environment Variables

| Variable       | Description          | Default                 |
| -------------- | -------------------- | ----------------------- |
| `VITE_API_URL` | Backend API base URL | `http://127.0.0.1:5000` |

Place these in `.env.development` (development) or `.env.production` (deployment).

---

## 📦 Installation & Running

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Start development server

```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

### 3️⃣ Build for production

```bash
npm run build
```

The output will be in the `dist/` folder.

---

## 🧩 Key Features (Frontend)

- **Authentication:** Login / Signup forms with JWT storage
- **Product browsing:** Product cards, detail view, likes, comments
- **Shopping cart:** Add/remove items, quantity controls, order summary
- **Checkout:** Mock M‑Pesa payment page with phone validation
- **User area:** Profile editing, order history, payment history
- **Admin panel:** Dashboard with stats, product/order/user management, payments overview
- **Responsive design:** Works on mobile, tablet, and desktop

---

## 🎨 Styling Notes

- The design follows the **Momma Nuts color palette**:
    - Primary Pink: `#FF3CB0`
    - Orange: `#F7941D`
    - Golden Yellow: `#F7A720`
    - Dark Brown: `#4B1E0E`
- Tailwind classes are extended in `tailwind.config.js` to include these brand colors.
- All components use Tailwind utility classes – no custom CSS except for small overrides.

---

## 🔌 API Integration

All backend calls go through the `api.js` module.  
Example usage:

```jsx
import { productAPI, cartAPI, authAPI } from "../lib/config/api";

// Get all products
const response = await productAPI.getAll();

// Login
const data = await authAPI.login({ identifier, password });

// Add to cart
await cartAPI.addItem(productId, 1);
```

The Axios interceptor automatically:

- Attaches `Authorization: Bearer <token>` if a token exists
- Handles 401 by clearing localStorage and redirecting to login

---

## 🧪 Testing

- Create a test user via `/signup`
- Login as admin (seed the database or promote a user via backend)
- Explore all routes, add products to cart, complete checkout
- Admin can visit `/admin` to manage the platform

---

## 🚢 Deployment (Vercel)

1. Push this `client/` folder to GitHub.
2. On Vercel, import the repository.
3. Set **Root Directory** to `client`.
4. Add environment variable: `VITE_API_URL` (your deployed backend URL).
5. Deploy.

---

## 📚 Further Reading

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Router](https://reactrouter.com/en/main)

---

## 💡 Troubleshooting

| Issue              | Solution                                                    |
| ------------------ | ----------------------------------------------------------- |
| CORS errors        | Ensure backend CORS allows `http://localhost:3000`          |
| 401 Unauthorized   | Clear localStorage and login again                          |
| API calls failing  | Check that `VITE_API_URL` is correct and backend is running |
| Images not showing | Products need an `image` URL (Cloudinary or placeholder)    |
