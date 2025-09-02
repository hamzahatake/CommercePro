### E‑commerce Backend Flow (Django + DRF + PostgreSQL + Stripe)

This document explains the backend flow in simple steps. It shows how users move through the system, how permissions work, how orders and payments are handled, and how analytics and emails are sent. No code here — just the logic and the main Django/DRF features being used.

Note: File names like `users/`, `products/`, `cart/`, and `orders/` refer to Django apps in the backend.

## 1 - User Authentication and Roles

- **Roles**: Admin, Vendor, Customer.
  - **Custom user model** (Django feature): We use a custom user model in `users/` that stores the role. This lets us attach role-based logic everywhere.
  - Admins manage the site, Vendors manage their products and see their orders, Customers browse and buy.

- **Sign up and login**:
  - **Sign up**: A user picks a role during registration. Vendors start as “pending” until approved (details below).
  - **Login with JWT (SimpleJWT)**: We use DRF + SimpleJWT to issue two tokens:
    - Access token (short‑lived) and refresh token (long‑lived).
    - On each request to protected APIs, the client sends `Authorization: Bearer <access_token>`.
    - When the access token expires, the client requests a new one using the refresh token.
  - **Logout**: The client deletes tokens locally. If token blacklisting is enabled, we also blacklist refresh tokens (SimpleJWT feature).

- **Permissions**:
  - **DRF permissions** and possibly **custom permission classes** in `users/permissions.py` and `products/permissions.py` restrict access.
  - Examples of rules:
    - Only Admins can approve Vendors.
    - Only Vendors can create/edit/delete their own products.
    - Customers cannot write to product endpoints, only read.
    - Only the owner of a cart/wishlist can view or modify it.
    - Vendors only see orders that include their products (custom filtering logic in `orders/views.py`).

## 2 - Vendor Approval Workflow

- **Vendor registers**:
  - In the registration API, if a user selects the Vendor role, we create a vendor profile with `is_approved=False`.
  - The Vendor can log in but cannot publish products until approved.

- **Admin approval**:
  - Admin reviews pending vendors via the Django admin panel or an admin‑only API endpoint (DRF + permissions).
  - Admin sets `is_approved=True` to approve or keeps it false/rejects with a reason.

- **Emails**:
  - When a Vendor is approved (or rejected), we send an email using **Django’s email system**.
  - This can be triggered via **signals** (see `users/signals.py`) or directly in views/serializers.
  - If there is a task runner (see `users/tasks.py`), sending can be queued to avoid blocking requests.

## 3 - Products and Inventory

- **Create/Edit/Delete**:
  - Vendors use authenticated endpoints to add products in `products/` (DRF views/serializers).
  - **Permissions**:
    - Vendors can manage only their own products.
    - Admins can manage any product (override permissions).
  - **Validation**:
    - Uploads (images, etc.) are validated using custom validators in `products/validators.py`.

- **Stock management**:
  - Each product has a stock quantity.
  - Stock is NOT permanently reduced when adding to cart. It is only reduced after a successful payment (to avoid reserved but unpaid items).
  - We check stock both during checkout request and again on payment confirmation (to be safe against race conditions).

## 4 - Cart and Wishlist

- **Cart** (`cart/` app):
  - Each user has a cart with one or more cart items (product + quantity).
  - **Create/Update**: Users add products to their cart and change quantities via DRF endpoints.
  - **Validation**: We validate that quantities are positive and do not exceed available stock at the time of adding/updating.
  - **Storage**: Cart items are stored in the database tied to the authenticated user.

- **Wishlist** (`wishlist/` app):
  - Many‑to‑many relationship between users and products.
  - Users can add/remove products from their wishlist via DRF endpoints.
  - Wishlist does not affect stock; it is for saving favorites.

## 5 - Orders and Checkout with Stripe

- **Creating an order (pre‑payment)**:
  - When a user proceeds to checkout, we create an Order and related OrderItems from the cart contents.
  - Order status starts as something like “pending” or “unpaid”.
  - We re‑check stock. If any item is out of stock, we return a clear error.

- **Stripe PaymentIntent (server‑side)**:
  - Backend uses **Stripe’s Python SDK** and a secret key from environment variables to create a **PaymentIntent** with the total amount and currency.
  - We return the `client_secret` to the frontend, which confirms the payment on the client side.

