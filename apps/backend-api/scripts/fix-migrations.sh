#!/bin/bash

# Migration Fix Script for backend-api
# This script fixes migration issues for the backend-api app

set -e  # Exit on error

# Load .env file if it exists
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    log_error "DATABASE_URL environment variable is not set!"
    log_error "Please create a .env file with DATABASE_URL"
    exit 1
fi

log_success "Environment variables validated"

# Display warning
echo ""
log_warn "⚠️  WARNING: This will modify your database and migration files for backend-api!"
echo ""
echo "This script will:"
echo "1. Backup existing migrations"
echo "2. Clean migration directory"
echo "3. Generate fresh migrations from schema"
echo ""

read -p "Do you want to continue? (yes/no): " -r
echo ""
if [[ ! $REPLY =~ ^[Yy]([Ee][Ss])?$ ]]; then
    log_warn "Operation cancelled"
    exit 0
fi

TIMESTAMP=$(date +%s)

log_info "📦 Processing backend-api migrations..."
echo "──────────────────────────────────────────────────"

if [ -d "drizzle" ]; then
    log_info "Backing up migrations..."
    mv drizzle "drizzle.backup-$TIMESTAMP"
    log_success "Backup created at: drizzle.backup-$TIMESTAMP"
else
    log_warn "No existing migrations found"
fi

log_info "Generating new migrations..."
pnpm db:generate
log_success "Migrations generated"

echo ""
log_success "✅ Migration fix completed successfully!"
echo "──────────────────────────────────────────────────"

echo ""
read -p "Do you want to push schema to database? (yes/no): " -r
echo ""
if [[ $REPLY =~ ^[Yy]([Ee][Ss])?$ ]]; then
    log_info "📤 Pushing schema to database..."
    pnpm db:push
    log_success "Schema pushed successfully!"
fi

echo ""
log_info "Next steps:"
log_info "1. Review the new migration files in ./drizzle"
log_info "2. Test your application"
log_info "3. Commit the changes if everything works"
