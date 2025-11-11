# 🚀 Guia de Deploy - IT Helpdesk System

Este guia explica como fazer o deploy do sistema IT Helpdesk no seu servidor usando Docker e PostgreSQL externo.

## 📋 Pré-requisitos

- Servidor Linux (Ubuntu/Debian recomendado)
- Docker e Docker Compose instalados
- PostgreSQL instalado e rodando (fora do Docker)
- Git instalado
- Acesso SSH ao servidor

## 🗄️ Passo 1: Preparar o Banco de Dados PostgreSQL

### 1.1. Conectar ao PostgreSQL

```bash
sudo -u postgres psql
```

### 1.2. Criar o Banco de Dados e Usuário

```sql
-- Criar usuário
CREATE USER helpdesk_user WITH PASSWORD 'sua_senha_segura_aqui';

-- Criar banco de dados
CREATE DATABASE helpdesk;

-- Conceder privilégios
GRANT ALL PRIVILEGES ON DATABASE helpdesk TO helpdesk_user;

-- Conectar ao banco
\c helpdesk

-- Conceder privilégios no schema public
GRANT ALL ON SCHEMA public TO helpdesk_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO helpdesk_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO helpdesk_user;

-- Sair
\q
```

### 1.3. Configurar PostgreSQL para Aceitar Conexões do Docker

Edite o arquivo `postgresql.conf`:

```bash
sudo nano /etc/postgresql/[VERSION]/main/postgresql.conf
```

Encontre e modifique:
```
listen_addresses = 'localhost,172.17.0.1'
```

Edite o arquivo `pg_hba.conf`:

```bash
sudo nano /etc/postgresql/[VERSION]/main/pg_hba.conf
```

Adicione a linha:
```
host    helpdesk        helpdesk_user   172.17.0.0/16   md5
```

Reinicie o PostgreSQL:
```bash
sudo systemctl restart postgresql
```

## 📦 Passo 2: Clonar o Repositório no Servidor

```bash
# Conecte ao servidor via SSH
ssh seu_usuario@seu_servidor

# Clone o repositório
git clone https://github.com/seu-usuario/seu-repositorio.git
cd seu-repositorio
```

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

### 3.1. Criar arquivo .env

```bash
cp .env.example .env
nano .env
```

### 3.2. Preencher as variáveis

```env
# Servidor
NODE_ENV=production
PORT=5000

# Banco de Dados
# Use host.docker.internal para acessar o PostgreSQL do host
DATABASE_URL=postgresql://helpdesk_user:sua_senha@host.docker.internal:5432/helpdesk
PGHOST=host.docker.internal
PGPORT=5432
PGUSER=helpdesk_user
PGPASSWORD=sua_senha
PGDATABASE=helpdesk

# Sessão (gere uma chave segura)
SESSION_SECRET=$(openssl rand -base64 32)

# Domínio da aplicação
APP_URL=https://seu-dominio.com
```

### 3.3. Gerar SESSION_SECRET seguro

```bash
openssl rand -base64 32
```

Copie o resultado e cole no arquivo `.env` na variável `SESSION_SECRET`.

## 🐳 Passo 4: Build e Deploy com Docker

### 4.1. Build da imagem

```bash
docker-compose build
```

### 4.2. Executar as migrações do banco

Antes de iniciar a aplicação, execute as migrações:

```bash
# Instalar dependências localmente (apenas para rodar migrations)
npm install

# Executar migrations
npm run db:push

# Limpar node_modules (opcional)
rm -rf node_modules
```

### 4.3. Iniciar a aplicação

```bash
docker-compose up -d
```

### 4.4. Verificar se está rodando

```bash
# Ver logs
docker-compose logs -f

# Verificar status
docker-compose ps

# Testar health check
curl http://localhost:5000/api/health
```

## 🌐 Passo 5: Configurar Nginx (Reverse Proxy)

### 5.1. Instalar Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 5.2. Criar configuração do site

```bash
sudo nano /etc/nginx/sites-available/helpdesk
```

Adicione:

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    # Redirecionar HTTP para HTTPS (após configurar SSL)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # WebSocket support
    location /ws {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

### 5.3. Ativar o site

```bash
sudo ln -s /etc/nginx/sites-available/helpdesk /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5.4. Configurar SSL com Let's Encrypt (Recomendado)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com
```

## 🔄 Comandos Úteis

### Atualizar a aplicação

```bash
# Parar containers
docker-compose down

# Atualizar código
git pull

# Rebuild
docker-compose build

# Subir novamente
docker-compose up -d
```

### Ver logs

```bash
# Logs em tempo real
docker-compose logs -f

# Últimas 100 linhas
docker-compose logs --tail=100
```

### Restart

```bash
docker-compose restart
```

### Parar

```bash
docker-compose down
```

### Entrar no container

```bash
docker-compose exec helpdesk sh
```

### Executar migrations

```bash
# Opção 1: Dentro do container
docker-compose exec helpdesk npm run db:push

# Opção 2: Localmente (requer node_modules)
npm run db:push
```

## 🔧 Troubleshooting

### Erro de conexão com PostgreSQL

1. Verifique se o PostgreSQL está rodando:
```bash
sudo systemctl status postgresql
```

2. Teste a conexão:
```bash
psql -h localhost -U helpdesk_user -d helpdesk
```

3. Verifique as configurações do `pg_hba.conf` e `postgresql.conf`

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs

# Verificar se a porta 5000 está disponível
sudo netstat -tlnp | grep 5000
```

### Erro nas migrations

```bash
# Forçar push do schema
npm run db:push -- --force
```

## 📊 Monitoramento

### Verificar saúde da aplicação

```bash
curl http://localhost:5000/api/health
```

### Verificar uso de recursos

```bash
docker stats
```

## 🔐 Segurança

1. **Firewall**: Configure o firewall para permitir apenas portas 80, 443 e 22
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

2. **Atualizações**: Mantenha o sistema atualizado
```bash
sudo apt update && sudo apt upgrade
```

3. **Backup**: Configure backup automático do banco de dados
```bash
# Criar script de backup
nano backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backup/helpdesk"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U helpdesk_user -h localhost helpdesk | gzip > $BACKUP_DIR/backup_$DATE.sql.gz
# Manter apenas últimos 7 dias
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +7 -delete
```

```bash
chmod +x backup.sh
# Adicionar ao crontab para executar diariamente
crontab -e
# Adicionar: 0 2 * * * /caminho/para/backup.sh
```

## 🎯 Checklist de Deploy

- [ ] PostgreSQL instalado e rodando
- [ ] Banco de dados e usuário criados
- [ ] Repositório clonado
- [ ] Arquivo `.env` configurado
- [ ] Migrations executadas
- [ ] Docker container rodando
- [ ] Nginx configurado
- [ ] SSL configurado
- [ ] Firewall configurado
- [ ] Backup configurado
- [ ] Teste de funcionamento completo

## 📞 Suporte

Em caso de problemas, verifique:
- Logs da aplicação: `docker-compose logs`
- Logs do Nginx: `sudo tail -f /var/log/nginx/error.log`
- Logs do PostgreSQL: `sudo tail -f /var/log/postgresql/postgresql-*.log`
