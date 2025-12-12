# 🚀 Guia Passo a Passo - Deploy WhatsApp SaaS

## 📋 RESUMO: O que você vai fazer

1. **Railway** - Adicionar 2 variáveis do Supabase no backend
2. **Vercel** - Fazer upload do código e adicionar 1 variável

---

## 🔴 PARTE 1: Railway (Backend)

### Passo 1.1: Pegar as chaves do Supabase

1. Abra: https://supabase.com/dashboard/project/jjywkbaqukbexnpsdpcf/settings/api
2. Procure por **"Project URL"** e copie (já vai estar assim: `https://jjywkbaqukbexnpsdpcf.supabase.co`)
3. Procure por **"Service role"** (com ícone de chave)
4. Clique no ícone do olho para revelar
5. Copie a chave completa (começa com `eyJ...`)

### Passo 1.2: Configurar variáveis no Railway

1. Acesse: https://railway.app
2. Entre no projeto **3333-versao**
3. Clique na aba **"Variables"** (no topo)
4. Clique em **"New Variable"**
5. Adicione as variáveis:

**Variável 1:**
\`\`\`
Nome: SUPABASE_URL
Valor: https://jjywkbaqukbexnpsdpcf.supabase.co
\`\`\`

**Variável 2:**
\`\`\`
Nome: SUPABASE_SERVICE_ROLE_KEY
Valor: [cole aqui a Service Role Key que você copiou]
\`\`\`

6. O Railway vai fazer redeploy automático
7. Aguarde 1-2 minutos

### Passo 1.3: Testar o backend

1. Abra: https://3333-versao-production.up.railway.app
2. Deve aparecer: `{"message":"WhatsApp SaaS Backend API"}`
3. Se aparecer isso = **SUCESSO!** ✅

---

## 🟢 PARTE 2: Vercel (Frontend)

### Passo 2.1: Preparar o código

1. Baixe o código deste projeto (botão "Download ZIP" aqui no v0)
2. Extraia a pasta
3. Abra a pasta extraída

### Passo 2.2: Fazer deploy na Vercel

**Opção A: Via Interface da Vercel (Mais Fácil)**

1. Acesse: https://vercel.com/new
2. Clique em **"Add New Project"**
3. Arraste a pasta do projeto OU conecte via GitHub
4. A Vercel vai detectar que é Next.js automaticamente
5. **ANTES de clicar em Deploy**, vá para o próximo passo

### Passo 2.3: Adicionar variáveis de ambiente na Vercel

Na página de deploy, procure por **"Environment Variables"** e adicione:

**Variável 1:**
\`\`\`
Nome: NEXT_PUBLIC_BACKEND_URL
Valor: https://3333-versao-production.up.railway.app
\`\`\`

**Variável 2:**
\`\`\`
Nome: NEXT_PUBLIC_SUPABASE_URL
Valor: https://jjywkbaqukbexnpsdpcf.supabase.co
\`\`\`

**Variável 3:**
\`\`\`
Nome: NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: [pegue em https://supabase.com/dashboard/project/jjywkbaqukbexnpsdpcf/settings/api - campo "anon public"]
\`\`\`

**Variável 4:**
\`\`\`
Nome: SUPABASE_SERVICE_ROLE_KEY
Valor: [a mesma Service Role Key que você usou no Railway]
\`\`\`

> **IMPORTANTE:** Você já configurou essas variáveis no v0, então pode copiá-las da seção "Vars" aqui no v0!

### Passo 2.4: Finalizar o deploy

1. Clique em **"Deploy"**
2. Aguarde 2-3 minutos (a Vercel vai fazer o build)
3. Quando terminar, você receberá uma URL tipo: `https://seu-projeto.vercel.app`

### Passo 2.5: Testar o frontend

1. Abra a URL da Vercel que você recebeu
2. Deve aparecer a tela de login
3. Tente criar uma conta para testar
4. Se conseguir criar conta = **SUCESSO!** ✅

---

## 📝 CHECKLIST FINAL

### Railway ✓
- [ ] Adicionei `SUPABASE_URL`
- [ ] Adicionei `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Testei a URL e apareceu a mensagem JSON

### Vercel ✓
- [ ] Fiz upload do código
- [ ] Adicionei `NEXT_PUBLIC_BACKEND_URL`
- [ ] Adicionei `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Adicionei `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Adicionei `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Deploy concluído com sucesso
- [ ] Testei a página de login

---

## 🆘 PROBLEMAS COMUNS

### Railway mostra "Internal Server Error"
- ✓ Verifique se as variáveis estão corretas (sem espaços)
- ✓ Aguarde 2 minutos e teste novamente
- ✓ Clique em "Redeploy" manualmente no Railway

### Vercel: Build falhou
- ✓ Verifique se todas as 4 variáveis estão adicionadas
- ✓ Verifique se não tem erros de digitação

### Frontend não conecta no backend
- ✓ Verifique se `NEXT_PUBLIC_BACKEND_URL` está correta
- ✓ Certifique-se que o backend está funcionando (teste a URL)

### Erro de autenticação no Supabase
- ✓ Verifique se a `SUPABASE_SERVICE_ROLE_KEY` está correta
- ✓ Verifique se a `NEXT_PUBLIC_SUPABASE_ANON_KEY` está correta

---

## 🎯 PRÓXIMOS PASSOS

Depois que tudo estiver funcionando:

1. Execute os scripts SQL no Supabase (pasta `scripts/`)
2. Configure um domínio customizado na Vercel (opcional)
3. Teste criar uma instância WhatsApp
4. Conecte via QR Code

**Pronto!** Seu WhatsApp SaaS está no ar! 🎉
