FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY dist ./dist
COPY prisma ./prisma

RUN npx prisma generate

EXPOSE 4000


CMD ["node", "dist/server.js"]