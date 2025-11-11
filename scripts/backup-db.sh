#!/bin/bash

# Script de Backup do Banco de Dados PostgreSQL
# Para usar: chmod +x scripts/backup-db.sh && ./scripts/backup-db.sh

# Configurações
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/helpdesk_backup_$DATE.sql.gz"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Backup do Banco de Dados Helpdesk ===${NC}\n"

# Carregar variáveis de ambiente
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✓${NC} Variáveis de ambiente carregadas"
else
    echo -e "${RED}✗${NC} Arquivo .env não encontrado!"
    exit 1
fi

# Criar diretório de backup se não existir
mkdir -p "$BACKUP_DIR"
echo -e "${GREEN}✓${NC} Diretório de backup: $BACKUP_DIR"

# Verificar se as variáveis estão definidas
if [ -z "$PGDATABASE" ] || [ -z "$PGUSER" ] || [ -z "$PGHOST" ]; then
    echo -e "${RED}✗${NC} Variáveis de ambiente do PostgreSQL não configuradas!"
    echo "   Certifique-se de que PGDATABASE, PGUSER e PGHOST estão definidas no .env"
    exit 1
fi

# Fazer backup
echo -e "\n${YELLOW}Iniciando backup...${NC}"
echo "Database: $PGDATABASE"
echo "Host: $PGHOST"
echo "User: $PGUSER"

PGPASSWORD=$PGPASSWORD pg_dump \
    -h $PGHOST \
    -p ${PGPORT:-5432} \
    -U $PGUSER \
    -d $PGDATABASE \
    --no-owner \
    --no-acl \
    | gzip > "$BACKUP_FILE"

# Verificar se backup foi bem sucedido
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo -e "\n${GREEN}✓${NC} Backup criado com sucesso!"
    echo "   Arquivo: $BACKUP_FILE"
    echo "   Tamanho: $BACKUP_SIZE"
    
    # Limpar backups antigos (manter últimos 7 dias)
    echo -e "\n${YELLOW}Limpando backups antigos (>7 dias)...${NC}"
    find "$BACKUP_DIR" -name "helpdesk_backup_*.sql.gz" -mtime +7 -delete
    
    BACKUP_COUNT=$(ls -1 "$BACKUP_DIR"/helpdesk_backup_*.sql.gz 2>/dev/null | wc -l)
    echo -e "${GREEN}✓${NC} Total de backups mantidos: $BACKUP_COUNT"
    
    echo -e "\n${GREEN}=== Backup concluído com sucesso! ===${NC}"
else
    echo -e "\n${RED}✗${NC} Erro ao criar backup!"
    exit 1
fi
