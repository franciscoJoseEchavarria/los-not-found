# Build stage
FROM node:23-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Allow environment variables at build time (example: VITE_API_URL)
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build

# Production stage
FROM node:23-slim AS production

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

EXPOSE 3000

# Allow environment variables at runtime
ENV NODE_ENV=production

CMD ["npm", "run", "start"]