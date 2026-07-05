## AI Tools Used

Throughout this project, I used two AI tools:

- **ChatGPT (OpenAI GPT-5.5)** for backend development, architecture discussions, debugging, database design, webhook reliability, authentication, and API implementation.
- **Claude** primarily for frontend development, including React/Next.js UI components, page layouts, Tailwind CSS styling, and improving the overall user experience.

No persistent AI context or instruction files (such as `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, or similar) were used during development.

---

## Work Distribution

I designed the overall architecture, data model, and application flow. AI tools were used as development assistants rather than autonomous developers.

I was responsible for implementing and integrating:

- GitHub OAuth authentication using Passport.js
- GitHub webhook handling and signature verification
- Rule-based automation engine
- Background job processing with retries
- Dashboard event tracking
- Database schema and Prisma models
- Deployment to Render (backend) and Vercel (frontend)

AI mainly helped with:

- Explaining unfamiliar concepts and libraries
- Generating repetitive boilerplate code
- Reviewing implementation ideas
- Debugging backend issues (ChatGPT)
- Building and refining frontend components and styling (Claude)

---

## Key Decisions I Made

### 1. Database-driven automation rules

Instead of hardcoding automation behavior, I designed the application so that automation rules, actions, and conditions are stored in the database. This allows users to configure workflows without requiring backend code changes.

---

### 2. Reliable background job processing

Rather than processing webhook actions directly inside the webhook endpoint, I implemented a database-backed job queue with retries. This ensures GitHub events are not lost if Slack, GitHub APIs, or AI services are temporarily unavailable.

---

### 3. Idempotent webhook execution

GitHub can deliver the same webhook multiple times. To prevent duplicate actions, I implemented two layers of protection:

- `ProcessedWebhook` prevents processing the same webhook delivery twice.
- `ExecutedAction` tracks completed actions for each delivery so retries only execute actions that previously failed.

This makes retries safe while avoiding duplicate labels, comments, and notifications.

### 4. Security of webhook delivered

- Implemented the security check to ensure that the webhook events coming from github is actually set up by my application.

---

## Hardest Bug / Wrong Turn

The most difficult issue involved implementing reliable retries for failed webhook jobs.

Initially, AI suggested retrying the entire webhook whenever an action failed. While this successfully retried failed Slack notifications, it also repeated actions that had already succeeded, resulting in duplicate GitHub labels and comments.

I identified the issue during testing when repeated retries continued executing completed actions. To solve it, I redesigned the retry mechanism by introducing an `ExecutedAction` table keyed by `(deliveryId, actionId)`. Before executing an action, the worker checks whether that action has already completed successfully for the current webhook delivery. Successful actions are skipped, while failed actions continue to be retried.

This resulted in an idempotent and fault-tolerant webhook processing pipeline.

---

## Improvements With More Time

With additional time, I would implement:

- GitHub App authentication instead of OAuth
- AI-powered issue and pull request summarization and triage
- More advanced rule builder supporting nested AND/OR conditions
- Exponential backoff for retries instead of fixed intervals
- Structured logging and monitoring with dashboards
- Docker support and CI/CD automation
- Real-time dashboard updates using WebSockets

---

## Example Prompt

One of the most useful prompts during development was:

> "How can I make GitHub webhook processing idempotent so retries only execute failed actions and never repeat successful ones?"

The discussion around this problem helped shape the final design using `ProcessedWebhook` and `ExecutedAction` tables.
