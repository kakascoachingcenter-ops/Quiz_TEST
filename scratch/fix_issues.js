// fix_issues.js — Apply targeted fixes to index.html
// Fixes:
//  1. Continue button disabled (call checkS1Validity after full login init setup)
//  2. Replace Web Speech API with neural MP3 voice
//  3. Fix corrupted emoji strings in closeStoryModal / toggleStoryVoice

const fs = require('fs');
const path = require('path');

const filePath = path.resolve('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html');
let html = fs.readFileSync(filePath, 'utf8');

let changes = 0;

// ============================================================
// FIX 1: Call checkS1Validity() on startup so Continue button
//         enables as soon as the page loads (ID field still
//         needs to be typed, but date is pre-filled).
//         
// The initAutoDate() call happens BEFORE the login event
// listeners and checkS1Validity() are defined. We must add a
// SECOND call AFTER the full init block, using a small trick:
// attach it right after all s1Inputs event listeners are set up.
// Find the unique string right before the main btn click handler.
// ============================================================

const FIX1_OLD = `        s1Inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', checkS1Validity);
                input.addEventListener('change', checkS1Validity);
                input.addEventListener('blur', checkS1Validity);
            }
        });`;

const FIX1_NEW = `        s1Inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', checkS1Validity);
                input.addEventListener('change', checkS1Validity);
                input.addEventListener('blur', checkS1Validity);
            }
        });
        // Run once on page load so the button state is correct immediately
        // (date is pre-filled, ID just needs to be typed)
        setTimeout(checkS1Validity, 0);`;

if (html.includes(FIX1_OLD)) {
    html = html.replace(FIX1_OLD, FIX1_NEW);
    changes++;
    console.log('✅ FIX 1 applied: checkS1Validity() called on startup');
} else {
    console.log('⚠️  FIX 1 target not found (may already be applied)');
}

// ============================================================
// FIX 2: Replace Web Speech API toggleStoryVoice() with neural
//         MP3 implementation using zara_story_voice.mp3
// ============================================================

// Replace variable declarations
const FIX2_OLD_DECLS = `let storySpeechUtterance = null;
    let isStorySpeaking = false;`;
const FIX2_NEW_DECLS = `let storyAudioPlayer = null;
    let isStorySpeaking = false;`;

if (html.includes(FIX2_OLD_DECLS)) {
    html = html.replace(FIX2_OLD_DECLS, FIX2_NEW_DECLS);
    changes++;
    console.log('✅ FIX 2a applied: replaced voice variable declarations');
} else {
    console.log('⚠️  FIX 2a: decls not found (checking alternatives)');
    // Try alternate - only one decl
    if (html.includes('let storySpeechUtterance = null;')) {
        html = html.replace('let storySpeechUtterance = null;', 'let storyAudioPlayer = null;');
        changes++;
        console.log('✅ FIX 2a-alt applied');
    }
}

// Replace the full toggleStoryVoice function
const OLD_TOGGLE = `function toggleStoryVoice() {
        if (!('speechSynthesis' in window)) {
            alert("Speech synthesis is not supported in this browser.");
            return;
        }

        const voiceBtn = document.getElementById('btn-story-voice');
        const voiceIcon = document.getElementById('voice-icon');
        const voiceLabel = document.getElementById('voice-label');

        if (window.speechSynthesis.speaking && isStorySpeaking) {
            window.speechSynthesis.cancel();
            isStorySpeaking = false;
            if (voiceIcon) voiceIcon.innerText = "dY\\"S";
            if (voiceLabel) voiceLabel.innerText = "Read Aloud";
            return;
        }

        window.speechSynthesis.cancel(); // Stop any pending speech

        const storyBody = document.getElementById('story-sheet-body');
        const storyText = storyBody ? storyBody.innerText : "";
        if (!storyText.trim()) return;

        storySpeechUtterance = new SpeechSynthesisUtterance(storyText);
        storySpeechUtterance.rate = 0.88; // Calm, gentle storyteller pace for young learners
        storySpeechUtterance.pitch = 1.05;

        const bestVoice = getBestEnglishVoice();
        if (bestVoice) storySpeechUtterance.voice = bestVoice;

        storySpeechUtterance.onstart = () => {
            isStorySpeaking = true;
            if (voiceIcon) voiceIcon.innerText = "\\u{1F6D1}";
            if (voiceLabel) voiceLabel.innerText = "Stop";
        };

        storySpeechUtterance.onend = () => {
            isStorySpeaking = false;
            if (voiceIcon) voiceIcon.innerText = "dY\\"S";
            if (voiceLabel) voiceLabel.innerText = "Read Aloud";
        };

        storySpeechUtterance.onerror = () => {
            isStorySpeaking = false;
            if (voiceIcon) voiceIcon.innerText = "dY\\"S";
            if (voiceLabel) voiceLabel.innerText = "Read Aloud";
        };

        window.speechSynthesis.speak(storySpeechUtterance);
    }`;

