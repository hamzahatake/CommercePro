# Base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend source
COPY . .

# Expose port
EXPOSE 3000

# Start React dev server
CMD ["npm", "start"]
