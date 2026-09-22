# E-commerce REST API

## Description

REST API built with JavaScript and Express for a simple e-commerce application. Consumers can register, login to obtain a JWT token, and perform checkout. All data is stored in memory (no database).

## Installation

```bash
npm install
```

## How to Run

```bash
npm start
```

The API will be available at `http://localhost:3000`.

Swagger UI is available at `http://localhost:3000/api-docs`.

## Rules

1. **Authentication** — Only authenticated users (with a valid JWT) can perform checkout.
2. **Payment methods** — Checkout accepts only `cash` or `credit_card`.
3. **Cash discount** — Paying with `cash` applies a **10% discount** on the order subtotal.
4. **In-memory storage** — Users and products live in memory; data resets when the server restarts.

## Existent Data

### Users

| ID | Username | Email              | Password     |
|----|----------|--------------------|--------------|
| 1  | alice    | alice@example.com  | password123  |
| 2  | bob      | bob@example.com    | password123  |
| 3  | carol    | carol@example.com  | password123  |

### Products

| ID | Name                 | Description                                              | Price  |
|----|----------------------|----------------------------------------------------------|--------|
| 1  | Wireless Headphones  | Noise-cancelling over-ear headphones                     | 99.99  |
| 2  | Smart Watch          | Fitness tracking smartwatch with heart-rate monitor      | 149.99 |
| 3  | USB-C Hub            | 7-in-1 USB-C hub with HDMI and SD card reader            | 49.99  |

## How to Use the Rest API

### 1. Healthcheck

```bash
curl -X GET http://localhost:3000/healthcheck
```

### 2. Register

```bash
curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "dave",
    "email": "dave@example.com",
    "password": "password123"
  }'
```

### 3. Login

```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "password": "password123"
  }'
```

Use the `token` from the response in the `Authorization` header for checkout.

### 4. Checkout

```bash
curl -X POST http://localhost:3000/checkout \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "items": [
      { "productId": 1, "quantity": 2 },
      { "productId": 3, "quantity": 1 }
    ],
    "paymentMethod": "cash"
  }'
```

**Payment method options:** `cash` (10% discount) or `credit_card` (no discount).

### API Endpoints Summary

| Method | Endpoint       | Auth Required | Description                          |
|--------|----------------|---------------|--------------------------------------|
| POST   | `/register`    | No            | Register a new user                  |
| POST   | `/login`       | No            | Login and receive a JWT token        |
| POST   | `/checkout`    | Yes (JWT)     | Checkout with cash or credit card    |
| GET    | `/healthcheck` | No            | Check API health                     |
| GET    | `/api-docs`    | No            | Interactive Swagger documentation    |

### Project Structure

```
src/
├── app.js                 # Express app setup
├── server.js              # Server entry point
├── controllers/           # Request handlers
├── middleware/            # Auth middleware
├── models/                # In-memory users and products
├── routes/                # Route definitions
└── services/              # Business logic
swagger.yaml               # OpenAPI specification
```
