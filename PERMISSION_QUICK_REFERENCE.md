# Quick Permission Assignment Reference

## 🏪 Vendor Role - Essential Permissions

### **Core Shop Management**
- `manage_shop_profile` - Manage Shop Profile
- `view_shop_analytics` - View Shop Analytics
- `manage_shop_settings` - Manage Shop Settings

### **Product Operations**
- `add_products` - Add Products
- `edit_own_products` - Edit Own Products
- `delete_own_products` - Delete Own Products
- `manage_product_inventory` - Manage Product Inventory
- `set_product_prices` - Set Product Prices
- `upload_product_images` - Upload Product Images

### **Order & Financial**
- `view_own_orders` - View Own Orders
- `update_order_status` - Update Order Status
- `process_orders` - Process Orders
- `view_earnings` - View Earnings
- `request_payouts` - Request Payouts

### **Customer Interaction**
- `respond_to_reviews` - Respond to Reviews
- `manage_customer_messages` - Manage Customer Messages

---

## 👨‍💼 Manager Role - Essential Permissions

### **Vendor Oversight**
- `approve_vendors` - Approve Vendors
- `reject_vendors` - Reject Vendors
- `suspend_vendors` - Suspend Vendors
- `view_vendor_details` - View Vendor Details

### **Product Quality Control**
- `review_products` - Review Products
- `approve_products` - Approve Products
- `reject_products` - Reject Products
- `flag_inappropriate_content` - Flag Inappropriate Content

### **Order & Customer Support**
- `view_all_orders` - View All Orders
- `manage_order_disputes` - Manage Order Disputes
- `process_refunds` - Process Refunds
- `handle_customer_complaints` - Handle Customer Complaints

### **Analytics & Reporting**
- `view_platform_analytics` - View Platform Analytics
- `generate_vendor_reports` - Generate Vendor Reports
- `view_sales_reports` - View Sales Reports

---

## 🔧 Admin Role - Essential Permissions

### **User Management**
- `create_users` - Create Users
- `edit_user_accounts` - Edit User Accounts
- `delete_user_accounts` - Delete User Accounts
- `manage_user_roles` - Manage User Roles

### **Permission Control**
- `create_permissions` - Create Permissions
- `edit_permissions` - Edit Permissions
- `assign_role_permissions` - Assign Role Permissions

### **System Administration**
- `system_configuration` - System Configuration
- `manage_system_settings` - Manage System Settings
- `view_system_logs` - View System Logs
- `system_backup` - System Backup

### **Platform Control**
- `manage_all_vendors` - Manage All Vendors
- `manage_all_products` - Manage All Products
- `manage_all_orders` - Manage All Orders
- `platform_analytics` - Platform Analytics

### **Security & Compliance**
- `security_management` - Security Management
- `audit_trail_access` - Audit Trail Access
- `data_privacy_management` - Data Privacy Management
- `emergency_access` - Emergency Access

---

## 🚀 Quick Setup Commands

### **Create All Permissions**
```bash
cd backend
python create_basic_permissions.py
```

### **Assign Vendor Permissions (Example)**
```javascript
// In your permission assignment interface
const vendorPermissions = [
    'manage_shop_profile',
    'add_products',
    'edit_own_products',
    'view_own_orders',
    'view_earnings'
];
```

### **Assign Manager Permissions (Example)**
```javascript
const managerPermissions = [
    'approve_vendors',
    'review_products',
    'view_all_orders',
    'handle_customer_complaints',
    'view_platform_analytics'
];
```

### **Assign Admin Permissions (Example)**
```javascript
const adminPermissions = [
    'create_users',
    'system_configuration',
    'manage_all_vendors',
    'security_management',
    'emergency_access'
];
```

---

## 📊 Permission Statistics

| Role | Total Permissions | Core Permissions | Advanced Permissions |
|------|------------------|------------------|---------------------|
| **Vendor** | 19 | 12 | 7 |
| **Manager** | 25 | 15 | 10 |
| **Admin** | 30 | 18 | 12 |
| **Total** | **74** | **45** | **29** |

---

## 🔍 Permission Categories

### **Core Permissions** (Essential for role function)
- Basic operations required for daily tasks
- Should be assigned to all users of that role

### **Advanced Permissions** (Specialized functions)
- Optional permissions for specific needs
- Assign only to users who need them

### **Sensitive Permissions** (High-risk operations)
- Financial, security, and system management
- Assign only to trusted, experienced users

---

## ⚡ Quick Tips

1. **Start Small**: Begin with core permissions, add more as needed
2. **Test Thoroughly**: Verify permissions work as expected
3. **Document Changes**: Keep track of permission modifications
4. **Regular Audits**: Review permissions periodically
5. **User Training**: Ensure users understand their permissions

This reference makes it easy to quickly assign the right permissions to each role!
