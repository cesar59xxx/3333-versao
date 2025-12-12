# 🔑 VARIÁVEIS - GUIA DEFINITIVO

## 📍 Resumo Rápido

Você precisa configurar variáveis em **2 lugares**:
1. **Railway** (Backend) - 4 variáveis ⚠️ **INCLUI FRONTEND_URL!**
2. **Vercel** (Frontend) - 1 variável

**NÃO precisa configurar nada no Supabase!** As tabelas já existem.

---

## 🚨 ATENÇÃO: ERRO DE CORS

Se você está vendo este erro no console:
\`\`\`
Access to fetch has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present
\`\`\`

**CAUSA:** A variável `FRONTEND_URL` está faltando no Railway!

O backend precisa saber qual é o domínio do frontend para permitir requisições. Sem isso, o navegador bloqueia tudo por segurança.

---

## 🚂 PARTE 1: Railway (Backend)

### Onde fazer:
1. Acesse: https://railway.app
2. Clique no seu projeto `3333-versao-production`
3. Clique na aba **"Variables"**

### ⚠️ Adicione estas 4 VARIÁVEIS (NÃO 3!):

\`\`\`bash
SUPABASE_URL=https://jjywkbaqukbexnpsdpcf.supabase.co

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqeXdrYmFxdWtiZXhucHNkcGNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzk3MTc0NSwiZXhwIjoyMDQ5NTQ3NzQ1fQ.c5k-MXMXomh3I4hC_wGeLNdSBOdlTUITvdmw4J12Qi0

FRONTEND_URL=https://3333-versao.vercel.app

NODE_ENV=production
\`\`\`

### 🔥 MUITO IMPORTANTE:
- A variável `FRONTEND_URL` é **OBRIGATÓRIA** para o CORS funcionar
- Deve ser **exatamente** o domínio da sua Vercel (sem barra no final)
- Sem ela, o backend bloqueia todas as requisições do frontend
- Após adicionar as variáveis, clique em **"Deploy"** → **"Redeploy"** no Railway

---

## ▲ PARTE 2: Vercel (Frontend)

### Onde fazer:
1. Acesse: https://vercel.com/dashboard
2. Clique no projeto `3333-versao`
3. Vá em **Settings** → **Environment Variables**

### ⚠️ Adicione ou CORRIJA esta variável:

\`\`\`bash
Name: NEXT_PUBLIC_BACKEND_URL
Value: https://3333-versao-production.up.railway.app
\`\`\`

### 🔥 ATENÇÃO - Erros comuns:

❌ **ERRADO:**
\`\`\`
3333-versao-production.up.railway.app  (falta https://)
https://3333-versao-production.up.railway.app/  (tem barra no final)
\`\`\`

✅ **CERTO:**
\`\`\`
https://3333-versao-production.up.railway.app
\`\`\`

### Como adicionar/corrigir:
1. Se já existe a variável, clique nos **3 pontinhos** → **"Edit"**
2. Se não existe, clique em **"Add New"** → **"Environment Variable"**
3. Coloque exatamente como mostrado acima
4. Selecione **"Production"**, **"Preview"**, **"Development"**
5. Clique em **"Save"**
6. Vá em **"Deployments"** → clique nos **3 pontinhos** no último deploy → **"Redeploy"**

---

## 🗄️ PARTE 3: Supabase

### ✅ Você NÃO precisa fazer NADA no Supabase!

As tabelas já foram criadas pelos scripts SQL. As variáveis de ambiente do Supabase já estão configuradas automaticamente no v0.

---

## 📋 Checklist Final - SIGA ESTA ORDEM

### Passo 1: Railway
- [ ] Adicionei `SUPABASE_URL` no Railway
- [ ] Adicionei `SUPABASE_SERVICE_ROLE_KEY` no Railway
- [ ] Adicionei `FRONTEND_URL` no Railway (https://3333-versao.vercel.app)
- [ ] Adicionei `NODE_ENV` no Railway (production)
- [ ] Total de 4 variáveis no Railway
- [ ] Fiz **Redeploy** no Railway
- [ ] Esperei 2 minutos para o deploy terminar

### Passo 2: Vercel
- [ ] Adicionei/corrigi `NEXT_PUBLIC_BACKEND_URL` na Vercel
- [ ] O valor começa com `https://`
- [ ] O valor NÃO tem barra `/` no final
- [ ] Fiz **Redeploy** na Vercel
- [ ] Esperei 2 minutos para o deploy terminar

---

## 🧪 Como Testar (NA ORDEM)

### 1. Teste o Backend (Railway):
Abra no navegador: `https://3333-versao-production.up.railway.app/health`

**✅ Deve mostrar:** `{"status":"ok"}`

**❌ Se mostrar "Internal Server Error":**
- As variáveis do Railway não estão corretas
- Volte na PARTE 1 e confira

### 2. Teste o Frontend (Vercel):
Abra: `https://3333-versao.vercel.app/instances`

