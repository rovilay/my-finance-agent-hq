#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Deploying to Staging Environment${NC}"

# Check if .env.staging exists
if [ ! -f .env.staging ]; then
    echo -e "${RED}Error: .env.staging file not found${NC}"
    echo -e "${YELLOW}Please copy .env.staging.example to .env.staging and configure it${NC}"
    exit 1
fi

# Export environment variables
export $(cat .env.staging | grep -v '^#' | xargs)

# Pull latest images
echo -e "${YELLOW}Pulling latest Docker images...${NC}"
docker-compose -f docker-compose.staging.yml pull

# Stop existing containers
echo -e "${YELLOW}Stopping existing containers...${NC}"
docker-compose -f docker-compose.staging.yml down

# Start services
echo -e "${YELLOW}Starting services...${NC}"
docker-compose -f docker-compose.staging.yml up -d

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be healthy...${NC}"
sleep 10

# Run database migrations
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose -f docker-compose.staging.yml exec -T backend pnpm db:migrate || true

# Check health
echo -e "${YELLOW}Checking service health...${NC}"
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    exit 1
fi

if curl -f http://localhost:3001 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Staging deployment completed successfully!${NC}"
echo -e "${YELLOW}Backend: http://localhost:3000${NC}"
echo -e "${YELLOW}Frontend: http://localhost:3001${NC}"
