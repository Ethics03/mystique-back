# 🎭 Mystique Backend

A robust NestJS backend service for event management and user authentication using Supabase and Prisma.

## ⚡ Features

- 🔐 User Authentication with Supabase
- 👥 Role-based Access Control (ADMIN, CL, PRNC)
- 📅 Event Management
- 👤 Profile Management
- 📝 Participant Registration
- 🔒 Secure Cookie-based JWT Authentication

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- PostgreSQL database (Supabase)
- Git

### 🛠️ Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ethics03/mystique-back.git
   cd mystique-back
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or using npm
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the root directory with these variables:

   ```env
   # Supabase Database Configuration
   SUPABASE_DB_PASSWORD=your_db_password
   DATABASE_URL=postgresql://[username]:[password]@[host]:[port]/[database]

   # Supabase Authentication
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_KEY=your_supabase_anon_key

   # Application Configuration
   JWT_SECRET_KEY=your_secure_jwt_secret
   PORT=5553
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start Development Server**
   ```bash
   pnpm start:dev
   # or
   npm run start:dev
   ```

   The server will start on `http://localhost:5553` (or your configured PORT)

## 📝 Environment Variables Guide

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_DB_PASSWORD` | Database password | `your_strong_password` |
| `DATABASE_URL` | Supabase PostgreSQL URL | `postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_KEY` | Supabase anon/public key | `eyJ...` (JWT format) |
| `JWT_SECRET_KEY` | JWT signing key | `your_secure_random_string` |
| `PORT` | Server port number | `5553` |

### 🔐 Getting Supabase Credentials

1. **Database & URL**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project
   - Go to Project Settings → Database
   - Find Database Password and Connection string

2. **API Keys**
   - In Project Settings → API
   - Copy Project URL for `SUPABASE_URL`
   - Copy anon/public key for `SUPABASE_KEY`

3. **JWT Secret**
   - Generate a secure random string
   - Minimum 32 characters recommended
   - Keep this secret safe!

## 🧪 API Testing

The API documentation is available at:
- Swagger UI: `http://localhost:5553/api`
- OpenAPI JSON: `http://localhost:5553/api-json`

## � Docker Support

### Development with Docker

```bash
# Start the development environment
pnpm docker:dev

# Start and rebuild containers
pnpm docker:dev:build

# Stop containers
pnpm docker:down
```

### Production with Docker

```bash
# Build production image
pnpm docker:build

# Run production container
pnpm docker:run
```

### Docker Configuration
- Development setup includes hot-reload
- PostgreSQL container for local development
- Multi-stage build for smaller production image
- Volume mapping for persistent data
- Environment variable support

## �📚 Available Scripts

```bash
# Development
pnpm start:dev     # Start with hot-reload
pnpm docker:dev    # Start with Docker Compose

# Production
pnpm build         # Build the application
pnpm start:prod    # Start production server
pnpm docker:build  # Build Docker image
pnpm docker:run    # Run Docker container

# Testing
pnpm test         # Run unit tests
pnpm test:e2e     # Run e2e tests
pnpm test:cov     # Generate coverage reports

# Docker Commands
pnpm docker:dev        # Start development environment
pnpm docker:dev:build  # Rebuild and start development
pnpm docker:down       # Stop Docker Compose services
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is [MIT Licensed](LICENSE)
