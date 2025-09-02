#!/bin/sh

echo "Waiting for database..."

# Wait until Postgres is available
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.1
done

echo "Database is ready ✅"

# Run migrations
python manage.py migrate --noinput

# Collect static files
python manage.py collectstatic --noinput

# Start Gunicorn server
exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000 --workers 4
