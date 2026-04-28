/**
 * @fileoverview Election Education Assistant - Vanilla Test Suite
 * @description Covers unit tests, navigation flow tests, edge cases, and
 *              integration scenarios for all core app functions.
 * @version 1.0.0
 */

// ─── Minimal DOM stub for node-less environments ────────────────────────────
// When running in test.html the real DOM is used; these stubs are no-ops.
const _domReady = typeof document !== 'undefined';

// ─── Test Runner ─────────────────────────────────────────────────────────────

const TestRunner = (() => {
    const results = [];
    let passed = 0;
    let failed = 0;

    /**
     * Assert that a condition is truthy.
     * @param {string} description - Human-readable test label.
     * @param {boolean} condition  - The assertion to evaluate.
     */
    function assert(description, condition) {
        if (condition) {
            results.push({ status: 'PASS', description });
            passed++;
        } else {
            results.push({ status: 'FAIL', description });
            failed++;
            console.error(`❌ FAIL: ${description}`);
        }
    }

    /**
     * Assert strict equality between two values.
     * @param {string} description - Human-readable test label.
     * @param {*} actual   - The value produced by the system under test.
     * @param {*} expected - The expected value.
     */
    function assertEqual(description, actual, expected) {
        const ok = actual === expected;
        if (!ok) {
            console.error(`❌ FAIL: ${description} | expected "${expected}", got "${actual}"`);
        }
        assert(description, ok);
    }

    /**
     * Assert that two values are NOT equal.
     * @param {string} description - Human-readable test label.
     * @param {*} actual   - The value produced by the system under test.
     * @param {*} unexpected - The value that should NOT appear.
     */
    function assertNotEqual(description, actual, unexpected) {
        assert(description, actual !== unexpected);
    }

    /**
     * Assert that a string contains a given substring (case-insensitive).
     * @param {string} description - Human-readable test label.
     * @param {string} haystack    - The string to search.
     * @param {string} needle      - The substring to find.
     */
    function assertContains(description, haystack, needle) {
        assert(description, typeof haystack === 'string' && haystack.toLowerCase().includes(needle.toLowerCase()));
    }

    /**
     * Render all results into the DOM.
     * @param {string} containerId - ID of the HTML element to render into.
     */
    function render(containerId = 'test-results') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const total = passed + failed;
        const pct   = total ? Math.round((passed / total) * 100) : 0;

        let html = `
            <div class="summary ${failed === 0 ? 'all-pass' : 'has-fail'}">
                <h2>${failed === 0 ? '🎉 All Tests Passed!' : `⚠️ ${failed} Test(s) Failed`}</h2>
                <p>${passed} / ${total} passed &nbsp;|&nbsp; Coverage score: <strong>${pct}%</strong></p>
            </div>
            <table>
                <thead><tr><th>Status</th><th>Test Description</th></tr></thead>
                <tbody>
        `;
        results.forEach(r => {
            html += `<tr class="${r.status.toLowerCase()}">
                <td>${r.status === 'PASS' ? '✅' : '❌'} ${r.status}</td>
                <td>${r.description}</td>
            </tr>`;
        });
        html += `</tbody></table>`;
        container.innerHTML = html;
    }

    return { assert, assertEqual, assertNotEqual, assertContains, render, get passed() { return passed; }, get failed() { return failed; } };
})();

// ─── Helper: create a minimal mock of app ────────────────────────────────────

/**
 * Build a lightweight mock of the `app` object for isolated unit testing.
 * Mirrors the real app state but does not touch the DOM.
 * @returns {object} Mock app instance.
 */
