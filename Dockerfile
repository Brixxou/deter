# ===========================================
# DETER - Fitness Social App
# Multi-stage Docker build
# ===========================================

# Stage 1: Dependencies
FROM node:22-alpine AS deps
WORKDIR /app

# Install dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --only=production=false

# Stage 2: Builder
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment variables
ARG PUBLIC_SUPABASE_URL
ARG PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ARG STRAVA_CLIENT_ID
ARG STRAVA_CLIENT_SECRET

# Set environment variables for build
ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL
ENV PUBLIC_SUPABASE_ANON_KEY=$PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY
ENV STRAVA_CLIENT_ID=$STRAVA_CLIENT_ID
ENV STRAVA_CLIENT_SECRET=$STRAVA_CLIENT_SECRET
ENV DOCKER_BUILD=true

# Build the application
RUN npm run build

# Stage 3: Runner
FROM node:22-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltekit

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Copy built application
COPY --from=builder --chown=sveltekit:nodejs /app/build ./build
COPY --from=builder --chown=sveltekit:nodejs /app/package.json ./

# Install production dependencies only
RUN npm install --only=production

# Switch to non-root user
USER sveltekit

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the application
CMD ["node", "build"]
