# ==========================================
# Estágio 1: Build (Compilação do TypeScript)
# ==========================================
FROM node:26-alpine AS builder

# O motor do Prisma depende do OpenSSL, ausente na imagem Alpine
RUN apk add --no-cache openssl

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

# Gera o Prisma Client antes da compilação, para o tsc conhecer os tipos dos models
RUN npx prisma generate
RUN npm run build

# ==========================================
# Estágio 2: Runner (Ambiente de Execução)
# ==========================================
FROM node:26-alpine AS runner

RUN apk add --no-cache openssl

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./
# Schema e migrations, necessários para o generate e o migrate deploy
COPY prisma ./prisma

RUN npm ci --omit=dev
RUN npx prisma generate

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3333

CMD ["node", "dist/main/server.js"]