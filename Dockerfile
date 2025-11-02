# Use Node 20 (Node 18 has issues with Prisma on ARM)
FROM node:20-alpine AS base

# Install dependencies for Prisma
RUN apk add --no-cache \
    openssl \
    openssl-dev \
    libc6-compat

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Development stage
FROM base AS development

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies
RUN pnpm install --frozen-lockfile

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN pnpm prisma generate

# Copy source
COPY . .

# Expose port
EXPOSE 5553

# Start dev server
CMD ["pnpm", "start:dev"]

# Production build stage
FROM base AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (needed for build)
RUN pnpm install --frozen-lockfile

# Copy prisma and generate
COPY prisma ./prisma/
RUN pnpm prisma generate

# Create the generated directory first
RUN mkdir -p src/generated

# Then copy the rest of the source
COPY . .

# Build the application
RUN pnpm build

# Ensure the generated directory exists after build
RUN mkdir -p src/generated

# Production stage
FROM base AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile
COPY --from=builder /app/prisma ./prisma

# Generate Prisma client in production
RUN pnpm prisma generate

# Copy built app and generated files
COPY --from=builder /app/dist ./dist

# Only copy the generated directory if it exists
RUN if [ -d "/app/src/generated" ]; then \
      mkdir -p src/generated && \
      cp -r /app/src/generated/* src/generated/; \
    fi
RUN addgroup -S nestjs && adduser -S nestjs -G nestjs
RUN chown -R nestjs:nestjs /app
USER nestjs

EXPOSE 5553

CMD ["node", "dist/main"]