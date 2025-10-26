# Build Stage
FROM node:18-alpine AS builder

# Install pnpm and dependencies
RUN apk add --no-cache python3 make g++ \
    && corepack enable \
    && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with specific platform to avoid architecture issues
RUN pnpm install --frozen-lockfile --platform=linux --arch=x64

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build application
RUN pnpm build

# Production Stage
FROM node:18-alpine AS production

# Install pnpm and create non-root user
RUN corepack enable \
    && corepack prepare pnpm@latest --activate \
    && addgroup -S nestjs \
    && adduser -S nestjs -G nestjs

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile --platform=linux --arch=x64

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/prisma ./prisma

# Generate Prisma Client in production
RUN npx prisma generate \
    && chown -R nestjs:nestjs /app

# Switch to non-root user
USER nestjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s \
    CMD wget -q --spider http://localhost:${PORT:-5553}/api/health || exit 1

# Expose port
EXPOSE ${PORT:-5553}

# Start the application
CMD ["node", "dist/main"]