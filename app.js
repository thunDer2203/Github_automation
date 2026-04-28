/**
 * @fileoverview Election Education Assistant – Main Application Logic
 * @description Provides guided voter journey, quiz, chat assistant, and
 *              EVM simulation for Indian election education.
 * @version 2.0.0
 */
"use strict";

/** @constant {number} Default base font size in pixels */
const DEFAULT_FONT_SIZE = 16;
/** @constant {number} Minimum allowed font size in pixels */
const MIN_FONT_SIZE = 12;
/** @constant {number} Maximum allowed font size in pixels */
const MAX_FONT_SIZE = 24;
/** @constant {number} Step size for font size adjustments */
const FONT_STEP = 2;
/** @constant {number} Maximum allowed chat input length */
const MAX_CHAT_LENGTH = 500;
/** @constant {string} Gemini model to use for AI chat */
const GEMINI_MODEL = 'gemini-1.5-flash';
/** @constant {number} EVM beep frequency in Hz */
const EVM_BEEP_HZ = 800;
/** @constant {number} EVM beep duration in seconds */
const EVM_BEEP_DURATION = 1.5;

const app = {
    currentLang: 'en',
    currentFontSize: DEFAULT_FONT_SIZE,
    geminiChat: null,
    isGeminiActive: false,
    waitingForKey: false,
    quizQuestions: [
        { q: "Can you use your PAN card to vote if you lost your Voter ID?", options: ["Yes", "No"], answer: 0 },
        { q: "Are EVMs connected to the internet?", options: ["Yes, for live counting", "No, they are standalone machines"], answer: 1 },
        { q: "What form do you use if you shifted to a new house?", options: ["Form 6", "Form 8"], answer: 1 }
    ],
    currentQuizIndex: 0,
    quizScore: 0,

    /**
     * Initialises the application by binding all DOM event listeners.
     * Called once on window load.
     */
    init() {
        this.bindEvents();
    },

    /**
     * Binds all DOM event listeners for accessibility controls and chat input.
     */
    bindEvents() {
        document.getElementById('btn-font-increase').addEventListener('click', () => {
            if (this.currentFontSize < MAX_FONT_SIZE) {
                this.currentFontSize += FONT_STEP;
                document.documentElement.style.fontSize = this.currentFontSize + 'px';
            }
        });

        document.getElementById('btn-font-decrease').addEventListener('click', () => {
            if (this.currentFontSize > MIN_FONT_SIZE) {
                this.currentFontSize -= FONT_STEP;
                document.documentElement.style.fontSize = this.currentFontSize + 'px';
            }
        });

        // Submit chat on Enter key
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    },

    /**
     * Triggers the hidden Google Translate widget to switch language.
     * Fires a Firebase Analytics `language_change` event for tracking.
     * @param {string} langCode - BCP-47 language code (e.g. 'hi', 'ta').
     */
    triggerGoogleTranslate(langCode) {
        const selectBox = document.querySelector(".goog-te-combo");
        if (selectBox) {
            selectBox.value = langCode;
            selectBox.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
            this.logEvent('language_change', { language: langCode });
        } else {
            console.error("Google Translate is still loading. Please try again in a second.");
        }
    },

    /**
     * Uses the Web Speech API to read the visible screen content aloud.
     * Respects the currently selected language code.
     */
    readAloud() {
        window.speechSynthesis.cancel();
        const activeScreen = document.querySelector('.screen.active');
        if (!activeScreen) return;
        const utterance = new SpeechSynthesisUtterance(activeScreen.innerText);
        utterance.lang = document.getElementById('lang-toggle').value || 'en';
        window.speechSynthesis.speak(utterance);
    },

    /**
     * Opens the official ECI electoral search portal for constituency lookup.
     * Logs a Firebase Analytics event for funnel tracking.
     */
    findConstituency() {
        this.logEvent('find_constituency_clicked');
        alert("To find your exact Assembly Constituency (AC) and Tehsil:\n\n1. Select 'Search by Details' on the next screen.\n2. Enter your State and District.\n3. The portal will automatically find your Constituency!");
        window.open("https://electoralsearch.eci.gov.in/", "_blank");
    },

    /**
     * Navigates to a named screen, hiding all others.
     * Logs a `screen_view` event to Firebase Analytics on every transition.
     * @param {string} screenId - The DOM `id` of the target screen section.
     */
    goToScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        window.scrollTo(0, 0);
        this.logEvent('screen_view', { screen_name: screenId });

        if (screenId === 'screen-quiz') {
            this.initQuiz();
        }

        // Reset forms when returning to welcome
        if(screenId === 'screen-welcome') {
            document.getElementById('eligibility-q2').classList.add('hidden');
            document.getElementById('home-voting-info').classList.add('hidden');
            document.getElementById('not-eligible-info').classList.add('hidden');
            
            document.getElementById('roll-q2').classList.add('hidden');
            document.getElementById('roll-info').classList.add('hidden');
            document.getElementById('shift-q3').classList.add('hidden');
            document.getElementById('form8-info').classList.add('hidden');
            document.getElementById('form6-info').classList.add('hidden');
            document.getElementById('voter-slip-info').classList.add('hidden');
            
            // reset evm
            document.querySelectorAll('.evm-light').forEach(l => l.classList.remove('on'));
            document.getElementById('vvpat-screen').classList.add('hidden');
        }
    },

    // ---- Back Navigation Handlers ----
    goBack_eligibilityQ2() {
        document.getElementById('eligibility-q2').classList.add('hidden');
        document.getElementById('eligibility-q1').classList.remove('hidden');
    },

    goBack_homeVoting() {
        document.getElementById('home-voting-info').classList.add('hidden');
        document.getElementById('eligibility-q2').classList.remove('hidden');
    },

    goBack_epicInfo() {
        document.getElementById('epic-info').classList.add('hidden');
        document.getElementById('voter-q1').classList.remove('hidden');
    },

    goBack_rollQ2() {
        document.getElementById('roll-q2').classList.add('hidden');
        document.getElementById('voter-q1').classList.remove('hidden');
    },

    goBack_rollInfo() {
        document.getElementById('roll-info').classList.add('hidden');
        document.getElementById('roll-q2').classList.remove('hidden');
    },

    goBack_shiftQ3() {
        document.getElementById('shift-q3').classList.add('hidden');
        document.getElementById('roll-q2').classList.remove('hidden');
    },

    goBack_form8() {
        document.getElementById('form8-info').classList.add('hidden');
        document.getElementById('shift-q3').classList.remove('hidden');
    },

    goBack_form6() {
        document.getElementById('form6-info').classList.add('hidden');
        document.getElementById('shift-q3').classList.remove('hidden');
    },

    goBack_voterSlip() {
        document.getElementById('voter-slip-info').classList.add('hidden');
        document.getElementById('roll-q2').classList.remove('hidden');
    },

    // ---- Step Handlers ----
    answerAge(isAdult) {
        document.getElementById('eligibility-q1').classList.add('hidden');
        if (isAdult) {
            document.getElementById('eligibility-q2').classList.remove('hidden');
            document.getElementById('not-eligible-info').classList.add('hidden');
        } else {
            document.getElementById('eligibility-q2').classList.add('hidden');
            document.getElementById('home-voting-info').classList.add('hidden');
            document.getElementById('not-eligible-info').classList.remove('hidden');
        }
    },

    answerSenior(isSenior) {
        document.getElementById('eligibility-q2').classList.add('hidden');
        if (isSenior) {
            document.getElementById('home-voting-info').classList.remove('hidden');
        } else {
            // Not a senior, proceed normally to step 2
            this.goToScreen('screen-voter-slip');
        }
    },

    // Step 2: Voter Slip
    answerEpic(hasEpic) {
        document.getElementById('voter-q1').classList.add('hidden');
        document.getElementById('epic-info').classList.add('hidden');
        document.getElementById('roll-q2').classList.add('hidden');
        document.getElementById('roll-info').classList.add('hidden');
        document.getElementById('voter-slip-info').classList.add('hidden');

        if (hasEpic) {
            document.getElementById('roll-q2').classList.remove('hidden');
        } else {
            document.getElementById('epic-info').classList.remove('hidden');
        }
    },

    answerRoll(status) {
        document.getElementById('roll-q2').classList.add('hidden');
        document.getElementById('epic-info').classList.add('hidden');
        document.getElementById('roll-info').classList.add('hidden');
        document.getElementById('voter-slip-info').classList.add('hidden');
        document.getElementById('shift-q3').classList.add('hidden');
        document.getElementById('form8-info').classList.add('hidden');
        document.getElementById('form6-info').classList.add('hidden');

        if (status === 'yes') {
            document.getElementById('voter-slip-info').classList.remove('hidden');
        } else if (status === 'unknown') {
            document.getElementById('roll-info').classList.remove('hidden');
        } else if (status === 'no') {
            document.getElementById('shift-q3').classList.remove('hidden');
        }
    },

    answerShift(status) {
        document.getElementById('shift-q3').classList.add('hidden');
        document.getElementById('form8-info').classList.add('hidden');
        document.getElementById('form6-info').classList.add('hidden');

        if (status === 'yes') {
            document.getElementById('form8-info').classList.remove('hidden');
        } else {
            document.getElementById('form6-info').classList.remove('hidden');
        }
    },

    // Step 3: Mock EVM
    pressEVM(candidateNum) {
        // Turn off all lights
        document.querySelectorAll('.evm-light').forEach(l => l.classList.remove('on'));
        
        // Turn on the selected light
        document.getElementById('light-' + candidateNum).classList.add('on');

        // Play Beep & Show VVPAT
        const vvpat = document.getElementById('vvpat-screen');
        vvpat.classList.remove('hidden');
        
        // simple simulated beep sound using browser API if possible, else just visual
        this.playBeep();
    },

    /**
     * Plays a synthetic beep via the Web Audio API to simulate the EVM sound.
     * Falls back silently if the Audio API is blocked or unavailable.
     */
    playBeep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(EVM_BEEP_HZ, ctx.currentTime);
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + EVM_BEEP_DURATION);
        } catch (e) {
            console.log("Audio API not supported or blocked");
        }
    },

    // Chat
    /**
     * Toggles the chat assistant overlay open or closed.
     * On first open, attempts to initialise Gemini with a saved API key,
     * or prompts the user for a key (BYOK flow).
     * Logs a `chat_opened` event to Firebase Analytics.
     */
    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.toggle('hidden');

        if (!chatWindow.classList.contains('hidden')) {
            this.logEvent('chat_opened');
            // Init BYOK Gemini on first open
            if (!this.isGeminiActive && !this.waitingForKey) {
                const savedKey = localStorage.getItem('gemini_api_key');
                if (savedKey) {
                    this.initGemini(savedKey);
                } else {
                    this.waitingForKey = true;
                    this.addChatBubble("Hello! I can connect to Google Gemini for smart answers. Please paste your Gemini API Key here to activate AI mode. (Or type 'skip' to use the offline assistant).", 'bot');
                }
            }
        }
    },

    /**
     * Initialises the Google Gemini generative AI chat session.
     * Tests the provided API key with a handshake message before activating.
     * Persists the key to localStorage on success.
     * @param {string} apiKey - The user-supplied Gemini API key.
     */
    async initGemini(apiKey) {
        try {
            this.addChatBubble("⏳ Connecting to Google Gemini...", 'bot');
            const { GoogleGenerativeAI } = await import("https://esm.run/@google/generative-ai");
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: GEMINI_MODEL,
                systemInstruction: "You are an official Indian Election Education Assistant. Provide concise, accurate information about Indian electoral processes (Form 6, Form 8, Form 12D, EVMs, VVPAT, etc.). Keep answers short and 'dumb-person friendly'. Do not hallucinate laws."
            });
            this.geminiChat = model.startChat({ history: [] });
            await this.geminiChat.sendMessage("Hello"); // key validation handshake
            this.isGeminiActive = true;
            this.waitingForKey = false;
            localStorage.setItem('gemini_api_key', apiKey);
            this.logEvent('gemini_activated');
            this.addChatBubble("✅ Gemini Activated! What would you like to ask about the elections?", 'bot');
        } catch (e) {
            console.error(e);
            this.addChatBubble("❌ Invalid API Key or network error. Please paste a valid key or type 'skip'.", 'bot');
            localStorage.removeItem('gemini_api_key');
            this.waitingForKey = true;
        }
    },

    /**
     * Reads the chat input, validates it, and dispatches to either the
     * Gemini AI or the offline keyword-based bot response engine.
     * Sanitises input to enforce max length and non-empty constraints.
     */
    async sendMessage() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        // Input validation: reject empty or excessively long messages
        if (!text || text.length > MAX_CHAT_LENGTH) {
            if (text.length > MAX_CHAT_LENGTH) {
                this.addChatBubble(`⚠️ Message too long. Please keep it under ${MAX_CHAT_LENGTH} characters.`, 'bot');
            }
            return;
        }

        this.addChatBubble(text, 'user');
        input.value = '';

        if (this.waitingForKey) {
            if (text.toLowerCase() === 'skip') {
                this.waitingForKey = false;
                this.addChatBubble("Using standard offline assistant. How can I help?", 'bot');
            } else {
                this.initGemini(text);
            }
            return;
        }

        if (this.isGeminiActive && this.geminiChat) {
            try {
                const typingBubble = this.addChatBubble("Typing...", 'bot');
                const result = await this.geminiChat.sendMessage(text);
                const mdText = result.response.text()
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/\n/g, '<br>');
                typingBubble.innerHTML = mdText;
            } catch(e) {
                console.error(e);
                this.addChatBubble("Error communicating with Gemini. Falling back to offline assistant...", 'bot');
                this.isGeminiActive = false;
                setTimeout(() => {
                    const response = this.getBotResponse(text);
                    this.addChatBubble(response, 'bot');
                }, 500);
            }
            return;
        }

        // Simulate thinking offline
        setTimeout(() => {
            const response = this.getBotResponse(text);
            this.addChatBubble(response, 'bot');
        }, 600);
    },

    addChatBubble(text, sender) {
        const body = document.getElementById('chat-body');
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        bubble.innerHTML = text;
        body.appendChild(bubble);
        body.scrollTop = body.scrollHeight;
        return bubble;
    },

    getBotResponse(text) {
        const lower = text.toLowerCase();
        
        if (lower.includes('age') || lower.includes('old') || lower.includes('18')) {
            return "You must be 18 years old to vote in India.";
        }
        if (lower.includes('slip') || lower.includes('find my name') || lower.includes('roll')) {
            return "You can download your Voter Slip from the Voter Helpline App, voters.eci.gov.in, or by asking your local BLO.";
        }
        if (lower.includes('home') || lower.includes('senior') || lower.includes('pwd')) {
            return "Voters aged 85+ or Persons with Disabilities (PwD) can vote from home using Form 12D via the Saksham App!";
        }
        if (lower.includes('form 8') || lower.includes('shift') || lower.includes('correction') || lower.includes('mistake') || lower.includes('lost')) {
            return "Use Form 8 if you have shifted houses, need to correct mistakes (spelling, age) on your card, or if you lost your card and need a replacement.";
        }
        if (lower.includes('form 6a') || lower.includes('nri') || lower.includes('abroad') || lower.includes('overseas')) {
            return "If you are an NRI (Non-Resident Indian), you must use Form 6A to register to vote.";
        }
        if (lower.includes('form 6') || lower.includes('new voter') || lower.includes('register')) {
            return "New voters should fill out Form 6 to register on the electoral roll.";
        }
        if (lower.includes('evm') || lower.includes('hack') || lower.includes('safe') || lower.includes('machine')) {
            return "EVMs are 100% safe. They are standalone machines with no internet or Bluetooth connectivity, making them impossible to hack remotely.";
        }
        if (lower.includes('aadhaar') || lower.includes('pan') || lower.includes('id') || lower.includes('passport')) {
            return "If you lost your Voter ID card, you can still vote using alternative IDs like your Aadhaar, PAN card, or Passport, provided your name is on the voter list.";
        }
        if (lower.includes('helpline') || lower.includes('call') || lower.includes('number') || lower.includes('1950')) {
            return "You can call the official toll-free Voter Helpline at 1950 for any election-related queries.";
        }
        if (lower.includes('blo') || lower.includes('booth level officer')) {
            return "Your Booth Level Officer (BLO) is a local representative who can help you with forms, slips, and checking the voter list.";
        }
        
        return "I am a simple demo assistant! In a production app, I would connect to a generative AI like Gemini to answer this complex question.";
    },

    // Accordion Logic
    toggleAccordion(btn) {
        const content = btn.nextElementSibling;
        const isOpen = content.style.display === 'block';
        
        // Close all other accordions
        document.querySelectorAll('.accordion-content').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.accordion-header').forEach(el => el.innerText = el.innerText.replace('▲', '▼'));
        
        // Toggle the clicked one
        if (!isOpen) {
            content.style.display = 'block';
            btn.innerText = btn.innerText.replace('▼', '▲');
        }
    },

    // ---- Quiz Logic ----

    /**
     * Resets and starts the quiz from question 1.
     * Hides the result card and renders the first question.
     */
    initQuiz() {
        this.currentQuizIndex = 0;
        this.quizScore = 0;
        document.getElementById('quiz-container').classList.remove('hidden');
        document.getElementById('quiz-result').classList.add('hidden');
        this.renderQuizQuestion();
    },

    renderQuizQuestion() {
        if (this.currentQuizIndex >= this.quizQuestions.length) {
            this.showQuizResult();
            return;
        }
        const qData = this.quizQuestions[this.currentQuizIndex];
        document.getElementById('quiz-question').innerText = `Question ${this.currentQuizIndex + 1}: ${qData.q}`;
        
        const optionsDiv = document.getElementById('quiz-options');
        optionsDiv.innerHTML = '';
        qData.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'btn-secondary giant-btn';
            btn.innerText = opt;
            btn.onclick = () => this.answerQuiz(btn, idx === qData.answer, qData.answer);
            optionsDiv.appendChild(btn);
        });
    },

    answerQuiz(btnClicked, isCorrect, correctIdx) {
        // Disable all buttons to prevent double clicking
        const optionsDiv = document.getElementById('quiz-options');
        const buttons = optionsDiv.querySelectorAll('button');
        buttons.forEach(b => b.disabled = true);

        if (isCorrect) {
            btnClicked.style.backgroundColor = '#28a745'; // Green
            btnClicked.style.color = 'white';
            this.quizScore++;
        } else {
            btnClicked.style.backgroundColor = '#dc3545'; // Red
            btnClicked.style.color = 'white';
            buttons[correctIdx].style.backgroundColor = '#28a745'; // Highlight correct answer
            buttons[correctIdx].style.color = 'white';
        }

        setTimeout(() => {
            this.currentQuizIndex++;
            this.renderQuizQuestion();
        }, 1500);
    },

    /**
     * Fires a Firebase Analytics `quiz_complete` event with the final score,
     * then renders the appropriate result card (badge or retry prompt).
     */
    showQuizResult() {
        this.logEvent('quiz_complete', {
            score: this.quizScore,
            total: this.quizQuestions.length,
            perfect: this.quizScore === this.quizQuestions.length
        });
        document.getElementById('quiz-container').classList.add('hidden');
        const resultDiv = document.getElementById('quiz-result');
        resultDiv.classList.remove('hidden');

        if (this.quizScore === this.quizQuestions.length) {
            resultDiv.innerHTML = `
                <h3 style="font-size: 2rem; margin: 0;">🎉</h3>
                <h3 style="color: #28a745;">Congratulations!</h3>
                <p>You scored ${this.quizScore}/3. You have earned the <strong>Smart Voter Badge!</strong></p>
                <div class="badge-icon" style="font-size: 4rem; margin: 20px 0; animation: pulse 2s infinite;">🏅</div>
                <button class="btn-secondary giant-btn mt-4" onclick="app.goToScreen('screen-welcome')" id="t-restart">Restart Journey</button>
            `;
        } else {
            resultDiv.innerHTML = `
                <h3 style="font-size: 2rem; margin: 0;">💡</h3>
                <h3 style="color: #d39e00;">Almost there!</h3>
                <p>You scored ${this.quizScore}/3. You need a perfect score to earn the badge.</p>
                <button class="btn-primary giant-btn mt-4" style="margin-bottom: 10px;" onclick="app.initQuiz()">Try Again ➔</button>
                <button class="btn-secondary giant-btn" onclick="app.goToScreen('screen-welcome')">Go Home</button>
            `;
        }
    },
    /**
     * Safely logs an event to Firebase Analytics if the SDK is available.
     * Fails silently so analytics never breaks the app.
     * @param {string} eventName  - Firebase Analytics event name.
     * @param {object} [params={}] - Optional event parameters.
     */
    logEvent(eventName, params = {}) {
        try {
            // Use the window bridge set up by the Firebase ES module in index.html
            if (typeof window.__analyticsReady === 'function') {
                window.__analyticsReady(eventName, params);
            }
        } catch (e) {
            // Analytics unavailable — fail silently
        }
    }
};

window.onload = () => app.init();
