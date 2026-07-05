# 🇮🇳 Election Education Assistant

![Banner](https://img.shields.io/badge/Hackathon-Submission-blue?style=for-the-badge) ![Status](https://img.shields.io/badge/Status-Complete-success?style=for-the-badge) ![Tech](https://img.shields.io/badge/Tech-Vanilla_JS_%7C_PWA-orange?style=for-the-badge)

## 📌 Overview
The **Election Education Assistant** is a hyper-accessible Progressive Web App (PWA) designed to drastically simplify the complex Indian electoral process. It guides first-time voters, senior citizens, and marginalized groups through the exact forms and procedures required to cast their vote successfully.

---

## 🎯 Chosen Vertical
**Election Process Education**

---

## 🧠 The Problem & Our Logic
The Indian electoral system is robust but suffers from high information complexity. Millions of legitimate voters are turned away on election day because of simple misunderstandings (e.g., confusing having a Voter ID with actually being on the Electoral Roll, or senior citizens missing the short 5-day window for Form 12D Home Voting).

**Our Logic:** We abandoned the traditional "wall of text" government manual approach. Instead, we built an interactive, state-machine **Decision Tree** that asks users simple binary questions and routes them to the precise ECI forms (Form 6, Form 6A, Form 8, or Form 12D) they need, while debunking EVM tampering myths and explaining their rights.

---

## ✨ Key Features

### 1. "Dumb-Person Friendly" UI
- **Zero Frameworks:** Built with pure Vanilla HTML/CSS/JS. It guarantees sub-second load times and zero crashes on low-end 1GB RAM budget smartphones in rural areas.
- **Offline PWA:** A Service Worker aggressively caches the app so it continues to function flawlessly even when the user loses 4G connectivity.
- **Glassmorphism & ECI Branding:** Uses a stunning modern UI featuring the official Election Commission colors (Deep Blue, Saffron, Green) with massive touch targets.

### 2. Meaningful Google Services Integration
- **Native Google Translate:** We bypassed massive hardcoded translation dictionaries by wiring a custom native-looking dropdown directly into the Google Translate API, supporting every Indian dialect instantly.
- **Web Speech API (TTS):** A "🔊 Read Aloud" button automatically reads on-screen instructions to assist illiterate or visually impaired voters.
- **Google Gemini (BYOK):** Features an intelligent Assistant Chat powered by **Google Gemini 1.5 Flash**. 

### 3. Comprehensive Education Hub
- **Interactive Accordions:** Step-by-step guides on what to do inside the polling booth.
- **Alternative IDs:** Educates voters on the 12 alternative documents (Aadhaar, PAN, Passport, etc.) they can use if they lose their Voter ID card.
- **Mock EVM:** An experiential learning simulator that lets rural voters practice pressing the EVM button and checking the VVPAT slip.

---

## 🤖 Gemini API: "Bring Your Own Key" (BYOK)
To maintain the highest tier of security for this public GitHub repository, we did **not** hardcode an API key. 

Instead, the Assistant Chat uses a secure **Bring Your Own Key (BYOK)** architecture:
1. Open the Chat window in the app.
2. The bot will prompt you to paste your Gemini API Key.
3. The key is securely saved in your browser's local storage and used to dynamically import and initialize the `@google/generative-ai` SDK on the client side!
4. *If you don't have a key, simply type `skip` to use our offline fallback logic!*

---

## 🛠 Assumptions Made
1. **Target Hardware:** We assumed the target user is on a budget Android smartphone with a low-end CPU and unreliable internet connectivity.
2. **Translation Accuracy:** We assume the Google Translate API provides sufficient accuracy for rural dialects.
3. **Frontend Security:** We assume that a backend proxy server is out-of-scope for a 24-hour hackathon, making the local BYOK approach the safest method to demonstrate live Gemini integration without exposing credentials.

---
*Built with passion for digital democracy.*
