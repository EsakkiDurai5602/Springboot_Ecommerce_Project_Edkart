# EdKart Enterprise E-Commerce Platform

A full-stack, enterprise-grade digital e-commerce application consisting of a **Spring Boot 4 REST API backend** and a modern, responsive **React JSX frontend** with complete storefront browsing, category filtering, cart & checkout, order tracking, and an operations Admin Portal with Day & Night themes.

---

## 🏛️ Project Architecture

```
d:\SpringBoot\edkart/
├── backend/                       # Spring Boot 4 REST API, JPA & Security
│   ├── src/main/java/com/edcode/edkart/
│   │   ├── config/                # SecurityConfiguration & GlobalExceptionHandler
│   │   ├── controller/            # ProductController, OrderController, ProductReviewController
│   │   ├── dto/                   # ProductDto, OrderItemDto, CreateOrderList, OrderCreated
│   │   ├── entity/                # Product, Order, OrderItem, ProductReview, ProductImage
│   │   ├── repository/            # ProductRepository, OrderRepository, ProductReviewRepository
│   │   ├── seed/                  # ProductSeeder (Tech products initial seed)
│   │   ├── services/              # ProductServices, OrderServices
│   │   └── EdkartApplication.java # Spring Boot Main Class
│   ├── src/main/resources/        # application.properties & profiles
│   ├── Dockerfile                 # Multi-stage JDK 21 Alpine container
│   ├── pom.xml                    # Maven dependencies
│   └── mvnw / mvnw.cmd            # Maven wrapper
├── frontend/                      # React 18 + Vite + Tailwind CSS + Lucide Icons
│   ├── src/                       # JSX Components, Features, Layouts, Contexts
│   │   ├── components/layout/     # Navbar, Footer, CartDrawer, StoreLayout, AdminLayout
│   │   ├── components/ui/         # 18 Reusable accessible design system components
│   │   ├── context/               # CartContext, AuthContext, ThemeContext, ToastContext
│   │   ├── features/              # Feature modules (Storefront & Admin Portal)
│   │   ├── services/              # API Client & E-Commerce state services
│   │   └── tests/                 # Vitest & React Testing Library test suites (15 tests)
│   ├── Dockerfile                 # Multi-stage Node.js build -> Nginx SPA image
│   ├── nginx-frontend.conf        # Nginx SPA router & backend reverse proxy
│   └── package.json               # Pure React JSX dependencies & scripts
├── docker-compose.yml             # Root multi-container orchestration (MySQL, Backend, Frontend)
├── AWS_Deployment_Guide.md        # Comprehensive EC2 + DuckDNS + SSL deployment guide
└── nginx.conf                     # Host-level Nginx SSL reverse proxy
```

---

## 🌟 Key Features

### 🛍️ Storefront Experience
- **Home Showcase**: Hero tech promotional banners, category navigation cards, featured tech drops, flash deals, and trust badges.
- **Product Catalog (`/shop`)**: Multi-category filter (Smartphones, Laptops, Audio, Wearables, Gaming, Accessories), price range slider (₹5,000 - ₹3,50,000), minimum star ratings (4★, 3★), keyword search, sorting options, and grid/list view toggles.
- **Product Detail View (`/product/:id`)**: High-resolution image gallery with zoom and thumbnails, verified stock level indicator, seller details, quantity selector, customer reviews list, and "Write a Review" modal.
- **Shopping Cart & Drawer (`/cart`)**: Real-time line items, quantity adjustment (+/-), free shipping progress bar, and coupon code system (`EDKART10` for 10% discount).
- **Multi-Step Checkout (`/checkout`)**: Shipping Address form, payment selection (Instant UPI, Cards, NetBanking, COD), and order placement.
- **Order Tracking & Invoices (`/orders`)**: Order confirmation voucher with Order ID, printable tax invoice, and status progression timeline (`PROCESSING` -> `SHIPPED` -> `DELIVERED`).

### 🛡️ Operations Admin Portal (`ROLE_ADMIN` at `/admin/*`)
- **Admin Dashboard**: Total Sales Revenue, Total Orders count, Active Products count, Inventory Low-Stock warnings, Recent Orders feed.
- **Product Inventory CRUD**: Add new products with high-resolution image URLs, stock levels, category, seller, description, and price; Edit products; Delete products.
- **Customer Orders Management**: Review all customer orders, inspect line items, and update fulfillment status (`PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`).

### 🌓 Day & Night Themes
- Instant toggle between **Light Day Mode** and **Dark Night Mode**.

---

## 🔑 Demo Login Credentials

| Role | Email / User ID | Password | Access Level |
|---|---|---|---|
| **Shopper Customer** | `user@edkart.com` | `Password@123` | Full Storefront, Cart, Checkout & Orders |
| **Store Administrator** | `admin@edkart.com` | `Admin@123` | Store Operations Admin Console |

*(Use the 1-click **Customer Demo** or **Store Admin** buttons on the Login page)*

---

## 🚀 Running the Full Stack

### 1. Start Backend (Spring Boot on Port 8085):
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### 2. Start Frontend (React + Vite on Port 3000):
```powershell
cd frontend
npm run dev
```

### 3. Run Automated Tests:
```powershell
cd frontend
npm run test
```

### 4. Production Build:
```powershell
cd frontend
npm run build
```

---

## 🐳 Docker Multi-Container Deployment

Run the complete stack (MySQL 8, Spring Boot Backend, and React Frontend):
```bash
docker compose up --build -d
```
Access the application at `http://localhost`.
