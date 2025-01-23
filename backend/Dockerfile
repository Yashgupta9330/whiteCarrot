FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=production

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the pre-built application and necessary files
COPY dist ./dist
COPY prisma ./prisma
COPY .env ./.env

# Generate Prisma Client
RUN npx prisma generate

# Expose the application port
EXPOSE 4000

# Start the server
CMD ["node", "dist/server.js"]