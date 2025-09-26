# Frontend Documentation - Commerce Pro

This document provides a brief overview of each JavaScript and JSX file in the frontend directory, explaining their purpose and functionality.

## App Directory (Next.js Pages)

### Core Layout & Pages
- **`app/layout.js`** - Root layout component that wraps the entire application with Redux store, authentication provider, and cart animation context. Sets up the main HTML structure and global providers.

- **`app/page.js`** - Home page component that renders the main landing page content using the HomePageContent component.

### Authentication Pages
- **`app/login/page.js`** - Main login page that handles user authentication for all user types.

- **`app/login/customer/page.js`** - Customer-specific login page with customer authentication logic and UI.

- **`app/login/vendor/page.js`** - Vendor-specific login page for vendor authentication and access to vendor dashboard.

- **`app/login/manager/page.js`** - Manager-specific login page for manager authentication and role validation.

- **`app/login/admin/page.js`** - Admin-specific login page for admin authentication and system access.

- **`app/login/staff/page.js`** - Staff login page for internal staff members (managers/admins).

- **`app/registration/page.js`** - User registration page for new customer and vendor account creation.

### Admin Pages
- **`app/admin/layout.js`** - Admin-specific layout wrapper with admin navigation and sidebar components.

- **`app/admin/dashboard/page.js`** - Main admin dashboard displaying system overview, vendor management, and manager management tabs.

- **`app/admin/vendors/page.js`** - Admin page for managing vendor approvals, rejections, and vendor list overview.

- **`app/admin/vendors/[id]/page.js`** - Individual vendor detail page for admins to view and manage specific vendor information.

- **`app/admin/managers/page.js`** - Admin page for managing managers, displaying manager list and management options.

- **`app/admin/managers/create/page.js`** - Page for creating new manager accounts (admin-only functionality).

- **`app/admin/users/page.js`** - Admin page for user management, displaying all users with filtering and management options.

- **`app/admin/users/create/page.js`** - Page for creating new user accounts through admin interface.

- **`app/admin/users/[id]/page.js`** - Individual user detail page for admins to view and manage specific user information.

- **`app/admin/users/[id]/edit/page.js`** - User edit page for admins to modify user details and settings.

- **`app/admin/settings/page.js`** - Admin settings page for system configuration and admin-specific preferences.

- **`app/admin/permissions/page.js`** - Admin page for managing user permissions and role-based access control.

- **`app/admin/roles/page.js`** - Admin page for managing user roles and role assignments.

### Manager Pages
- **`app/manager/dashboard/page.js`** - Manager dashboard displaying assigned vendors, department information, and management tools.

- **`app/manager/settings/page.js`** - Manager settings page for profile management and preferences.

### Vendor Pages
- **`app/vendor/dashboard/page.js`** - Vendor dashboard for product management, sales overview, and vendor-specific tools.

- **`app/vendor/profile/page.js`** - Vendor profile page for managing shop information and vendor details.

- **`app/vendor/settings/page.js`** - Vendor settings page for account configuration and preferences.

### Customer Pages
- **`app/profile/page.js`** - Customer profile page for managing personal information and account details.

- **`app/settings/page.js`** - Customer settings page for account preferences and configuration.

### E-commerce Pages
- **`app/products/page.js`** - Products listing page displaying all available products with filtering and search.

- **`app/products/[id]/page.js`** - Individual product detail page (PDP) showing product information, images, and purchase options.

- **`app/cart/page.js`** - Shopping cart page displaying cart items, quantities, and checkout options.

- **`app/checkout/page.js`** - Checkout page for processing orders and payment information.

- **`app/pdf-refrence/page.js`** - PDF reference page for documentation or product catalogs.

## Components Directory

### Authentication Components
- **`components/auth/AuthProvider.jsx`** - Authentication context provider managing user state, login/logout, and role-based access throughout the application.

- **`components/auth/LoginPageComponent.jsx`** - Reusable login component with form handling, validation, and authentication logic.

