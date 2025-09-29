#!/usr/bin/env python
"""
Script to create sample permissions for testing the dynamic permission system
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append('/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import Permission, RolePermission, User

def create_sample_permissions():
    """Create sample permissions for testing"""
    
    sample_permissions = [
        {
            'name': 'View Products',
            'codename': 'view_products',
            'description': 'Allows users to view product listings and details'
        },
        {
            'name': 'Add Products',
            'codename': 'add_products',
            'description': 'Allows users to add new products to the system'
        },
        {
            'name': 'Edit Products',
            'codename': 'edit_products',
            'description': 'Allows users to edit existing products'
        },
        {
            'name': 'Delete Products',
            'codename': 'delete_products',
            'description': 'Allows users to delete products'
        },
        {
            'name': 'Manage Vendors',
            'codename': 'manage_vendors',
            'description': 'Allows users to approve, reject, and manage vendor accounts'
        },
        {
            'name': 'View Orders',
            'codename': 'view_orders',
            'description': 'Allows users to view order information'
        },
        {
            'name': 'Manage Orders',
            'codename': 'manage_orders',
            'description': 'Allows users to update order status and details'
        },
        {
            'name': 'View Analytics',
            'codename': 'view_analytics',
            'description': 'Allows users to access system analytics and reports'
        },
        {
            'name': 'Manage Users',
            'codename': 'manage_users',
            'description': 'Allows users to create, edit, and manage user accounts'
        },
        {
            'name': 'System Configuration',
            'codename': 'system_config',
            'description': 'Allows users to modify system settings and configuration'
        }
    ]
    
    print("Creating sample permissions...")
    created_permissions = []
    
    for perm_data in sample_permissions:
        permission, created = Permission.objects.get_or_create(
            codename=perm_data['codename'],
            defaults={
                'name': perm_data['name'],
                'description': perm_data['description']
            }
        )
        if created:
            print(f"✓ Created permission: {permission.name}")
        else:
            print(f"- Permission already exists: {permission.name}")
        created_permissions.append(permission)
    
    return created_permissions

def assign_role_permissions():
    """Assign permissions to different roles - NO DEFAULT ASSIGNMENTS"""
    
    print("\nNo default permissions will be assigned to roles.")
    print("All permissions must be manually assigned by administrators.")
    print("This ensures complete control over role permissions.")
    
    # Clear any existing role permissions to ensure clean slate
    existing_assignments = RolePermission.objects.count()
    if existing_assignments > 0:
        print(f"\nClearing {existing_assignments} existing role permission assignments...")
        RolePermission.objects.all().delete()
        print("✓ All existing role permission assignments cleared.")
    
    print("\nRoles will start with NO permissions assigned.")
    print("Administrators must manually assign permissions through the admin interface.")

def test_user_permissions():
    """Test user permission checking"""
    
    print("\nTesting user permission checking...")
    
    # Get a sample user from each role
    for role in ['vendor', 'manager', 'admin']:
        try:
            user = User.objects.filter(role=role).first()
            if user:
                print(f"\n{role.title()} user ({user.email}):")
                permissions = user.get_permissions()
                print(f"  Has {permissions.count()} permissions:")
                for perm in permissions:
                    print(f"    - {perm.name} ({perm.codename})")
            else:
                print(f"\nNo {role} users found")
        except Exception as e:
            print(f"Error testing {role} permissions: {e}")

if __name__ == '__main__':
    try:
        # Create sample permissions
        permissions = create_sample_permissions()
        
        # Assign permissions to roles
        assign_role_permissions()
        
        # Test user permissions
        test_user_permissions()
        
        print("\n" + "="*50)
        print("Sample permission system setup completed!")
        print("="*50)
        print(f"Total permissions created: {Permission.objects.count()}")
        print(f"Total role-permission assignments: {RolePermission.objects.count()}")
        print("\nIMPORTANT: No default permissions have been assigned to roles.")
        print("Administrators must manually assign permissions through the admin interface.")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

