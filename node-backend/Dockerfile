# Use Node LTS with Bash (Debian-based)
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy wait-for-it script and give execute permission
COPY wait-for-it.sh ./
RUN chmod +x ./wait-for-it.sh

# Copy the rest of the application
COPY . .

# Expose backend port
EXPOSE 5000

# Start the backend only after MySQL is ready
CMD ["bash", "./wait-for-it.sh", "db:3306", "--", "npm", "start"]
