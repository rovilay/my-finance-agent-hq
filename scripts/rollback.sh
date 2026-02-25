#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
    echo -e "${RED}Error: Environment not specified${NC}"
    echo "Usage: ./scripts/rollback.sh [staging|production]"
    exit 1
fi

if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    echo -e "${RED}Error: Invalid environment. Use 'staging' or 'production'${NC}"
    exit 1
fi

echo -e "${YELLOW}🔄 Rolling back $ENVIRONMENT environment${NC}"

# Find latest backup
LATEST_BACKUP=$(ls -t backups/ | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo -e "${RED}Error: No backups found${NC}"
    exit 1
fi

echo -e "${YELLOW}Found backup: $LATEST_BACKUP${NC}"
read -p "Restore from this backup? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}Rollback cancelled${NC}"
    exit 0
fi

# Export environment variables
export $(cat .env.$ENVIRONMENT | grep -v '^#' | xargs)

# Stop current services
docker-compose -f docker-compose.$ENVIRONMENT.yml down

# Restore database
echo -e "${YELLOW}Restoring database...${NC}"
docker-compose -f docker-compose.$ENVIRONMENT.yml up -d postgres
sleep 5
cat "backups/$LATEST_BACKUP/database.sql" | docker-compose -f docker-compose.$ENVIRONMENT.yml exec -T postgres psql -U $POSTGRES_USER $POSTGRES_DB

# Start all services
docker-compose -f docker-compose.$ENVIRONMENT.yml up -d

echo -e "${GREEN}✅ Rollback completed${NC}"
