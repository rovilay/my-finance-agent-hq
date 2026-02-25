#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying to Production Environment${NC}"

# Confirmation prompt
read -p "Are you sure you want to deploy to PRODUCTION? (yes/no): " confirm
if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}Deployment cancelled${NC}"
    exit 0
fi

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}Error: .env.production file not found${NC}"
    echo -e "${YELLOW}Please copy .env.production.example to .env.production and configure it${NC}"
    exit 1
fi

# Export environment variables
export $(cat .env.production | grep -v '^#' | xargs)

# Create backup
echo -e "${YELLOW}Creating backup...${NC}"
BACKUP_DIR="backups/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
docker-compose -f docker-compose.production.yml exec -T postgres pg_dump -U $POSTGRES_USER $POSTGRES_DB > "$BACKUP_DIR/database.sql" || echo "Backup skipped (database not running)"

# Pull latest images
echo -e "${YELLOW}Pulling latest Docker images...${NC}"
docker-compose -f docker-compose.production.yml pull

# Stop existing containers gracefully
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose -f docker-compose.production.yml stop

# Start services
echo -e "${YELLOW}Starting services...${NC}"
docker-compose -f docker-compose.production.yml up -d

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
sleep 15

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose -f docker-compose.production.yml exec -T backend pnpm db:migrate || true

# Check health
echo -e "${YELLOW}Checking service health...${NC}"
MAX_RETRIES=5
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Backend is healthy${NC}"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
            echo -e "${RED}❌ Backend health check failed after $MAX_RETRIES attempts${NC}"
            echo -e "${YELLOW}Rolling back...${NC}"
            docker-compose -f docker-compose.production.yml down
            exit 1
        fi
        echo -e "${YELLOW}Retry $RETRY_COUNT/$MAX_RETRIES...${NC}"
        sleep 5
    fi
done

if curl -f http://localhost:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
    exit 1
fi

# Create deployment tag
DEPLOYMENT_TAG="prod-$(date +%Y%m%d-%H%M%S)"
echo "$DEPLOYMENT_TAG" > .last-deployment

echo -e "${GREEN}✅ Production deployment completed successfully!${NC}"
echo -e "${YELLOW}Deployment tag: $DEPLOYMENT_TAG${NC}"
echo -e "${YELLOW}Backend: http://localhost:3000${NC}"
echo -e "${YELLOW}Frontend: http://localhost:3001${NC}"
echo -e "${BLUE}Backup saved to: $BACKUP_DIR${NC}"
