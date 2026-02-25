# Finance Agent HQ 💰

An AI-powered finance and tax assistant platform designed for Canadian immigrants to Ontario, helping them navigate tax obligations and optimize their financial decisions.

## 🌟 Features

- **Tax Education Agent**: Interactive AI chat for tax questions and education
- **Document Processing**: AI-powered extraction of financial data from documents
- **Financial Entry Management**: Track income, deductions, credits, and tax payments
- **Tax Projections**: Real-time calculation of tax obligations
- **Secure Storage**: GCP Cloud Storage with KMS encryption
- **Redis Caching**: Optimized performance with intelligent caching

## � Deploy for $0/month

This platform is optimized to run completely free using **Fly.io**:

- **Fly.io** (Backend + Frontend + Database) - 3 VMs, 160GB bandwidth, no cold starts
- **Upstash** (Redis) - 10k commands/day free
- **Cloudflare R2** (Storage) - 10GB free

**→ [Fly.io Deployment Guide](docs/FLY-IO-DEPLOYMENT.md)** 🚀

Alternative options: [Vercel + Railway](docs/ZERO-COST-DEPLOYMENT.md), Render, Oracle Cloud.

---

## �🏗️ Architecture

### Monorepo Structure

```
my-finance-agent-hq/
├── apps/
│   ├── backend-api/      # NestJS backend with GraphQL
│   ├── web-app/          # Next.js frontend
│   └── cli/              # CLI tools
├── packages/
│   ├── cache/            # Redis caching service
│   ├── config/           # Shared configuration
│   ├── database/         # Drizzle ORM + PostgreSQL
│   ├── encryption/       # GCP KMS encryption
│   ├── tools/            # AI agents and tools
│   └── validation-schema/# Zod schemas
└── docs/                 # Documentation
```

### Tech Stack

**Backend:**

- NestJS (Node.js framework)
- GraphQL with Apollo
- PostgreSQL with pgvector
- Redis for caching
- Drizzle ORM
- Google Gemini AI
- Mastra AI framework

**Frontend:**

- Next.js 16 (React 19)
- Apollo Client
- Mantine UI
- TailwindCSS
- Firebase Auth

**Infrastructure:**

- Docker & Docker Compose
- GitHub Actions CI/CD
- GCP Cloud Storage
- GCP KMS

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- Redis (or use Docker)

### Local Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/my-finance-agent-hq.git
   cd my-finance-agent-hq
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Setup environment variables**

   ```bash
   cp apps/backend-api/.env.example apps/backend-api/.env
   # Edit .env with your values
   ```

4. **Start infrastructure**

   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**

   ```bash
   pnpm db:migrate
   ```

6. **Start development servers**

   ```bash
   # Backend (terminal 1)
   cd apps/backend-api
   pnpm dev

   # Frontend (terminal 2)
   cd apps/web-app
   pnpm dev
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - GraphQL Playground: http://localhost:3001/graphql

## 📦 Deployment

## 📦 Deployment

### Recommended: Fly.io (15 minutes, $0/month)

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
flyctl auth login

# Deploy backend
cd apps/backend-api
flyctl launch --no-deploy
flyctl postgres create --name finance-agent-db
flyctl secrets set JWT_SECRET="$(openssl rand -base64 32)" # ... (see guide)
flyctl deploy

# Deploy frontend
cd ../web-app
flyctl launch --no-deploy
flyctl secrets set NEXT_PUBLIC_API_URL="https://your-backend.fly.dev"
flyctl deploy
```

**→ [Complete Fly.io Guide](docs/FLY-IO-DEPLOYMENT.md)** 🚀

---

### Alternative: Docker Pipeline (Local → Staging → Production)

- **Local**: Development environment with hot-reloading
- **Staging**: Auto-deploys on push to `develop` branch
- **Production**: Auto-deploys on push to `main` branch

### Quick Deploy

**Staging:**

```bash
git checkout develop
git push origin develop
# GitHub Actions will automatically deploy
```

**Production:**

```bash
git checkout main
git merge develop
git push origin main
# GitHub Actions will automatically deploy
```

### Manual Deploy

```bash
# Staging
./scripts/deploy-staging.sh

# Production (requires confirmation)
./scripts/deploy-production.sh

# Fly.io (from package.json)
pnpm fly:deploy:backend
pnpm fly:deploy:frontend
```

