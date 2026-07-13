# ── Build Stage ───────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source and build
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

# ── Production Stage ──────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files AND prisma schema BEFORE npm ci
# so postinstall (if any) can find schema.prisma
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only (no postinstall issues)
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy prisma client binaries from builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Create upload directories
RUN mkdir -p src/uploads/products src/uploads/banners

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 && \
    chown -R nodeuser:nodejs /app

USER nodeuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget -q -O- http://localhost:3000/health || exit 1

# Push schema to DB then start server
CMD ["sh", "-c", "node_modules/.bin/prisma db push --skip-generate && node dist/app.js"]
