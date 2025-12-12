# ARQUIVOS EXATOS PARA O GITHUB

O seu repositório `back-novamente` no GitHub deve ter EXATAMENTE estes arquivos:

## Estrutura de Pastas:
\`\`\`
back-novamente/
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   └── supabase.ts
│   ├── whatsapp/
│   │   ├── clientManager.ts
│   │   └── sessionStore.ts
│   ├── routes/
│   │   ├── instances.ts
│   │   ├── messages.ts
│   │   ├── dashboard.ts
│   │   └── webhooks.ts
│   ├── middleware/
│   │   └── auth.ts
│   └── server.ts
├── package.json
├── tsconfig.json
├── railway.toml
└── Procfile
\`\`\`

---

## 1. package.json (COPIE EXATAMENTE ISSO)

\`\`\`json
{
  "name": "whatsapp-saas-backend",
  "version": "1.0.0",
  "main": "dist/server.js",
  "engines": {
    "node": ">=18.0.0"
  },
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "postinstall": "npm run build"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@whiskeysockets/baileys": "^6.7.16",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "socket.io": "^4.6.1",
    "qrcode": "^1.5.3",
    "pino": "^8.17.2",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.5",
    "@types/qrcode": "^1.5.5",
    "typescript": "^5.3.3"
  }
}
\`\`\`

---

## 2. railway.toml (COPIE EXATAMENTE ISSO)

\`\`\`toml
[build]
builder = "nixpacks"

[deploy]
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
\`\`\`

**IMPORTANTE:** NÃO pode ter `aptPkgs` nem `chromium` neste arquivo!

---

## 3. tsconfig.json (COPIE EXATAMENTE ISSO)

\`\`\`json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
\`\`\`

---

## 4. Procfile (COPIE EXATAMENTE ISSO)

\`\`\`
web: npm start
\`\`\`

---

## COMO ATUALIZAR NO GITHUB:

### Opção A - Pelo Site do GitHub (Mais Fácil):
1. Vá em https://github.com/cesar59xxx/back-novamente
2. Clique em cada arquivo (package.json, railway.toml, tsconfig.json)
3. Clique no ícone de lápis (Edit)
4. DELETE TODO o conteúdo
5. COLE o conteúdo novo deste guia
6. Clique em "Commit changes"

### Opção B - Delete e Recrie o Repositório:
1. Delete o repositório `back-novamente`
2. Crie um novo repositório com o mesmo nome
3. Faça upload de TODOS os arquivos da pasta `backend/` do v0

---

## ARQUIVOS QUE NÃO DEVEM EXISTIR:
- ❌ Dockerfile
- ❌ nixpacks.json
- ❌ .npmrc
- ❌ .node-version

Se algum desses arquivos existir, DELETE!

---

## DEPOIS DE ATUALIZAR:
1. Vá no Railway
2. Clique em "Redeploy"
3. O build deve levar apenas 2-3 minutos (sem Chromium!)