🚀 **Fly.io Guide (Recommended)**: [docs/FLY-IO-DEPLOYMENT.md](docs/FLY-IO-DEPLOYMENT.md)

⚡ **Fly.io Quick Commands**: [docs/FLY-IO-QUICK-REF.md](docs/FLY-IO-QUICK-REF.md)

🆓 **Other Free Options**: [docs/ZERO-COST-DEPLOYMENT.md](docs/ZERO-COST-DEPLOYMENT.md)

📖 **Full Deployment Guide**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

🔧 **Docker Quick Reference**: [docs/DEPLOYMENT-QUICK-REF.md](docs/DEPLOYMENT-QUICK-REF.md)

## 🛠️ Development

### Workspace Commands

```bash
# Lint all packages
pnpm lint

# Format code
pnpm format

# Type check
pnpm typecheck

# Database operations
pnpm db:studio    # Open Drizzle Studio
pnpm db:generate  # Generate migrations
pnpm db:migrate   # Run migrations
pnpm db:push      # Push schema changes
```

### Package Commands

```bash
# Run specific package
pnpm --filter @hq/backend-api dev
pnpm --filter @hq/web-app dev

# Build specific package
pnpm --filter @hq/backend-api build

# Add dependency to package
pnpm --filter @hq/backend-api add express
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Restart service
docker-compose restart backend

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up -d --build
```

## 📚 Project Structure

### Backend API (`apps/backend-api`)

```
src/
├── nest/
│   ├── ai/               # AI service and agents
│   ├── auth/             # Firebase authentication
│   ├── document/         # Document management
│   ├── financial-entry/  # Financial entries CRUD
│   ├── fiscal-entity/    # User fiscal entities
│   ├── tax/              # Tax calculations
│   └── user/             # User management
├── config/
│   └── env.ts           # Environment configuration
└── main.ts              # Application entry point
```

### Frontend (`apps/web-app`)

```
src/
├── app/                 # Next.js app router
│   ├── dashboard/      # Dashboard pages
│   ├── documents/      # Document management
│   └── tax/            # Tax pages
├── components/         # React components
├── contexts/           # React contexts
├── hooks/              # Custom hooks
└── lib/                # Utilities
```

### Shared Packages

- **@hq/cache**: Redis caching service
- **@hq/config**: Environment configuration
- **@hq/database**: Database client and schema
- **@hq/encryption**: GCP KMS encryption
- **@hq/tools**: AI agents and tools
- **@hq/validation-schema**: Zod schemas

## 🔐 Security

- Firebase JWT authentication
- GCP KMS encryption for sensitive data
- Environment-specific secrets
- Redis password protection
- SQL injection prevention with Drizzle ORM
- CORS configuration
- Rate limiting (TODO)

## 🧪 Testing

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Coverage
pnpm test:cov
```

## 📊 Monitoring

### Health Checks

- Backend: `GET /health`
- Database: `pg_isready`
- Redis: `redis-cli ping`

### Logs

```bash
# Backend logs
docker logs finance-agent-backend

# Frontend logs
docker logs finance-agent-frontend

# Database logs
docker logs finance-agent-db
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'feat: add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open a Pull Request to `develop` branch

### Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Build/tooling changes

## 📝 API Documentation

### GraphQL

Access GraphQL Playground at: http://localhost:3001/graphql

### REST Endpoints

- `POST /api/ai/tax-education-chat` - Tax education agent chat
- `GET /health` - Health check

## 🗺️ Roadmap

- [ ] User onboarding flow
- [ ] Multi-year tax comparison
- [ ] Tax document generation (T1, T4)
- [ ] Receipt scanning and categorization
- [ ] Email notifications
- [ ] Mobile app
- [ ] Multi-province support
- [ ] Tax optimization recommendations
- [ ] Integration with CRA My Account

## 📄 License

This project is proprietary and confidential.

## 🆘 Support

- 🚀 [Fly.io Deployment (Recommended)](docs/FLY-IO-DEPLOYMENT.md)
- 🆓 [Other Zero-Cost Options](docs/ZERO-COST-DEPLOYMENT.md)
- 📖 [Full Documentation](docs/)
- 🔧 [Quick Reference](docs/DEPLOYMENT-QUICK-REF.md)
- 🐛 [Report Issues](https://github.com/yourusername/my-finance-agent-hq/issues)

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- AI framework by [Mastra](https://mastra.ai/)
- UI components by [Mantine](https://mantine.dev/)

---

**Made with ❤️ for Canadian immigrants**
