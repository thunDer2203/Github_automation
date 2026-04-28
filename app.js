const app = {
    currentLang: 'en',
    currentFontSize: 16,

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
            selectBox.dispatchEvent(new Event("change"));
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

    goToScreen(screenId) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        window.scrollTo(0, 0);

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

    // Step 1: Eligibility
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
        const chat = document.getElementById('chat-window');
        chat.classList.toggle('hidden');
    },

    sendMessage() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;

        const body = document.getElementById('chat-body');
        
        // User message
        const userDiv = document.createElement('div');
        userDiv.className = 'chat-bubble user';
        userDiv.innerText = text;
        body.appendChild(userDiv);

        input.value = '';
        body.scrollTop = body.scrollHeight;

        // Mock Bot Response (Simulating a simple AI)
        setTimeout(() => {
            const botDiv = document.createElement('div');
            botDiv.className = 'chat-bubble bot';
            
            botDiv.innerText = this.getBotResponse(text);
            
            body.appendChild(botDiv);
            body.scrollTop = body.scrollHeight;
        }, 600);
    },

    getBotResponse(text) {
        const lower = text.toLowerCase();
        if (lower.includes('age') || lower.includes('old') || lower.includes('18')) {
            return "You must be 18 years old to vote in India.";
        }
        if (lower.includes('slip') || lower.includes('find my name')) {
            return "You can get your slip from voters.eci.gov.in or your local BLO.";
        }
        if (lower.includes('home') || lower.includes('senior')) {
            return "Voters aged 85+ or PwD can vote from home using Form 12D!";
        }
        return "I am a simple demo assistant! In the real app, I would connect to an AI to answer this question.";
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
    }
};

window.onload = () => app.init();