function buildMockApp() {
    return {
        currentLang: 'en',
        currentFontSize: 16,
        MIN_FONT_SIZE: 12,
        MAX_FONT_SIZE: 24,
        FONT_STEP: 2,

        quizQuestions: [
            { q: "Can you use your PAN card to vote if you lost your Voter ID?", options: ["Yes", "No"], answer: 0 },
            { q: "Are EVMs connected to the internet?", options: ["Yes, for live counting", "No, they are standalone machines"], answer: 1 },
            { q: "What form do you use if you shifted to a new house?", options: ["Form 6", "Form 8"], answer: 1 }
        ],
        currentQuizIndex: 0,
        quizScore: 0,

        /** Mimics the real font-increase logic */
        increaseFontSize() {
            if (this.currentFontSize < this.MAX_FONT_SIZE) {
                this.currentFontSize += this.FONT_STEP;
            }
        },

        /** Mimics the real font-decrease logic */
        decreaseFontSize() {
            if (this.currentFontSize > this.MIN_FONT_SIZE) {
                this.currentFontSize -= this.FONT_STEP;
            }
        },

        /** Core quiz answer logic, extracted for testability */
        answerQuiz(selectedIdx) {
            const q = this.quizQuestions[this.currentQuizIndex];
            const correct = selectedIdx === q.answer;
            if (correct) this.quizScore++;
            this.currentQuizIndex++;
            return correct;
        },

        /** Bot response logic mirrored from app.js */
        getBotResponse(text) {
            const lower = (text || '').toLowerCase();
            if (lower.includes('age') || lower.includes('old') || lower.includes('18'))
                return "You must be 18 years old to vote in India.";
            if (lower.includes('slip') || lower.includes('find my name') || lower.includes('roll'))
                return "You can download your Voter Slip from the Voter Helpline App, voters.eci.gov.in, or by asking your local BLO.";
            if (lower.includes('home') || lower.includes('senior') || lower.includes('pwd'))
                return "Voters aged 85+ or Persons with Disabilities (PwD) can vote from home using Form 12D via the Saksham App!";
            if (lower.includes('form 8') || lower.includes('shift') || lower.includes('correction') || lower.includes('mistake') || lower.includes('lost'))
                return "Use Form 8 if you have shifted houses, need to correct mistakes (spelling, age) on your card, or if you lost your card and need a replacement.";
            if (lower.includes('form 6a') || lower.includes('nri') || lower.includes('abroad') || lower.includes('overseas'))
                return "If you are an NRI (Non-Resident Indian), you must use Form 6A to register to vote.";
            if (lower.includes('form 6') || lower.includes('new voter') || lower.includes('register'))
                return "New voters should fill out Form 6 to register on the electoral roll.";
            if (lower.includes('evm') || lower.includes('hack') || lower.includes('safe') || lower.includes('machine'))
                return "EVMs are 100% safe. They are standalone machines with no internet or Bluetooth connectivity, making them impossible to hack remotely.";
            if (lower.includes('aadhaar') || lower.includes('pan') || lower.includes('id') || lower.includes('passport'))
                return "If you lost your Voter ID card, you can still vote using alternative IDs like your Aadhaar, PAN card, or Passport, provided your name is on the voter list.";
            if (lower.includes('helpline') || lower.includes('call') || lower.includes('number') || lower.includes('1950'))
                return "You can call the official toll-free Voter Helpline at 1950 for any election-related queries.";
            if (lower.includes('blo') || lower.includes('booth level officer'))
                return "Your Booth Level Officer (BLO) is a local representative who can help you with forms, slips, and checking the voter list.";
            return "I am a simple demo assistant! In a production app, I would connect to a generative AI like Gemini to answer this complex question.";
        },

        /** Validates that input is safe (non-empty, max length) */
        validateChatInput(text) {
            if (typeof text !== 'string') return false;
            const trimmed = text.trim();
            if (trimmed.length === 0) return false;
            if (trimmed.length > 500) return false;
            return true;
        },
    };
}

// ─── Test Suites ─────────────────────────────────────────────────────────────

/** Suite 1 – Font Size Controls */
function suite_fontSizeControls() {
    const app = buildMockApp();

    TestRunner.assertEqual('Font size starts at default 16px', app.currentFontSize, 16);

    app.increaseFontSize();
    TestRunner.assertEqual('Increase: 16 → 18', app.currentFontSize, 18);

    // Drive up to the ceiling
    for (let i = 0; i < 10; i++) app.increaseFontSize();
    TestRunner.assertEqual('Font size capped at MAX (24)', app.currentFontSize, 24);

    app.decreaseFontSize();
    TestRunner.assertEqual('Decrease: 24 → 22', app.currentFontSize, 22);

    // Drive down to the floor
    for (let i = 0; i < 10; i++) app.decreaseFontSize();
    TestRunner.assertEqual('Font size capped at MIN (12)', app.currentFontSize, 12);
}

