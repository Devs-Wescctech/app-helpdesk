# Dockerfile para IT Helpdesk System
# Multi-stage build para otimizar o tamanho da imagem

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Build do frontend e backend
RUN npm run build

# Copiar arquivo static.ts compilado manualmente para dist
RUN npx esbuild server/static.ts --platform=node --packages=external --bundle=false --format=esm --outdir=dist

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copiar apenas os arquivos necessários do builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && \
    npm cache clean --force

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 5000

# Variáveis de ambiente padrão
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]
