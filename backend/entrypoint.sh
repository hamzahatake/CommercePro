#!/bin/sh

set -e

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to start..."
while ! nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL started ✅"

# Apply database migrations
echo "Applying migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start server based on environment
if [ "$DJANGO_ENV" = "production" ]; then
  echo "Starting Gunicorn..."
  exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 4
else
  echo "Starting Django dev server..."
  exec python manage.py runserver 0.0.0.0:8000
fi