- **`components/auth/CustomerLogin.jsx`** - Customer-specific login component with customer-focused UI and validation.

- **`components/auth/VendorLogin.jsx`** - Vendor-specific login component with vendor authentication and shop-specific features.

- **`components/auth/ManagerAdminLogin.jsx`** - Login component for managers and admins with role validation and dashboard redirection.

- **`components/auth/Registration.jsx`** - User registration component handling customer and vendor account creation with form validation.

- **`components/auth/ManagerRegistrationForm.jsx`** - Manager registration form component (admin-only) for creating new manager accounts.

- **`components/auth/ProtectedRoute.jsx`** - Route protection component ensuring only authenticated users with proper roles can access specific pages.

- **`components/auth/AccessDeniedError.jsx`** - Error component displayed when users lack proper permissions to access certain features.

### Admin Components
- **`components/admin/AdminDashboard.jsx`** - Main admin dashboard component with vendor management, manager management, and system overview tabs.

- **`components/admin/AdminLayout.jsx`** - Admin-specific layout wrapper with navigation, sidebar, and admin-specific styling.

- **`components/admin/CreateManagerForm.jsx`** - Form component for creating new manager accounts with validation and submission handling.

- **`components/admin/ManagersManagement.jsx`** - Manager management component displaying manager list, actions, and management options.

- **`components/admin/VendorsManagement.jsx`** - Vendor management component for approving, rejecting, and managing vendor accounts.

- **`components/admin/VendorDetail.jsx`** - Individual vendor detail component showing vendor information and management actions.

- **`components/admin/UsersManagement.jsx`** - User management component for viewing, editing, and managing all user accounts.

- **`components/admin/UserCreateForm.jsx`** - Form component for creating new user accounts through admin interface.

- **`components/admin/UserEditForm.jsx`** - Form component for editing existing user accounts and updating user information.

- **`components/admin/UserDetail.jsx`** - Individual user detail component displaying user information and management options.

- **`components/admin/RolesPermissions.jsx`** - Component for managing user roles and permissions within the admin interface.

### Manager Components
- **`components/manager/ManagerDashboard.jsx`** - Manager dashboard component displaying assigned vendors, department info, and management tools.

- **`components/manager/ManagerSettings.jsx`** - Manager settings component for profile management and account configuration.

### Vendor Components
- **`components/vendor/VendorDashboard.jsx`** - Vendor dashboard component for product management, sales tracking, and vendor tools.

- **`components/vendor/VendorSettings.jsx`** - Vendor settings component for managing shop information and account preferences.

### Customer Components
- **`components/profile/CustomerProfile.jsx`** - Customer profile component for managing personal information and account details.

- **`components/settings/CustomerSettings.jsx`** - Customer settings component for account preferences and configuration.

### Product Components
- **`components/products/ProductsListContent.jsx`** - Product listing component displaying products with filtering, sorting, and pagination.

- **`components/products/ProductCard.jsx`** - Individual product card component showing product image, title, price, and quick actions.

- **`components/products/ProductImage.jsx`** - Product image component handling image display, loading states, and image optimization.

### Product Detail Page (PDP) Components
- **`components/pdp/TopHeading.jsx`** - Product detail page header component with product title and breadcrumbs.

- **`components/pdp/GalleryColumn.jsx`** - Product image gallery component with main image and thumbnail navigation.

- **`components/pdp/InfoColumn.jsx`** - Product information column with details, pricing, and purchase options.

- **`components/pdp/ImageCarousel.jsx`** - Image carousel component for product photo navigation and zoom functionality.

- **`components/pdp/DetailsTabs.jsx`** - Tabbed component displaying product details, specifications, and reviews.

- **`components/pdp/RelatedProducts.jsx`** - Related products component suggesting similar or complementary products.

- **`components/pdp/FooterCTAs.jsx`** - Footer call-to-action component with additional product actions and links.

- **`components/pdp/Breadcrumbs.jsx`** - Breadcrumb navigation component for product category and navigation context.

