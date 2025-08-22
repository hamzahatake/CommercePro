User (role: admin/vendor/customer)
   |---(1:1)--- VendorProfile
   |---(1:N)--- Cart
   |---(1:N)--- Wishlist
   |---(1:N)--- Order

VendorProfile (business_name, status)
   |---(1:N)--- Product
   |---(1:N)--- OrderItem (sales tracking)

Product (title, price, stock, category)
   |---(1:N)--- CartItem
   |---(1:N)--- WishlistItem
   |---(1:N)--- OrderItem

Cart (per customer)
   |---(1:N)--- CartItem (quantity)

Wishlist (per customer)
   |---(1:N)--- WishlistItem

Order (per customer)
   |---(1:N)--- OrderItem (captures vendor + product snapshot)


# 📦 Database Schema (PostgreSQL → Django Models)

1. # User & Profiles

- User (Custom AbstractUser)
→ id (PK, UUID or AutoField)
→ username (unique)
→ email (unique, required)
→ password (hashed)
→ role (enum: admin, vendor, customer)
→ is_active (bool, defaults True, except vendor pending approval)
→ date_joined (datetime)

Relationships:
→ One-to-one → VendorProfile (only if role=vendor)
→ Customers can have Cart, Wishlist, Orders.

- VendorProfile
→ id (PK)
→ user_id (FK → User, one-to-one, unique, role must = vendor)
→ business_name (string)
→ approved_at (datetime, nullable if not approved)
→ status (enum: pending, approved, rejected)

Relationships:
→ One-to-many → Products
→ One-to-many → Orders (through OrderItems, because orders can contain multiple vendors’ products)

2. # Products & Categories

- Category
→ id (PK)
→ name (string, unique)
→ slug (string, unique)

- Product
→ id (PK)
→ vendor_id (FK → VendorProfile)
→ category_id (FK → Category, nullable)
→ title (string)
→ slug (string, unique)
→ description (text)
→ price (decimal, precision=10,2)
→ stock (integer)
→ image (string/filepath or S3 URL)
→ created_at (datetime)
→ updated_at (datetime)

3. # Wishlist & Cart

- Wishlist
→ id (PK)
→ user_id (FK → User, role=customer)
→ created_at (datetime)

- WishlistItem
→ id (PK)
→ wishlist_id (FK → Wishlist)
→ product_id (FK → Product)
→ added_at (datetime)

(Alternatively, a simple many-to-many table between User and Product. But explicit model gives flexibility.)

- Cart
→ id (PK)
→ user_id (FK → User, role=customer, one active cart at a time)
→ created_at (datetime)
→ updated_at (datetime)

- CartItem
→ id (PK)
→ cart_id (FK → Cart)
→ product_id (FK → Product)
→ quantity (integer)

4. # Orders

- Order
→ id (PK)
→ user_id (FK → User, role=customer)
→ status (enum: pending, paid, failed, shipped, completed, cancelled)
→ total_amount (decimal, 10,2)
→ payment_intent_id (string, from Stripe)
→ payment_status (enum: requires_payment, succeeded, failed)
→ created_at (datetime)
→ updated_at (datetime)

- OrderItem
→ id (PK)
→ order_id (FK → Order)
→ product_id (FK → Product)
→ vendor_id (FK → VendorProfile) ← helps vendors query their sales quickly
→ quantity (integer)
→ price_at_purchase (decimal, 10,2)

5. # Analytics (implicit)

→ Vendor revenue: SUM of OrderItem.price_at_purchase * quantity grouped by vendor.
→ Top products: Count of OrderItem.product_id.
→ Admin sales: Aggregated from Order.total_amount.

No separate analytics tables needed (compute via queries).

Relationships (Summary)
→ User ↔ VendorProfile: one-to-one.
→ VendorProfile ↔ Product: one-to-many.
→ Customer (User) ↔ Wishlist/Cart/Order: one-to-many.
→ Cart ↔ CartItem ↔ Product: many-to-many via CartItem.
→ Wishlist ↔ WishlistItem ↔ Product: many-to-many via WishlistItem.
→ Order ↔ OrderItem ↔ Product ↔ Vendor: many-to-many via OrderItem.