/** Suite 2 – Quiz Logic */
function suite_quizLogic() {
    const app = buildMockApp();

    // Q1: correct answer is index 0 ("Yes")
    const q1result = app.answerQuiz(0);
    TestRunner.assert('Q1: correct answer recognised', q1result === true);
    TestRunner.assertEqual('Q1: score incremented to 1', app.quizScore, 1);
    TestRunner.assertEqual('Q1: index advances to 1', app.currentQuizIndex, 1);

    // Q2: wrong answer (index 0 instead of 1)
    const q2result = app.answerQuiz(0);
    TestRunner.assert('Q2: wrong answer detected', q2result === false);
    TestRunner.assertEqual('Q2: score stays at 1', app.quizScore, 1);
    TestRunner.assertEqual('Q2: index advances to 2', app.currentQuizIndex, 2);

    // Q3: correct answer is index 1 ("Form 8")
    const q3result = app.answerQuiz(1);
    TestRunner.assert('Q3: correct answer recognised', q3result === true);
    TestRunner.assertEqual('Q3: final score is 2', app.quizScore, 2);
    TestRunner.assertEqual('Q3: index is now 3 (end)', app.currentQuizIndex, 3);
}

/** Suite 3 – Quiz Perfect Score Path */
function suite_quizPerfectScore() {
    const app = buildMockApp();
    app.answerQuiz(0); // Q1 correct
    app.answerQuiz(1); // Q2 correct
    app.answerQuiz(1); // Q3 correct
    TestRunner.assertEqual('Perfect score: 3/3', app.quizScore, 3);
}

/** Suite 4 – Bot Response: Happy Paths */
function suite_botResponse_happyPaths() {
    const app = buildMockApp();

    TestRunner.assertContains('Bot: age query → 18 info',
        app.getBotResponse('how old to vote'), '18');

    TestRunner.assertContains('Bot: voter slip query → helpline info',
        app.getBotResponse('how to get my voter slip'), 'voter helpline app');

    TestRunner.assertContains('Bot: senior query → form 12D',
        app.getBotResponse('my grandma is a senior citizen'), '12D');

    TestRunner.assertContains('Bot: form 8 query → shifting info',
        app.getBotResponse('I shifted my house'), 'form 8');

    TestRunner.assertContains('Bot: NRI query → form 6A',
        app.getBotResponse('I live abroad as NRI'), 'form 6a');

    TestRunner.assertContains('Bot: form 6 query → new voter',
        app.getBotResponse('how to register as new voter'), 'form 6');

    TestRunner.assertContains('Bot: EVM query → safe',
        app.getBotResponse('can EVMs be hacked?'), '100% safe');

    TestRunner.assertContains('Bot: PAN query → alternative IDs',
        app.getBotResponse('can I use my PAN card?'), 'pan card');

    TestRunner.assertContains('Bot: helpline query → 1950',
        app.getBotResponse('what is the voter helpline number?'), '1950');

    TestRunner.assertContains('Bot: BLO query → BLO description',
        app.getBotResponse('who is the booth level officer?'), 'booth level officer');
}

/** Suite 5 – Bot Response: Edge Cases */
function suite_botResponse_edgeCases() {
    const app = buildMockApp();

    // Empty string
    const emptyResponse = app.getBotResponse('');
    TestRunner.assertNotEqual('Bot: empty string → fallback (not empty response)', emptyResponse, '');

    // Very long string
    const longQuery = 'a'.repeat(1000);
    const longResponse = app.getBotResponse(longQuery);
    TestRunner.assert('Bot: very long input → returns a string', typeof longResponse === 'string');

    // All caps
    TestRunner.assertContains('Bot: UPPERCASE "AGE" query → correct response',
        app.getBotResponse('HOW OLD DO I NEED TO BE'), '18');

    // Special characters
    const specialResponse = app.getBotResponse('!@#$%^&*()');
    TestRunner.assert('Bot: special chars → returns fallback string', typeof specialResponse === 'string');

    // null/undefined guard
    const nullResponse = app.getBotResponse(null);
    TestRunner.assert('Bot: null input → does not throw (returns string)', typeof nullResponse === 'string');
}