// Use a regex to find and replace the full function (handles encoding issues)
const toggleFnRegex = /function toggleStoryVoice\(\)\s*\{[\s\S]*?window\.speechSynthesis\.speak\(storySpeechUtterance\);\s*\}/;

const NEW_TOGGLE = `function toggleStoryVoice() {
        const voiceBtn = document.getElementById('btn-story-voice');
        const voiceIcon = document.getElementById('voice-icon');
        const voiceLabel = document.getElementById('voice-label');

        // Neural MP3 voice (Microsoft Edge TTS - en-US-AnaNeural)
        if (!storyAudioPlayer) {
            storyAudioPlayer = new Audio('zara_story_voice.mp3');
            storyAudioPlayer.onended = () => {
                isStorySpeaking = false;
                if (voiceIcon) { voiceIcon.textContent = ''; voiceIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>'; }
                if (voiceLabel) voiceLabel.textContent = 'Read Aloud';
            };
            storyAudioPlayer.onerror = () => {
                isStorySpeaking = false;
                if (voiceIcon) { voiceIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>'; }
                if (voiceLabel) voiceLabel.textContent = 'Read Aloud';
                console.warn('KCI Voice: Could not load zara_story_voice.mp3');
            };
        }

        if (isStorySpeaking && !storyAudioPlayer.paused) {
            storyAudioPlayer.pause();
            storyAudioPlayer.currentTime = 0;
            isStorySpeaking = false;
            if (voiceIcon) { voiceIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>'; }
            if (voiceLabel) voiceLabel.textContent = 'Read Aloud';
        } else {
            storyAudioPlayer.currentTime = 0;
            const playPromise = storyAudioPlayer.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isStorySpeaking = true;
                    if (voiceIcon) { voiceIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>'; }
                    if (voiceLabel) voiceLabel.textContent = 'Stop';
                }).catch(err => {
                    console.warn('KCI Voice playback error:', err);
                });
            }
        }
    }`;

if (toggleFnRegex.test(html)) {
    html = html.replace(toggleFnRegex, NEW_TOGGLE);
    changes++;
    console.log('✅ FIX 2b applied: toggleStoryVoice() replaced with neural MP3 version');
} else {
    console.log('⚠️  FIX 2b: toggleStoryVoice regex did not match');
    // Try a simpler approach - find by exact function signature
    const idx = html.indexOf('function toggleStoryVoice()');
    if (idx >= 0) {
        console.log('  Found toggleStoryVoice at index', idx, '- context:', JSON.stringify(html.substring(idx, idx+100)));
    }
}

// ============================================================
// FIX 3: Fix closeStoryModal() to stop MP3 instead of Web Speech
// ============================================================
const closeModalRegex = /function closeStoryModal\(\)\s*\{[\s\S]*?window\.speechSynthesis\.cancel\(\);[\s\S]*?\}/;

const NEW_CLOSE = `function closeStoryModal() {
        // Stop neural MP3 if playing
        if (storyAudioPlayer && !storyAudioPlayer.paused) {
            storyAudioPlayer.pause();
            storyAudioPlayer.currentTime = 0;
        }
        isStorySpeaking = false;
        const voiceIcon = document.getElementById('voice-icon');
        const voiceLabel = document.getElementById('voice-label');
        if (voiceIcon) { voiceIcon.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>'; }
        if (voiceLabel) voiceLabel.textContent = 'Read Aloud';

        // Hide story sheet
        const sheet = document.getElementById('story-sheet');
        if (sheet) {
            sheet.style.display = 'none';
            sheet.classList.remove('open');
        }
    }`;

if (closeModalRegex.test(html)) {
    html = html.replace(closeModalRegex, NEW_CLOSE);
    changes++;
    console.log('✅ FIX 3 applied: closeStoryModal() updated for MP3');
} else {
    console.log('⚠️  FIX 3: closeStoryModal regex did not match - trying simpler approach');
    // Find function and show context for debugging
    const idx = html.indexOf('function closeStoryModal()');
    if (idx >= 0) {
        console.log('  Found at:', idx, '| Context:', JSON.stringify(html.substring(idx, idx+300)));
    }
}

// ============================================================
// FIX 4: Remove getBestEnglishVoice function (no longer needed)
// ============================================================
const getBestVoiceRegex = /function getBestEnglishVoice\(\)\s*\{[\s\S]*?\n    \}/;
if (getBestVoiceRegex.test(html)) {
    html = html.replace(getBestVoiceRegex, '// getBestEnglishVoice removed — using neural MP3 instead');
    changes++;
    console.log('✅ FIX 4: getBestEnglishVoice() removed');
}

// ============================================================
// WRITE OUTPUT
// ============================================================
if (changes > 0) {
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`\n✅ Done. Applied ${changes} fix(es) to index.html`);
} else {
    console.log('\n⚠️  No changes applied — check patterns above');
}