### Catalog Components
- **`components/catalog/CatalogGrid.jsx`** - Catalog grid layout component for displaying products in organized grid format.

- **`components/catalog/CatalogCard.jsx`** - Individual catalog card component for product display in catalog view.

- **`components/catalog/CatalogImage.jsx`** - Catalog image component handling product image display and optimization.

### Cart Components
- **`components/cart/CartPageContent.jsx`** - Cart page content component displaying cart items, quantities, totals, and checkout options.

### Checkout Components
- **`components/checkout/CheckoutForm.jsx`** - Checkout form component handling order processing, payment information, and order submission.

### Home Page Components
- **`components/home/HomePageContent.jsx`** - Main home page content component with hero sections, featured products, and promotional content.

### UI Components
- **`components/Navbar.jsx`** - Main navigation component with search, user profile, cart, and role-based navigation options.

- **`components/HeroCarousel.jsx`** - Hero carousel component for homepage banner slides and promotional content.

- **`components/SneakersHero.jsx`** - Sneaker-specific hero component for featured sneaker promotions and campaigns.

- **`components/VideoHero.jsx`** - Video hero component for homepage video backgrounds and multimedia content.

- **`components/FilterPanel.jsx`** - Product filtering panel component with category, price, color, and size filters.

- **`components/GridLayout.jsx`** - Grid layout component for organizing content in responsive grid format.

- **`components/Pagination.jsx`** - Pagination component for navigating through multiple pages of content.

- **`components/ColorSelector.jsx`** - Color selection component for product color variants and customization.

### Shoe Components
- **`components/shoes/ShoeCard.jsx`** - Shoe-specific product card component with shoe-specific features and styling.

- **`components/shoes/ShoeCarousel.jsx`** - Shoe carousel component for displaying shoe collections and featured products.

- **`components/ShoeLoader.jsx`** - Loading component specifically designed for shoe product loading states.

- **`components/ShoeNotAvailable.jsx`** - Component displayed when shoe products are out of stock or unavailable.

### Reference Components
- **`components/pdpRef/TwoColumnPDP.jsx`** - Two-column product detail page layout component for reference implementation.

- **`components/pdpRef/Tokens.js`** - Design tokens and constants file for consistent styling and theming.

### Context Components
- **`contexts/CartAnimationContext.jsx`** - Cart animation context provider managing cart animations and visual feedback.

## Features Directory

### API Features
- **`features/api/apiSlice.js`** - Main API slice using RTK Query for all backend API calls including authentication, products, cart, orders, and admin functions.

- **`features/api/baseQuerry.js`** - Base query configuration with authentication headers, error handling, and token refresh logic.

### Authentication Features
- **`features/auth/authSlice.js`** - Redux slice managing authentication state, login/logout actions, and user session management.

### Cart Features
- **`features/cart/cart.js`** - Cart-related API functions and utilities for cart management operations.

### Product Features
- **`features/products/productNormalization.js`** - Product data normalization utilities for consistent product data formatting across the application.

## Store Directory (Redux)

- **`store/index.js`** - Main Redux store configuration combining all slices and middleware.

- **`store/cartSlice.js`** - Redux slice managing cart state, cart items, quantities, and cart operations.

- **`store/shoeSlice.js`** - Redux slice managing shoe-specific state and shoe-related operations.

## Utils Directory

- **`utils/debounce.js`** - Debounce utility function for optimizing search and input handling performance.

- **`utils/queryParams.js`** - Query parameter utility functions for URL parameter handling and formatting.

- **`utils/useQueryParams.js`** - Custom hook for managing and accessing URL query parameters in components.

## Configuration Files

- **`next.config.js`** - Next.js configuration file with custom settings, image optimization, and build configurations.

---

*This documentation provides a comprehensive overview of the frontend codebase structure and functionality. Each file serves a specific purpose in the Commerce Pro e-commerce application, supporting customer shopping, vendor management, admin operations, and manager oversight.*
