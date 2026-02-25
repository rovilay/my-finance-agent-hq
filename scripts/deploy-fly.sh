#!/bin/bash

# Fly.io Quick Deploy Script for Finance Agent HQ
# This script will guide you through deploying to Fly.io

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🚀 Finance Agent HQ - Fly.io Deployment Script"
echo "================================================"
echo ""

# Ask for environment
echo -e "${BLUE}Which environment do you want to deploy?${NC}"
echo "1) Staging (fly.staging.toml)"
echo "2) Production (fly.toml)"
read -p "Select (1 or 2): " ENV_CHOICE

if [ "$ENV_CHOICE" = "1" ]; then
  ENV="staging"
  BACKEND_CONFIG="apps/backend-api/fly.staging.toml"
  FRONTEND_CONFIG="apps/web-app/fly.staging.toml"
  APP_SUFFIX="-stg"
  DB_NAME="finance-agent-db-stg"
elif [ "$ENV_CHOICE" = "2" ]; then
  ENV="production"
  BACKEND_CONFIG="apps/backend-api/fly.toml"
  FRONTEND_CONFIG="apps/web-app/fly.toml"
  APP_SUFFIX=""
  DB_NAME="finance-agent-db"
else
  echo -e "${RED}Invalid choice. Exiting.${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}Deploying to: ${ENV}${NC}"
echo -e "${GREEN}Using backend config: ${BACKEND_CONFIG}${NC}"
echo -e "${GREEN}Using frontend config: ${FRONTEND_CONFIG}${NC}"
echo ""

# Check if flyctl is installed
if ! command -v flyctl &> /dev/null; then
    echo -e "${RED}❌ Fly CLI not found!${NC}"
    echo "Install it with:"
    echo "  curl -L https://fly.io/install.sh | sh"
    exit 1
fi

echo -e "${GREEN}✅ Fly CLI found${NC}"
echo ""

# Check if logged in
if ! flyctl auth whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Fly.io${NC}"
    echo "Login now..."
    flyctl auth login
fi

echo -e "${GREEN}✅ Logged in to Fly.io${NC}"
echo ""

# Prompt for environment variables
echo -e "${BLUE}📝 Let's collect your environment variables...${NC}"
echo ""

read -p "Google Gemini API Key: " GEMINI_KEY
read -p "Firebase Project ID: " FIREBASE_PROJECT
read -p "Upstash Redis Host: " REDIS_HOST
read -p "Upstash Redis Port (default 6379): " REDIS_PORT
REDIS_PORT=${REDIS_PORT:-6379}
read -sp "Upstash Redis Password: " REDIS_PASSWORD
echo ""
read -p "GCS Bucket Name: " GCS_BUCKET
read -p "GCP KMS Key ID: " KMS_KEY
read -p "GCP Project ID: " GCP_PROJECT
read -p "GCP KMS Location (default us-central1): " KMS_LOCATION
KMS_LOCATION=${KMS_LOCATION:-us-central1}
read -p "GCP KMS Key Ring: " KMS_KEYRING

# Generate JWT secret
JWT_SECRET=$(openssl rand -base64 32)

echo ""
echo -e "${BLUE}🚀 Deploying Backend...${NC}"
echo ""

# Check if config exists
if [ ! -f "$BACKEND_CONFIG" ]; then
    echo -e "${RED}❌ $BACKEND_CONFIG not found${NC}"
    exit 1
fi

# Launch backend
BACKEND_APP=$(grep '^app = ' "$BACKEND_CONFIG" | cut -d'"' -f2 | tr -d "'")
echo "Backend app name: $BACKEND_APP"

if ! flyctl apps list | grep -q "$BACKEND_APP"; then
    echo "Creating backend app..."
    flyctl launch --no-deploy --copy-config --config "$BACKEND_CONFIG" --name "$BACKEND_APP"
    
    # Create PostgreSQL
    echo ""
    echo -e "${BLUE}Creating PostgreSQL database...${NC}"
    flyctl postgres create --name "$DB_NAME" --region yyz
    flyctl postgres attach "$DB_NAME" --app "$BACKEND_APP"
fi

