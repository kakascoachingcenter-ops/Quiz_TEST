const fs = require('fs');

console.log('Testing voice fallback chain...');

// Test 1: MP3 missing, speechSynthesis available
let synthCalledWith = null;

global.Audio = class MockAudio {
    constructor() {
        this.src = '';
    }
    play() {
        // Simulate missing file error
        return Promise.reject(new Error('404 Not Found'));
    }
    pause() {}
    removeAttribute() {}
};

global.document = {
    addEventListener: () => {}
};

global.sessionStorage = {
    getItem: () => null,
    setItem: () => {}
};

global.window = {
    fetch: async () => ({
        ok: true,
        json: async () => ({
            'test-key': { text: 'Hello World', file: 'audio/en/test-key.mp3' }
        })
    }),
    speechSynthesis: {
        getVoices: () => [{ lang: 'en-GB', name: 'British' }],
        speak: (utter) => {
            synthCalledWith = utter.text;
            setTimeout(() => { if (utter.onend) utter.onend(); }, 10);
        },
        cancel: () => {}
    },
    SpeechSynthesisUtterance: class MockUtterance {
        constructor(text) {
            this.text = text;
            this.rate = 1;
            this.pitch = 1;
            this.voice = null;
        }
    },
    dispatchEvent: () => {},
    CustomEvent: class {}
};

const voiceCode = fs.readFileSync('KCI_TableOf2_App/modules/voice.js', 'utf8');
const runVoice = new Function('window', voiceCode);
runVoice(global.window);

async function runTests() {
    await global.window.KCIVoice.loadManifest();
    const res = await global.window.KCIVoice.say('test-key');
    console.log('SpeechSynthesis spoke:', synthCalledWith);
    if (synthCalledWith === 'Hello World' && res === true) {
        console.log('[PASS] When MP3 is missing, speechSynthesis fallback speaks!');
    } else {
        console.error('[FAIL] Fallback did not speak via speechSynthesis');
        process.exit(1);
    }

    // Test 2: Neither MP3 nor speechSynthesis available
    delete global.window.speechSynthesis;
    const silentRes = await global.window.KCIVoice.say('test-key');
    console.log('Silent fallback result:', silentRes);
    if (silentRes === false) {
        console.log('[PASS] When neither MP3 nor speechSynthesis is available, runs silently without throwing!');
    } else {
        console.error('[FAIL] Expected false for silent fallback');
        process.exit(1);
    }
}

runTests();
