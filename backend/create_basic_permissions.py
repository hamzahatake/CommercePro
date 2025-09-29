#!/usr/bin/env python
"""
Simple script to create basic permissions for testing
Run this script to create some basic permissions for testing the system
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append('/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Permission

def create_role_specific_permissions():
    """Create comprehensive permissions for vendors, managers, and admins"""
    
    # Vendor-specific permissions
    vendor_permissions = [
        # Shop Management
        {
            'name': 'Manage Shop Profile',
            'codename': 'manage_shop_profile',
            'description': 'Allows vendors to update their shop information, logo, and business details'
        },
        {
            'name': 'View Shop Analytics',
            'codename': 'view_shop_analytics',
            'description': 'Allows vendors to view their shop performance metrics and sales data'
        },
        {
            'name': 'Manage Shop Settings',
            'codename': 'manage_shop_settings',
            'description': 'Allows vendors to configure shop-specific settings and preferences'
        },
        
        # Product Management
        {
            'name': 'Add Products',
            'codename': 'add_products',
            'description': 'Allows vendors to add new products to their shop'
        },
        {
            'name': 'Edit Own Products',
            'codename': 'edit_own_products',
            'description': 'Allows vendors to edit products they have created'
        },
        {
            'name': 'Delete Own Products',
            'codename': 'delete_own_products',
            'description': 'Allows vendors to delete products they have created'
        },
        {
            'name': 'Manage Product Inventory',
            'codename': 'manage_product_inventory',
            'description': 'Allows vendors to update stock levels and inventory status'
        },
        {
            'name': 'Set Product Prices',
            'codename': 'set_product_prices',
            'description': 'Allows vendors to set and modify product pricing'
        },
        {
            'name': 'Manage Product Categories',
            'codename': 'manage_product_categories',
            'description': 'Allows vendors to assign and manage product categories'
        },
        {
            'name': 'Upload Product Images',
            'codename': 'upload_product_images',
            'description': 'Allows vendors to upload and manage product images'
        },
        
        # Order Management
        {
            'name': 'View Own Orders',
            'codename': 'view_own_orders',
            'description': 'Allows vendors to view orders for their products'
        },
        {
            'name': 'Update Order Status',
            'codename': 'update_order_status',
            'description': 'Allows vendors to update the status of their orders'
        },
        {
            'name': 'Process Orders',
            'codename': 'process_orders',
            'description': 'Allows vendors to process and fulfill customer orders'
        },
        {
            'name': 'Generate Order Reports',
            'codename': 'generate_order_reports',
            'description': 'Allows vendors to generate reports for their orders'
        },
        
        # Customer Communication
        {
            'name': 'Respond to Reviews',
            'codename': 'respond_to_reviews',
            'description': 'Allows vendors to respond to customer reviews and feedback'
        },
        {
            'name': 'Manage Customer Messages',
            'codename': 'manage_customer_messages',
            'description': 'Allows vendors to communicate with customers via messages'
        },
        
        # Financial Management
        {
            'name': 'View Earnings',
            'codename': 'view_earnings',
            'description': 'Allows vendors to view their earnings and payment history'
        },
        {
            'name': 'Request Payouts',
            'codename': 'request_payouts',
            'description': 'Allows vendors to request payouts for their earnings'
        },
        {
            'name': 'View Financial Reports',
            'codename': 'view_financial_reports',
            'description': 'Allows vendors to view detailed financial reports'
        }
    ]
    
    # Manager-specific permissions
    manager_permissions = [
        # Vendor Management
        {
            'name': 'Approve Vendors',
            'codename': 'approve_vendors',
            'description': 'Allows managers to approve new vendor applications'
        },
        {
            'name': 'Reject Vendors',
            'codename': 'reject_vendors',
            'description': 'Allows managers to reject vendor applications'
        },
        {
            'name': 'Suspend Vendors',
            'codename': 'suspend_vendors',
            'description': 'Allows managers to suspend vendor accounts'
        },
        {
            'name': 'Reactivate Vendors',
            'codename': 'reactivate_vendors',
            'description': 'Allows managers to reactivate suspended vendor accounts'
        },
        {
            'name': 'View Vendor Details',
            'codename': 'view_vendor_details',
            'description': 'Allows managers to view detailed vendor information'
        },
        {
            'name': 'Manage Vendor Verification',
            'codename': 'manage_vendor_verification',
            'description': 'Allows managers to verify vendor documents and credentials'
        },
        
        # Product Oversight
        {
            'name': 'Review Products',
            'codename': 'review_products',
            'description': 'Allows managers to review products before they go live'
        },
        {
            'name': 'Approve Products',
            'codename': 'approve_products',
            'description': 'Allows managers to approve products for publication'
        },
        {
            'name': 'Reject Products',
            'codename': 'reject_products',
            'description': 'Allows managers to reject products that violate guidelines'
        },
        {
            'name': 'Flag Inappropriate Content',
            'codename': 'flag_inappropriate_content',
            'description': 'Allows managers to flag inappropriate product content'
        },
        {
            'name': 'Manage Product Categories',
            'codename': 'manage_product_categories_admin',
            'description': 'Allows managers to create and manage global product categories'
        },
        
        # Order Management
        {
            'name': 'View All Orders',
            'codename': 'view_all_orders',
            'description': 'Allows managers to view all orders across the platform'
        },
        {
            'name': 'Manage Order Disputes',
            'codename': 'manage_order_disputes',
            'description': 'Allows managers to handle customer order disputes'
        },
        {
            'name': 'Process Refunds',
            'codename': 'process_refunds',
            'description': 'Allows managers to process customer refunds'
        },
        {
            'name': 'Handle Returns',
            'codename': 'handle_returns',
            'description': 'Allows managers to manage product returns'
        },
        
        # Analytics & Reporting
        {
            'name': 'View Platform Analytics',
            'codename': 'view_platform_analytics',
            'description': 'Allows managers to view platform-wide analytics and metrics'
        },
        {
            'name': 'Generate Vendor Reports',
            'codename': 'generate_vendor_reports',
            'description': 'Allows managers to generate reports on vendor performance'
        },
        {
            'name': 'View Sales Reports',
            'codename': 'view_sales_reports',
            'description': 'Allows managers to view comprehensive sales reports'
        },
        {
            'name': 'Export Data',
            'codename': 'export_data',
            'description': 'Allows managers to export platform data for analysis'
        },
        
        # Customer Support
        {
            'name': 'Handle Customer Complaints',
            'codename': 'handle_customer_complaints',
            'description': 'Allows managers to handle customer complaints and issues'
        },
        {
            'name': 'Manage Customer Accounts',
            'codename': 'manage_customer_accounts',
            'description': 'Allows managers to manage customer account issues'
        },
        {
            'name': 'View Customer Feedback',
            'codename': 'view_customer_feedback',
            'description': 'Allows managers to view and analyze customer feedback'
        }
    ]
    
    # Admin-specific permissions
    admin_permissions = [
        # User Management
        {
            'name': 'Create Users',
            'codename': 'create_users',
            'description': 'Allows admins to create new user accounts'
        },
        {
            'name': 'Edit User Accounts',
            'codename': 'edit_user_accounts',
            'description': 'Allows admins to edit any user account information'
        },
        {
            'name': 'Delete User Accounts',
            'codename': 'delete_user_accounts',
            'description': 'Allows admins to delete user accounts'
        },
        {
            'name': 'Suspend User Accounts',
            'codename': 'suspend_user_accounts',
            'description': 'Allows admins to suspend any user account'
        },
        {
            'name': 'Reset User Passwords',
            'codename': 'reset_user_passwords',
            'description': 'Allows admins to reset user passwords'
        },
        {
            'name': 'Manage User Roles',
            'codename': 'manage_user_roles',
            'description': 'Allows admins to assign and change user roles'
        },
        
        # Permission Management
        {
            'name': 'Create Permissions',
            'codename': 'create_permissions',
            'description': 'Allows admins to create new system permissions'
        },
        {
            'name': 'Edit Permissions',
            'codename': 'edit_permissions',
            'description': 'Allows admins to edit existing permissions'
        },
        {
            'name': 'Delete Permissions',
            'codename': 'delete_permissions',
            'description': 'Allows admins to delete permissions'
        },
        {
            'name': 'Assign Role Permissions',
            'codename': 'assign_role_permissions',
            'description': 'Allows admins to assign permissions to roles'
        },
        {
            'name': 'View Permission Logs',
            'codename': 'view_permission_logs',
            'description': 'Allows admins to view permission change logs'
        },
        
        # System Management
        {
            'name': 'System Configuration',
            'codename': 'system_configuration',
            'description': 'Allows admins to modify system-wide configuration settings'
        },
        {
            'name': 'Manage System Settings',
            'codename': 'manage_system_settings',
            'description': 'Allows admins to manage global system settings'
        },
        {
            'name': 'View System Logs',
            'codename': 'view_system_logs',
            'description': 'Allows admins to view system logs and audit trails'
        },
        {
            'name': 'Manage Database',
            'codename': 'manage_database',
            'description': 'Allows admins to perform database maintenance operations'
        },
        {
            'name': 'System Backup',
            'codename': 'system_backup',
            'description': 'Allows admins to create and manage system backups'
        },
        {
            'name': 'System Restore',
            'codename': 'system_restore',
            'description': 'Allows admins to restore system from backups'
        },
        
        # Platform Management
        {
            'name': 'Manage All Vendors',
            'codename': 'manage_all_vendors',
            'description': 'Allows admins to manage all vendor accounts and settings'
        },
        {
            'name': 'Manage All Products',
            'codename': 'manage_all_products',
            'description': 'Allows admins to manage all products across the platform'
        },
        {
            'name': 'Manage All Orders',
            'codename': 'manage_all_orders',
            'description': 'Allows admins to manage all orders and transactions'
        },
        {
            'name': 'Platform Analytics',
            'codename': 'platform_analytics',
            'description': 'Allows admins to view comprehensive platform analytics'
        },
        {
            'name': 'Financial Oversight',
            'codename': 'financial_oversight',
            'description': 'Allows admins to oversee all financial transactions and reports'
        },
        
        # Security & Compliance
        {
            'name': 'Security Management',
            'codename': 'security_management',
            'description': 'Allows admins to manage security settings and policies'
        },
        {
            'name': 'Compliance Monitoring',
            'codename': 'compliance_monitoring',
            'description': 'Allows admins to monitor compliance with regulations'
        },
        {
            'name': 'Audit Trail Access',
            'codename': 'audit_trail_access',
            'description': 'Allows admins to access complete audit trails'
        },
        {
            'name': 'Data Privacy Management',
            'codename': 'data_privacy_management',
            'description': 'Allows admins to manage data privacy and GDPR compliance'
        },
        
        # Advanced Features
        {
            'name': 'API Management',
            'codename': 'api_management',
            'description': 'Allows admins to manage API keys and integrations'
        },
        {
            'name': 'Third-party Integrations',
            'codename': 'third_party_integrations',
            'description': 'Allows admins to manage third-party service integrations'
        },
        {
            'name': 'System Maintenance',
            'codename': 'system_maintenance',
            'description': 'Allows admins to perform system maintenance tasks'
        },
        {
            'name': 'Emergency Access',
            'codename': 'emergency_access',
            'description': 'Allows admins emergency access to override normal restrictions'
        }
    ]
    
    # Combine all permissions
    all_permissions = vendor_permissions + manager_permissions + admin_permissions
    
    print("Creating role-specific permissions...")
    created_count = 0
    
    for perm_data in all_permissions:
        try:
            permission, created = Permission.objects.get_or_create(
                codename=perm_data['codename'],
                defaults={
                    'name': perm_data['name'],
                    'description': perm_data['description']
                }
            )
            if created:
                print(f"✓ Created permission: {permission.name}")
                created_count += 1
            else:
                print(f"- Permission already exists: {permission.name}")
        except Exception as e:
            print(f"⚠ Error creating permission '{perm_data['name']}': {e}")
            # Try to find existing permission by codename
            try:
                existing = Permission.objects.get(codename=perm_data['codename'])
                print(f"- Found existing permission: {existing.name}")
            except Permission.DoesNotExist:
                print(f"✗ Permission not found: {perm_data['codename']}")
    
    print(f"\nCompleted! Created {created_count} new permissions.")
    print(f"Total permissions in database: {Permission.objects.count()}")
    
    # Print summary by role
    print(f"\nPermission Summary:")
    print(f"Vendor permissions: {len(vendor_permissions)}")
    print(f"Manager permissions: {len(manager_permissions)}")
    print(f"Admin permissions: {len(admin_permissions)}")
    print(f"Total permissions: {len(all_permissions)}")
    
    return created_count

if __name__ == '__main__':
    try:
        create_role_specific_permissions()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
