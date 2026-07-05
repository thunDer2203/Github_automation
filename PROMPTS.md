# 🤖 Prompting Logic & AI Integration Documentation

This document explains the AI prompting strategies used across two distinct layers of this project:
1. **How Google Antigravity (the AI coding agent) was prompted to build this app.**
2. **How the in-app Gemini chatbot was prompted to behave correctly for voters.**

---

## Part 1: Development Prompting Strategy (Google Antigravity)

This application was built entirely within **Google Antigravity** using a structured, iterative prompting methodology.

### Core Prompting Principles Used

#### 1. Context-First Prompting
Every session began with rich domain context before any code request:
> *"We are building a civic education app for first-time Indian voters on budget Android devices. Constraints: no backend, no frameworks, no API keys in code, <10MB repo, GitHub Pages deployable."*

Providing constraints upfront prevented the agent from suggesting over-engineered solutions (e.g., React, Node.js backends) that would violate the hackathon rules.

#### 2. "Role + Task + Constraint" Pattern
Each feature prompt was structured as:
- **Role:** "You are building a government-grade civic app..."
- **Task:** "Add a Form 6B educational block explaining Aadhaar-Voter ID linkage..."
- **Constraint:** "...it must match the existing card UI pattern, use no external libraries, and be accessible."

#### 3. Audit-Loop Prompting
After each major feature, a meta-prompt was used to force a holistic review:
> *"Treat this as feedback on Form 12D. Now audit the entire app for similar logical gaps, missing edge cases, or content inaccuracies."*

This produced consistent quality improvements — for example, catching that the Constituency Helper was missing from the EPIC application flow.

#### 4. Security-First Constraint Prompting
For the Gemini integration:
> *"Integrate Gemini AI but with zero hardcoded API keys. The user must provide their own key. It must be stored only in localStorage, never sent to any backend."*

This single constraint drove the entire BYOK architecture design.

#### 5. "Fix and Propagate" Pattern
When a bug was found in one place (e.g., quiz giving badge on wrong answers), the follow-up prompt was:
> *"Fix the quiz badge logic. Also check if the same logical error exists anywhere else in the app flow."*

This turned individual bug fixes into system-wide quality improvements.

---

## Part 2: In-App Gemini Chatbot Prompting

The Gemini chatbot is initialized with a hardcoded **system prompt** defined in `app.js` that constrains it to behave as a trustworthy civic assistant.

### System Prompt (from `app.js`)

```javascript
You are the "Election Education Assistant" for India. Your role is to help
citizens understand the Indian election process. You must:
1. ONLY answer questions related to Indian elections, voting, forms (Form 6,
   Form 6A, Form 6B, Form 8, Form 12D), voter registration, EVM/VVPAT, and
   electoral rights.
2. Always be polite, simple, and use plain language suitable for first-time voters.
3. If asked something outside elections, politely redirect to election topics.
4. Never provide legal advice. Always recommend users visit their local BLO or
   call the official helpline 1950 for complex cases.
5. Cite official sources (voters.eci.gov.in, eci.gov.in) when relevant.
```

### Why This Prompt Works

| Design Decision | Reason |
|---|---|
| **Scope restriction to elections only** | Prevents hallucination on unrelated topics and builds user trust |
| **Plain language instruction** | Ensures responses are readable by users with low literacy levels |
| **Helpline 1950 fallback** | Provides a verified, human safety net for edge cases |
| **No legal advice clause** | Manages liability and prevents the bot from giving incorrect procedural guidance |
| **Official source citation** | Grounds responses in verifiable government information |

### Offline Fallback Logic

If the user does not provide a Gemini API key (or types `skip`), the app falls back to a local keyword-matching response engine (`getBotResponse()` in `app.js`). This ensures the chatbot is **never broken** — even in zero-connectivity rural environments.

---

## Part 3: Content Accuracy Strategy

All electoral content was verified against official ECI sources:
- [voters.eci.gov.in](https://voters.eci.gov.in) — For form procedures and application flows
- [eci.gov.in/forms](https://eci.gov.in/forms/) — For official form downloads
- [electoralsearch.eci.gov.in](https://electoralsearch.eci.gov.in) — For electoral roll verification

The AI agent was explicitly prompted **not** to invent electoral procedures and to flag any content where accuracy was uncertain, ensuring no misinformation is provided to voters.

---

*This document is part of the hackathon submission for the Prompt Wars challenge on Hack2skill.*
