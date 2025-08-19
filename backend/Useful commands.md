# 1. copy env
cp .env.sample .env
# edit .env and set SECRET_KEY etc.

# 2. build and start
docker compose up -d --build

# 3. run migrations (if not auto-run)
docker compose exec web python manage.py migrate

# 4. create superuser
docker compose exec web python manage.py createsuperuser

# 5. view logs
docker compose logs -f web

# 6. shell into container
docker compose exec web sh

# 7. stop and remove containers + volumes (clean)
docker compose down -v
