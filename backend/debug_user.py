#!/usr/bin/env python
"""
Debug script to check user authentication
Run this from the backend directory: python debug_user.py
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model

User = get_user_model()

def debug_user_login():
    email = "IchigoKurasaki@gmail.com"
    password = "manager12345"
    
    print(f"Debugging login for: {email}")
    print("=" * 50)
    
    # Check if user exists
    try:
        user = User.objects.get(email=email)
        print(f"✅ User found:")
        print(f"   ID: {user.id}")
        print(f"   Email: {user.email}")
        print(f"   Username: {user.username}")
        print(f"   First Name: {user.first_name}")
        print(f"   Last Name: {user.last_name}")
        print(f"   Role: {user.role}")
        print(f"   Is Active: {user.is_active}")
        print(f"   Is Staff: {user.is_staff}")
        print(f"   Is Superuser: {user.is_superuser}")
        print(f"   Date Joined: {user.date_joined}")
        print(f"   Last Login: {user.last_login}")
        
        # Check password
        print(f"\n🔐 Password check:")
        print(f"   Has usable password: {user.has_usable_password()}")
        
        # Try authentication methods
        print(f"\n🔍 Authentication tests:")
        
        # Method 1: Authenticate with email as username
        auth_user1 = authenticate(username=email, password=password)
        print(f"   Method 1 (email as username): {'✅ Success' if auth_user1 else '❌ Failed'}")
        
        # Method 2: Authenticate with actual username
        auth_user2 = authenticate(username=user.username, password=password)
        print(f"   Method 2 (actual username): {'✅ Success' if auth_user2 else '❌ Failed'}")
        
        # Method 3: Check password directly
        password_check = user.check_password(password)
        print(f"   Method 3 (direct password check): {'✅ Success' if password_check else '❌ Failed'}")
        
        # Check if user has manager profile
        try:
            manager_profile = user.manager_profile
            print(f"\n👤 Manager Profile:")
            print(f"   Department: {manager_profile.department}")
            print(f"   Phone Number: {manager_profile.phone_number}")
            print(f"   Permissions Level: {manager_profile.permissions_level}")
        except:
            print(f"\n❌ No manager profile found")
            
    except User.DoesNotExist:
        print(f"❌ User with email {email} not found in database")
        
        # Check for similar emails
        similar_users = User.objects.filter(email__icontains="ichigo")
        if similar_users.exists():
            print(f"\n🔍 Found similar users:")
            for u in similar_users:
                print(f"   - {u.email} (ID: {u.id}, Role: {u.role})")
        else:
            print(f"\n🔍 No similar users found")

if __name__ == "__main__":
    debug_user_login()

