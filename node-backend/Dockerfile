# Use Node LTS
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Install mysql2 if not in package.json (needed for wait-for-db script)
RUN npm list mysql2 || npm install mysql2

# Copy wait-for-db script
COPY wait-for-db.js ./

# Copy the rest of the application
COPY . .

# Expose backend port
EXPOSE 5000

# Start with the wait script
CMD ["node", "wait-for-db.js"]