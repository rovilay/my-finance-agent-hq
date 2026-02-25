#!/bin/sh
set -e

echo "Starting application..."

# Run migrations if psql is available
if command -v psql >/dev/null 2>&1; then
  echo "Running database migrations..."
  cd /app/apps/backend-api
  
  # Check if migration files exist
  if [ -d "drizzle" ] && [ -f "drizzle/0000_fresh_start.sql" ]; then
    echo "Applying migrations..."
    psql $DATABASE_URL -f drizzle/0000_fresh_start.sql 2>&1 | grep -v "already exists" || true
    
    if [ -f "drizzle/0002_create_document_enums.sql" ]; then
      psql $DATABASE_URL -f drizzle/0002_create_document_enums.sql 2>&1 | grep -v "already exists" || true
    fi
    
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