# Set secrets
echo ""
echo -e "${BLUE}Setting environment secrets...${NC}"
flyctl secrets set \
  GOOGLE_GENERATIVE_AI_API_KEY="$GEMINI_KEY" \
  AI_API_KEY="$GEMINI_KEY" \
  JWT_SECRET="$JWT_SECRET" \
  FIREBASE_PROJECT_ID="$FIREBASE_PROJECT" \
  JWT_ISSUER="https://securetoken.google.com/$FIREBASE_PROJECT" \
  JWT_AUDIENCE="$FIREBASE_PROJECT" \
  REDIS_HOST="$REDIS_HOST" \
  REDIS_PORT="$REDIS_PORT" \
  REDIS_PASSWORD="$REDIS_PASSWORD" \
  GCS_BUCKET_NAME="$GCS_BUCKET" \
  GCP_KMS_KEY_ID="$KMS_KEY" \
  GCP_KMS_PROJECT_ID="$GCP_PROJECT" \
  GCP_KMS_LOCATION_ID="$KMS_LOCATION" \
  GCP_KMS_KEY_RING_ID="$KMS_KEYRING" \
  NODE_ENV="$ENV" \
  --app "$BACKEND_APP"

# Deploy backend
echo ""
echo -e "${BLUE}Deploying backend...${NC}"
flyctl deploy --config "$BACKEND_CONFIG"

# Get backend URL
BACKEND_URL=$(flyctl info --app "$BACKEND_APP" --json | grep -o '"Hostname":"[^"]*"' | cut -d'"' -f4)
BACKEND_URL="https://$BACKEND_URL"

echo ""
echo -e "${GREEN}✅ Backend deployed at: $BACKEND_URL${NC}"

# Run migrations
echo ""
echo -e "${BLUE}Running database migrations...${NC}"
flyctl ssh console -C "cd /app/apps/backend-api && pnpm db:migrate"

echo ""
echo -e "${GREEN}✅ Backend setup complete!${NC}"

# Deploy Frontend
echo ""
echo -e "${BLUE}🚀 Deploying Frontend...${NC}"
echo ""

# Check if config exists
if [ ! -f "$FRONTEND_CONFIG" ]; then
    echo -e "${RED}❌ $FRONTEND_CONFIG not found${NC}"
    exit 1
fi

FRONTEND_APP=$(grep '^app = ' "$FRONTEND_CONFIG" | cut -d'"' -f2 | tr -d "'")
echo "Frontend app name: $FRONTEND_APP"

if ! flyctl apps list | grep -q "$FRONTEND_APP"; then
    echo "Creating frontend app..."
    flyctl launch --no-deploy --copy-config --config "$FRONTEND_CONFIG" --name "$FRONTEND_APP"
fi

# Set frontend secrets
echo ""
echo -e "${BLUE}Setting frontend environment...${NC}"
flyctl secrets set \
  NEXT_PUBLIC_API_URL="$BACKEND_URL" \
  NODE_ENV="$ENV" \
  --app "$FRONTEND_APP"

# Deploy frontend
echo ""
echo -e "${BLUE}Deploying frontend...${NC}"
flyctl deploy --config "$FRONTEND_CONFIG"

# Get frontend URL
FRONTEND_URL=$(flyctl info --app "$FRONTEND_APP" --json | grep -o '"Hostname":"[^"]*"' | cut -d'"' -f4)
FRONTEND_URL="https://$FRONTEND_URL"

echo ""
echo -e "${GREEN}✅ Frontend deployed at: $FRONTEND_URL${NC}"

# Summary
echo ""
echo "================================================"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo "================================================"
echo ""
echo -e "${YELLOW}Environment:${NC} $ENV"
echo -e "${BLUE}Backend:${NC}  $BACKEND_URL"
echo -e "${BLUE}Frontend:${NC} $FRONTEND_URL"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test backend: curl $BACKEND_URL/health"
echo "2. Visit frontend: open $FRONTEND_URL"
echo "3. Check logs: flyctl logs -a $BACKEND_APP"
echo ""
echo -e "${GREEN}Total cost: \$0/month 🎉${NC}"
echo ""
