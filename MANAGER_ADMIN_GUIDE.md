# Manager and Admin Management Guide

This guide explains the manager and admin login pages and logic that have been implemented in the Commerce Pro application.

## Overview

The system now supports four user roles:
- **Customer**: Can register and shop
- **Vendor**: Can register and manage products (requires admin approval)
- **Manager**: Can only be created by admins, manages operations
- **Admin**: Can manage vendors and managers, system administration

## Key Features Implemented

### 1. Manager Login and Dashboard
- **Login Page**: `/login/manager` - Dedicated manager login with role validation
- **Dashboard**: `/manager/dashboard` - Manager-specific dashboard with:
  - Assigned vendors overview
  - Department information
  - Quick actions for vendor management
  - Activity tracking

### 2. Admin Login and Enhanced Dashboard
- **Login Page**: `/login/admin` - Admin login with role validation
- **Enhanced Dashboard**: `/admin/dashboard` - Now includes:
  - **Vendor Management Tab**: Approve/reject vendors
  - **Manager Management Tab**: Create, view, and delete managers
  - Statistics overview for both vendors and managers

### 3. Manager Registration (Admin Only)
- **Form Component**: `ManagerRegistrationForm.jsx` - Modal form for creating managers
- **API Endpoints**: 
  - `POST /admin/managers/create/` - Create new manager
  - `GET /admin/managers/` - List all managers
  - `PATCH /admin/managers/{id}/update/` - Update manager
  - `DELETE /admin/managers/{id}/delete/` - Delete manager

### 4. Role-Based Access Control
- **Managers cannot register**: Only admins can create manager accounts
- **Admin-only manager creation**: Manager registration is restricted to admin users
- **Role validation**: Login pages validate user roles before allowing access
- **Automatic email notifications**: Welcome emails sent to new managers

## User Workflows

### Manager Creation Workflow
1. Admin logs in to admin dashboard
2. Navigates to "Managers" tab
3. Clicks "Add Manager" button
4. Fills out manager registration form with:
   - Personal information (name, email, username)
   - Department (Sales, Support, Operations)
   - Phone number
   - Permission level (Basic, Senior Manager)
5. System creates manager account and sends welcome email
6. Manager receives credentials and can log in

### Manager Login Workflow
1. Manager visits `/login/manager`
2. Enters credentials provided by admin
3. System validates role and redirects to manager dashboard
4. Manager can view assigned vendors and manage operations

### Admin Management Workflow
1. Admin logs in to admin dashboard
2. Can switch between "Vendors" and "Managers" tabs
3. **Vendor Management**: Approve/reject vendor applications
4. **Manager Management**: Create, view, and delete managers
5. View statistics and system overview

## API Endpoints

### Manager Management (Admin Only)
```
GET    /admin/managers/              # List all managers
POST   /admin/managers/create/       # Create new manager
PATCH  /admin/managers/{id}/update/  # Update manager
DELETE /admin/managers/{id}/delete/  # Delete manager
```

### Authentication
```
POST   /auth/login/                  # Login (all roles)
POST   /auth/register/               # Register (customers/vendors only)
```

## Database Models

### ManagerProfile
- `user`: OneToOne relationship with User
- `department`: Sales, Support, Operations
- `phone_number`: Contact information
- `permissions_level`: Basic, Senior Manager
- `assigned_vendors`: ManyToMany with VendorProfile

### AdminProfile
- `user`: OneToOne relationship with User
- `access_level`: Admin, Super Admin
- `notes`: Additional admin notes

## Security Features

1. **Role-based permissions**: Each endpoint checks user role
2. **Admin-only manager creation**: Prevents unauthorized manager registration
3. **Password validation**: Strong password requirements
4. **Email verification**: New accounts require email verification
5. **JWT tokens**: Secure authentication with refresh tokens

## Frontend Components

### Login Components
- `CustomerLogin.jsx` - Customer login form
- `VendorLogin.jsx` - Vendor login form
- `ManagerLogin.jsx` - Manager login form
- `AdminLogin.jsx` - Admin login form

### Management Components
- `ManagerRegistrationForm.jsx` - Admin form for creating managers
- Admin dashboard with tabbed interface
- Manager dashboard with overview and actions

## Testing

A test script `test_manager_workflow.py` is provided to verify the complete manager workflow:

```bash
python test_manager_workflow.py
```

This script tests:
1. Admin login
2. Manager creation
3. Manager listing
4. Manager login
5. Manager profile access

## Usage Instructions

### For Admins
1. Log in at `/login/admin`
2. Navigate to admin dashboard
3. Use "Managers" tab to create and manage managers
4. Provide manager credentials to team members

### For Managers
1. Receive credentials from admin
2. Log in at `/login/manager`
3. Access manager dashboard for operations management
4. View assigned vendors and system statistics

### For Customers/Vendors
1. Use existing registration and login flows
2. Note that manager/admin roles are not available for self-registration

## Future Enhancements

Potential improvements for the manager/admin system:
1. Manager assignment to specific vendors
2. Manager performance tracking
3. Advanced permission levels
4. Manager activity logs
5. Bulk manager operations
6. Manager profile management

## Troubleshooting

### Common Issues
1. **Manager cannot login**: Verify credentials and account activation
2. **Admin cannot create managers**: Check admin permissions and authentication
3. **Email not received**: Check email configuration and spam folder
4. **Role validation errors**: Ensure user has correct role assigned

### Debug Steps
1. Check browser console for JavaScript errors
2. Verify API endpoints are accessible
3. Check Django logs for backend errors
4. Validate user roles in database
5. Test with provided test script

This implementation provides a complete manager and admin management system with proper role-based access control and user-friendly interfaces.
