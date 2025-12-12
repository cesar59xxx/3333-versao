# WhatsApp SaaS Backend

Backend API for WhatsApp SaaS built with Node.js, Express, and whatsapp-web.js.

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Copy `.env.example` to `.env` and fill in your values:
\`\`\`bash
cp .env.example .env
\`\`\`

3. Run in development:
\`\`\`bash
npm run dev
\`\`\`

4. Build for production:
\`\`\`bash
npm run build
npm start
\`\`\`

## Deploy to Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add environment variables in Railway dashboard
4. Railway will automatically detect and deploy the Node.js application

## API Endpoints

### Authentication
All endpoints (except webhooks) require Bearer token in Authorization header.

### Instances
- `POST /api/instances` - Create new WhatsApp instance
- `POST /api/instances/:id/start` - Start instance and generate QR
- `GET /api/instances` - List all instances
- `GET /api/instances/:id/status` - Get instance status
- `GET /api/instances/:id/contacts` - Get instance contacts

### Messages
- `GET /api/instances/:instanceId/chats/:contactId/messages` - Get chat messages
- `POST /api/instances/:instanceId/messages` - Send message

### Dashboard
- `GET /api/dashboard?projectId=xxx` - Get daily metrics

### Webhooks
- `POST /api/webhooks/sales` - Record sales event

## Socket.IO Events

### Emitted by server:
- `qr` - QR code generated
- `instance_status` - Instance status changed
- `message_received` - New message received

## Architecture

\`\`\`
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── whatsapp/       # WhatsApp client management
│   ├── routes/         # API routes
│   ├── middleware/     # Express middleware
│   └── server.ts       # Main server file
├── package.json
└── tsconfig.json
