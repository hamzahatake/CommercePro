#!/usr/bin/env python
"""
Test script to verify role-specific email templates
Run this with: python test_role_emails.py
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from users.models import User
from users.emails import send_welcome_email

def test_role_emails():
    """Test role-specific email templates"""
    
    # Test data for different roles
    test_users = [
        {
            'email': 'customer@test.com',
            'username': 'test_customer',
            'first_name': 'John',
            'last_name': 'Doe',
            'role': 'customer'
        },
        {
            'email': 'vendor@test.com',
            'username': 'test_vendor',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'role': 'vendor'
        },
        {
            'email': 'manager@test.com',
            'username': 'test_manager',
            'first_name': 'Bob',
            'last_name': 'Johnson',
            'role': 'manager'
        },
        {
            'email': 'admin@test.com',
            'username': 'test_admin',
            'first_name': 'Alice',
            'last_name': 'Wilson',
            'role': 'admin'
        }
    ]
    
    print("🧪 Testing Role-Specific Email Templates")
    print("=" * 50)
    
    for user_data in test_users:
        try:
            # Create user (don't save to database)
            user = User(
                email=user_data['email'],
                username=user_data['username'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                role=user_data['role']
            )
            
            print(f"\n✅ Testing {user_data['role'].upper()} email template...")
            print(f"   User: {user.first_name} {user.last_name} ({user.email})")
            
            # This will use console email backend, so emails will print to console
            send_welcome_email(user)
            
            print(f"   ✅ {user_data['role'].upper()} email sent successfully!")
            
        except Exception as e:
            print(f"   ❌ Error sending {user_data['role']} email: {str(e)}")
    
    print("\n" + "=" * 50)
    print("🎉 Role-specific email test completed!")
    print("\nNote: Emails are sent to console backend for testing.")
    print("Check the console output above to see the different email templates.")

if __name__ == "__main__":
    test_role_emails()

