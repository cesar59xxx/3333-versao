# 🔧 Como Adicionar a Variável NEXT_PUBLIC_BACKEND_URL na Vercel

## ⚠️ PROBLEMA: "Failed to fetch"

Você está vendo esse erro porque o frontend não sabe onde o backend está!

O frontend está tentando conectar em `localhost:3001` (seu computador) mas o backend está no Railway.

## ✅ SOLUÇÃO: Configurar a variável de ambiente

### Passo 1: Entre no seu projeto na Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique no seu projeto **3333-versao**

### Passo 2: Vá em Settings

1. Clique na aba **Settings** (no topo)
2. No menu lateral esquerdo, clique em **Environment Variables**

### Passo 3: Adicione a variável

Clique no botão **Add New** e preencha:

\`\`\`
Name: NEXT_PUBLIC_BACKEND_URL
Value: https://3333-versao-production.up.railway.app
Environment: Production, Preview, Development (marque todos)
\`\`\`

**IMPORTANTE:** Cole exatamente essa URL sem barra `/` no final:
\`\`\`
https://3333-versao-production.up.railway.app
\`\`\`

### Passo 4: Salve e faça Redeploy

1. Clique em **Save**
2. Vá na aba **Deployments**
3. Clique nos 3 pontinhos `...` do último deployment
4. Clique em **Redeploy**
5. Confirme clicando em **Redeploy**

### Passo 5: Aguarde o deploy terminar (1-2 minutos)

Quando terminar, o site vai recarregar e TUDO vai funcionar! ✅

---

## 🎯 Resumo Visual

\`\`\`
Vercel Dashboard
  └─ Seu Projeto (3333-versao)
     └─ Settings
        └─ Environment Variables
           └─ Add New
              ├─ Name: NEXT_PUBLIC_BACKEND_URL
              ├─ Value: https://3333-versao-production.up.railway.app
              └─ Environment: ✓ Production ✓ Preview ✓ Development
\`\`\`

---

## ❓ Dúvidas Comuns

**P: Preciso adicionar outras variáveis?**
R: NÃO! As variáveis do Supabase já foram copiadas automaticamente quando você fez o deploy pela primeira vez.

**P: Como sei se funcionou?**
R: Depois do redeploy, clique em "Nova instância" novamente. Se não aparecer "Failed to fetch", funcionou!

**P: E se ainda der erro?**
R: Verifique se o backend no Railway está rodando:
- Acesse: https://3333-versao-production.up.railway.app
- Você deve ver: `{"message":"WhatsApp SaaS Backend API"}`
- Se der erro, volte no guia de deploy do Railway

---

## 📸 Onde encontrar cada coisa

### Na Vercel:
1. **Dashboard**: https://vercel.com/dashboard
2. **Settings do projeto**: Clique no projeto → Settings (aba no topo)
3. **Environment Variables**: Menu lateral esquerdo

### No Railway:
1. **Dashboard**: https://railway.app/dashboard
2. **URL do backend**: Na página do projeto, na aba "Settings" → "Domains"
