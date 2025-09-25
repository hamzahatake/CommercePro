#!/usr/bin/env python3
"""
Test script to verify manager creation and login workflow
This script tests the complete manager management functionality
"""

import requests
import json
import sys

# Configuration
BASE_URL = "http://localhost:8000"  # Adjust if your backend runs on different port
ADMIN_EMAIL = "admin@example.com"  # You'll need to create an admin user first
ADMIN_PASSWORD = "admin123"  # Change this to your admin password

def test_manager_workflow():
    """Test the complete manager creation and login workflow"""
    
    print("🧪 Testing Manager Workflow")
    print("=" * 50)
    
    # Step 1: Admin login
    print("\n1. Testing admin login...")
    login_data = {
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
        if response.status_code == 200:
            admin_tokens = response.json()
            print("✅ Admin login successful")
            admin_headers = {
                "Authorization": f"Bearer {admin_tokens['tokens']['access']}"
            }
        else:
            print(f"❌ Admin login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Admin login request failed: {e}")
        return False
    
    # Step 2: Create a manager
    print("\n2. Testing manager creation...")
    manager_data = {
        "username": "test_manager",
        "email": "manager@example.com",
        "password": "manager123",
        "password_confirm": "manager123",
        "first_name": "Test",
        "last_name": "Manager",
        "department": "sales",
        "phone_number": "1234567890",
        "permissions_level": "basic"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/admin/managers/create/", 
            json=manager_data,
            headers=admin_headers
        )
        if response.status_code == 201:
            manager_info = response.json()
            print("✅ Manager creation successful")
            print(f"   Manager ID: {manager_info.get('id', 'N/A')}")
        else:
            print(f"❌ Manager creation failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Manager creation request failed: {e}")
        return False
    
    # Step 3: List managers
    print("\n3. Testing manager listing...")
    try:
        response = requests.get(f"{BASE_URL}/admin/managers/", headers=admin_headers)
        if response.status_code == 200:
            managers = response.json()
            print(f"✅ Manager listing successful - Found {len(managers)} managers")
        else:
            print(f"❌ Manager listing failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Manager listing request failed: {e}")
        return False
    
    # Step 4: Manager login
    print("\n4. Testing manager login...")
    manager_login_data = {
        "email": "manager@example.com",
        "password": "manager123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=manager_login_data)
        if response.status_code == 200:
            manager_tokens = response.json()
            print("✅ Manager login successful")
            print(f"   Manager role: {manager_tokens['user']['role']}")
        else:
            print(f"❌ Manager login failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Manager login request failed: {e}")
        return False
    
    # Step 5: Test manager profile access
    print("\n5. Testing manager profile access...")
    manager_headers = {
        "Authorization": f"Bearer {manager_tokens['tokens']['access']}"
    }
    
    try:
        response = requests.get(f"{BASE_URL}/users/api/profile/manager/", headers=manager_headers)
        if response.status_code == 200:
            manager_profile = response.json()
            print("✅ Manager profile access successful")
            print(f"   Department: {manager_profile.get('department', 'N/A')}")
            print(f"   Permissions: {manager_profile.get('permissions_level', 'N/A')}")
        else:
            print(f"❌ Manager profile access failed: {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"❌ Manager profile access request failed: {e}")
        return False
    
    print("\n🎉 All tests passed! Manager workflow is working correctly.")
    return True

if __name__ == "__main__":
    print("Manager Workflow Test")
    print("Make sure your Django backend is running on http://localhost:8000")
    print("And you have an admin user created with the credentials specified in this script.")
    print()
    
    success = test_manager_workflow()
    sys.exit(0 if success else 1)
