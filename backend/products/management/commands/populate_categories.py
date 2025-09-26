from django.core.management.base import BaseCommand
from products.models import Category


class Command(BaseCommand):
    help = 'Populate categories in the database'

    def handle(self, *args, **options):
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
                self.stdout.write(
                    self.style.SUCCESS(f'Created category: {category_name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'Category already exists: {category_name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'Successfully processed {len(categories)} categories. Created {created_count} new categories.')
        )

