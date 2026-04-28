# Election Education Assistant

## Overview
This repository contains the source code for the **Election Education Assistant**, submitted for the Hackathon. This Progressive Web App (PWA) is designed to drastically simplify the Indian electoral process for first-time voters, senior citizens, and marginalized groups.

## Chosen Vertical
**Election Process Education**

## Approach and Logic
The Indian electoral system is robust but suffers from high information complexity. Our approach focused on dissecting the exact "loopholes" where voters drop out of the process (e.g., confusing Voter ID with the Electoral Roll, not knowing how to find their Assembly Constituency, or senior citizens missing the short window for Form 12D Home Voting). 

To solve this, we built a hyper-accessible, step-by-step interactive assistant.
1. **Decision Trees over Walls of Text:** Instead of telling voters to "Read the manual," the app asks simple binary questions and routes them to the exact government form (Form 6, Form 8, or Form 12D) they need.
2. **"Dumb-Person Friendly" UI:** The design utilizes massive touch targets, official high-contrast ECI colors (Deep Blue, Saffron, Green), and a universal font-scaler to ensure elderly and less tech-savvy users can navigate flawlessly.
3. **Experiential Learning:** We included a Mock EVM to familiarize rural voters with the physical process of voting and checking the VVPAT slip.

## How the Solution Works
- **Progressive Web App (PWA):** Built using Vanilla HTML/CSS/JS. It includes a Service Worker that caches the application, allowing it to function completely **offline** in rural areas with spotty 2G internet.
- **Meaningful Google Services Integration:**
  - **Google Translate Widget (Native Integration):** The app supports every Indian dialect. We bypassed massive hardcoded dictionaries by wiring a custom native-looking dropdown directly into the Google Translate API.
  - **Google Web Speech API (TTS):** A "Read Aloud" button automatically reads the on-screen instructions to assist illiterate or visually impaired voters.
  - **Performance Optimization:** No heavy JS frameworks (React/Angular) were used to guarantee sub-second load times and zero crashes on low-end 1GB RAM budget smartphones.

## Assumptions Made
1. **Device Profile:** We assumed the target user is on a budget Android smartphone with a low-end CPU and unreliable internet connectivity.
2. **Translation Accuracy:** We assume the Google Translate API provides sufficient accuracy for rural dialects compared to maintaining a massive custom localization backend.
3. **API Access:** The Chat Assistant currently uses a mocked decision tree, assuming that in a production environment, it would be wired directly to the Gemini API for generative Q&A regarding election laws.

---
*Built with passion for digital democracy.*
