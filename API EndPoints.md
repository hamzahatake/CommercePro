# 📑 API Contract — E-Commerce Web App (React + Django + DRF + Stripe)

Base URL: `/api/`

Authentication: **JWT (SimpleJWT)**

* Login returns `{ access, refresh }`.
* Pass token as `Authorization: Bearer <access_token>` on protected endpoints.


**Auth**

1. Register (Customer)

→ POST `/auth/register/`
→ Public
→ Request:

```json
{ "username": "john_doe", "email": "john@example.com", "password": "pass1234" }
```

→ Response:

```json
{ "id": 1, "username": "john_doe", "email": "john@example.com", "role": "customer" }
```

2. Vendor Register

→ POST `/auth/vendor-register/`
→ Public (sets `is_active = false` until admin approval)
→ Request:

```json
{ "username": "vendor123", "email": "vendor@example.com", "password": "pass1234", "business_name": "Tech Store" }
```

→ Response:

```json
{ "id": 5, "username": "vendor123", "email": "vendor@example.com", "role": "vendor", "is_active": false }
```

3. Login

→ POST `/auth/login/`
→ Public
→ Request:

```json
{ "email": "john@example.com", "password": "pass1234" }
```

→ Response:

```json
{ "access": "<jwt_access>", "refresh": "<jwt_refresh>" }
```

4. Token Refresh

→ POST `/auth/refresh/`
→ Public
→ Request:

```json
{ "refresh": "<jwt_refresh>" }
```

→ Response:

```json
{ "access": "<new_access_token>" }
```


**Admin — Vendor Management**

5. List Vendors

→ GET `/admin/vendors/`
→ Admin only
→ Response:

```json
[
  { "id": 5, "username": "vendor123", "email": "vendor@example.com", "business_name": "Tech Store", "is_active": false }
]
```

6. Approve Vendor

→ PATCH `/admin/vendors/{id}/approve/`
→ Admin only
→ Response:

```json
{ "id": 5, "username": "vendor123", "is_active": true, "approved_at": "2025-08-18T10:00:00Z" }
```

7. Reject Vendor

→ PATCH `/admin/vendors/{id}/reject/`
→ Admin only
→ Response:

```json
{ "message": "Vendor rejected and notified." }
```


**Products**

8. Public Product List

→ GET `/products/`
→ Public
→ Query params: `?search=laptop&category=electronics&page=1`
→ Response:

```json
[
  { "id": 1, "title": "Laptop", "price": 1200, "stock": 10, "category": "electronics", "vendor": "Tech Store" }
]
```

9. Product Details

→ GET `/products/{id}/`
→ Public
→ Response:

```json
{ "id": 1, "title": "Laptop", "description": "High-end laptop", "price": 1200, "stock": 10, "category": "electronics", "vendor": "Tech Store", "image": "/media/laptop.png" }
```

10. Vendor Product CRUD

→ POST `/vendor/products/`
→ Vendor only
→ Request:

```json
{ "title": "Mouse", "description": "Wireless mouse", "price": 25, "stock": 50, "category": "accessories", "image": "<file>" }
```

**Response:**

```json
{ "id": 2, "title": "Mouse", "price": 25, "stock": 50, "category": "accessories" }
```

→ PATCH `/vendor/products/{id}/`
→ DELETE `/vendor/products/{id}/`


**Wishlist**

11. Add to Wishlist

→ POST `/wishlist/add/`
→ Customer only
→ Request:

```json
{ "product_id": 1 }
```

**Response:**

```json
{ "message": "Added to wishlist" }
```

12. Remove from Wishlist

→ DELETE`/wishlist/remove/`
→ Customer only
→ Request:

```json
{ "product_id": 1 }
```

**Response:**

```json
{ "message": "Removed from wishlist" }
```


**Cart**

13. Add Item

→ POST `/cart/add/`
→ Customer only
→ Request:

```json
{ "product_id": 1, "quantity": 2 }
```


**Response:**

```json
{ "cart_id": 10, "items": [{ "product": "Laptop", "quantity": 2, "price": 1200 }], "total": 2400 }
```


14. Update Item

→ PATCH `/cart/update/`

```json
{ "product_id": 1, "quantity": 3 }
```


15. Remove Item

→ DELETE `/cart/remove/`

```json
{ "product_id": 1 }
```

16. Get Cart

→ GET`/cart/`
→ Customer only


**Orders & Checkout**

17. Create PaymentIntent

→ POST `/orders/create-payment-intent/`
→ Customer only
→ Request:

```json
{ "cart_id": 10 }
```

**Response:**

```json
{ "client_secret": "pi_12345_secret_67890" }
```

18. Place Order (after payment success)

→ POST `/orders/create/`
→ Customer only
→ Request:

```json
{ "payment_intent_id": "pi_12345" }
```

**Response:**

```json
{ "order_id": 55, "status": "paid", "total": 2400 }
```

19. Get Customer Orders

→ GET `/orders/`
→ Customer only
→ Response:

```json
[
  { "id": 55, "status": "paid", "total": 2400, "created_at": "2025-08-18T10:00:00Z" }
]
```

20. Vendor Orders

→ GET `/vendor/orders/`
→ Vendor only
→ Response:

```json
[
  { "order_id": 55, "product": "Laptop", "quantity": 2, "total": 2400 }
]
```


**Analytics**

21. Admin Analytics

→ GET `/admin/analytics/`
→ Admin only
→ Response:

```json
{ "total_sales": 25000, "top_products": ["Laptop", "Phone"], "top_vendors": ["Tech Store"] }
```

22. Vendor Analytics

→ GET `/vendor/analytics/`
→ Vendor only
→ Response:

```json
{ "monthly_revenue": 5000, "top_products": ["Mouse", "Keyboard"] }
```


**Stripe Webhooks**

23. Webhook

→ POST `/stripe/webhook/`
→ Stripe only (signed request)
→ Handles events: `payment_intent.succeeded`, `payment_intent.failed`.
→ Response (success): `200 OK`
