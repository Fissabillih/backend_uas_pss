# ── Build Stage ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies for native modules (bcrypt)
RUN apk add --no-cache python3 make g++ openssl

# Cache bust: v3
COPY package*.json ./
COPY prisma ./prisma/

# Install all deps including dev (runs scripts for native bindings)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

# ── Production Stage ──────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install OpenSSL 1.1 for Prisma query engine + python/make/g++ for bcrypt rebuild
RUN apk add --no-cache openssl openssl-dev python3 make g++

COPY package*.json ./
COPY prisma ./prisma/

# Install production deps WITH scripts (needed for bcrypt native rebuild)
RUN npm ci --omit=dev && npm cache clean --force

# Copy built app
COPY --from=builder /app/dist ./dist

# Copy Prisma generated client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Create upload directories
RUN mkdir -p src/uploads/products src/uploads/banners

# Copy startup script
COPY start.sh ./start.sh
RUN chmod +x start.sh

# Non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 && \
    chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=60s --retries=5 \
  CMD wget -q -O- http://localhost:3000/health || exit 1

CMD ["sh", "start.sh"]
