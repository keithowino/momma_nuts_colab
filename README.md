## 📄 Root `README.md` (Project Root)

````markdown
# 🥜 Momma Nuts – Full Stack E‑commerce Platform

**Momma Nuts** is a complete e‑commerce web application for a premium peanut brand.  
It features a modern React frontend, a Flask (Python) backend, JWT authentication, shopping cart, order management, M‑Pesa payment simulation, product reviews, admin dashboard, and much more.

This project was built as a **UX/UI and full‑stack development showcase** to demonstrate professional design patterns, API integration, role‑based access, and responsive e‑commerce flows.

---

## ✨ Key Features

### 👥 Customer

- Product browsing with categories & collections
- Product detail with quantity selector & like button
- Shopping cart (add/remove, update quantity)
- Secure checkout (mock M‑Pesa payment)
- Order history & order details view
- Payment history with CSV export
- Product reviews & replies
- Profile management & account deletion

### 👑 Admin (Role‑Based)

- **Dashboard** with sales stats, order status pie chart, and revenue metrics
- **Product Management** (CRUD, image upload via Cloudinary, inventory)
- **Order Management** (view all orders, update status, cancel)
- **User Management** (promote to admin, delete users)
- **Payment Overview** (see all customer transactions, CSV export)

### 🔧 Technical Highlights

- **Frontend:** React 19 + Vite, Tailwind CSS, Recharts, React Router v7
- **Backend:** Python 3.13, Flask, SQLAlchemy, JWT, Bcrypt, Flask‑CORS
- **Database:** SQLite (dev) / PostgreSQL (production ready)
- **Payments:** Mock M‑Pesa STK Push simulation (ready for real Daraja API)
- **Authentication:** JWT with role‑based access (admin / user)
- **API Client:** Centralized Axios instance with interceptors

---

## 🚀 Quick Start (Local Development)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/keithowino/momma_nuts_colab.git
cd momma_nuts_colab
```
````

### 2️⃣ Install all dependencies (root, client & server)

```bash
npm run install:all
```

> This installs Node modules for the root and client, and runs `pipenv install` for the server.

### 3️⃣ Set up environment variables

**Backend (`server/.env`):**

```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-super-secret-key-min-32-chars

# Optional: Email & M-Pesa (mock mode is enabled by default)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CONSUMER_KEY=your_mpesa_consumer_key
CONSUMER_SECRET=your_mpesa_consumer_secret
SHORTCODE=174379
PASSKEY=your_mpesa_passkey
```

**Frontend (`client/.env.development`):**

```env
VITE_API_URL=http://127.0.0.1:5000
```

### 4️⃣ Run the full stack (backend + frontend together)

```bash
npm run dev
```

- Backend: `http://127.0.0.1:5000`
- Frontend: `http://localhost:3000`

> Use `npm run dev:server-only` or `npm run dev:client-only` to run one side only.

### 5️⃣ Seed the database with sample data (optional)

```bash
cd server
python -m pipenv run python
```

```python
from app import app, db
from models import Products

with app.app_context():
    sample = Products(name="Classic Roasted Peanuts", description="Lightly salted", price=8.99, stock=100)
    db.session.add(sample)
    db.session.commit()
    exit()
```

---

## 📁 Project Structure

```
momma_nuts_colab/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # All route pages (Home, ProductList, Cart, Admin, etc.)
│   │   ├── components/     # Reusable UI (ProductCard, Header, Footer, Comments, etc.)
│   │   ├── lib/config/     # API client & contexts
│   │   └── assets/         # Images, global styles
│   ├── .env.development
│   └── package.json
├── server/                 # Python Flask backend
│   ├── resources/          # API endpoints (crud.py)
│   ├── models.py           # SQLAlchemy models
│   ├── app.py              # Flask app, CORS, M-Pesa mock
│   ├── requirements.txt    # Python dependencies
│   └── .env
├── package.json            # Root scripts (concurrently, install:all)
└── README.md
```

---

## 🧪 Testing the Application

### Default Login Credentials (after seeding)

| Role  | Email                         | Password |
| ----- | ----------------------------- | -------- |
| Admin | designsolutions1629@gmail.com | password |
| User  | test@example.com              | Test1234 |

> You can also sign up a new user at `/signup` – the first user to be manually promoted to admin via database.

### API Endpoints (examples)

- `GET /products` – list all products
- `POST /login` – authenticate
- `GET /orders` – user orders (admin sees all)
- `POST /cart` – add item to cart
- `POST /mpesa/pay` – mock M‑Pesa payment

Full API is self‑documented in the code (Flask‑RESTful resources).

---

## 🛠️ Available Scripts (from root)

| Command               | Description                                  |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Start both backend and frontend concurrently |
| `npm run server`      | Start only Flask backend                     |
| `npm run client`      | Start only React frontend                    |
| `npm run install:all` | Install everything (Node + Pipenv)           |
| `npm run clean`       | Remove all `node_modules` and `.venv`        |
| `npm run build`       | Build frontend for production                |
| `npm run status`      | Show server & client URLs                    |
| `npm run kill`        | Kill processes on ports 5000 & 3000          |

---

## 🚢 Deployment

### Backend (Render)

1. Push the `server/` folder to GitHub
2. On Render, create a **New Web Service**, connect the repo
3. Set:
    - Build Command: `pip install -r requirements.txt`
    - Start Command: `gunicorn app:app`
    - Environment variables: `SECRET_KEY`, `DATABASE_URL` (PostgreSQL)
4. Deploy.

### Frontend (Vercel / Netlify)

1. Push the `client/` folder to GitHub
2. On Vercel: import project, set **Root Directory** to `client`
3. Add environment variable: `VITE_API_URL` = your deployed backend URL
4. Deploy.

> For production, set `USE_MOCK_MPESA = False` in `app.py` and provide real M‑Pesa credentials.

---

## 🧑‍💻 Developer Notes

- The frontend uses a **centralized API client** (`client/src/lib/config/api.js`) – all requests go through interceptors that attach the JWT token and handle 401s.
- Admin routes are protected by role checks on both frontend (`AdminLayout`) and backend.
- The **like system** and **comment/reply system** are fully integrated into product pages.
- M‑Pesa is in **mock mode** by default – it simulates a successful payment without real API calls. Switch to live by changing `USE_MOCK_MPESA = False` in `app.py`.
- Database migrations are handled with Flask‑Migrate. After model changes, run:
    ```bash
    cd server
    flask db migrate -m "message"
    flask db upgrade
    ```

---

## 🤝 Credits & Acknowledgments

- Special thanks to the open‑source community for React, Flask, and all amazing libraries
- Icons by React Icons and Lucide

---

## 📬 Questions or Issues?

Open a GitHub issue or contact the maintainer directly.  
**Happy snacking! 🥜✨**
