# Base image
FROM python:3.11-slim

# Prevents Python from writing pyc files & enables unbuffered output
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory inside container
WORKDIR /app

# Install system dependencies for psycopg2 (Postgres client)
RUN apt-get update \
    && apt-get install -y gcc libpq-dev netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project code
COPY . .

# Expose Django dev server port
EXPOSE 8000

# Run Django development server (with auto reload)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