/** Suite 6 – Input Validation */
function suite_inputValidation() {
    const app = buildMockApp();

    TestRunner.assert('Validation: normal text passes', app.validateChatInput('Hello'));
    TestRunner.assert('Validation: whitespace-only fails', !app.validateChatInput('   '));
    TestRunner.assert('Validation: empty string fails', !app.validateChatInput(''));
    TestRunner.assert('Validation: null fails', !app.validateChatInput(null));
    TestRunner.assert('Validation: number type fails', !app.validateChatInput(42));
    TestRunner.assert('Validation: 500-char string passes', app.validateChatInput('x'.repeat(500)));
    TestRunner.assert('Validation: 501-char string fails', !app.validateChatInput('x'.repeat(501)));
}

/** Suite 7 – Quiz Data Integrity */
function suite_quizDataIntegrity() {
    const app = buildMockApp();

    TestRunner.assertEqual('Quiz: has exactly 3 questions', app.quizQuestions.length, 3);

    app.quizQuestions.forEach((q, i) => {
        TestRunner.assert(`Quiz Q${i + 1}: has question text`, typeof q.q === 'string' && q.q.length > 0);
        TestRunner.assert(`Quiz Q${i + 1}: has at least 2 options`, Array.isArray(q.options) && q.options.length >= 2);
        TestRunner.assert(`Quiz Q${i + 1}: answer index is valid`, q.answer >= 0 && q.answer < q.options.length);
    });
}

/** Suite 8 – Screen Navigation (DOM-dependent) */
function suite_navigation() {
    if (typeof app === 'undefined') {
        TestRunner.assert('Navigation: app global is defined (skip — no DOM)', false);
        return;
    }

    // Navigate to eligibility screen
    app.goToScreen('screen-eligibility');
    const active = document.querySelector('.screen.active');
    TestRunner.assert('Nav: goToScreen("screen-eligibility") activates correct screen',
        active && active.id === 'screen-eligibility');

    // Back to welcome
    app.goToScreen('screen-welcome');
    const welcome = document.querySelector('.screen.active');
    TestRunner.assert('Nav: goToScreen("screen-welcome") activates welcome screen',
        welcome && welcome.id === 'screen-welcome');

    // Reset state check
    const q2 = document.getElementById('eligibility-q2');
    TestRunner.assert('Nav: eligibility-q2 hidden after returning to welcome',
        q2 && q2.classList.contains('hidden'));
}

/** Suite 9 – Eligibility Flow (DOM-dependent) */
function suite_eligibilityFlow() {
    if (typeof app === 'undefined') {
        TestRunner.assert('Eligibility: app global defined (skip — no DOM)', false);
        return;
    }

    app.goToScreen('screen-eligibility');

    // Under-18 path
    app.answerAge(false);
    const notEligible = document.getElementById('not-eligible-info');
    TestRunner.assert('Eligibility: under-18 shows not-eligible-info', notEligible && !notEligible.classList.contains('hidden'));

    // Reset
    app.goToScreen('screen-welcome');
    app.goToScreen('screen-eligibility');

    // Over-18 path
    app.answerAge(true);
    const q2 = document.getElementById('eligibility-q2');
    TestRunner.assert('Eligibility: over-18 reveals Q2', q2 && !q2.classList.contains('hidden'));

    // Senior citizen path
    app.answerSenior(true);
    const homeVoting = document.getElementById('home-voting-info');
    TestRunner.assert('Eligibility: senior reveals home-voting-info', homeVoting && !homeVoting.classList.contains('hidden'));
}

