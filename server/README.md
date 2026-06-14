## 📄 Server `README.md` (`server/README.md`)

# 🐍 Momma Nuts – Flask Backend

This is the **Python Flask** backend for the Momma Nuts e‑commerce platform.
It provides a RESTful API for products, cart, orders, payments, authentication, comments, and admin operations.

---

## 🚀 Tech Stack

- **Python 3.13+**
- **Flask** & **Flask‑RESTful** – API framework
- **Flask‑SQLAlchemy** – ORM
- **Flask‑JWT‑Extended** – JWT authentication & refresh tokens
- **Flask‑Bcrypt** – password hashing
- **Flask‑CORS** – cross‑origin requests
- **SQLite** (development) / **PostgreSQL** (production)
- **Flask‑Migrate** – database migrations
- **Requests** – for M‑Pesa API calls (mock mode by default)
- **python‑dotenv** – environment variables

---

## 📁 Project Structure (Selected)

```

server/
├── resources/
│ └── crud.py # All API resource classes (User, Product, Order, Cart, etc.)
├── models.py # SQLAlchemy models (Users, Products, Orders, Payments, Comments, Likes)
├── app.py # Flask app entry, CORS, M‑Pesa mock endpoint
├── email_utils.py # Email helpers (welcome, password reset, order confirmation)
├── requirements.txt # Python dependencies
├── .env # Environment variables (not committed)
├── instance/
│ └── app.db # SQLite database (ignored)
└── migrations/ # Alembic migration scripts

```

---

## 🔧 Environment Variables (`.env`)

| Variable                   | Description                               | Required                |
| -------------------------- | ----------------------------------------- | ----------------------- |
| `SECRET_KEY`               | JWT signing key (min 32 chars)            | ✅                      |
| `DATABASE_URL`             | PostgreSQL connection string (production) | ⬜ (defaults to SQLite) |
| `EMAIL_USER`               | Gmail address for sending emails          | ⬜                      |
| `EMAIL_PASS`               | Gmail app password                        | ⬜                      |
| `CONSUMER_KEY`             | M‑Pesa sandbox consumer key               | ⬜ (mock mode default)  |
| `CONSUMER_SECRET`          | M‑Pesa sandbox consumer secret            | ⬜                      |
| `SHORTCODE`                | M‑Pesa shortcode                          | ⬜                      |
| `PASSKEY`                  | M‑Pesa passkey                            | ⬜                      |
| `EMAIL_VALIDATION_API_URL` | Optional email validation endpoint        | ⬜                      |
| `EMAIL_VALIDATION_API_KEY` | API key for email validation              | ⬜                      |

> **Mock M‑Pesa** is enabled by default (`USE_MOCK_MPESA = True` in `app.py`).
> No real credentials are needed to test the checkout flow.

---

## 📦 Installation & Running

### 1️⃣ Install dependencies (using pipenv)

```bash
pip install pipenv
pipenv install
```

### 2️⃣ Activate virtual environment

```bash
pipenv shell
```

### 3️⃣ Set up environment variables

Create a `.env` file in the `server/` folder with at least:

```env
SECRET_KEY=your-very-strong-secret-key-at-least-32-characters
FLASK_APP=app.py
FLASK_ENV=development
```

### 4️⃣ Initialize the database

```bash
flask db upgrade
```

### 5️⃣ Run the development server

```bash
python app.py
```

Server runs at `http://127.0.0.1:5000`

---

## 🧪 API Endpoints Overview

### Authentication

- `POST /signup` – register new user
- `POST /login` – login (returns JWT token)
- `POST /refresh` – refresh expired token
- `GET /me` – current user profile

### Products

- `GET /products` – list products (with `?collection=` or `?category=` filters)
- `GET /products/<id>` – single product
- `POST /products` – create product (admin only)
- `PATCH /products/<id>` – update product (admin)
- `DELETE /products/<id>` – soft delete product (admin)

### Cart

