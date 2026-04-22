# 📦 Order Tracking System

A full-stack **Order Tracking Web Application** built with:

* **Backend:** Node.js, Express
* **Frontend:** EJS (Embedded JavaScript Templates)
* **Database:** PostgreSQL
* **Authentication:** Session-based (Login/Register)

---

## 🚀 Features

* 🔐 User Authentication (Admin & Client)
* 🧑‍💼 Role-Based Access Control
* 📦 Order Creation & Management
* 🔄 Order Status Tracking
* ⏱️ Timestamp tracking for each stage
* 📧 Email notifications (optional)
* 📊 Dashboard view (EJS)

---

## 🏗️ Project Structure

```
project/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   ├── services/
│   ├── models/
│   ├── views/
│   ├── public/
│   ├── utils/
│   └── app.js
│
├── server.js
├── .env
├── package.json
└── README.md
```

---

## 🗄️ Database Setup (PostgreSQL)

### 1. Create Database

```sql
CREATE DATABASE tracking_db;
```

---

### 2. Create Tables

#### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('ADMIN', 'CLIENT')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Orders Table

```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    po_number VARCHAR(50) NOT NULL,
    client_id INT REFERENCES users(id) ON DELETE CASCADE,
    supplier_name VARCHAR(100),
    status VARCHAR(20) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ordered_at TIMESTAMP,
    received_at TIMESTAMP,
    invoiced_at TIMESTAMP
);
```
#### Supplier Table

```
-- Create suppliers table for admin supplier management
-- Run this SQL in your PostgreSQL database

CREATE TABLE IF NOT EXISTS suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on name for faster searches
CREATE INDEX IF NOT EXISTS idx_suppliers_name ON suppliers(name);
```
#### Tickets Table
-- Create tickets table for support ticket management
-- Run this SQL in your PostgreSQL database

CREATE TABLE IF NOT EXISTS tickets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ticket_comments (
    id SERIAL PRIMARY KEY,
    ticket_id INT NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_ticket_comments_ticket_id ON ticket_comments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_comments_user_id ON ticket_comments(user_id);
```

```
#### add delivered_at column to orders

-- Migration: Add DELIVERED status support to orders table
-- Description: Adds delivered_at timestamp column to track when orders are delivered

ALTER TABLE orders ADD COLUMN delivered_at TIMESTAMP DEFAULT NULL;
ALTER TABLE orders ADD COLUMN dispatched_at TIMESTAMP DEFAULT NULL;

```
---

## ⚙️ Installation

```bash
git clone https://github.com/Akashs18/kiet_order_tracking
cd kiet_order_tracking
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file:

```
PORT=3000
DB_USER=postgres
DB_PASS=yourpassword
DB_NAME=tracking_db
SESSION_SECRET=supersecret
```

---

## ▶️ Run the App

```bash
npm start
```

App will run on:

```
http://localhost:3000
```

---

## 🔑 Default Roles

| Role   | Access            |
| ------ | ----------------- |
| ADMIN  | Manage all orders |
| CLIENT | View own orders   |

---

## 🔌 API Endpoints

### Auth

* `GET /auth/login`
* `POST /auth/login`
* `GET /auth/register`
* `POST /auth/register`
* `GET /auth/logout`

### Orders

* `GET /orders`
* `POST /orders`
* `POST /orders/:id/status`

---

## 📊 Order Workflow

```
PENDING → ORDERED → RECEIVED → INVOICED → DISPATCHED
```

---

## 🛠️ Tech Stack

* Node.js
* Express.js
* PostgreSQL
* EJS
* bcrypt
* express-session

---

## 🔒 Security Notes

* Passwords are hashed using bcrypt
* Session-based authentication
* Role-based authorization

---

## 🚀 Future Improvements

* JWT Authentication
* Docker setup
* CI/CD pipeline
* Email service integration
* Advanced dashboard (charts & analytics)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

---

## 📄 License

This project is licensed under the MIT License.
