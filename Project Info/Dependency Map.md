[User/Auth] 
   │
   ├── [Vendor Profile + Approval] ──> [Vendor Product CRUD] ──> [Product Listing/Search]
   │                                       │
   │                                       └────────────┐
   │                                                    │
   └─> [Customer Auth] ─────────────────────────────────┘
                 │
       ┌─────────┴─────────┐
       │                   │
   [Wishlist]           [Cart Mgmt] 
                            │
                   [Stripe PaymentIntent]
                            │
                          [Orders]
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
[Customer Order History]      [Vendor Orders & Analytics]
                                                │
                                       [Admin Analytics]


1. Foundation Layer (must exist first)

User model + Auth system (JWT)
→ Everything else requires users/roles.

Vendor profile model (pending approval)
→ Needed before vendor CRUD.

Product model
→ Needed before cart/wishlist/orders.

2. Second Layer (core domain features)

Vendor approval workflow
→ Depends on: User + Vendor profile.
→ Unlocks: Vendor login + product CRUD.

Product CRUD (Vendor/Admin)
→ Depends on: Product model + Vendor approval.
→ Unlocks: Customers browsing products.

Product listing/search/filter (Public)
→Depends on: Product CRUD.

3. Third Layer (shopping flow)

Wishlist
→ Depends on: Product listing + Customer auth.

Cart management
→ Depends on: Product listing + Customer auth.
→ Unlocks: Checkout.

4. Fourth Layer (transactions)

Stripe PaymentIntent API
→ Depends on: Cart (for totals), Customer auth.
→ Unlocks: Order creation.

Order & OrderItem models
→ Depends on: Cart + Stripe PaymentIntent.
→ Unlocks: Order history, vendor order view.

5. Fifth Layer (dashboards & analytics)

Customer order history
→ Depends on: Orders.

Vendor orders & analytics
→ Depends on: Orders + Product CRUD.

Admin analytics
→ Depends on: Orders + Vendor/Products data.

6. Cross-cutting

Email notifications
→Vendor approval (depends on approval workflow).
→ Order confirmation (depends on Orders).
→ Password reset (depends on Auth).

Security & permissions (role-based)
→ Depends on: Auth system.
→ Required across all layers.