- `GET /cart` – get user's cart
- `POST /cart` – add/update quantity
- `DELETE /cart/<cart_id>` – remove item
- `DELETE /cart` – clear entire cart

### Orders & Payments

- `POST /checkout` – create order from cart, clear cart
- `GET /orders` – list user orders (admin sees all)
- `PATCH /orders/<id>` – cancel order
- `GET /payments` – user payment history (admin sees all)
- `POST /mpesa/pay` – initiate mock M‑Pesa payment

### Comments & Likes

- `GET /comments/product/<product_id>` – get comments for product
- `POST /comments` – add comment
- `DELETE /comments/<id>` – delete comment (owner or admin)
- `POST /comments/<comment_id>/replies` – reply to comment
- `POST /products/<id>/likes` – like product
- `DELETE /products/<id>/likes` – unlike product

### Admin (role‑based)

- `GET /users` – list all users (admin only)
- `PATCH /users/<id>` – update user role (admin)
- `DELETE /delete` – soft delete user (admin or self)

> The full API is self‑documented in `resources/crud.py` – each class maps directly to an endpoint.

---

## 🗄️ Database Models (SQLAlchemy)

| Model        | Description                                                                             |
| ------------ | --------------------------------------------------------------------------------------- |
| `Users`      | id, name, email, phone, password, role (admin/user), is_active, deleted_at              |
| `Products`   | name, description, price, image, stock, collection, category, deleted_at                |
| `Orders`     | user_id, total_price, status (pending/completed/canceled), created_at                   |
| `OrderItems` | order_id, product_id, quantity, price                                                   |
| `Payments`   | order_id, user_id, mpesa_receipt_number, phone_number, amount, status, transaction_date |
| `Cart`       | user_id, product_id, quantity                                                           |
| `Comments`   | content, user_id, product_id, parent_id, created_at, deleted_at                         |
| `Likes`      | user_id, product_id                                                                     |

---

## 🔐 Authentication & Authorization

- JWT tokens are created with `identity=str(user.id)` and additional claims (name, email, role).
- The `@jwt_required()` decorator protects endpoints.
- Role checks are performed using `get_jwt()` claims or database lookup.
- Tokens expire after 7 days (refresh token can extend).

---

## 🧪 Testing with cURL

```bash
# Login
curl -X POST http://127.0.0.1:5000/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"test@example.com","password":"Test1234"}'

# Get all products
curl http://127.0.0.1:5000/products

# Add to cart (replace token)
curl -X POST http://127.0.0.1:5000/cart \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"product_id":1,"quantity":2}'
```

---

## 🚢 Deployment (Render)

1. Push this `server/` folder to GitHub.
2. On Render, create a **New Web Service**.
3. Connect your repository, set **Root Directory** to `server`.
4. Set Build Command: `pip install -r requirements.txt`
5. Set Start Command: `gunicorn app:app`
6. Add environment variables: `SECRET_KEY`, `DATABASE_URL` (Render PostgreSQL), and optional email/M‑Pesa keys.
7. Deploy.

> For production, change `USE_MOCK_MPESA = False` in `app.py` and provide valid M‑Pesa credentials.

---

## 🧹 Migrations

After changing models:

```bash
flask db migrate -m "description"
flask db upgrade
```

---

## 📚 Dependencies (requirements.txt)

All dependencies are listed in `requirements.txt` – install with `pip install -r requirements.txt`.

---

## 💡 Troubleshooting

| Issue                       | Solution                                                            |
| --------------------------- | ------------------------------------------------------------------- |
| `ModuleNotFoundError`       | Run `pipenv install` or `pip install -r requirements.txt`           |
| Database locked             | Stop the server, delete `instance/app.db`, and run migrations again |
| JWT signature error         | Regenerate `SECRET_KEY` in `.env` and restart                       |
| CORS errors                 | Ensure `CORS(app, origins="http://localhost:3000")` is set          |
| M‑Pesa callback not working | Mock mode is enabled – no real callback needed                      |
