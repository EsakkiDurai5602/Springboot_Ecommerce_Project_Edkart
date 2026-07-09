# Internet Banking System API

The Internet Banking System is a secure, transaction-ready financial REST API backend and frontend application built with **Spring Boot**, **Java 26**, and **React**. It provides the core financial services, multi-factor authentication, account management, and real-time transaction processing for digital banking.

## 🚀 Key Features

* **Multi-Factor Security**: Multi-factor authentication via automated email-based One-Time Passwords (OTP) and stateless JWT-based session security.
* **Account Management**: Real-time balance checks, multi-type account generation (Savings, Checking), and full transaction statements.
* **Secure Fund Transfers**: Transaction-level checks for internal and external transfers with historical state tracking and auditing.
* **Beneficiary Directory**: Add, update, and manage payees with detailed account numbers and IFSC tracking for rapid transfers.
* **Fixed Deposits (FD)**: Term-deposit creation, live interest calculation, and automatic maturity calculations.
* **Automated Mailing Engine**: Instant email updates sent to customers for successful registrations, logins, security changes, and transaction completions.

## 🛠️ Technology Stack

* **Frontend**: React.js (Vite), React Router v7, Axios, Custom CSS
* **Backend Framework**: Spring Boot 3.x (Web MVC, Data JPA, Security, Validation, Mail)
* **Database**: PostgreSQL (JPA & Hibernate ORM)
* **Build Tool**: Apache Maven (Wrapper included)

## 📦 Getting Started

### Prerequisites
* Java 26 JDK
* Node.js (v18 or higher)
* PostgreSQL Server (running locally or remotely)

### Environment Variables
Configure your database and mail credentials in your environment or update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/internet_banking
spring.datasource.username=YOUR_POSTGRES_USERNAME
spring.datasource.password=YOUR_POSTGRES_PASSWORD

# Mail Service Configurations
spring.mail.username=YOUR_GMAIL_USERNAME
spring.mail.password=YOUR_APP_SPECIFIC_PASSWORD
