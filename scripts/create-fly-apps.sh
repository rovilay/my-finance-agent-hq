#!/bin/bash

# Create Fly.io apps for Finance Agent HQ
# Run this ONCE before your first deployment

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Finance Agent HQ - Create Fly.io Apps"
echo "=========================================="
echo ""

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo -e "${RED}❌ Fly CLI not found!${NC}"
    echo "Install it with:"
    echo "  curl -L https://fly.io/install.sh | sh"
    exit 1
fi

# Check if logged in
if ! flyctl auth whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Fly.io${NC}"
    echo "Login now..."
    flyctl auth login
fi

echo -e "${GREEN}✅ Logged in to Fly.io${NC}"
echo ""

# Ask which environment
echo -e "${BLUE}Which environment do you want to create?${NC}"
echo "1) Staging (finance-agent-backend-stg, finance-agent-frontend-stg)"
echo "2) Production (finance-agent-backend, finance-agent-frontend)"
echo "3) Both"
read -p "Select (1, 2, or 3): " ENV_CHOICE

CREATE_STAGING=false
CREATE_PROD=false

case $ENV_CHOICE in
  1)
    CREATE_STAGING=true
    ;;
  2)
    CREATE_PROD=true
    ;;
  3)
    CREATE_STAGING=true
    CREATE_PROD=true
    ;;
  *)
    echo -e "${RED}Invalid choice. Exiting.${NC}"
    exit 1
    ;;
esac

echo ""

# Function to create apps
create_apps() {
  local ENV=$1
  local BACKEND_CONFIG=$2
  local FRONTEND_CONFIG=$3
  local BACKEND_APP=$4
  local FRONTEND_APP=$5
  local DB_NAME=$6
  
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}Creating $ENV apps...${NC}"
  echo -e "${BLUE}========================================${NC}"
  echo ""
  
  # Create backend app
  echo -e "${YELLOW}Creating backend app: $BACKEND_APP${NC}"
  
  if flyctl apps list | grep -q "^$BACKEND_APP"; then
    echo -e "${YELLOW}⚠️  Backend app already exists${NC}"
  else
    flyctl launch --no-deploy --copy-config --config "$BACKEND_CONFIG" --name "$BACKEND_APP" --region yyz
    echo -e "${GREEN}✅ Backend app created${NC}"
  fi
  
  echo ""
  
  # Create database
  echo -e "${YELLOW}Creating PostgreSQL database: $DB_NAME${NC}"
  if flyctl postgres list | grep -q "$DB_NAME"; then
    echo -e "${YELLOW}⚠️  Database already exists${NC}"
  else
    flyctl postgres create --name "$DB_NAME" --region yyz --initial-cluster-size 1 --vm-size shared-cpu-1x --volume-size 1
    echo -e "${GREEN}✅ Database created${NC}"
  fi
  
  echo ""
  
  # Attach database
  echo -e "${YELLOW}Attaching database to backend...${NC}"
  flyctl postgres attach "$DB_NAME" --app "$BACKEND_APP" || echo -e "${YELLOW}Database may already be attached${NC}"
  echo ""
  
  # Create frontend app
  echo -e "${YELLOW}Creating frontend app: $FRONTEND_APP${NC}"
  
  if flyctl apps list | grep -q "^$FRONTEND_APP"; then
    echo -e "${YELLOW}⚠️  Frontend app already exists${NC}"
  else
    flyctl launch --no-deploy --copy-config --config "$FRONTEND_CONFIG" --name "$FRONTEND_APP" --region yyz
    echo -e "${GREEN}✅ Frontend app created${NC}"
  fi
  
  echo ""
  
  echo -e "${GREEN}✅ $ENV apps created successfully!${NC}"
  echo ""
}

# Create staging apps
if [ "$CREATE_STAGING" = true ]; then
  create_apps "STAGING" "apps/backend-api/fly.staging.toml" "apps/web-app/fly.staging.toml" "finance-agent-backend-stg" "finance-agent-frontend-stg" "finance-agent-db-stg"
fi

# Create production apps
if [ "$CREATE_PROD" = true ]; then
  create_apps "PRODUCTION" "apps/backend-api/fly.toml" "apps/web-app/fly.toml" "finance-agent-backend" "finance-agent-frontend" "finance-agent-db"
fi

# Summary
echo ""
echo "================================================"
echo -e "${GREEN}🎉 Apps Created Successfully!${NC}"
echo "================================================"
echo ""

if [ "$CREATE_STAGING" = true ]; then
  echo -e "${BLUE}Staging Apps:${NC}"
  echo "  - finance-agent-backend-stg"
  echo "  - finance-agent-frontend-stg"
  echo "  - finance-agent-db-stg"
  echo ""
fi

if [ "$CREATE_PROD" = true ]; then
  echo -e "${BLUE}Production Apps:${NC}"
  echo "  - finance-agent-backend"
  echo "  - finance-agent-frontend"
  echo "  - finance-agent-db"
  echo ""
fi

echo -e "${YELLOW}Next steps:${NC}"
echo "1. Set environment secrets:"
echo "   flyctl secrets set JWT_SECRET=\"\$(openssl rand -base64 32)\" -a <app-name>"
echo ""
echo "2. Deploy your apps:"
if [ "$CREATE_STAGING" = true ]; then
  echo "   pnpm fly:deploy:staging:backend"
  echo "   pnpm fly:deploy:staging:frontend"
fi
if [ "$CREATE_PROD" = true ]; then
  echo "   pnpm fly:deploy:prod:backend"
  echo "   pnpm fly:deploy:prod:frontend"
fi
echo ""
echo "3. Or use the interactive script:"
echo "   ./scripts/deploy-fly.sh"
echo ""
