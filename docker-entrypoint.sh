#!/bin/sh
set -e

echo "Applying database migrations..."
npx prisma migrate deploy

if [ "${SEED_ON_START:-true}" = "true" ]; then
  echo "Seeding database (skipped if it already has data)..."
  npx prisma db seed
fi

exec "$@"
