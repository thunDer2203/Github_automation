# GitHub Automation Bot

A full-stack GitHub Automation platform that enables users to connect GitHub repositories, create configurable automation rules, automate repository workflows, send AI-powered Slack notifications, and monitor all automation activity through a centralized dashboard.

The project is built using **Next.js**, **Express.js**, **Prisma**, **PostgreSQL (Neon)**, **GitHub OAuth**, **GitHub Webhooks**, **Slack Incoming Webhooks**, and **Google Gemini AI**.

---

# Features

## Authentication

- GitHub OAuth Authentication
- Secure Passport.js session-based login
- Protected frontend pages
- Protected backend API routes
- Secure logout with session destruction

---

## Repository Management

- Connect GitHub repositories
- Disconnect repositories
- Automatic webhook creation
- Automatic webhook deletion
- Multiple repositories per user

---

## Configurable Automation Rules

Create automation rules directly from the UI.

### Supported Triggers

- Issue Opened
- Pull Request Opened

### Supported Conditions

- Title contains keyword
- Description contains keyword
- Author matches username
- Label matches

### Supported Actions

- Add GitHub Label
- Add GitHub Comment
- Send Slack Notification

Rules are completely configurable without changing backend code.

---

## AI-powered Slack Notifications

Instead of sending static Slack messages, the application uses **Google Gemini** to generate human-friendly summaries for GitHub Issues and Pull Requests before sending notifications.

---

## Dashboard

Every automation activity is recorded.

Dashboard events include:

- Repository Connected
- Repository Disconnected
- Rule Created
- Rule Updated
- Rule Deleted
- Label Added
- Comment Added
- Slack Notification Sent
- Job Retry
- Job Success
- Job Failure

Dashboard events can be filtered by repository.

---

## Reliable Webhook Processing

The application is designed to safely process GitHub webhooks.

Implemented reliability features:

- GitHub webhook signature verification
- Replay attack prevention
- Duplicate webhook detection
- Background job processing
- Automatic retry mechanism
- Idempotent action execution
- Dashboard logging for failures and retries

---

# Tech Stack

## Frontend

- Next.js
- React
- Tailwind CSS

## Backend

- Express.js
- Passport.js
- Prisma ORM
- PostgreSQL (Neon)

## External Services

- GitHub OAuth
- GitHub REST API
- GitHub Webhooks
- Slack Incoming Webhooks
- Google Gemini API

---

# Project Structure

```
github-automation/
│
├── frontend/
│   ├── app/
│   ├── components/
│   └── public/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── lib/
│   └── package.json
│
└── README.md
```

---

# Running the Project Locally

## 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/<repository-name>.git

cd <repository-name>
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

# 3. Create a PostgreSQL Database

You may use:

- Neon
- Supabase
- Local PostgreSQL

Copy the PostgreSQL connection string.

---

# 4. Configure Backend Environment Variables

Create:

```
backend/.env
```

Add the following:

```env
PORT=5000

DATABASE_URL=

SESSION_SECRET=

CLIENT_ID=
CLIENT_SECRET=

YOUR_PUBLIC_URL=

FRONTEND_URL=http://localhost:3000

WEBHOOK_SECRET=

GEMINI_API_KEY=
```

### Environment Variable Explanation

| Variable | Description |
|------------|-------------|
| PORT | Backend port |
| DATABASE_URL | PostgreSQL connection string |
| SESSION_SECRET | Secret used to sign sessions |
| CLIENT_ID | GitHub OAuth Client ID |
| CLIENT_SECRET | GitHub OAuth Client Secret |
| YOUR_PUBLIC_URL | Public backend URL (ngrok during local development) |
| FRONTEND_URL | Frontend URL |
| WEBHOOK_SECRET | GitHub webhook secret |
| GEMINI_API_KEY | Google Gemini API Key |

---

# 5. Configure Frontend Environment Variables

Create:

```
frontend/.env.local
```

Add:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

# 6. Generate Prisma Client

Inside the backend:

```bash
npx prisma generate
```

---

# 7. Push Database Schema

```bash
npx prisma db push
```

(Optional)

Open Prisma Studio:

```bash
npx prisma studio
```

---

# 8. Create a GitHub OAuth App

Go to:

https://github.com/settings/developers

Create a new OAuth App.

Use:

### Homepage URL

```
http://localhost:3000
```

### Authorization Callback URL

```
https://<your-ngrok-domain>.ngrok-free.app/auth/github/callback
```

Copy the generated:

- Client ID
- Client Secret

into your backend `.env`.

---

# 9. Expose Your Backend

GitHub Webhooks require a public URL.

Run:

```bash
ngrok http 5000
```

Example:

```
https://abc123.ngrok-free.app
```

Copy this URL.

Update:

```
YOUR_PUBLIC_URL
```

inside `.env`.

Restart the backend.

---

# 10. Generate a GitHub Webhook Secret

Generate any random string.

Example:

```
my-super-secret-key
```

Store it as:

```
WEBHOOK_SECRET
```

The same value is automatically used while creating GitHub webhooks.

---

# 11. Create a Slack Incoming Webhook

Create a Slack App.

Enable:

```
Incoming Webhooks
```

Create a webhook for your desired channel.

Copy the generated webhook URL.

When creating a rule in the application, choose the **Slack** action and paste this webhook URL into the action value field.

---

# 12. Generate a Gemini API Key

Visit:

https://aistudio.google.com/

Create a new API key.

Store it as:

```
GEMINI_API_KEY
```

---

# 13. Start the Backend

```bash
cd backend

npm run dev
```

The backend starts on:

```
http://localhost:5000
```

---

# 14. Start the Frontend

```bash
cd frontend

npm run dev
```

Frontend:

```
http://localhost:3000
```

---

# Using the Application

## Step 1

Open:

```
http://localhost:3000
```

---

## Step 2

Login using GitHub.

---

## Step 3

Connect one or more repositories.

The application automatically:

- Stores repository information
- Creates a GitHub webhook

---

## Step 4

Create automation rules.

Example:

Trigger:

```
Issue Opened
```

Condition:

```
Title contains "bug"
```

Actions:

- Add label
- Comment
- Send Slack notification

---

## Step 5

Open an Issue or Pull Request in the connected repository.

The application will automatically:

- Receive the GitHub webhook
- Verify its signature
- Store the webhook job
- Execute matching automation rules
- Retry failures automatically
- Update the dashboard

---

## Step 6

Visit the Dashboard to monitor:

- Connected repositories
- Automation history
- Successful actions
- Failed actions
- Retry history

---

# Security Features

The application includes several production-oriented security measures:

- GitHub webhook signature verification
- Session-based authentication
- Protected API routes
- Replay attack prevention
- Duplicate webhook protection
- Idempotent action execution
- Environment variable-based secret management
- Automatic retry mechanism for failed jobs

---

# Future Improvements

Potential enhancements include:

- GitHub App authentication
- AI-powered issue triage
- AI-generated labels
- Priority prediction
- Nested AND/OR rule builder
- Multiple Slack workspaces
- Microsoft Teams integration
- Discord integration
- Email notifications
- Scheduled workflows
- Redis/BullMQ job queue
- Exponential retry backoff
- Docker support
- GitHub Actions CI/CD
- Prometheus & Grafana monitoring
- WebSocket-based live dashboard
- Unit and integration tests

---

# Deployment

## Frontend

- Vercel

## Backend

- Render
- Railway
- Fly.io

## Database

- Neon PostgreSQL

---

# License

This project was developed for educational purposes and as a demonstration of building reliable GitHub automation workflows using modern web technologies.