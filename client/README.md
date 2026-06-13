# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# momma_nuts_frontend

I am just from unzipping the momma_nuts_frontend-main folder i acquired from his frontend repo - https://github.com/thedann3r/momma_nuts_frontend and this is the file structure

```bash

client/
├── node_modules/
├── public/
├── src/
│ ├── assets/
│ ├── components/
│   ├── common/
│   └── Layout.jsx
│ ├── lib/
│   ├── context/
│     └── CommonContext.jsx
│ ├── pages/
│   ├── admin/
│   ├── auth/
│   ├── order/
│   ├── About.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── Home.jsx
│   ├── Payments.jsx
│   ├── ProductDetails.jsx
│   ├── ProductList.jsx
│   └── Profile.jsx
│ ├── App.jsx
│ ├── index.css
│ └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── STYLEGUIDE.md
├── tailwind.config.js
└── vite.config.js

```

```bash

backend/
├── public/
├── src/
│ ├── assets/
│ ├── authorization/
│   ├── Authorization.css
│   ├── Authorization.jsx
│   ├── ForgotPassword.jsx
│   ├── Login.jsx
│   ├── Logout.jsx
│   ├── ResetPassword.jsx
│   └── Signup.jsx
│ ├── cart/
│   ├── Cart.css
│   └── Cart.jsx
│ ├── comments/
│   ├── CommentItem.jsx
│   ├── CommentSection.jsx
│   ├── ReplyForm.jsx
│   └── ReplyList.jsx
│ ├── lansing/
│   ├── Landing.css
│   └── LandingPage.jsx
│ ├── mpesa/
│   ├── Mpesa.css
│   └── Mpesa.jsx
│ ├── navbar/
│   ├── NavBar.css
│   └── NavBar.jsx
│ ├── orders/
│   ├── OrderItems.jsx
│   ├── Orders.css
│   └── Orders.jsx
│ ├── payments/
│   └── Payments.jsx
│ ├── productAdmin/
│   ├── AProduct.css
│   ├── AProduct.jsx
│   ├── AProductItem.jsx
│   ├── AProductList.jsx
│   └── NewAProduct.jsx
│ ├── productUser/
│   ├── ProductCard.jsx
│   ├── UProduct.css
│   ├── UProduct.jsx
│   ├── UProductItem.jsx
│   └── UProductList.jsx
│ ├── profile/
│   ├── Profile.css
│   └── Profile.jsx
│ ├── App.css
│ ├── App.jsx
│ ├── index.css
│ ├── main.jsx
│ └── MainLayout.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── STYLEGUIDE.md
├── vite.config.js

```
