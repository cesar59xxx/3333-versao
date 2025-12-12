# PROBLEMA: Railway está rodando Next.js em vez do Backend Express

O Railway está executando `next start` (frontend) em vez do servidor Express (backend).

Você precisa criar um novo deploy APENAS da pasta `/backend`.

---

## OPÇÃO 1: Criar novo projeto no Railway (RECOMENDADO)

### Passo 1: Baixar a pasta backend

1. No v0, clique nos 3 pontinhos no canto superior direito
2. Clique em "Download ZIP"
3. Extraia o ZIP
4. Você vai ter uma pasta `backend` dentro

### Passo 2: Criar repositório separado no GitHub

1. Vá em https://github.com/new
2. Nome: `whatsapp-backend`
3. Clique em "Create repository"
4. No seu computador, abra a pasta `backend` extraída
5. Execute esses comandos:

\`\`\`bash
cd backend
git init
git add .
git commit -m "Backend Express"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/whatsapp-backend.git
git push -u origin main
\`\`\`

### Passo 3: Criar NOVO projeto no Railway

1. Vá em https://railway.app/new
2. Clique em "Deploy from GitHub repo"
3. Selecione o repositório `whatsapp-backend`
4. Aguarde o deploy

### Passo 4: Adicionar variáveis no NOVO projeto

No Railway, vá em Variables e adicione:

| Variável | Valor |
|----------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `3001` |
| `SUPABASE_URL` | `https://jjywkbaqukbexnpsdpcf.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | (sua chave do Supabase) |
| `FRONTEND_URL` | `https://3333-versao.vercel.app` |

### Passo 5: Pegar a nova URL do Railway

Após o deploy, você terá uma nova URL tipo:
\`\`\`
https://whatsapp-backend-production.up.railway.app
\`\`\`

### Passo 6: Atualizar a Vercel

Na Vercel, mude a variável `NEXT_PUBLIC_BACKEND_URL` para a nova URL do Railway.

---

## OPÇÃO 2: Usar o projeto atual (mais complexo)

### Configurar Root Directory no Railway

1. No Railway, vá em **Settings**
2. Procure por **Root Directory**
3. Mude de `/` para `/backend`
4. Clique em **Redeploy**

Isso fará o Railway rodar apenas a pasta backend.

---

## COMO SABER SE FUNCIONOU

Acesse no navegador:
\`\`\`
https://SUA-URL-RAILWAY.up.railway.app/health
\`\`\`

Se aparecer `{"status":"ok"}`, o backend Express está rodando!

Se aparecer uma página HTML ou erro, ainda está rodando Next.js.

---

## RESUMO DO PROBLEMA

\`\`\`
❌ ERRADO (atual):
   Railway → roda Next.js (frontend)
   Vercel → roda Next.js (frontend)
   Resultado: 2 frontends, nenhum backend!

✅ CORRETO:
   Railway → roda Express (backend) - pasta /backend
   Vercel → roda Next.js (frontend)
   Resultado: frontend se comunica com backend!
