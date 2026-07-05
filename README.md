# GitHub Automation Bot

A full-stack GitHub Automation platform that allows users to connect their GitHub repositories, configure custom automation rules, receive Slack notifications, and monitor all automation events through a dashboard.

The application uses GitHub OAuth for authentication, GitHub Webhooks for real-time events, Slack Incoming Webhooks for notifications, Prisma ORM with PostgreSQL (Neon), and Next.js + Express.js for the frontend and backend.

---

## Features

### Authentication
- GitHub OAuth Login
- Secure session-based authentication
- Protected dashboard and repository pages

### Repository Management
- Connect GitHub repositories
- Disconnect repositories
- Automatically create GitHub webhooks
- Automatically remove GitHub webhooks when disconnecting

### Automation Rules
Create custom automation rules for every connected repository.

Supported Triggers:
- Issue Opened
- Pull Request Opened

Supported Conditions:
- Title contains keyword
- Description contains keyword
- Author matches username
- Label matches

Supported Actions:
- Add GitHub Label
- Comment on Issue / Pull Request
- Send Slack Notification

Rules are completely configurable through the UI.

---

### Slack Integration

Supports Slack Incoming Webhooks.

Whenever a configured automation rule executes, the bot sends an AI-generated Slack notification.

---

### Dashboard

A user-specific dashboard displaying:

- Repository Connections
- Rule Creation / Updates / Deletion
- Incoming GitHub Events
- Successful Actions
- Failed Actions
- Job Retries
- Job Success History

Dashboard can also be filtered by repository.

---

### Reliability

The application is designed to avoid common webhook problems.

Implemented features include:

- GitHub webhook signature verification
- Replay attack protection
- Duplicate webhook prevention
- Background job processing
- Automatic retries for failed jobs
- Dashboard logging for failures and retries

---

## Tech Stack

### Frontend

- Next.js
- React
- Tailwind CSS

### Backend

- Express.js
- Prisma ORM
- PostgreSQL (Neon)

### APIs

- GitHub OAuth
- GitHub REST API
- GitHub Webhooks
- Slack Incoming Webhooks
- Google Gemini API

---

# Project Structure

```
frontend/
    app/
    components/

backend/
    src/
        controllers/
        routes/
        services/
        middleware/
        utils/
        lib/

    prisma/
```

---

# Local Setup

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<your-repository>.git

cd <your-repository>
```

---

## 2. Install Dependencies

### Backend

```bash
cd backend

npm install
```

### Frontend

```bash
cd ../frontend

npm install
```

---

## 3. Create a PostgreSQL Database

You can use:

- Neon
- Supabase
- Local PostgreSQL

Copy the connection string.

---

## 4. Backend Environment Variables

Create:

```
backend/.env
```

Add:

```env
DATABASE_URL=

PORT=5000

SESSION_SECRET=

CLIENT_URL=http://localhost:3000

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GITHUB_WEBHOOK_SECRET=

SLACK_WEBHOOK_URL=

GEMINI_API_KEY=
```

---

## 5. Frontend Environment Variables

Create:

```
frontend/.env.local
```

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

---

## 6. Run Prisma

Generate the Prisma Client

```bash
npx prisma generate
```

Push the schema

```bash
npx prisma db push
```

(Optional)

```bash
npx prisma studio
```

---

## 7. Create a GitHub OAuth App

Create a GitHub OAuth App.

Homepage URL

```
http://localhost:3000
```

Authorization Callback URL

```
http://localhost:5000/auth/github/callback
```

Copy:

- Client ID
- Client Secret

into `.env`.

---

## 8. Generate a Webhook Secret

Generate any random string.

Example

```
my-secret-webhook-key
```

Store it as

```
GITHUB_WEBHOOK_SECRET
```

---

## 9. Create a Slack Incoming Webhook

Create a Slack App.

Enable Incoming Webhooks.

Copy the generated webhook URL.

Paste it inside

```
SLACK_WEBHOOK_URL
```

---

## 10. Generate a Gemini API Key

Visit:

https://aistudio.google.com/

Create an API Key.

Add it to

```
GEMINI_API_KEY
```

---

## 11. Start the Backend

```bash
cd backend

npm run dev
```

---

## 12. Start the Frontend

```bash
cd frontend

npm run dev
```

---

## 13. Expose Backend Using ngrok

GitHub Webhooks require a public endpoint.

```bash
ngrok http 5000
```

Copy the generated HTTPS URL.

Update your backend base URL if required.

---

## Using the Application

1. Login using GitHub.

2. Connect one or more repositories.

3. Configure automation rules.

4. Open an Issue or Pull Request.

5. Observe:

- GitHub Label
- GitHub Comment
- Slack Notification
- Dashboard Updates

---

# Security

The project includes:

- GitHub Webhook Signature Verification
- Replay Attack Prevention
- Duplicate Event Protection
- Secure Session Authentication
- Environment Variable Based Secret Management
- Protected Backend Routes
- Background Job Queue
- Automatic Retry Mechanism

---

# Future Improvements

Potential future enhancements include:

- GitHub App Authentication instead of OAuth App
- AI-powered Issue/Pull Request summarization
- AI-generated label suggestions
- AI-based issue priority classification
- Multiple Slack channels per repository
- Microsoft Teams integration
- Discord integration
- Email notifications
- Scheduled automation workflows
- Custom JavaScript automation actions
- Advanced rule builder with nested AND/OR conditions
- Organization repository support
- WebSocket-based live dashboard updates
- Docker support
- Redis/BullMQ based distributed job queue
- Retry backoff strategy
- Monitoring with Prometheus and Grafana
- CI/CD using GitHub Actions
- Unit and Integration Tests

---

# Deployment

Frontend can be deployed on:

- Vercel

Backend can be deployed on:

- Render
- Railway
- Fly.io

Database:

- Neon PostgreSQL

---

# License

This project is intended for educational and learning purposes.