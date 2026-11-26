/**
 * modules/voice.js
 * Reusable Voice System for KCI Platform
 * 
 * Features:
 * - Shared HTMLAudioElement for iOS/Android autoplay unlock
 * - Three-tier playback: MP3 file -> window.speechSynthesis (en-GB/en-US, rate 0.85, pitch 1.1) -> silent fallback
 * - Mute control stored in sessionStorage
 * - Queue playback for sentences (per-word, configurable gap)
 * - Safe: Never throws or blocks progression
 */

(function(window) {
    'use strict';

    let manifest = null;
    let isAudioUnlocked = false;
    let enabled = true;
    let speaking = false;
    let currentQueue = [];
    let queueTimer = null;
    let activeUtterance = null;
    const preloadedAudio = new Map();

    // Check mute state from sessionStorage safely
    let muted = false;
    try {
        const storedMute = sessionStorage.getItem('kci_voice_muted');
        if (storedMute !== null) {
            muted = storedMute === 'true';
        }
    } catch (e) {
        muted = false;
    }

    // Shared HTMLAudioElement
    const sharedAudio = new Audio();
    sharedAudio.preload = 'auto';

    // Fetch manifest
    async function loadManifest() {
        if (manifest) return manifest;
        try {
            const fetchFn = window.fetch || (typeof fetch !== 'undefined' ? fetch : null);
            if (fetchFn) {
                const resp = await fetchFn('audio/manifest.json');
                if (resp && resp.ok) {
                    manifest = await resp.json();
                }
            }
        } catch (e) {
            console.warn('[Voice] Could not fetch audio/manifest.json, using fallback synthesis');
        }
        if (!manifest) manifest = {};
        return manifest;
    }
    // Kick off manifest load immediately
    loadManifest();

    // Unlock audio on first user tap/click
    function unlockAudio() {
        if (isAudioUnlocked) return;
        isAudioUnlocked = true;
        // Play silent audio buffer to unlock iOS Safari WebAudio/HTMLAudio
        try {
            sharedAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            const playPromise = sharedAudio.play();
            if (playPromise && playPromise.then) {
                playPromise.then(() => {
                    sharedAudio.pause();
                    sharedAudio.currentTime = 0;
                }).catch(() => {});
            }
        } catch (e) {}

        // Also warm up SpeechSynthesis
        if ('speechSynthesis' in window) {
            try {
                window.speechSynthesis.getVoices();
            } catch (e) {}
        }
    }

    // Bind unlock to first interaction anywhere on page
    ['click', 'touchstart', 'touchend', 'keydown'].forEach(evt => {
        document.addEventListener(evt, unlockAudio, { once: true, passive: true });
    });

    // Pick best English voice for SpeechSynthesis (prefer en-GB, then en-US)
    function getBestVoice() {
        if (!('speechSynthesis' in window)) return null;
        const voices = window.speechSynthesis.getVoices() || [];
        if (!voices.length) return null;

        // 1. British female / British English
        const enGb = voices.find(v => v.lang && (v.lang === 'en-GB' || v.lang.replace('_', '-').startsWith('en-GB')));
        if (enGb) return enGb;

        // 2. US English
        const enUs = voices.find(v => v.lang && (v.lang === 'en-US' || v.lang.replace('_', '-').startsWith('en-US')));
        if (enUs) return enUs;

        // 3. Any English
        const anyEn = voices.find(v => v.lang && v.lang.startsWith('en'));
        if (anyEn) return anyEn;

        return voices[0] || null;
    }

    // Stop all current audio (both HTMLAudio and SpeechSynthesis)
    function stop() {
        speaking = false;
        if (queueTimer) {
            clearTimeout(queueTimer);
            queueTimer = null;
        }
        currentQueue = [];

        try {
            sharedAudio.pause();
            sharedAudio.currentTime = 0;
            sharedAudio.removeAttribute('src');
            sharedAudio.onended = null;
            sharedAudio.onerror = null;
        } catch (e) {}

        if ('speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
            } catch (e) {}
        }
        activeUtterance = null;
    }

    // Speak using SpeechSynthesis fallback
    function speakSynthesis(text) {
        return new Promise(resolve => {
            const synth = window.speechSynthesis || (typeof speechSynthesis !== 'undefined' ? speechSynthesis : null);
            const UtterClass = window.SpeechSynthesisUtterance || (typeof SpeechSynthesisUtterance !== 'undefined' ? SpeechSynthesisUtterance : null);
            if (!synth || !UtterClass || !text) {
                speaking = false;
                resolve(false);
                return;
            }
            try {
                synth.cancel();
                const utter = new UtterClass(text);
                activeUtterance = utter;
                utter.rate = 0.85;
                utter.pitch = 1.1;
                const voice = getBestVoice();
                if (voice) utter.voice = voice;

                utter.onend = () => {
                    speaking = false;
                    activeUtterance = null;
                    resolve(true);
                };
                utter.onerror = (err) => {
                    console.warn('[Voice] SpeechSynthesis error:', err);
                    speaking = false;
                    activeUtterance = null;
                    resolve(false);
                };

                speaking = true;
                synth.speak(utter);
            } catch (e) {
                speaking = false;
                resolve(false);
            }
        });
    }

    // Main say function: key -> MP3 -> SpeechSynthesis -> silent
    async function say(key, options = {}) {
        if (!enabled || muted) {
            return false;
        }

        stop();
        speaking = true;

        if (!manifest) {
            await loadManifest();
        }

        const entry = manifest ? manifest[key] : null;
        const text = entry ? entry.text : key;
        const filePath = entry ? entry.file : `audio/en/${key}.mp3`;

        // 1. Try playing MP3
        const playMp3 = () => new Promise(resolve => {
            if (!filePath) {
                resolve(false);
                return;
            }

            let resolved = false;
            const cleanup = () => {
                sharedAudio.onended = null;
                sharedAudio.onerror = null;
            };

            sharedAudio.onended = () => {
                if (resolved) return;
                resolved = true;
                cleanup();
                speaking = false;
                resolve(true);
            };

            sharedAudio.onerror = () => {
                if (resolved) return;
                resolved = true;
                cleanup();
                resolve(false);
            };

            try {
                sharedAudio.src = filePath;
                const p = sharedAudio.play();
                if (p && p.then) {
                    p.catch(() => {
                        if (resolved) return;
                        resolved = true;
                        cleanup();
                        resolve(false);
                    });
                }
            } catch (e) {
                cleanup();
                resolve(false);
            }
        });

        const mp3Success = await playMp3();
        if (mp3Success) {
            return true;
        }

        // 2. Fallback to SpeechSynthesis
        const synthSuccess = await speakSynthesis(text);
        if (synthSuccess) {
            return true;
        }

        // 3. Silent
        speaking = false;
        return false;
    }

    // sayQueue([keys], { gapMs = 350, onWordStart, onComplete })
    async function sayQueue(keys, options = {}) {
        if (!enabled || muted) {
            if (options.onComplete) options.onComplete();
            return;
        }

        stop();
        if (!keys || !keys.length) {
            if (options.onComplete) options.onComplete();
            return;
        }

        speaking = true;
        currentQueue = [...keys];
        const gapMs = typeof options.gapMs === 'number' ? options.gapMs : 350;

        for (let i = 0; i < currentQueue.length; i++) {
            if (!speaking) break; // cancelled
            const key = currentQueue[i];
            if (options.onWordStart) {
                try {
                    options.onWordStart(key, i);
                } catch (e) {}
            }

            await say(key);

            if (i < currentQueue.length - 1 && speaking) {
                await new Promise(r => {
                    queueTimer = setTimeout(r, gapMs);
                });
            }
        }

        speaking = false;
        if (options.onComplete) {
            try {
                options.onComplete();
            } catch (e) {}
        }
    }

    // Preload instructions or clips
    function preload(keys) {
        if (!Array.isArray(keys)) return;
        keys.forEach(k => {
            const path = manifest && manifest[k] ? manifest[k].file : `audio/en/${k}.mp3`;
            if (path && !preloadedAudio.has(path)) {
                try {
                    const audio = new Audio();
                    audio.src = path;
                    preloadedAudio.set(path, audio);
                } catch (e) {}
            }
        });
    }

    // Mute toggle
    function setMuted(val) {
        muted = Boolean(val);
        try {
            sessionStorage.setItem('kci_voice_muted', muted ? 'true' : 'false');
        } catch (e) {}
        if (muted) {
            stop();
        }
        window.dispatchEvent(new CustomEvent('kci-voice-mute-change', { detail: { muted } }));
    }

    function toggleMute() {
        setMuted(!muted);
        return muted;
    }

    function isMuted() {
        return muted;
    }

    function setEnabled(val) {
        enabled = Boolean(val);
        if (!enabled) stop();
    }

    function isSpeaking() {
        return speaking;
    }

    // Export module
    window.KCIVoice = {
        say,
        sayQueue,
        stop,
        setEnabled,
        isSpeaking,
        isMuted,
        setMuted,
        toggleMute,
        unlockAudio,
        preload,
        loadManifest
    };

})(window);
