# ShopNest — Full-Stack E-Commerce Platform

A complete online shopping platform built from scratch during my internship at **IT Solera**. The app supports three types of users — customers, sellers, and admins — each with their own dashboard and set of features.

I built this project to learn full-stack development hands-on. It covers everything from user authentication to product management, order tracking, and admin analytics.

---

## What It Does

**For Customers:**
- Browse products by category (Men, Women) or search with filters (price, brand, color)
- View detailed product pages with image galleries, size selection, and stock info
- Add to cart, manage quantities, and checkout with shipping details
- Track order status from your personal orders page
- Forgot password? Reset it via email link

**For Sellers:**
- Register as a seller (admin approval required before you can start)
- Add, edit, and delete your own products with image uploads
- View orders that contain your products
- Update order status (processing → shipped → delivered)

**For Admins:**
- Full dashboard with revenue charts, order breakdowns, and user stats
- Manage all users — verify sellers, delete accounts
- View and manage all orders and products across the platform

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS |
| State Management | Redux Toolkit |
| Routing | React Router v7 |
| Icons | Lucide React |
| Backend | Node.js, Express 5 |
| Database | MongoDB with Mongoose |
| Auth | JWT (JSON Web Tokens) + bcrypt |
| File Upload | Multer |
| Email | Nodemailer |

---

## Project Structure

```
E-Commerce/
├── backend/
│   ├── controllers/       # Route handlers (auth, products, orders, admin)
│   ├── middleware/         # Auth middleware (protect, seller, admin)
│   ├── models/            # Mongoose schemas (User, Product, Order, Category)
│   ├── routes/            # API route definitions
│   ├── utils/             # Token generation, email sender
│   ├── uploads/           # Uploaded product images
│   └── server.js          # Entry point
│
├── frontend/e_commerce/
│   ├── src/
│   │   ├── components/    # Navbar, Footer, ProductCard, route guards
│   │   ├── components/admin/    # Admin dashboard panels
│   │   ├── components/seller/   # Seller dashboard panels
│   │   ├── pages/         # All page components (18 total)
│   │   ├── redux/         # Auth slice, Cart slice, Store config
│   │   └── services/      # API service layer (axios calls)
│   └── index.html
```

---

## Getting Started

### What You Need
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- A Gmail account (for password reset emails — you'll need an App Password)

### 1. Clone the repo
```bash
git clone https://github.com/your-username/E-Commerce.git
cd E-Commerce
```

### 2. Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=pick_any_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
PORT=5000
```

Start the server:
```bash
npm run dev
```

### 3. Set up the frontend
```bash
cd frontend/e_commerce
npm install
npm run dev
```

The app will be running at `http://localhost:5173`

### 4. (Optional) Seed sample data
If you want some sample products in the database:
```bash
cd backend
node seeder.js
```
> Note: You need at least one seller account in the database before running the seeder.

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/forgot-password` | Send reset email |
| PUT | `/api/auth/reset-password/:token` | Reset password |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/search` | Search with filters |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (seller) |
| PUT | `/api/products/:id` | Update product (seller) |
| DELETE | `/api/products/:id` | Delete product (seller) |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place order |
| GET | `/api/orders/myorders` | Get my orders |
| GET | `/api/orders/sellerorders` | Get seller's orders |
| PUT | `/api/orders/:id/status` | Update order status |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | Get all users |
| GET | `/api/admin/orders` | Get all orders |
| DELETE | `/api/admin/users/:id` | Delete user |
| PUT | `/api/admin/users/:id/verify` | Verify seller |
| DELETE | `/api/admin/products/:id` | Delete any product |

---

## Some Things Worth Knowing

- **Password rules** — Minimum 6 characters, must include both letters and numbers. This is checked on both frontend and backend.
- **Image uploads** — Product images are stored in the `backend/uploads/` folder and served as static files.
- **Route protection** — Frontend uses `PrivateRoute` and `RoleRoute` components. Backend uses JWT middleware.
- **Cart persistence** — Cart is saved in both localStorage (for guests) and MongoDB (for logged-in users).
- **Environment variable** — The frontend API URL can be changed by setting `VITE_API_URL` in a `.env` file. Defaults to `http://localhost:5000`.

---

## What I Learned

This was my first full-stack project and I learned a ton building it:
- How to structure a MERN app with separate frontend and backend
- JWT-based authentication with role-based access control
- State management with Redux Toolkit
- Building reusable React components and service layers
- Working with file uploads using Multer
- Sending emails with Nodemailer
- Writing clean, maintainable code

---

## License

This project was built as part of my internship at IT Solera. Feel free to use it as a reference or learning resource.
