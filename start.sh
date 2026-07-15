#!/bin/sh
set -e

echo "🔄 Running database migration..."
node_modules/.bin/prisma db push --skip-generate --accept-data-loss || echo "⚠️  DB push failed, continuing..."

echo "🌱 Running database seed..."
node prisma/seed.js || echo "⚠️  Seed failed (may already be seeded), continuing..."

echo "🚀 Starting server..."
exec node dist/app.js
