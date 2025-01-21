FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g nodemon

COPY tsconfig*.json ./
COPY .env ./

COPY src ./src
COPY prisma ./prisma

RUN npx prisma generate

RUN npm run build

EXPOSE 4000

CMD ["nodemon", "dist/server.js"]
