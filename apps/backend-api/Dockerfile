# Build stage
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# Copy all packages and apps needed for backend-api
COPY packages/ ./packages/
COPY apps/backend-api/ ./apps/backend-api/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build backend-api and all its dependencies in correct order
WORKDIR /app/apps/backend-api
RUN pnpm --filter @hq/backend-api... build

# Production stage
FROM node:20-alpine AS production

# Install pnpm and postgresql-client for migrations
RUN npm install -g pnpm && \
    apk add --no-cache postgresql-client

WORKDIR /app

# Copy workspace configuration
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json ./

# Copy built packages (dist and package.json only, no src)
COPY --from=builder /app/packages/cache/package.json ./packages/cache/
COPY --from=builder /app/packages/cache/dist ./packages/cache/dist
COPY --from=builder /app/packages/config/package.json ./packages/config/
COPY --from=builder /app/packages/config/dist ./packages/config/dist
COPY --from=builder /app/packages/database/package.json ./packages/database/
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/encryption/package.json ./packages/encryption/
COPY --from=builder /app/packages/encryption/dist ./packages/encryption/dist
COPY --from=builder /app/packages/tools/package.json ./packages/tools/
COPY --from=builder /app/packages/tools/dist ./packages/tools/dist
COPY --from=builder /app/packages/validation-schema/package.json ./packages/validation-schema/
COPY --from=builder /app/packages/validation-schema/dist ./packages/validation-schema/dist

# Copy backend-api
COPY --from=builder /app/apps/backend-api/package.json ./apps/backend-api/
COPY --from=builder /app/apps/backend-api/tsconfig.json ./apps/backend-api/
COPY --from=builder /app/apps/backend-api/register-paths.js ./apps/backend-api/
COPY --from=builder /app/apps/backend-api/dist ./apps/backend-api/dist
COPY --from=builder /app/apps/backend-api/drizzle ./apps/backend-api/drizzle
COPY --from=builder /app/apps/backend-api/drizzle.config.ts ./apps/backend-api/
COPY --from=builder /app/apps/backend-api/scripts/startup.sh ./apps/backend-api/scripts/startup.sh

# Make startup script executable
RUN chmod +x ./apps/backend-api/scripts/startup.sh

# Install production dependencies fresh (this properly sets up workspace links)
RUN pnpm install --prod --frozen-lockfile

WORKDIR /app/apps/backend-api

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start the application with migrations
CMD ["sh", "./scripts/startup.sh"]
