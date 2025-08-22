# syntax=docker/dockerfile:1

# Base image
FROM python:3.12-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Make entrypoint executable
RUN chmod +x /app/entrypoint.sh

# Expose Django port
EXPOSE 8000

# Default entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

# Optional: For development hot-reload, can override CMD in docker-compose
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
