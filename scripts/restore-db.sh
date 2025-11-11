#!/bin/bash

# Script de Restauração do Banco de Dados PostgreSQL
# Para usar: chmod +x scripts/restore-db.sh && ./scripts/restore-db.sh <arquivo_backup>

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Restauração do Banco de Dados Helpdesk ===${NC}\n"

# Verificar se arquivo de backup foi fornecido
if [ -z "$1" ]; then
    echo -e "${RED}✗${NC} Nenhum arquivo de backup especificado!"
    echo ""
    echo "Uso: ./scripts/restore-db.sh <arquivo_backup>"
    echo ""
    echo "Backups disponíveis:"
    ls -lh ./backups/helpdesk_backup_*.sql.gz 2>/dev/null || echo "  Nenhum backup encontrado"
    exit 1
fi

BACKUP_FILE="$1"

# Verificar se arquivo existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}✗${NC} Arquivo de backup não encontrado: $BACKUP_FILE"
    exit 1
fi

# Carregar variáveis de ambiente
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
    echo -e "${GREEN}✓${NC} Variáveis de ambiente carregadas"
else
    echo -e "${RED}✗${NC} Arquivo .env não encontrado!"
    exit 1
fi

# Verificar variáveis
if [ -z "$PGDATABASE" ] || [ -z "$PGUSER" ] || [ -z "$PGHOST" ]; then
    echo -e "${RED}✗${NC} Variáveis de ambiente do PostgreSQL não configuradas!"
    exit 1
fi

# Confirmação
echo -e "\n${RED}ATENÇÃO:${NC} Esta operação irá ${RED}SOBRESCREVER${NC} todos os dados do banco!"
echo "Database: $PGDATABASE"
echo "Host: $PGHOST"
echo "Arquivo: $BACKUP_FILE"
echo ""
read -p "Deseja continuar? (digite 'sim' para confirmar): " CONFIRM

if [ "$CONFIRM" != "sim" ]; then
    echo -e "\n${YELLOW}Restauração cancelada.${NC}"
    exit 0
fi

# Fazer backup atual antes de restaurar
echo -e "\n${YELLOW}Criando backup de segurança antes da restauração...${NC}"
./scripts/backup-db.sh

# Restaurar
echo -e "\n${YELLOW}Iniciando restauração...${NC}"

gunzip -c "$BACKUP_FILE" | PGPASSWORD=$PGPASSWORD psql \
    -h $PGHOST \
    -p ${PGPORT:-5432} \
    -U $PGUSER \
    -d $PGDATABASE \
    -q

# Verificar resultado
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓${NC} Restauração concluída com sucesso!"
    echo -e "\n${GREEN}=== Banco de dados restaurado! ===${NC}"
else
    echo -e "\n${RED}✗${NC} Erro durante a restauração!"
    echo "Verifique os logs acima para mais detalhes."
    exit 1
fi
