# Auth

- POST /api/auth/register/ → create customer.

- POST /api/auth/vendor-register/ → vendor signup (inactive until approved).

- POST /api/auth/login/ → JWT login.

- POST /api/auth/refresh/ → refresh token.

# Admin

- GET /api/admin/vendors/

- PATCH /api/admin/vendors/{id}/approve/

- PATCH /api/admin/vendors/{id}/reject/

# Products

- GET /api/products/ → list/search/filter.

- GET /api/products/{id}/ → details.

- POST /api/vendor/products/ (vendor only).

- PATCH /api/vendor/products/{id}/.

- DELETE /api/vendor/products/{id}/.

# Wishlist

- POST /api/wishlist/add/

- DELETE /api/wishlist/remove/

# Cart

- POST /api/cart/add/

- PATCH /api/cart/update/

- DELETE /api/cart/remove/

- GET /api/cart/

# Orders

- POST /api/orders/create/ (after Stripe payment success).

- GET /api/orders/ (customer’s).

- GET /api/vendor/orders/ (vendor’s).

# Stripe

- POST /api/payment/create-intent/

- POST /api/payment/webhook/