- **Stripe Webhook (payment confirmation)**:
  - Stripe sends events (like `payment_intent.succeeded`) to our webhook endpoint (DRF view).
  - We verify the event signature using the **Stripe webhook secret** (environment variable) to ensure the event is genuine.
  - On confirmed success:
    - Mark the Order as “paid/complete”.
    - **Reduce stock** for each product in the order (final, persistent deduction).
    - Clear the user’s cart.
    - Send order confirmation email (see below).
  - On failure/cancellation, we mark the Order accordingly and do NOT reduce stock.

## 6 - Vendor Orders (What Vendors Can See)

- **Filtered view** (custom logic):
  - Vendors only see orders that contain at least one of their products.
  - In queries, we filter `OrderItems` by `product.vendor == request.user` and show only those items.

- **Visible information to Vendors**:
  - Order ID, dates, payment status.
  - The specific items that belong to that Vendor (product name, quantity, price subtotal).
  - Limited customer info required for fulfillment (e.g., shipping details if needed).

- **Hidden information**:
  - Items sold by other vendors in the same order are not shown to this Vendor.
  - Sensitive customer data beyond what is necessary is not exposed.

## 7 - Analytics

- **For Vendors**:
  - Monthly revenue, total orders, and top products based on `OrderItem` data.
  - Implemented with **Django ORM annotations** and **aggregations** (`annotate`, `aggregate`, `Sum`, `Count`, possibly `TruncMonth`).
  - Queries filter by the vendor so each vendor sees only their own performance.

- **For Admins**:
  - Site‑wide metrics: total sales, total orders, top vendors, and top products.
  - Also built using ORM aggregations on `Order` and `OrderItem` models, optionally grouped by month.

## 8 - Emails

- **Events that send emails**:
  - Vendor approval or rejection (to the vendor).
  - Order confirmation after successful payment (to the customer).
  - Optional: Payment failure/cancellation notice.

- **How we send**:
  - **Django’s email system** configured in settings (SMTP/Console/Other backend).
  - Emails can be dispatched in request/response cycle or via background tasks (see `users/tasks.py` if enabled).
  - Webhook‑triggered emails are sent after we verify payment success.

## 9 - Security and Best Practices

- **Permissions**:
  - DRF permissions restrict access by role and object ownership.
  - Custom permission classes enforce vendor ownership of products and limit vendor order visibility.

- **Authentication**:
  - JWT (SimpleJWT) for stateless auth. Access tokens are short‑lived; refresh tokens rotate/renew.

- **Data validation**:
  - DRF **serializers** validate inputs for users, products, cart, and orders.
  - File and image uploads validated with custom validators (`products/validators.py`).

- **Stripe safety**:
  - Webhook signature is verified using the Stripe library before processing.
  - Amounts sent to Stripe are computed server‑side to prevent tampering.

- **Environment variables**:
  - Secrets and keys (Stripe secret, webhook secret, database password, JWT settings) live in environment variables and are loaded in `backend/settings.py`.
  - This keeps secrets out of source control and allows different values per environment (dev/stage/prod).

- **Database integrity**:
  - PostgreSQL transactions protect critical flows like order finalization and stock deduction.
  - We re‑check stock at payment confirmation to avoid overselling.

## Putting It All Together (Story Flow)

1. A user signs up and chooses a role.
   - If Vendor, their account is pending approval.
2. The user logs in and receives JWT tokens. They use the access token for API calls.
3. If the user is a Vendor, an Admin approves them. An email notifies the Vendor.
4. Vendors add products with prices, images, and stock. Admins can also manage products.
5. Customers browse products and add them to their cart or wishlist.
6. At checkout, an Order is created from the cart. We create a Stripe PaymentIntent and return its client secret.
7. The frontend confirms payment with Stripe. Stripe sends a webhook to our backend.
8. The webhook verifies the event. If successful, we mark the Order paid, reduce stock, clear the cart, and send a confirmation email.
9. Vendors can view only the items from paid orders that belong to them and track their revenue.
10. Admins view site‑wide analytics and manage vendors and products.

That’s the complete backend flow in plain words. Check the Django apps (`users/`, `products/`, `cart/`, `orders/`, `wishlist/`) for where each piece lives. Built‑in Django/DRF features (auth, serializers, permissions) are used wherever possible, and custom logic is added for vendor filtering, approvals, stock handling, webhooks, and analytics.


