# =============================================================================
# Stage 1: Builder
# Используется для production сборки приложения
# =============================================================================
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm ci

# Копирование исходного кода и сборка
COPY . .

# Генерация Prisma клиента
RUN npx prisma generate

# Production сборка Next.js
RUN npm run build

# =============================================================================
# Stage 2: Development
# Используется для локальной разработки с hot reload
# Запуск: docker-compose -f docker-compose.dev.yml up
# =============================================================================
FROM builder AS dev

ENV NODE_ENV=development

# Установка Prisma для миграций в dev режиме
RUN npm install -D prisma

EXPOSE 3000

# Запуск Next.js в режиме разработки
CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

# =============================================================================
# Stage 3: Runner (Production)
# Оптимизированный образ для production
# Запуск: docker-compose up
# =============================================================================
FROM node:20-bookworm-slim AS runner

WORKDIR /app

ENV NODE_ENV=production

# Установка production зависимостей
COPY package*.json ./
RUN npm ci --omit=dev

# Установка OpenSSL для работы Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Копирование артефактов сборки из builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/lib/generated ./lib/generated
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000

# Применение миграций, seed данных (опционально) и запуск приложения
CMD ["sh", "-c", "npx prisma migrate deploy && if [ \"$RUN_SEED_ON_START\" = \"true\" ]; then npx tsx prisma/seed.ts; fi && npm run start"]