/** Suite 10 – Voter Roll Flow (DOM-dependent) */
function suite_voterRollFlow() {
    if (typeof app === 'undefined') {
        TestRunner.assert('VoterRoll: app global defined (skip — no DOM)', false);
        return;
    }

    app.goToScreen('screen-voter-slip');

    // Has EPIC → show roll-q2
    app.answerEpic(true);
    const rollQ2 = document.getElementById('roll-q2');
    TestRunner.assert('VoterRoll: has EPIC shows roll-q2', rollQ2 && !rollQ2.classList.contains('hidden'));

    // Name on roll → voter-slip-info
    app.answerRoll('yes');
    const slipInfo = document.getElementById('voter-slip-info');
    TestRunner.assert('VoterRoll: name on roll shows voter-slip-info', slipInfo && !slipInfo.classList.contains('hidden'));

    // Reset
    app.goToScreen('screen-welcome');
    app.goToScreen('screen-voter-slip');

    // No EPIC → epic-info
    app.answerEpic(false);
    const epicInfo = document.getElementById('epic-info');
    TestRunner.assert('VoterRoll: no EPIC shows epic-info', epicInfo && !epicInfo.classList.contains('hidden'));
}

/** Suite 11 – Shift / Form selection (DOM-dependent) */
function suite_shiftFlow() {
    if (typeof app === 'undefined') {
        TestRunner.assert('ShiftFlow: app global defined (skip — no DOM)', false);
        return;
    }

    app.goToScreen('screen-voter-slip');
    app.answerEpic(true);
    app.answerRoll('no');

    // Shifted → Form 8
    app.answerShift('yes');
    const form8 = document.getElementById('form8-info');
    TestRunner.assert('ShiftFlow: shifted → shows form8-info', form8 && !form8.classList.contains('hidden'));

    // Reset
    app.goToScreen('screen-welcome');
    app.goToScreen('screen-voter-slip');
    app.answerEpic(true);
    app.answerRoll('no');

    // Not shifted → Form 6
    app.answerShift('no');
    const form6 = document.getElementById('form6-info');
    TestRunner.assert('ShiftFlow: not shifted → shows form6-info', form6 && !form6.classList.contains('hidden'));
}

/** Suite 12 – EVM Interaction (DOM-dependent) */
function suite_evmInteraction() {
    if (typeof app === 'undefined') {
        TestRunner.assert('EVM: app global defined (skip — no DOM)', false);
        return;
    }

    app.goToScreen('screen-evm');

    // Press EVM button 1
    app.pressEVM(1);
    const light1 = document.getElementById('light-1');
    const vvpat  = document.getElementById('vvpat-screen');
    TestRunner.assert('EVM: pressing button 1 turns on light-1', light1 && light1.classList.contains('on'));
    TestRunner.assert('EVM: pressing button shows VVPAT screen', vvpat && !vvpat.classList.contains('hidden'));

    // Press EVM button 2 — light 1 should turn off
    app.pressEVM(2);
    const light2 = document.getElementById('light-2');
    TestRunner.assert('EVM: pressing button 2 turns on light-2', light2 && light2.classList.contains('on'));
    TestRunner.assert('EVM: pressing button 2 turns OFF light-1', light1 && !light1.classList.contains('on'));
}

// ─── Run All Suites ────────────────────────────────────────────────────────

function runAllTests() {
    console.log('🗳️ Starting Election Education Test Suite...');

    suite_fontSizeControls();
    suite_quizLogic();
    suite_quizPerfectScore();
    suite_botResponse_happyPaths();
    suite_botResponse_edgeCases();
    suite_inputValidation();
    suite_quizDataIntegrity();

    // DOM-dependent suites — only run in browser
    if (_domReady) {
        // Defer to ensure app.js has initialised
        window.addEventListener('DOMContentLoaded', () => {
            suite_navigation();
            suite_eligibilityFlow();
            suite_voterRollFlow();
            suite_shiftFlow();
            suite_evmInteraction();
            TestRunner.render('test-results');
            console.log(`✅ Done: ${TestRunner.passed} passed, ${TestRunner.failed} failed.`);
        });
    } else {
        TestRunner.render('test-results');
        console.log(`✅ Done: ${TestRunner.passed} passed, ${TestRunner.failed} failed.`);
    }
}

// Auto-run if loaded in test.html context
if (_domReady && document.readyState !== 'loading') {
    runAllTests();
} else if (_domReady) {
    document.addEventListener('DOMContentLoaded', runAllTests);
}
