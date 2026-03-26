# Stage 1: Initial pnpm setup
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

# Stage 2: Install everything, including dev
FROM base AS dependencies
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

# Stage 3: NestJS build
FROM base AS builder
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

RUN pnpm run build

# Stage 4: Production dependencies
FROM base AS prod-deps
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile

# Stage 5: Final image, ready for production (secure and lightweight)
FROM node:24-alpine AS production

WORKDIR /usr/src/app

USER node

COPY --chown=node:node --from=prod-deps /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=builder /usr/src/app/dist ./dist

EXPOSE 7070

CMD ["node", "dist/main.js"]