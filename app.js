const app = {
    currentLang: 'en',
    currentFontSize: 16,
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

    init() {
        this.bindEvents();
    },

    bindEvents() {

        document.getElementById('btn-font-increase').addEventListener('click', () => {
            if (this.currentFontSize < 24) {
                this.currentFontSize += 2;
                document.documentElement.style.fontSize = this.currentFontSize + 'px';
            }
        });

        document.getElementById('btn-font-decrease').addEventListener('click', () => {
            if (this.currentFontSize > 12) {
                this.currentFontSize -= 2;
                document.documentElement.style.fontSize = this.currentFontSize + 'px';
            }
        });

        // Chat Enter key
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    },

    triggerGoogleTranslate(langCode) {
        const selectBox = document.querySelector(".goog-te-combo");
        if (selectBox) {
            selectBox.value = langCode;
            selectBox.dispatchEvent(new Event("change", { bubbles: true, cancelable: true }));
        } else {
            console.error("Google Translate is still loading. Please try again in a second.");
        }
    },

    readAloud() {
        window.speechSynthesis.cancel();
        const activeScreen = document.querySelector('.screen.active');
        if (!activeScreen) return;
        
        const utterance = new SpeechSynthesisUtterance(activeScreen.innerText);
        utterance.lang = document.getElementById('lang-toggle').value || 'en';
        window.speechSynthesis.speak(utterance);
    },

    findConstituency() {
        alert("To find your exact Assembly Constituency (AC) and Tehsil:\n\n1. Select 'Search by Details' on the next screen.\n2. Enter your State and District.\n3. The portal will automatically find your Constituency!");
        window.open("https://electoralsearch.eci.gov.in/", "_blank");
    },

    goToScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        window.scrollTo(0, 0);

        if(screenId === 'screen-quiz') {
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

    playBeep() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, ctx.currentTime); // 800Hz beep
            osc.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 1.5); // long beep for VVPAT
        } catch (e) {
            console.log("Audio API not supported or blocked");
        }
    },

    // Chat
    toggleChat() {
        const chatWindow = document.getElementById('chat-window');
        chatWindow.classList.toggle('hidden');
        
        // Init BYOK Gemini on first open
        if (!chatWindow.classList.contains('hidden') && !this.isGeminiActive && !this.waitingForKey) {
            const savedKey = localStorage.getItem('gemini_api_key');
            if (savedKey) {
                this.initGemini(savedKey);
            } else {
                this.waitingForKey = true;
                this.addChatBubble("Hello! I can connect to Google Gemini for smart answers. Please paste your Gemini API Key here to activate AI mode. (Or type 'skip' to use the offline assistant).", 'bot');
            }
        }
    },

    async initGemini(apiKey) {
        try {
            this.addChatBubble("⏳ Connecting to Google Gemini...", 'bot');
            const { GoogleGenerativeAI } = await import("https://esm.run/@google/generative-ai");
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ 
                model: "gemini-1.5-flash", 
                systemInstruction: "You are an official Indian Election Education Assistant. Provide concise, accurate information about Indian electoral processes (Form 6, Form 8, Form 12D, EVMs, VVPAT, etc.). Keep answers short and 'dumb-person friendly'. Do not hallucinate laws." 
            });
            this.geminiChat = model.startChat({ history: [] });
            
            // test the key
            await this.geminiChat.sendMessage("Hello");
            
            this.isGeminiActive = true;
            this.waitingForKey = false;
            localStorage.setItem('gemini_api_key', apiKey);
            this.addChatBubble("✅ Gemini Activated! What would you like to ask about the elections?", 'bot');
        } catch (e) {
            console.error(e);
            this.addChatBubble("❌ Invalid API Key or network error. Please paste a valid key or type 'skip'.", 'bot');
            localStorage.removeItem('gemini_api_key');
            this.waitingForKey = true;
        }
    },

    async sendMessage() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

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

    // Quiz Logic
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

    showQuizResult() {
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
    }
};

window.onload = () => app.init();
