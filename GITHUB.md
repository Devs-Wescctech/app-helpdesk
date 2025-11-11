# 📤 Guia de Export para GitHub

Este guia explica como exportar o código do Replit para o GitHub.

## Método 1: Usando Git do Replit (Recomendado)

### 1. Criar repositório no GitHub

1. Acesse [GitHub](https://github.com) e faça login
2. Clique em **New Repository**
3. Nome: `helpdesk-system` (ou o nome que preferir)
4. Descrição: "Sistema completo de Helpdesk para TI"
5. Escolha **Private** ou **Public**
6. **NÃO marque** "Initialize with README"
7. Clique em **Create repository**

### 2. Configurar Git no Replit

No Shell do Replit, execute:

```bash
# Verificar se já tem git inicializado
git status

# Se não tiver, inicializar
git init

# Configurar seu nome e email
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"
```

### 3. Adicionar todos os arquivos

```bash
# Verificar arquivos que serão commitados
git status

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit: IT Helpdesk System"
```

### 4. Conectar ao repositório GitHub

```bash
# Adicionar remote (substitua SEU-USUARIO e SEU-REPOSITORIO)
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git

# Verificar se foi adicionado
git remote -v
```

### 5. Fazer push para o GitHub

```bash
# Push do código
git push -u origin main

# Se der erro de "main" não existe, tente:
git branch -M main
git push -u origin main
```

Se pedir autenticação:
- Username: seu username do GitHub
- Password: use um **Personal Access Token** (não sua senha)

#### Como criar Personal Access Token:
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → Generate new token (classic)
3. Nome: "Replit Helpdesk Deploy"
4. Marque: `repo` (Full control of private repositories)
5. Generate token
6. **COPIE O TOKEN** (você não verá de novo!)
7. Use este token como senha ao fazer push

## Método 2: Download e Upload Manual

### 1. Download do Replit

No Replit:
1. Clique nos três pontos (⋮) ao lado do nome do projeto
2. Clique em **Download as zip**
3. Extraia o arquivo ZIP no seu computador

### 2. Limpar arquivos desnecessários

Antes de fazer upload, delete:
- Pasta `node_modules/`
- Pasta `dist/`
- Arquivo `.env` (mantenha apenas `.env.example`)
- Arquivos `.replit` e `replit.nix`

### 3. Upload para GitHub

1. Crie o repositório no GitHub (veja passo 1 do Método 1)
2. Na página do repositório, clique em **uploading an existing file**
3. Arraste todos os arquivos (exceto os listados acima)
4. Commit: "Initial commit: IT Helpdesk System"
5. Clique em **Commit changes**

## Método 3: Usando GitHub CLI

Se você tem GitHub CLI instalado:

```bash
# Login no GitHub
gh auth login

# Criar repositório
gh repo create helpdesk-system --private --source=. --remote=origin

# Push do código
git add .
git commit -m "Initial commit: IT Helpdesk System"
git push -u origin main
```

## 🔐 Verificação de Segurança

Antes de fazer push, **CERTIFIQUE-SE** de que:

✅ O arquivo `.env` está no `.gitignore`
✅ Não existem senhas ou tokens no código
✅ O arquivo `.env.example` está sem valores reais
✅ Nenhum arquivo de configuração pessoal será enviado

Execute para verificar:
```bash
# Ver o que será commitado
git status

# Ver diferenças
git diff
```

## 📦 Estrutura que será enviada

```
helpdesk-system/
├── client/              # Frontend React
├── server/              # Backend Express
├── shared/              # Tipos compartilhados
├── Dockerfile           # Configuração Docker
├── docker-compose.yml   # Orquestração Docker
├── .dockerignore        # Arquivos ignorados no build
├── .gitignore           # Arquivos ignorados no Git
├── .env.example         # Template de variáveis de ambiente
├── package.json         # Dependências npm
├── tsconfig.json        # Configuração TypeScript
├── vite.config.ts       # Configuração Vite
├── tailwind.config.ts   # Configuração Tailwind
├── drizzle.config.ts    # Configuração Drizzle ORM
├── README.md            # Documentação principal
├── DEPLOY.md            # Guia de deployment
└── GITHUB.md            # Este arquivo
```

## 🔄 Atualizações Futuras

Após o primeiro push, para enviar alterações:

```bash
# Adicionar alterações
git add .

# Commit com mensagem descritiva
git commit -m "Descrição das alterações"

# Push para GitHub
git push
```

## ⚠️ Problemas Comuns

### "Authentication failed"
- Use Personal Access Token em vez de senha
- Verifique se o token tem permissão `repo`

### "Remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
```

### "Failed to push some refs"
```bash
git pull origin main --rebase
git push origin main
```

### Arquivos grandes (node_modules, dist)
- Certifique-se de que estão no `.gitignore`
- Se já foram adicionados:
```bash
git rm -r --cached node_modules dist
git commit -m "Remove large files"
```

## ✅ Checklist Final

Antes de compartilhar o repositório:

- [ ] Código no GitHub
- [ ] README.md completo
- [ ] DEPLOY.md com instruções
- [ ] .env.example documentado
- [ ] Sem credenciais no código
- [ ] .gitignore configurado
- [ ] Documentação atualizada
- [ ] Licença adicionada (opcional)

## 🎯 Próximos Passos

Após o código estar no GitHub:

1. ✅ Configure GitHub Actions para CI/CD (opcional)
2. ✅ Adicione badges no README
3. ✅ Configure branch protection
4. ✅ Faça deploy no seu servidor seguindo [DEPLOY.md](DEPLOY.md)

---

**Dúvidas?** Consulte a [documentação do Git](https://git-scm.com/doc) ou [GitHub Docs](https://docs.github.com).
