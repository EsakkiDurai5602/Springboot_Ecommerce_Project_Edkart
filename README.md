# EdKart Enterprise Internet Banking & Financial Platform

A full-stack, enterprise-grade digital banking and financial platform consisting of a Spring Boot REST API backend and a responsive, secure React JSX frontend with complete NetBanking capabilities, role-based Admin Portal, and Dockerized AWS deployment architecture.

---

## 🏛️ Project Architecture

```
d:\SpringBoot\edkart/
├── backend/                       # Spring Boot 4 REST API, JPA & Security
│   ├── src/main/java/             # Controllers, Entities, Repositories, DTOs
│   ├── src/main/resources/        # application.properties & profiles
│   ├── Dockerfile                 # Multi-stage JDK 21 Alpine container
│   ├── pom.xml                    # Maven dependencies
│   └── mvnw / mvnw.cmd            # Maven wrappers
├── frontend/                      # React 18 + Vite + Tailwind CSS + Lucide
│   ├── src/                       # JSX Components, Features, Layouts, Contexts
│   │   ├── assets/                # Visual cards, vaults, loans & security illustrations
│   │   ├── components/ui/         # 18 Reusable accessible design system components
│   │   ├── components/layout/     # AppShell, AdminLayout, Topbar, Sidebar, MobileNav
│   │   ├── context/               # AuthContext, BankingContext, ThemeContext, ToastContext
│   │   ├── features/              # Feature modules (User NetBanking & Admin Portal)
│   │   ├── services/              # API Client & banking state services
│   │   └── tests/                 # Vitest & React Testing Library test suites
│   ├── Dockerfile                 # Multi-stage Node.js build -> Nginx SPA image
│   ├── nginx-frontend.conf        # Nginx SPA router & backend reverse proxy
│   └── package.json               # Pure JavaScript JSX dependencies & scripts
├── docker-compose.yml             # Root multi-container orchestration (MySQL, Backend, Frontend)
├── AWS_Deployment_Guide.md        # Comprehensive EC2 + DuckDNS + SSL deployment guide
└── nginx.conf                     # Host-level Nginx SSL reverse proxy
```

---

## 🌟 Key Features

### 👤 Customer NetBanking Portal
- **Financial Dashboard**: Real-time total balance, hide/reveal toggle, quick transfers, category spending analysis, and recent activity feed.
- **Account Management**: Savings, Current, and Fixed Deposit accounts with masked numbers, branch details, and statement generator.
- **Domestic Transfers**: Instant 24/7 IMPS, NEFT, and RTGS transfers with double-submit protection, review modal, and 2FA OTP authorization.
- **Beneficiaries Directory**: Register new payees with IFSC validation, daily limits, and instant transfer actions.
- **Bill Payments**: 7 Biller categories (Electricity, Mobile, Broadband, Water, Gas, Credit Cards, Insurance) with bill fetch and instant receipts.
- **Cards Management**: 3D visual card renders (Titanium Elite, Sapphire Reserve, Virtual Shield), freeze/unfreeze toggle, daily limit slider, PIN reset, and lost card reporting.
- **Loans & EMI Calculator**: Outstanding balances, repayment progress, digital loan applications, and interactive principal/interest calculator.
- **e-Documents**: Download monthly PDF statements, tax certificates, and deposit receipts.
- **Security Center**: Password update, 2FA toggle, and active session audit across devices.

### 🛡️ Operations Admin Portal (`ROLE_ADMIN`)
- **Product Catalog CRUD**: Add, edit, and delete banking products with custom image URLs, interest rates, minimum balances, and feature tags.
- **Customer KYC Pipeline**: Approve or reject pending PAN/Aadhaar identity verifications, lock or unlock account NetBanking access.
- **Transaction Oversight**: Real-time surveillance of all system transactions with high-value transfer tags (> ₹1,00,000).
- **Dispute Resolution Desk**: View and reply to customer transaction dispute tickets and update resolution statuses.
- **Security Audit Logs**: Cryptographic audit logs with timestamp, IP address, and operation status.

### 🌓 Day / Night Themes
- Instant toggle between **Light Slate** and **Dark Navy** fintech color palettes.

---

## 🔑 Demo Login Credentials

| Role | Email / User ID | Password | Access Level |
|---|---|---|---|
| **Bank Customer** | `durai@edkart.com` | `Password@123` | Full NetBanking Portal |
| **Bank Administrator** | `admin@edkart.com` | `Admin@123` | Full Operations Admin Console |
| **Locked Account** | `locked@edkart.com` | *Any* | Demonstrates security lock state |

*(Use the 1-click **Customer Demo** or **Admin Console** buttons on the Login page for instant login)*

---

## 🚀 Local Development Setup

### 1. Run Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```
Access at `http://localhost:3000`.

### 2. Run Tests
```bash
cd frontend
npm run test
```

### 3. Production Build
```bash
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

---

## ☁️ AWS EC2 & DuckDNS Deployment

Refer to [`AWS_Deployment_Guide.md`](./AWS_Deployment_Guide.md) for full instructions on launching on Ubuntu EC2 with DuckDNS and Let's Encrypt SSL.
