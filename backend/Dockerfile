FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm config set fetch-retry-maxtimeout 120000 && npm config set fetch-retries 5 && npm install
RUN npx prisma generate

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm config set fetch-retry-maxtimeout 120000 && npm config set fetch-retries 5 && npm install --omit=dev
RUN npx prisma generate

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["sh", "-c", "npx prisma db push && node dist/main"]
