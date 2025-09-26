#!/usr/bin/env python
"""
Simple script to populate categories in the database.
Run this when the database is available.
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from products.models import Category

def populate_categories():
    categories = [
        'Sneakers',
        'Running',
        'Casual',
        'Formal',
        'Sports',
        'Lifestyle',
        'Athletic',
        'Boots',
        'Sandals',
        'Dress Shoes'
    ]

    created_count = 0
    for category_name in categories:
        category, created = Category.objects.get_or_create(
            name=category_name,
            defaults={'slug': category_name.lower().replace(' ', '-')}
        )
        if created:
            created_count += 1
            print(f'Created category: {category_name}')
        else:
            print(f'Category already exists: {category_name}')

    print(f'Successfully processed {len(categories)} categories. Created {created_count} new categories.')

if __name__ == '__main__':
    populate_categories()

