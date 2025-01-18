FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json (if present) first for better build caching
COPY package*.json ./

# Install dependencies in the container at the root level
RUN npm install

# Copy the entire project
COPY . .

# Build application
RUN npm run build

# Expose server port
EXPOSE ${PORT}

# Start the application
CMD ["npm", "start"]
