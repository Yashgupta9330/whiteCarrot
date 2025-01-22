FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps
RUN npm install -g nodemon


# Copy the rest of the necessary files
COPY tsconfig*.json ./
COPY .env ./
COPY src ./src
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Expose the application port
EXPOSE 4000

# Start the application with nodemon
CMD ["nodemon", "dist/server.js"]

