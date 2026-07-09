# EdKart Backend API

EdKart is a robust, production-ready e-commerce REST API backend built with **Spring Boot** and **Java 26**. It provides the core business logic and database layer for an online storefront, featuring catalog search, shopping carts, order workflows, and customer reviews.

## 🚀 Key Features

* **Product Catalog**: Full CRUD support for products, multiple categories, and dynamic image mappings.
* **Advanced Filtering & Search**: Structured search filtering powered by **Spring Data JPA Specifications** (allows matching by brand, category, price ranges, and ratings dynamically).
* **Order Management System**: End-to-end checkout APIs handling orders, order items, and quantity tracking.
* **Customer Reviews**: Dynamic product rating calculation based on user feedback and reviews.
* **Secured Endpoints**: Configured with **Spring Security** to restrict admin operations and protect user data.
* **Database Auto-Seeding**: Automatically seeds the MySQL database with demo products and images on first startup for immediate testing.

## 🛠️ Technology Stack

* **Language**: Java 26
* **Framework**: Spring Boot 3.x (Web MVC, JPA, Security, Validation)
* **Database**: MySQL 8.x
* **Build Tool**: Apache Maven (Wrapper included)

## 📐 Architecture Flow

```mermaid
graph TD
    Client[Client / Frontend Application] -->|HTTP Requests| Security[Spring Security Filter Chain]
    Security -->|Authorize Request| Controller[Spring Boot Controllers]
    Controller -->|DTO Data Transfer| Service[Spring Service Layer]
    Service -->|Business Logic| Repository[Spring Data JPA Repositories]
    Repository -->|SQL Queries| DB[(MySQL Database)]

## 📂 Project Structure

    edkart/
│
├── .mvn/                                # Maven wrapper configuration
├── src/main/java/com/edcode/edkart/
│   ├── config/                          # Security & Web configuration
│   ├── controller/                      # REST API Endpoints
│   ├── dto/                             # Data Transfer Objects
│   ├── entity/                          # JPA Entities / Models
│   ├── repository/                      # JPA Database Repositories
│   ├── seed/                            # Database auto-seed implementation
│   ├── services/                        # Business Logic implementation
│   └── spec/                            # JPA Specifications for advanced search
│
├── src/main/resources/
│   ├── application.properties           # Database & server configurations
│   ├── static/                          # Static web assets (placeholder)
│   └── templates/                       # Web templates (placeholder)
│
├── uploads/                             # Product images & user-uploaded media
│   └── products/                        # Essential seed product images
│
├── mvnw                                 # Maven wrapper execution script (Unix)
├── mvnw.cmd                             # Maven wrapper execution script (Windows)
└── pom.xml                              # Maven project dependency configuration

📦 Getting Started
Prerequisites
Java 26 JDK
MySQL Server (running locally or via Docker)
Environment Variables
Configure your database credentials in your environment or update src/main/resources/application.properties:

properties


spring.datasource.url=jdbc:mysql://${MYSQL_HOST:localhost}:3306/edkart
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD
Installation & Run
Clone the repository:

bash


git clone https://github.com/your-username/edkart.git
cd edkart
Build the project using Maven Wrapper:

bash


./mvnw clean package
Run the application:

bash


./mvnw spring-boot:run
The backend server will start on port 8080.