Faça login e tente criar uma instância.

**✅ Deve funcionar sem erros!**

**❌ Se ainda der erro de CORS:**
- Confira se `FRONTEND_URL` no Railway está correta
- Confira se fez Redeploy no Railway
- Aguarde mais 2 minutos (o Railway demora para atualizar)

---

## 🚨 Problemas Comuns e Soluções

### 🔴 Erro: "Internal Server Error" no Railway
**Sintoma:** Acessar `/health` mostra erro
**Causa:** Variáveis não configuradas no Railway
**Solução:** 
1. Confira se tem 4 variáveis (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FRONTEND_URL, NODE_ENV)
2. Faça Redeploy
3. Aguarde 2 minutos

### 🔴 Erro: "Failed to fetch" no Frontend
**Sintoma:** Console mostra `net::ERR_FAILED`
**Causa:** Vercel não sabe onde está o backend
**Solução:** 
1. Adicione `NEXT_PUBLIC_BACKEND_URL` com `https://` no início
2. Faça Redeploy na Vercel
3. Limpe o cache do navegador (Ctrl+Shift+R)

### 🔴 Erro: "blocked by CORS policy" 
**Sintoma:** Console mostra `No 'Access-Control-Allow-Origin' header`
**Causa:** `FRONTEND_URL` no Railway está errada ou faltando
**Solução:** 
1. Vá no Railway → Variables
2. Confira se tem `FRONTEND_URL=https://3333-versao.vercel.app`
3. **SEM barra no final!**
4. Faça Redeploy no Railway
5. Aguarde 3-5 minutos para propagar

### 🔴 Erro: "Unknown error" ao criar instância
**Sintoma:** Modal mostra "Failed to fetch"
**Causa:** Backend não está respondendo corretamente
**Solução:** 
1. Teste `/health` primeiro
2. Veja os logs do Railway (Deploy Logs)
3. Procure por erros relacionados ao Supabase

---

## 🎯 Variáveis Completas (Copy/Paste)

### 🚂 Railway - 4 variáveis:
\`\`\`env
SUPABASE_URL=https://jjywkbaqukbexnpsdpcf.supabase.co

SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqeXdrYmFxdWtiZXhucHNkcGNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzk3MTc0NSwiZXhwIjoyMDQ5NTQ3NzQ1fQ.c5k-MXMXomh3I4hC_wGeLNdSBOdlTUITvdmw4J12Qi0

FRONTEND_URL=https://3333-versao.vercel.app

NODE_ENV=production
\`\`\`

### ▲ Vercel - 1 variável:
\`\`\`env
NEXT_PUBLIC_BACKEND_URL=https://3333-versao-production.up.railway.app
\`\`\`

### 🗄️ Supabase:
\`\`\`
✅ Nada! Já está tudo configurado automaticamente.
\`\`\`

---

## 💡 Resumo Visual

\`\`\`
┌─────────────────────────────────────────────┐
│  1. RAILWAY (Backend)                       │
│  ✓ SUPABASE_URL                            │
│  ✓ SUPABASE_SERVICE_ROLE_KEY               │
│  ✓ FRONTEND_URL ← IMPORTANTE PARA CORS!    │
│  ✓ NODE_ENV                                │
│  → Redeploy                                 │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  2. VERCEL (Frontend)                       │
│  ✓ NEXT_PUBLIC_BACKEND_URL                 │
│  → Redeploy                                 │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│  3. TESTE                                   │
│  ✓ /health retorna {"status":"ok"}         │
│  ✓ /instances carrega sem erro CORS        │
│  ✓ Criar instância funciona                │
└─────────────────────────────────────────────┘
\`\`\`

---

## 🎓 Entenda o que está acontecendo

**Por que preciso de FRONTEND_URL no Railway?**

O navegador tem uma proteção de segurança chamada CORS (Cross-Origin Resource Sharing). Quando o frontend (Vercel) tenta falar com o backend (Railway), o navegador pergunta:

- Browser: "Ei backend, o site `https://3333-versao.vercel.app` pode fazer requisições para você?"
- Backend: "Deixa eu ver minhas configurações... Se `FRONTEND_URL` estiver configurado com esse domínio, sim!"

Se `FRONTEND_URL` não existir ou estiver errado, o backend responde "não", e o navegador bloqueia tudo.

**Por que preciso de NEXT_PUBLIC_BACKEND_URL na Vercel?**

O frontend precisa saber onde o backend está. Sem essa variável, ele tenta conectar em `localhost:3001` (sua máquina local), que obviamente não funciona quando deployado.

---

## 📞 Ainda com problemas?

Se depois de seguir TUDO isso ainda não funcionar:

1. Tire um print das variáveis do Railway (pode esconder as chaves sensíveis)
2. Tire um print das variáveis da Vercel
3. Tire um print do erro no console (F12)
4. Me mostre e eu te ajudo!
