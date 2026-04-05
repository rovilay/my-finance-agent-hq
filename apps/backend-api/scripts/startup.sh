#!/bin/sh
set -e

echo "Starting application..."

# Run migrations if psql is available
if command -v psql >/dev/null 2>&1; then
  echo "Running database migrations..."
  cd /app/apps/backend-api
  
  # Check if migration files exist
  if [ -d "drizzle" ]; then
    echo "Applying migrations..."
    for migration in $(ls drizzle/*.sql 2>/dev/null | sort); do
      echo "  Running $migration..."
      psql $DATABASE_URL -f "$migration" 2>&1 | grep -v "already exists" || true
    done
    echo "Migrations completed successfully"
  else
    echo "No migration files found, skipping..."
  fi
else
  echo "psql not found, skipping migrations..."
fi

# Start the application
echo "Starting NestJS application..."
exec node -r ./register-paths.js dist/main.js
