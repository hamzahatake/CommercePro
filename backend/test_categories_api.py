#!/usr/bin/env python
"""
Test script to check if categories API endpoint works.
"""

import requests
import json

def test_categories_api():
    try:
        # Test the categories endpoint
        response = requests.get('http://localhost:8000/api/products/categories/')
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Categories Data: {json.dumps(data, indent=2)}")
            print(f"Number of categories: {len(data) if isinstance(data, list) else 'Not a list'}")
        else:
            print(f"Error Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("Could not connect to the backend server. Make sure it's running on localhost:8000")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    test_categories_api()

