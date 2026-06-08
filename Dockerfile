# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache libc6-compat

# Salin package.json dan package-lock.json
COPY package*.json ./
COPY prisma ./prisma/
COPY codegen.yml ./
COPY schema.graphql ./

# Install dependencies (termasuk devDependencies untuk build)
RUN npm install

# Salin sisa source code
COPY . .

# Generate GraphQL types, Prisma client, dan compile TypeScript
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS runner

# Set environment variables
ENV NODE_ENV=production

WORKDIR /app

# Salin package.json
COPY package*.json ./
COPY prisma ./prisma/
COPY schema.graphql ./

# Install only production dependencies
RUN npm install --omit=dev

# Salin hasil build dari builder stage
COPY --from=builder /app/dist ./dist
# Prisma client seringkali digenerate ke node_modules/.prisma atau lokasi custom
# Sesuai src/index.ts baris 8: import { PrismaClient } from "../prisma/generated/client.js";
COPY --from=builder /app/prisma/generated ./prisma/generated

# Expose port (Apollo Server standalone default port is 4000)
EXPOSE 4000

# Jalankan aplikasi
CMD ["node", "dist/index.js"]
