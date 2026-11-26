/**
 * modules/kgWorksheets.js
 * Implementation of W1 (Little Readers - English) and W2 (Number Buddies - Maths)
 * for KCI Platform.
 * 
 * Rules:
 * - STEPPER: one section per screen with Big Back/Next buttons (min 56px tall)
 * - Sticker strip at top: fills when section has an answer (completion only)
 * - NEUTRAL FEEDBACK: gentle highlight + pop, all grading at Verify
 * - Max 3 options per question (except S2 4 letters), >= 56px tap targets
 * - Inline SVGs (Twemoji-style thick friendly outlines)
 * - Font token: --font-letters: "Andika", sans-serif for letter glyphs
 * - Free-Draw Canvas at final section (ungraded)
 */

(function(window) {
    'use strict';

    // SVG Graphics Helper
    const SVG = {
        starEmpty: `<svg class="w-8 h-8 text-gray-300 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        starFilled: `<svg class="w-8 h-8 text-gold drop-shadow transition-transform scale-110" viewBox="0 0 24 24" fill="#f0b429" stroke="#1e3a5f" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
        speaker: `<svg class="w-6 h-6 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`,

        // Items for S3 and S4
        apple: (size = 72) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><path d="M38 18c-2-8 4-12 4-12s-6 1-10 6c-3 4-2 9-2 9s4 0 8-3z" fill="#3f9b6a" stroke="#1e3a5f" stroke-width="2.5" stroke-linejoin="round"/><path d="M36 18c0-4 2-10 2-10" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/><path d="M36 22c-8-6-20-4-24 5-5 11 1 29 12 37 5 3 10 4 12 4s7-1 12-4c11-8 17-26 12-37-4-9-16-11-24-5z" fill="#e8765f" stroke="#1e3a5f" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="26" cy="30" rx="4" ry="7" fill="#ffffff" opacity="0.4"/></svg>`,
        banana: (size = 72) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><path d="M16 54c14 12 36 8 46-12 6-12 3-26 2-30-1-3-4-2-4-2s-1 10-6 19c-7 13-19 20-33 18-3 0-6 3-5 7z" fill="#f0b429" stroke="#1e3a5f" stroke-width="3.5" stroke-linejoin="round"/><path d="M16 54c3 3 6 4 9 4" stroke="#8d6e63" stroke-width="4" stroke-linecap="round"/><path d="M59 12l4-4" stroke="#3f9b6a" stroke-width="3.5" stroke-linecap="round"/></svg>`,
        cake: (size = 72) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><rect x="12" y="34" width="48" height="26" rx="6" fill="#f6efe1" stroke="#1e3a5f" stroke-width="3.5"/><path d="M12 42c4 4 8 4 12 0 4 4 8 4 12 0 4 4 8 4 12 0 4 4 8 4 12 0v-8H12v8z" fill="#e8765f" stroke="#1e3a5f" stroke-width="2.5"/><line x1="36" y1="34" x2="36" y2="20" stroke="#f0b429" stroke-width="4" stroke-linecap="round"/><circle cx="36" cy="14" r="4" fill="#e8765f" stroke="#1e3a5f" stroke-width="2"/></svg>`,
        grapes: (size = 72) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><path d="M36 12c-2-6 2-8 2-8" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/><path d="M38 12c4-2 12 0 12 6s-6 6-12 2" fill="#3f9b6a" stroke="#1e3a5f" stroke-width="2.5"/><circle cx="28" cy="26" r="8" fill="#8b5cf6" stroke="#1e3a5f" stroke-width="3"/><circle cx="44" cy="26" r="8" fill="#8b5cf6" stroke="#1e3a5f" stroke-width="3"/><circle cx="36" cy="36" r="8" fill="#8b5cf6" stroke="#1e3a5f" stroke-width="3"/><circle cx="24" cy="42" r="8" fill="#8b5cf6" stroke="#1e3a5f" stroke-width="3"/><circle cx="48" cy="42" r="8" fill="#8b5cf6" stroke="#1e3a5f" stroke-width="3"/><circle cx="36" cy="52" r="8" fill="#8b5cf6" stroke="#1e3a5f" stroke-width="3"/></svg>`,
        heart: (size = 72) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><path d="M36 58s-22-14-22-28c0-8 6-14 14-14 5 0 8 3 8 3s3-3 8-3c8 0 14 6 14 14 0 14-22 28-22 28z" fill="#e8765f" stroke="#1e3a5f" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="28" cy="24" rx="3" ry="5" fill="#ffffff" opacity="0.4"/></svg>`,
        book: (size = 72) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><path d="M36 24c-8-4-16-4-24 0v30c8-4 16-4 24 0 8-4 16-4 24 0V24c-8-4-16-4-24 0z" fill="#ffffff" stroke="#1e3a5f" stroke-width="3.5" stroke-linejoin="round"/><line x1="36" y1="24" x2="36" y2="54" stroke="#1e3a5f" stroke-width="3"/><path d="M12 24v30" stroke="#3f8fd1" stroke-width="6" stroke-linecap="round"/></svg>`,
        pen: (size = 72) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><g transform="rotate(45 36 36)"><rect x="31" y="14" width="10" height="38" rx="2" fill="#f0b429" stroke="#1e3a5f" stroke-width="3"/><polygon points="31 52 36 62 41 52" fill="#ffffff" stroke="#1e3a5f" stroke-width="3"/><circle cx="36" cy="61" r="1.5" fill="#1e3a5f"/><rect x="29" y="18" width="14" height="6" rx="2" fill="#1e3a5f"/></g></svg>`,
        moon: (size = 72) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><path d="M48 14c-18 2-28 20-22 36 4 10 12 16 18 16-16 6-32-6-32-24 0-16 14-30 30-29 2 0 4 0 6 1z" fill="#f0b429" stroke="#1e3a5f" stroke-width="3.5" stroke-linejoin="round"/><circle cx="54" cy="22" r="2.5" fill="#f0b429"/><circle cx="58" cy="38" r="2" fill="#f0b429"/></svg>`,

        // Words S4
        cat: (size = 80) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><circle cx="36" cy="40" r="24" fill="#f6efe1" stroke="#1e3a5f" stroke-width="3.5"/><polygon points="16 26 22 10 32 20" fill="#e8765f" stroke="#1e3a5f" stroke-width="3" stroke-linejoin="round"/><polygon points="56 26 50 10 40 20" fill="#e8765f" stroke="#1e3a5f" stroke-width="3" stroke-linejoin="round"/><circle cx="27" cy="36" r="3.5" fill="#1e3a5f"/><circle cx="45" cy="36" r="3.5" fill="#1e3a5f"/><polygon points="36 42 33 46 39 46" fill="#e8765f"/><path d="M33 46c0 3 3 4 3 4s3-1 3-4" fill="none" stroke="#1e3a5f" stroke-width="2.5" stroke-linecap="round"/><line x1="12" y1="42" x2="24" y2="44" stroke="#1e3a5f" stroke-width="2"/><line x1="12" y1="48" x2="24" y2="48" stroke="#1e3a5f" stroke-width="2"/><line x1="60" y1="42" x2="48" y2="44" stroke="#1e3a5f" stroke-width="2"/><line x1="60" y1="48" x2="48" y2="48" stroke="#1e3a5f" stroke-width="2"/></svg>`,
        rat: (size = 80) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><circle cx="16" cy="24" r="12" fill="#fdf2ef" stroke="#1e3a5f" stroke-width="3.5"/><circle cx="56" cy="24" r="12" fill="#fdf2ef" stroke="#1e3a5f" stroke-width="3.5"/><circle cx="36" cy="42" r="22" fill="#cbd5e1" stroke="#1e3a5f" stroke-width="3.5"/><circle cx="28" cy="38" r="3" fill="#1e3a5f"/><circle cx="44" cy="38" r="3" fill="#1e3a5f"/><circle cx="36" cy="46" r="4" fill="#e8765f" stroke="#1e3a5f" stroke-width="2"/><line x1="12" y1="46" x2="26" y2="46" stroke="#1e3a5f" stroke-width="2"/><line x1="60" y1="46" x2="46" y2="46" stroke="#1e3a5f" stroke-width="2"/></svg>`,
        man: (size = 80) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><circle cx="36" cy="40" r="22" fill="#fbf7ef" stroke="#1e3a5f" stroke-width="3.5"/><path d="M16 34c0-12 8-20 20-20s20 8 20 20" fill="#8d6e63" stroke="#1e3a5f" stroke-width="3"/><circle cx="27" cy="38" r="3.5" fill="#1e3a5f"/><circle cx="45" cy="38" r="3.5" fill="#1e3a5f"/><path d="M28 48c4 4 12 4 16 0" fill="none" stroke="#1e3a5f" stroke-width="3" stroke-linecap="round"/></svg>`,
        cap: (size = 80) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><path d="M16 46c0-16 10-24 24-24 10 0 18 6 20 16-10 0-24 8-44 8z" fill="#3f8fd1" stroke="#1e3a5f" stroke-width="3.5" stroke-linejoin="round"/><path d="M16 46c10 0 32-4 44-4 6 0 10 4 6 7-6 4-22 7-38 6-8 0-12-5-12-9z" fill="#f0b429" stroke="#1e3a5f" stroke-width="3.5" stroke-linejoin="round"/><circle cx="36" cy="22" r="3" fill="#1e3a5f"/></svg>`,

        // Grass illustration
        grass: `<svg width="80" height="40" viewBox="0 0 80 40" class="inline-block"><path d="M4 36c4-16 12-24 16-24s4 12 6 24c4-18 10-28 16-28s6 14 8 28c4-14 10-22 14-22s6 8 8 22" fill="none" stroke="#3f9b6a" stroke-width="4" stroke-linecap="round"/><line x1="2" y1="36" x2="78" y2="36" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/></svg>`,

        // Shapes
        triangle: (size = 72) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><polygon points="36 12 62 58 10 58" fill="#f0b429" stroke="#1e3a5f" stroke-width="4" stroke-linejoin="round"/></svg>`,
        square: (size = 72) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><rect x="14" y="14" width="44" height="44" rx="6" fill="#3f8fd1" stroke="#1e3a5f" stroke-width="4"/></svg>`,
        circle: (size = 72) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><circle cx="36" cy="36" r="26" fill="#e8765f" stroke="#1e3a5f" stroke-width="4"/></svg>`,
        mango: (size = 64) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><path d="M38 14c-1-6 3-8 3-8" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/><path d="M40 14c6-4 14-2 14 4s-6 6-14 0" fill="#3f9b6a" stroke="#1e3a5f" stroke-width="2"/><path d="M34 16c-10 2-20 12-16 26 4 14 16 22 26 18 12-6 16-22 10-32-6-10-14-13-20-12z" fill="#f0b429" stroke="#1e3a5f" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
        starYellow: (size = 64) => `<svg width="${size}" height="${size}" viewBox="0 0 72 72" class="inline-block"><polygon points="36 6 45 25 66 28 51 43 54 64 36 54 18 64 21 43 6 28 27 25" fill="#f0b429" stroke="#1e3a5f" stroke-width="3.5" stroke-linejoin="round"/></svg>`
    };

    // Shuffle helper (Fisher-Yates)
    function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    // =========================================================================
    // WORKSHEET 1: LITTLE READERS (ENGLISH)
    // =========================================================================

    // Data for W1
    const W1_SECTIONS = [
        { id: 'w1-s1', title: 'Capital and Small', topic: 'Letters', voiceKey: 'en-s1' },
        { id: 'w1-s2', title: 'Grass Letters', topic: 'Letters', voiceKey: 'en-s2' },
        { id: 'w1-s3', title: 'First Sound', topic: 'First Sounds', voiceKey: 'en-s3' },
        { id: 'w1-s4', title: 'Read the Words', topic: 'Reading Words', voiceKey: 'en-s4' },
        { id: 'w1-s5', title: 'Build the Sentence', topic: 'Reading Words', voiceKey: 'en-s5' },
        { id: 'w1-s6', title: 'How do they feel?', topic: 'Feelings', voiceKey: 'en-s6' },
        { id: 'w1-s7', title: 'My Picture', topic: 'Drawing', voiceKey: 'en-draw', isDraw: true }
    ];

    // S1 items
    const W1_S1_ITEMS = [
        { capital: 'B', correct: 'b', options: ['b', 'd', 'p'] },
        { capital: 'D', correct: 'd', options: ['d', 'b', 'q'] },
        { capital: 'P', correct: 'p', options: ['p', 'q', 'b'] },
        { capital: 'Q', correct: 'q', options: ['q', 'p', 'g'] }
    ];

    // S2 items (grass letters: middle line)
    const W1_S2_ITEMS = [
        { options: ['b', 'e', 'h', 'k'], correct: 'e' },
        { options: ['l', 'd', 'm', 'p'], correct: 'm' },
        { options: ['g', 's', 'f', 'y'], correct: 's' },
        { options: ['j', 'k', 'o', 'q'], correct: 'o' }
    ];

    // S3 items (first sound)
    const W1_S3_ITEMS = [
        { name: 'apple', svg: SVG.apple, correct: 'a', options: ['a', 'b', 'd'] },
        { name: 'banana', svg: SVG.banana, correct: 'b', options: ['b', 'g', 'f'] },
        { name: 'cake', svg: SVG.cake, correct: 'c', options: ['c', 'p', 'd'] },
        { name: 'grapes', svg: SVG.grapes, correct: 'g', options: ['g', 'b', 'd'] },
        { name: 'heart', svg: SVG.heart, correct: 'h', options: ['h', 'p', 'q'] },
        { name: 'book', svg: SVG.book, correct: 'b', options: ['b', 'd', 'f'] },
        { name: 'pen', svg: SVG.pen, correct: 'p', options: ['p', 'd', 'c'] },
        { name: 'moon', svg: SVG.moon, correct: 'm', options: ['m', 'n', 'o'] }
    ];

    // S4 items (draw a line: cat, rat, man, cap)
    const W1_S4_ITEMS = [
        { id: 'cat', word: 'cat', svg: SVG.cat },
        { id: 'rat', word: 'rat', svg: SVG.rat },
        { id: 'man', word: 'man', svg: SVG.man },
        { id: 'cap', word: 'cap', svg: SVG.cap }
    ];

    // S5 items (sentences)
    const W1_S5_ITEMS = [
        { id: 's1', words: ['A', 'cat', 'sat'], audioKeys: ['a', 'cat', 'sat'], sentence: 'A cat sat.' },
        { id: 's2', words: ['A', 'rat', 'ran'], audioKeys: ['a', 'rat', 'ran'], sentence: 'A rat ran.' },
        { id: 's3', words: ['The', 'man', 'has', 'a', 'cap'], audioKeys: ['the', 'man', 'has', 'a', 'cap'], sentence: 'The man has a cap.' },
        { id: 's4', words: ['I', 'am', 'a', 'fat', 'cat'], audioKeys: ['I', 'am', 'a', 'fat', 'cat'], sentence: 'I am a fat cat.' }
    ];

    // S6 items (feelings)
    const W1_S6_ITEMS = [
        { feeling: 'happy', correct: 'happy', options: ['happy', 'sad', 'angry'] },
        { feeling: 'sad', correct: 'sad', options: ['sad', 'tired', 'happy'] },
        { feeling: 'tired', correct: 'tired', options: ['tired', 'angry', 'sad'] },
        { feeling: 'angry', correct: 'angry', options: ['angry', 'happy', 'tired'] }
    ];

    // Animated face generator
    function generateFaceSVG(feeling, size = 100) {
        let eyes = '';
        let mouth = '';
        let brows = '';

        if (feeling === 'happy') {
            eyes = `<circle cx="34" cy="42" r="4.5" fill="#1e3a5f"/><circle cx="66" cy="42" r="4.5" fill="#1e3a5f"/>`;
            mouth = `<path d="M36 58c6 10 22 10 28 0" fill="none" stroke="#1e3a5f" stroke-width="4.5" stroke-linecap="round"/>`;
            brows = `<path d="M28 32c4-3 10-3 14 0" fill="none" stroke="#1e3a5f" stroke-width="3" stroke-linecap="round"/><path d="M58 32c4-3 10-3 14 0" fill="none" stroke="#1e3a5f" stroke-width="3" stroke-linecap="round"/>`;
        } else if (feeling === 'sad') {
            eyes = `<circle cx="34" cy="44" r="4.5" fill="#1e3a5f"/><circle cx="66" cy="44" r="4.5" fill="#1e3a5f"/><circle cx="70" cy="52" r="2.5" fill="#3f8fd1"/>`;
            mouth = `<path d="M36 66c6-8 22-8 28 0" fill="none" stroke="#1e3a5f" stroke-width="4.5" stroke-linecap="round"/>`;
            brows = `<path d="M28 32c4 3 10 3 14 0" fill="none" stroke="#1e3a5f" stroke-width="3" stroke-linecap="round"/><path d="M58 32c4 3 10 3 14 0" fill="none" stroke="#1e3a5f" stroke-width="3" stroke-linecap="round"/>`;
        } else if (feeling === 'tired') {
            eyes = `<path d="M28 44h12" stroke="#1e3a5f" stroke-width="4.5" stroke-linecap="round"/><path d="M60 44h12" stroke="#1e3a5f" stroke-width="4.5" stroke-linecap="round"/>`;
            mouth = `<ellipse cx="50" cy="62" rx="6" ry="8" fill="#fdf2ef" stroke="#1e3a5f" stroke-width="3.5"/>`;
            brows = `<text x="74" y="32" font-family="Fredoka" font-size="16" font-weight="700" fill="#3f8fd1">z</text><text x="82" y="22" font-family="Fredoka" font-size="12" font-weight="700" fill="#3f8fd1">z</text>`;
        } else if (feeling === 'angry') {
            eyes = `<circle cx="34" cy="44" r="4.5" fill="#1e3a5f"/><circle cx="66" cy="44" r="4.5" fill="#1e3a5f"/>`;
            mouth = `<path d="M38 64h24" stroke="#1e3a5f" stroke-width="4.5" stroke-linecap="round"/>`;
            brows = `<path d="M26 34l14 6" stroke="#1e3a5f" stroke-width="4" stroke-linecap="round"/><path d="M74 34l-14 6" stroke="#1e3a5f" stroke-width="4" stroke-linecap="round"/>`;
        }

        return `
            <svg width="${size}" height="${size}" viewBox="0 0 100 100" class="face-svg transition-transform hover:scale-105 duration-200">
                <circle cx="50" cy="50" r="44" fill="#fef8eb" stroke="#1e3a5f" stroke-width="4.5"/>
                <g class="face-brows">${brows}</g>
                <g class="face-eyes">${eyes}</g>
                <g class="face-mouth">${mouth}</g>
            </svg>
        `;
    }

    // State for W1 Little Readers
    window.kgEnglishState = {
        currentStep: 0,
        s1Answers: {},
        s2Answers: {},
        s3Answers: {},
        s4Connections: {}, // pictureId -> wordId
        s5Sentences: {},   // sentenceId -> [words]
        s6Answers: {},
        drawCanvas: null
    };

    function renderKgEnglishWorksheet() {
        const container = document.getElementById('screen-worksheet-kg-english-nov26');
        if (!container) return;
        if (container.dataset.rendered === 'true') return;
        container.dataset.rendered = 'true';

        let html = `
            <div class="kg-worksheet-wrapper max-w-4xl mx-auto px-4 py-6">
                <!-- Top Sticker Strip -->
                <div class="kg-sticker-bar flex items-center justify-between gap-2 p-3 sm:p-4 mb-6 bg-white rounded-2xl border-2 border-paper-edge shadow-sm">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-heading font-bold text-navy uppercase tracking-wider hidden sm:inline">Progress</span>
                        <div class="sticker-strip flex items-center gap-1 sm:gap-2" id="w1-sticker-strip">
                            ${W1_SECTIONS.map((sec, i) => `
                                <div class="sticker-slot flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-gray-300 transition-all" data-step="${i}" title="${sec.title}">
                                    ${SVG.starEmpty}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="step-indicator text-sm sm:text-base font-heading font-bold text-graphite" id="w1-step-label">
                        Section 1 of 7
                    </div>
                </div>

                <!-- Sections Container -->
                <div class="kg-sections-container">
        `;

        // Section 1: Capital and Small
        html += `
            <section class="kg-section-step active" id="w1-sec-0" data-step="0">
                <div class="kci-paper-card p-6 sm:p-8 mb-6">
                    <div class="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-paper-edge">
                        <div class="flex items-center gap-3">
                            <button type="button" class="btn-step-voice p-2 rounded-full hover:bg-gold-light text-navy transition-colors" data-key="en-s1" aria-label="Listen to instruction">
                                ${SVG.speaker}
                            </button>
                            <div>
                                <h3 class="text-2xl sm:text-3xl font-heading font-bold text-navy">Capital and Small</h3>
                                <p class="text-base text-graphite font-medium">Tap the small partner for each letter.</p>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        ${W1_S1_ITEMS.map((item, idx) => {
                            const shuffled = shuffleArray(item.options);
                            return `
                                <div class="w1-s1-q p-5 rounded-2xl bg-[#faf6ed] border-2 border-[#ecdcb9] flex flex-col items-center gap-4" data-q="${idx}" data-correct="${item.correct}">
                                    <div class="flex items-center justify-center w-20 h-20 rounded-2xl bg-white border-2 border-navy shadow-sm">
                                        <span class="font-letters text-5xl font-bold text-navy">${item.capital}</span>
                                    </div>
                                    <div class="options-row flex items-center justify-center gap-3 w-full">
                                        ${shuffled.map(opt => `
                                            <button type="button" class="w1-s1-opt flex-1 min-h-[56px] py-3 px-4 rounded-xl border-2 border-navy/30 bg-white hover:border-navy text-navy font-letters text-3xl font-bold shadow-sm transition-all" data-val="${opt}">
                                                ${opt}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </section>
        `;

        // Section 2: Grass Letters
        html += `
            <section class="kg-section-step hidden" id="w1-sec-1" data-step="1">
                <div class="kci-paper-card p-6 sm:p-8 mb-6">
                    <div class="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-paper-edge">
                        <div class="flex items-center gap-3">
                            <button type="button" class="btn-step-voice p-2 rounded-full hover:bg-gold-light text-navy transition-colors" data-key="en-s2" aria-label="Listen to instruction">
                                ${SVG.speaker}
                            </button>
                            <div>
                                <h3 class="text-2xl sm:text-3xl font-heading font-bold text-navy">Grass Letters</h3>
                                <p class="text-base text-graphite font-medium">Some letters live in the grass. Tap the grass letter.</p>
                            </div>
                        </div>
                        <div class="hidden sm:block">${SVG.grass}</div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        ${W1_S2_ITEMS.map((item, idx) => {
                            const shuffled = shuffleArray(item.options);
                            return `
                                <div class="w1-s2-q p-5 rounded-2xl bg-[#f2f9f5] border-2 border-[#b8e2cb] flex flex-col items-center gap-4" data-q="${idx}" data-correct="${item.correct}">
                                    <div class="text-sm font-heading font-bold text-success flex items-center gap-2">
                                        <span>Find the grass letter</span>
                                        <span class="w-3 h-3 rounded-full bg-success inline-block"></span>
                                    </div>
                                    <div class="options-row flex items-center justify-center gap-3 w-full">
                                        ${shuffled.map(opt => `
                                            <button type="button" class="w1-s2-opt flex-1 min-h-[56px] py-3 px-3 rounded-xl border-2 border-navy/30 bg-white hover:border-navy text-navy font-letters text-3xl font-bold shadow-sm transition-all" data-val="${opt}">
                                                ${opt}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </section>
        `;

        // Section 3: First Sound
        html += `
            <section class="kg-section-step hidden" id="w1-sec-2" data-step="2">
                <div class="kci-paper-card p-6 sm:p-8 mb-6">
                    <div class="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-paper-edge">
                        <div class="flex items-center gap-3">
                            <button type="button" class="btn-step-voice p-2 rounded-full hover:bg-gold-light text-navy transition-colors" data-key="en-s3" aria-label="Listen to instruction">
                                ${SVG.speaker}
                            </button>
                            <div>
                                <h3 class="text-2xl sm:text-3xl font-heading font-bold text-navy">First Sound</h3>
                                <p class="text-base text-graphite font-medium">Tap the picture to hear it. Tap its first letter.</p>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        ${W1_S3_ITEMS.map((item, idx) => {
                            const shuffled = shuffleArray(item.options);
                            return `
                                <div class="w1-s3-q p-4 rounded-2xl bg-white border-2 border-paper-edge shadow-sm flex flex-col items-center gap-3" data-q="${idx}" data-word="${item.name}" data-correct="${item.correct}">
                                    <button type="button" class="btn-speak-pic p-2 rounded-2xl hover:bg-lightBlue/40 transition-transform active:scale-95 flex flex-col items-center" data-word="${item.name}" title="Listen: ${item.name}">
                                        ${item.svg(80)}
                                        <span class="text-xs font-heading font-bold text-navy mt-1 opacity-75">${item.name}</span>
                                    </button>
                                    <div class="options-row flex items-center justify-center gap-2 w-full">
                                        ${shuffled.map(opt => `
                                            <button type="button" class="w1-s3-opt flex-1 min-h-[56px] py-2 px-2 rounded-xl border-2 border-navy/30 bg-white hover:border-navy text-navy font-letters text-2xl font-bold shadow-sm transition-all" data-val="${opt}">
                                                ${opt}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </section>
        `;

        // Section 4: Read the Words (Draw-a-line Match)
        html += `
            <section class="kg-section-step hidden" id="w1-sec-3" data-step="3">
                <div class="kci-paper-card p-6 sm:p-8 mb-6">
                    <div class="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-paper-edge">
                        <div class="flex items-center gap-3">
                            <button type="button" class="btn-step-voice p-2 rounded-full hover:bg-gold-light text-navy transition-colors" data-key="en-s4" aria-label="Listen to instruction">
                                ${SVG.speaker}
                            </button>
                            <div>
                                <h3 class="text-2xl sm:text-3xl font-heading font-bold text-navy">Read the Words</h3>
                                <p class="text-base text-graphite font-medium">Match each picture to its word.</p>
                            </div>
                        </div>
                    </div>

                    <div class="relative max-w-lg mx-auto py-4">
                        <svg class="line-match-canvas absolute inset-0 w-full h-full pointer-events-none z-10" id="w1-line-canvas"></svg>
                        <div class="grid grid-cols-2 gap-8 sm:gap-16 relative z-20">
                            <!-- Left: Pictures -->
                            <div class="flex flex-col gap-5" id="w1-match-left">
                                ${W1_S4_ITEMS.map(item => `
                                    <button type="button" class="w1-match-node left-node min-h-[72px] p-2 rounded-2xl border-2 border-navy/30 bg-white hover:border-navy flex items-center justify-center gap-2 shadow-sm transition-all" data-id="${item.id}" data-word="${item.word}">
                                        ${item.svg(56)}
                                    </button>
                                `).join('')}
                            </div>
                            <!-- Right: Words (shuffled) -->
                            <div class="flex flex-col gap-5" id="w1-match-right">
                                ${shuffleArray(W1_S4_ITEMS).map(item => `
                                    <button type="button" class="w1-match-node right-node min-h-[72px] p-2 rounded-2xl border-2 border-navy/30 bg-white hover:border-navy flex items-center justify-center shadow-sm text-navy font-heading font-bold text-2xl transition-all" data-id="${item.id}" data-word="${item.word}">
                                        ${item.word}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Section 5: Build the Sentence
        html += `
            <section class="kg-section-step hidden" id="w1-sec-4" data-step="4">
                <div class="kci-paper-card p-6 sm:p-8 mb-6">
                    <div class="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-paper-edge">
                        <div class="flex items-center gap-3">
                            <button type="button" class="btn-step-voice p-2 rounded-full hover:bg-gold-light text-navy transition-colors" data-key="en-s5" aria-label="Listen to instruction">
                                ${SVG.speaker}
                            </button>
                            <div>
                                <h3 class="text-2xl sm:text-3xl font-heading font-bold text-navy">Build the Sentence</h3>
                                <p class="text-base text-graphite font-medium">Tap word tiles into slots in order.</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-8">
                        ${W1_S5_ITEMS.map((item, idx) => {
                            const shuffledWords = shuffleArray(item.words);
                            return `
                                <div class="w1-s5-item p-5 rounded-2xl bg-white border-2 border-paper-edge shadow-sm" data-idx="${idx}" data-id="${item.id}" data-expected="${item.words.join(' ')}">
                                    <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
                                        <span class="text-sm font-heading font-bold text-navy bg-lightBlue px-3 py-1 rounded-full">Sentence ${idx + 1}</span>
                                        <button type="button" class="btn-hear-sentence btn btn-ghost text-sm font-heading font-bold text-navy hover:bg-gold/20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-navy/30 min-h-[44px]" data-idx="${idx}">
                                            ${SVG.speaker}
                                            <span>Hear my sentence</span>
                                        </button>
                                    </div>

                                    <!-- Sentence Slots -->
                                    <div class="sentence-slots-wrap min-h-[64px] p-3 rounded-xl bg-paper border-2 border-dashed border-navy/30 flex flex-wrap items-center gap-2 mb-4" data-idx="${idx}">
                                        ${item.words.map((w, sIdx) => `
                                            <div class="w1-word-slot min-w-[70px] min-h-[48px] px-3 py-2 rounded-xl border-2 border-dashed border-navy/40 bg-white/60 flex items-center justify-center font-heading font-bold text-lg text-navy transition-all" data-slot="${sIdx}"></div>
                                        `).join('')}
                                    </div>

                                    <!-- Shuffled Word Tray -->
                                    <div class="word-tray flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100" data-idx="${idx}">
                                        ${shuffledWords.map((word, wIdx) => `
                                            <button type="button" class="w1-tray-tile min-h-[48px] px-4 py-2 rounded-xl border-2 border-navy bg-white hover:bg-gold-light text-navy font-heading font-bold text-lg shadow-sm transition-all" data-word="${word}">
                                                ${word}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </section>
        `;

        // Section 6: How do they feel?
        html += `
            <section class="kg-section-step hidden" id="w1-sec-5" data-step="5">
                <div class="kci-paper-card p-6 sm:p-8 mb-6">
                    <div class="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-paper-edge">
                        <div class="flex items-center gap-3">
                            <button type="button" class="btn-step-voice p-2 rounded-full hover:bg-gold-light text-navy transition-colors" data-key="en-s6" aria-label="Listen to instruction">
                                ${SVG.speaker}
                            </button>
                            <div>
                                <h3 class="text-2xl sm:text-3xl font-heading font-bold text-navy">How do they feel?</h3>
                                <p class="text-base text-graphite font-medium">Look at the face. Tap the feeling word.</p>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        ${W1_S6_ITEMS.map((item, idx) => {
                            const shuffled = shuffleArray(item.options);
                            return `
                                <div class="w1-s6-q p-5 rounded-2xl bg-white border-2 border-paper-edge shadow-sm flex flex-col items-center gap-4" data-q="${idx}" data-correct="${item.correct}">
                                    <div class="face-wrap p-2">
                                        ${generateFaceSVG(item.feeling, 100)}
                                    </div>
                                    <div class="options-row flex flex-wrap items-center justify-center gap-3 w-full">
                                        ${shuffled.map(opt => `
                                            <button type="button" class="w1-s6-opt flex-1 min-h-[56px] py-3 px-3 rounded-xl border-2 border-navy/30 bg-white hover:border-navy text-navy font-heading text-lg font-bold shadow-sm transition-all capitalize" data-val="${opt}">
                                                ${opt}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </section>
        `;

        // Section 7: Free-Draw Canvas (Ungraded)
        html += `
            <section class="kg-section-step hidden" id="w1-sec-6" data-step="6">
                <div id="w1-draw-canvas-container"></div>
            </section>
        `;

        // Bottom Navigation Bar
        html += `
                </div><!-- /.kg-sections-container -->

                <!-- Navigation Controls (Min 56px Tall) -->
                <div class="kg-stepper-nav flex items-center justify-between gap-4 mt-8 pt-4 border-t-2 border-paper-edge">
                    <button type="button" class="btn-kg-back btn min-h-[56px] py-3 px-6 rounded-2xl border-2 border-navy text-navy bg-white hover:bg-gray-100 font-heading font-bold text-xl transition-all shadow-sm flex items-center gap-2" id="w1-btn-back">
                        <svg class="w-6 h-6 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        <span>Back</span>
                    </button>

                    <button type="button" class="btn-kg-next btn btn-gold min-h-[56px] py-3 px-8 rounded-2xl border-2 border-navy text-navy font-heading font-bold text-xl transition-all shadow-md flex items-center gap-2" id="w1-btn-next">
                        <span>Next</span>
                        <svg class="w-6 h-6 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>

                    <button type="button" class="btn-kg-verify btn btn-gold min-h-[56px] py-3 px-8 rounded-2xl border-2 border-navy text-navy font-heading font-bold text-xl transition-all shadow-xl hidden flex items-center gap-2" id="w1-btn-verify">
                        <span>Check my answers</span>
                        <svg class="w-6 h-6 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                </div>

                <!-- Footer with CC-BY and Phone -->
                <div class="mt-8 text-center text-xs text-gray-500 font-medium">
                    <span>Illustrations CC-BY 4.0 Twemoji &bull; KCI Contact: 0300-2917500</span>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Instantiate FreeDrawCanvas in Section 7
        window.kgEnglishState.drawCanvas = new window.FreeDrawCanvas('#w1-draw-canvas-container', {
            prompt: 'Draw your favourite animal.',
            voiceKey: 'en-draw',
            onDrawChange: (hasDrawing) => {
                updateW1Sticker(6, hasDrawing);
            },
            onSkip: () => {
                updateW1Sticker(6, true);
            }
        });
    }

    function updateW1Sticker(stepIdx, isFilled) {
        const slot = document.querySelector(`#w1-sticker-strip .sticker-slot[data-step="${stepIdx}"]`);
        if (!slot) return;
        if (isFilled) {
            slot.innerHTML = SVG.starFilled;
            slot.classList.add('border-gold', 'bg-gold-light');
            slot.classList.remove('border-gray-300');
        } else {
            slot.innerHTML = SVG.starEmpty;
            slot.classList.remove('border-gold', 'bg-gold-light');
            slot.classList.add('border-gray-300');
        }
    }

    function checkW1SectionCompletion(stepIdx) {
        const state = window.kgEnglishState;
        if (stepIdx === 0) return Object.keys(state.s1Answers).length > 0;
        if (stepIdx === 1) return Object.keys(state.s2Answers).length > 0;
        if (stepIdx === 2) return Object.keys(state.s3Answers).length > 0;
        if (stepIdx === 3) return Object.keys(state.s4Connections).length > 0;
        if (stepIdx === 4) return Object.keys(state.s5Sentences).length > 0;
        if (stepIdx === 5) return Object.keys(state.s6Answers).length > 0;
        if (stepIdx === 6) return (state.drawCanvas && state.drawCanvas.hasDrawing()) || (state.drawCanvas && state.drawCanvas.isSkipped);
        return false;
    }

    function registerKgEnglishInteractivity() {
        const container = document.getElementById('screen-worksheet-kg-english-nov26');
        if (!container) return;

        const state = window.kgEnglishState;
        const totalSteps = W1_SECTIONS.length; // 7

        const btnBack = document.getElementById('w1-btn-back');
        const btnNext = document.getElementById('w1-btn-next');
        const btnVerify = document.getElementById('w1-btn-verify');
        const stepLabel = document.getElementById('w1-step-label');

        function updateStepUI() {
            // Hide all steps, show current
            for (let i = 0; i < totalSteps; i++) {
                const sec = document.getElementById(`w1-sec-${i}`);
                if (sec) {
                    if (i === state.currentStep) {
                        sec.classList.remove('hidden');
                        sec.classList.add('active');
                    } else {
                        sec.classList.add('hidden');
                        sec.classList.remove('active');
                    }
                }
            }

            // Update label
            if (stepLabel) {
                stepLabel.textContent = `Section ${state.currentStep + 1} of ${totalSteps}`;
            }

            // Update Back button
            if (btnBack) {
                btnBack.disabled = state.currentStep === 0;
                btnBack.style.opacity = state.currentStep === 0 ? '0.4' : '1';
            }

            // Update Next / Verify buttons
            if (state.currentStep === totalSteps - 1) {
                btnNext.classList.add('hidden');
                btnVerify.classList.remove('hidden');
            } else {
                btnNext.classList.remove('hidden');
                btnVerify.classList.add('hidden');
            }

            // Auto-play section instruction
            const secInfo = W1_SECTIONS[state.currentStep];
            if (secInfo && secInfo.voiceKey && window.KCIVoice) {
                // Preload current + next section
                const nextSec = W1_SECTIONS[state.currentStep + 1];
                const preloadKeys = [secInfo.voiceKey];
                if (nextSec && nextSec.voiceKey) preloadKeys.push(nextSec.voiceKey);
                window.KCIVoice.preload(preloadKeys);

                window.KCIVoice.say(secInfo.voiceKey);
            }

            // If draw step, trigger resize on canvas
            if (state.currentStep === 6 && state.drawCanvas) {
                setTimeout(() => state.drawCanvas.setupCanvas(), 50);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Stepper Navigation
        btnNext.onclick = () => {
            if (state.currentStep < totalSteps - 1) {
                state.currentStep++;
                updateStepUI();
            }
        };

        btnBack.onclick = () => {
            if (state.currentStep > 0) {
                state.currentStep--;
                updateStepUI();
            }
        };

        btnVerify.onclick = () => {
            // Grade worksheet and proceed to results
            gradeWorksheetKgEnglish();
            if (window.showValueTipThenResults) {
                window.showValueTipThenResults();
            }
        };

        // Section Voice Replay buttons
        container.querySelectorAll('.btn-step-voice').forEach(btn => {
            btn.onclick = () => {
                const key = btn.dataset.key;
                if (key && window.KCIVoice) window.KCIVoice.say(key);
            };
        });

        // S1: Capital and Small selection
        container.querySelectorAll('.w1-s1-q').forEach(qEl => {
            const qIdx = qEl.dataset.q;
            qEl.querySelectorAll('.w1-s1-opt').forEach(optBtn => {
                optBtn.onclick = () => {
                    qEl.querySelectorAll('.w1-s1-opt').forEach(b => {
                        b.classList.remove('bg-lightBlue', 'border-navy', 'ring-2', 'ring-gold');
                    });
                    optBtn.classList.add('bg-lightBlue', 'border-navy', 'ring-2', 'ring-gold');
                    state.s1Answers[qIdx] = optBtn.dataset.val;

                    // Speak letter name
                    const letter = optBtn.dataset.val.toLowerCase();
                    if (window.KCIVoice) window.KCIVoice.say(`name-${letter}`);

                    updateW1Sticker(0, checkW1SectionCompletion(0));
                };
            });
        });

        // S2: Grass Letters selection
        container.querySelectorAll('.w1-s2-q').forEach(qEl => {
            const qIdx = qEl.dataset.q;
            qEl.querySelectorAll('.w1-s2-opt').forEach(optBtn => {
                optBtn.onclick = () => {
                    qEl.querySelectorAll('.w1-s2-opt').forEach(b => {
                        b.classList.remove('bg-success-light', 'border-success', 'ring-2', 'ring-success');
                    });
                    optBtn.classList.add('bg-success-light', 'border-success', 'ring-2', 'ring-success');
                    state.s2Answers[qIdx] = optBtn.dataset.val;

                    // Speak letter name
                    const letter = optBtn.dataset.val.toLowerCase();
                    if (window.KCIVoice) window.KCIVoice.say(`name-${letter}`);

                    updateW1Sticker(1, checkW1SectionCompletion(1));
                };
            });
        });

        // S3: First Sound selection & Picture audio
        container.querySelectorAll('.w1-s3-q').forEach(qEl => {
            const qIdx = qEl.dataset.q;
            const word = qEl.dataset.word;

            // Picture click -> speak word
            const picBtn = qEl.querySelector('.btn-speak-pic');
            if (picBtn) {
                picBtn.onclick = () => {
                    if (window.KCIVoice) window.KCIVoice.say(word);
                };
            }

            qEl.querySelectorAll('.w1-s3-opt').forEach(optBtn => {
                optBtn.onclick = () => {
                    qEl.querySelectorAll('.w1-s3-opt').forEach(b => {
                        b.classList.remove('bg-lightBlue', 'border-navy', 'ring-2', 'ring-gold');
                    });
                    optBtn.classList.add('bg-lightBlue', 'border-navy', 'ring-2', 'ring-gold');
                    state.s3Answers[qIdx] = optBtn.dataset.val;

                    // Speak letter phonics / name
                    const letter = optBtn.dataset.val.toLowerCase();
                    if (window.KCIVoice) window.KCIVoice.say(`letter-${letter}`);

                    updateW1Sticker(2, checkW1SectionCompletion(2));
                };
            });
        });

        // S4: Draw-a-Line Matching
        let selectedLeftNode = null;
        const lineCanvas = document.getElementById('w1-line-canvas');

        function redrawLines() {
            if (!lineCanvas) return;
            lineCanvas.innerHTML = '';
            const canvasRect = lineCanvas.getBoundingClientRect();

            Object.entries(state.s4Connections).forEach(([leftId, rightId]) => {
                const leftEl = container.querySelector(`.left-node[data-id="${leftId}"]`);
                const rightEl = container.querySelector(`.right-node[data-id="${rightId}"]`);
                if (leftEl && rightEl) {
                    const lRect = leftEl.getBoundingClientRect();
                    const rRect = rightEl.getBoundingClientRect();

                    const x1 = lRect.right - canvasRect.left;
                    const y1 = lRect.top + lRect.height / 2 - canvasRect.top;
                    const x2 = rRect.left - canvasRect.left;
                    const y2 = rRect.top + rRect.height / 2 - canvasRect.top;

                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', x1);
                    line.setAttribute('y1', y1);
                    line.setAttribute('x2', x2);
                    line.setAttribute('y2', y2);
                    line.setAttribute('stroke', '#1e3a5f');
                    line.setAttribute('stroke-width', '4');
                    line.setAttribute('stroke-linecap', 'round');
                    line.setAttribute('stroke-dasharray', '8 4');
                    lineCanvas.appendChild(line);
                }
            });
        }

        window.addEventListener('resize', redrawLines);

        container.querySelectorAll('.left-node').forEach(node => {
            node.onclick = () => {
                selectedLeftNode = node.dataset.id;
                container.querySelectorAll('.left-node').forEach(n => n.classList.remove('ring-2', 'ring-gold', 'bg-gold-light'));
                node.classList.add('ring-2', 'ring-gold', 'bg-gold-light');

                const word = node.dataset.word;
                if (word && window.KCIVoice) window.KCIVoice.say(word);
            };
        });

        container.querySelectorAll('.right-node').forEach(node => {
            node.onclick = () => {
                const word = node.dataset.word;
                if (word && window.KCIVoice) window.KCIVoice.say(word);

                if (selectedLeftNode) {
                    state.s4Connections[selectedLeftNode] = node.dataset.id;
                    container.querySelectorAll('.left-node').forEach(n => n.classList.remove('ring-2', 'ring-gold', 'bg-gold-light'));
                    selectedLeftNode = null;
                    redrawLines();
                    updateW1Sticker(3, checkW1SectionCompletion(3));
                }
            };
        });

        // S5: Build the Sentence
        container.querySelectorAll('.w1-s5-item').forEach(itemEl => {
            const idx = itemEl.dataset.idx;
            const slotsWrap = itemEl.querySelector('.sentence-slots-wrap');
            const wordTray = itemEl.querySelector('.word-tray');
            const wordsPlaced = [];

            function refreshSlots() {
                const slots = slotsWrap.querySelectorAll('.w1-word-slot');
                slots.forEach((s, i) => {
                    if (wordsPlaced[i]) {
                        s.textContent = wordsPlaced[i];
                        s.classList.add('bg-navy', 'text-white', 'border-solid');
                        s.classList.remove('bg-white/60', 'text-navy', 'border-dashed');
                        s.style.cursor = 'pointer';
                        s.onclick = () => {
                            // Return word to tray
                            const removed = wordsPlaced.splice(i, 1)[0];
                            // Restore in tray
                            wordTray.querySelectorAll('.w1-tray-tile').forEach(tile => {
                                if (tile.dataset.word === removed && tile.style.display === 'none') {
                                    tile.style.display = 'inline-flex';
                                }
                            });
                            refreshSlots();
                        };
                    } else {
                        s.textContent = '';
                        s.classList.remove('bg-navy', 'text-white', 'border-solid');
                        s.classList.add('bg-white/60', 'text-navy', 'border-dashed');
                        s.style.cursor = 'default';
                        s.onclick = null;
                    }
                });

                state.s5Sentences[idx] = [...wordsPlaced];
                updateW1Sticker(4, checkW1SectionCompletion(4));
            }

            // Word tray tile tap
            wordTray.querySelectorAll('.w1-tray-tile').forEach(tile => {
                tile.onclick = () => {
                    const word = tile.dataset.word;
                    wordsPlaced.push(word);
                    tile.style.display = 'none';
                    if (window.KCIVoice) window.KCIVoice.say(word);
                    refreshSlots();
                };
            });

            // "Hear my sentence" button
            const hearBtn = itemEl.querySelector('.btn-hear-sentence');
            if (hearBtn) {
                hearBtn.onclick = () => {
                    if (!wordsPlaced.length) return;
                    if (window.KCIVoice) {
                        const slots = slotsWrap.querySelectorAll('.w1-word-slot');
                        window.KCIVoice.sayQueue(wordsPlaced, {
                            gapMs: 350,
                            onWordStart: (w, wordIndex) => {
                                slots.forEach((s, si) => {
                                    if (si === wordIndex) {
                                        s.classList.add('ring-4', 'ring-gold');
                                    } else {
                                        s.classList.remove('ring-4', 'ring-gold');
                                    }
                                });
                            },
                            onComplete: () => {
                                slots.forEach(s => s.classList.remove('ring-4', 'ring-gold'));
                            }
                        });
                    }
                };
            }
        });

        // S6: How do they feel?
        container.querySelectorAll('.w1-s6-q').forEach(qEl => {
            const qIdx = qEl.dataset.q;
            qEl.querySelectorAll('.w1-s6-opt').forEach(optBtn => {
                optBtn.onclick = () => {
                    qEl.querySelectorAll('.w1-s6-opt').forEach(b => {
                        b.classList.remove('bg-gold-light', 'border-navy', 'ring-2', 'ring-gold');
                    });
                    optBtn.classList.add('bg-gold-light', 'border-navy', 'ring-2', 'ring-gold');
                    state.s6Answers[qIdx] = optBtn.dataset.val;

                    const feeling = optBtn.dataset.val;
                    if (window.KCIVoice) window.KCIVoice.say(feeling);

                    updateW1Sticker(5, checkW1SectionCompletion(5));
                };
            });
        });

        // Initialize UI
        updateStepUI();
    }

    function gradeWorksheetKgEnglish() {
        const state = window.kgEnglishState;
        window.state.results = [];
        window.state.totalCorrect = 0;

        // 1. S1: Capital and Small (4 items, topic: Letters)
        W1_S1_ITEMS.forEach((item, idx) => {
            const uAns = state.s1Answers[idx] || '';
            const cAns = item.correct;
            const isCorrect = uAns === cAns;
            if (isCorrect) window.state.totalCorrect++;

            window.state.results.push({
                q: `Small letter for ${item.capital}`,
                userAns: uAns || 'None',
                correctAns: cAns,
                isCorrect: isCorrect,
                section: 'Letters',
                topic: 'Letters'
            });
        });

        // 2. S2: Grass Letters (4 items, topic: Letters)
        W1_S2_ITEMS.forEach((item, idx) => {
            const uAns = state.s2Answers[idx] || '';
            const cAns = item.correct;
            const isCorrect = uAns === cAns;
            if (isCorrect) window.state.totalCorrect++;

            window.state.results.push({
                q: `Grass letter in [${item.options.join(', ')}]`,
                userAns: uAns || 'None',
                correctAns: cAns,
                isCorrect: isCorrect,
                section: 'Letters',
                topic: 'Letters'
            });
        });

        // 3. S3: First Sound (8 items, topic: First Sounds)
        W1_S3_ITEMS.forEach((item, idx) => {
            const uAns = state.s3Answers[idx] || '';
            const cAns = item.correct;
            const isCorrect = uAns === cAns;
            if (isCorrect) window.state.totalCorrect++;

            window.state.results.push({
                q: `First sound of ${item.name}`,
                userAns: uAns || 'None',
                correctAns: cAns,
                isCorrect: isCorrect,
                section: 'First Sounds',
                topic: 'First Sounds'
            });
        });

        // 4. S4: Read the Words (4 items, topic: Reading Words)
        W1_S4_ITEMS.forEach(item => {
            const uAns = state.s4Connections[item.id] || '';
            const cAns = item.id;
            const isCorrect = uAns === cAns;
            if (isCorrect) window.state.totalCorrect++;

            window.state.results.push({
                q: `Match picture of ${item.word}`,
                userAns: uAns || 'None',
                correctAns: cAns,
                isCorrect: isCorrect,
                section: 'Reading Words',
                topic: 'Reading Words'
            });
        });

        // 5. S5: Build the Sentence (4 items, topic: Reading Words)
        W1_S5_ITEMS.forEach((item, idx) => {
            const userWords = state.s5Sentences[idx] || [];
            const userStr = userWords.join(' ');
            const expectedStr = item.words.join(' ');
            const isCorrect = userStr.trim() === expectedStr.trim();
            if (isCorrect) window.state.totalCorrect++;

            window.state.results.push({
                q: `Build sentence: "${item.sentence}"`,
                userAns: userStr || 'None',
                correctAns: expectedStr,
                isCorrect: isCorrect,
                section: 'Reading Words',
                topic: 'Reading Words'
            });
        });

        // 6. S6: How do they feel? (4 items, topic: Feelings)
        W1_S6_ITEMS.forEach((item, idx) => {
            const uAns = state.s6Answers[idx] || '';
            const cAns = item.correct;
            const isCorrect = uAns === cAns;
            if (isCorrect) window.state.totalCorrect++;

            window.state.results.push({
                q: `Feeling face: ${item.feeling}`,
                userAns: uAns || 'None',
                correctAns: cAns,
                isCorrect: isCorrect,
                section: 'Feelings',
                topic: 'Feelings'
            });
        });

        // Save drawing dataURL into state if drawn
        if (state.drawCanvas && state.drawCanvas.hasDrawing()) {
            window.state.studentDrawing = state.drawCanvas.getDataURL();
        } else {
            window.state.studentDrawing = null;
        }

        // Print console breakdown for acceptance checks
        const report = window.computeReport ? window.computeReport(window.state.results) : null;
        console.log(`[Verify W1 Little Readers] Total: ${window.state.results.length}/28. Correct: ${window.state.totalCorrect}`);
        if (report) {
            report.topics.forEach(t => {
                console.log(`  Topic "${t.name}": ${t.correct}/${t.total} (${t.percent}%)`);
            });
        }
    }

    // =========================================================================
    // WORKSHEET 2: NUMBER BUDDIES (MATHS)
    // =========================================================================

    const W2_SECTIONS = [
        { id: 'w2-s1', title: 'Count and Choose', topic: 'Counting', voiceKey: 'ma-s1' },
        { id: 'w2-s2', title: 'What Comes Next?', topic: 'Number Order', voiceKey: 'ma-s2' },
        { id: 'w2-s3', title: 'Number Words', topic: 'Number Words', voiceKey: 'ma-s3' },
        { id: 'w2-s4', title: 'Count to 50', topic: 'Number Order', voiceKey: 'ma-s4' },
        { id: 'w2-s5', title: 'Shapes and Size', topic: 'Shapes & Size', voiceKey: 'ma-s5-shape' },
        { id: 'w2-s6', title: 'My Picture', topic: 'Drawing', voiceKey: 'ma-draw', isDraw: true }
    ];

    const W2_S1_ITEMS = [
        { count: 1, name: 'apple', svg: SVG.apple, correct: 'one', options: ['one', 'two'] },
        { count: 2, name: 'apples', svg: SVG.apple, correct: 'two', options: ['two', 'one'] },
        { count: 3, name: 'stars', svg: SVG.starYellow, correct: 'three', options: ['three', 'one'] },
        { count: 4, name: 'mangoes', svg: SVG.mango, correct: 'four', options: ['four', 'two'] },
        { count: 5, name: 'circles', svg: SVG.circle, correct: 'five', options: ['five', 'three'] }
    ];

    const W2_S2_ITEMS = [
        { prompt: '1, 2, __', display: ['1', '2', '__'], correct: 3, options: [3, 4, 2] },
        { prompt: '2, 3, __', display: ['2', '3', '__'], correct: 4, options: [4, 5, 1] },
        { prompt: '3, __, 5', display: ['3', '__', '5'], correct: 4, options: [4, 2, 6] },
        { prompt: '__, 2, 3', display: ['__', '2', '3'], correct: 1, options: [1, 4, 5] }
    ];

    const W2_S3_ITEMS = [
        { word: 'five', digit: '5' },
        { word: 'nine', digit: '9' },
        { word: 'eleven', digit: '11' },
        { word: 'twelve', digit: '12' },
        { word: 'thirteen', digit: '13' }
    ];

    const W2_S4_BLANKS = [8, 17, 25, 36, 44];
    const W2_S4_TILES = [8, 17, 25, 36, 44, 18, 35]; // 5 blanks + 2 distractors

    const W2_S5_SHAPES = [
        { shape: 'triangle', svg: SVG.triangle, correct: 'triangle', options: ['triangle', 'square', 'circle'] },
        { shape: 'square', svg: SVG.square, correct: 'square', options: ['triangle', 'square', 'circle'] },
        { shape: 'circle', svg: SVG.circle, correct: 'circle', options: ['triangle', 'square', 'circle'] }
    ];

    // SVG colourable flower generator
    function generateColourableFlower(isBig = false, prefix = 'fl') {
        const size = isBig ? 140 : 80;
        return `
            <svg width="${size}" height="${size}" viewBox="0 0 100 100" class="colourable-pic cursor-pointer" data-target="${prefix}">
                <!-- Stem & Leaf -->
                <path class="paint-region" data-region="${prefix}-stem" d="M50 50v40" stroke="#8d6e63" stroke-width="6" stroke-linecap="round" fill="none"/>
                <path class="paint-region" data-region="${prefix}-leaf" d="M50 70c12-8 20 0 20 0s-8 12-20 0z" fill="#ffffff" stroke="#1e3a5f" stroke-width="2.5"/>
                <!-- Petals -->
                <circle class="paint-region" data-region="${prefix}-p1" cx="50" cy="24" r="14" fill="#ffffff" stroke="#1e3a5f" stroke-width="3"/>
                <circle class="paint-region" data-region="${prefix}-p2" cx="72" cy="42" r="14" fill="#ffffff" stroke="#1e3a5f" stroke-width="3"/>
                <circle class="paint-region" data-region="${prefix}-p3" cx="64" cy="68" r="14" fill="#ffffff" stroke="#1e3a5f" stroke-width="3"/>
                <circle class="paint-region" data-region="${prefix}-p4" cx="36" cy="68" r="14" fill="#ffffff" stroke="#1e3a5f" stroke-width="3"/>
                <circle class="paint-region" data-region="${prefix}-p5" cx="28" cy="42" r="14" fill="#ffffff" stroke="#1e3a5f" stroke-width="3"/>
                <!-- Center -->
                <circle class="paint-region" data-region="${prefix}-center" cx="50" cy="50" r="15" fill="#ffffff" stroke="#1e3a5f" stroke-width="3.5"/>
            </svg>
        `;
    }

    // SVG colourable house generator
    function generateColourableHouse(isBig = false, prefix = 'hs') {
        const size = isBig ? 150 : 85;
        return `
            <svg width="${size}" height="${size}" viewBox="0 0 100 100" class="colourable-pic cursor-pointer" data-target="${prefix}">
                <!-- Chimney -->
                <rect class="paint-region" data-region="${prefix}-chimney" x="22" y="16" width="12" height="24" rx="2" fill="#ffffff" stroke="#1e3a5f" stroke-width="3"/>
                <!-- Roof -->
                <polygon class="paint-region" data-region="${prefix}-roof" points="50 14 92 46 8 46" fill="#ffffff" stroke="#1e3a5f" stroke-width="3.5" stroke-linejoin="round"/>
                <!-- Main Wall -->
                <rect class="paint-region" data-region="${prefix}-wall" x="18" y="46" width="64" height="46" rx="3" fill="#ffffff" stroke="#1e3a5f" stroke-width="3.5"/>
                <!-- Door -->
                <rect class="paint-region" data-region="${prefix}-door" x="42" y="64" width="16" height="28" rx="2" fill="#ffffff" stroke="#1e3a5f" stroke-width="2.5"/>
                <!-- Windows -->
                <rect class="paint-region" data-region="${prefix}-w1" x="24" y="54" width="14" height="14" rx="2" fill="#ffffff" stroke="#1e3a5f" stroke-width="2.5"/>
                <rect class="paint-region" data-region="${prefix}-w2" x="62" y="54" width="14" height="14" rx="2" fill="#ffffff" stroke="#1e3a5f" stroke-width="2.5"/>
            </svg>
        `;
    }

    // State for W2 Number Buddies
    window.kgMathsState = {
        currentStep: 0,
        s1Answers: {},
        s2Answers: {},
        s3Connections: {}, // word -> digit
        s4FilledBlanks: {}, // blankNum -> tileVal
        s5ShapeAnswers: {},
        s5Colours: {},     // regionId -> hex
        activePaintColor: '#f0b429',
        isCountingAlong: false,
        drawCanvas: null
    };

    function renderKgMathsWorksheet() {
        const container = document.getElementById('screen-worksheet-kg-maths-nov26');
        if (!container) return;
        if (container.dataset.rendered === 'true') return;
        container.dataset.rendered = 'true';

        let html = `
            <div class="kg-worksheet-wrapper max-w-4xl mx-auto px-4 py-6">
                <!-- Top Sticker Strip -->
                <div class="kg-sticker-bar flex items-center justify-between gap-2 p-3 sm:p-4 mb-6 bg-white rounded-2xl border-2 border-paper-edge shadow-sm">
                    <div class="flex items-center gap-2">
                        <span class="text-sm font-heading font-bold text-navy uppercase tracking-wider hidden sm:inline">Progress</span>
                        <div class="sticker-strip flex items-center gap-1 sm:gap-2" id="w2-sticker-strip">
                            ${W2_SECTIONS.map((sec, i) => `
                                <div class="sticker-slot flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-dashed border-gray-300 transition-all" data-step="${i}" title="${sec.title}">
                                    ${SVG.starEmpty}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="step-indicator text-sm sm:text-base font-heading font-bold text-graphite" id="w2-step-label">
                        Section 1 of 6
                    </div>
                </div>

                <!-- Sections Container -->
                <div class="kg-sections-container">
        `;

        // Section 1: Count and Choose
        html += `
            <section class="kg-section-step active" id="w2-sec-0" data-step="0">
                <div class="kci-paper-card p-6 sm:p-8 mb-6">
                    <div class="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-paper-edge">
                        <div class="flex items-center gap-3">
                            <button type="button" class="btn-step-voice p-2 rounded-full hover:bg-gold-light text-navy transition-colors" data-key="ma-s1" aria-label="Listen to instruction">
                                ${SVG.speaker}
                            </button>
                            <div>
                                <h3 class="text-2xl sm:text-3xl font-heading font-bold text-navy">Count and Choose</h3>
                                <p class="text-base text-graphite font-medium">Tap each object to count it. Tap the number word.</p>
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-col gap-6">
                        ${W2_S1_ITEMS.map((item, idx) => {
                            const shuffled = shuffleArray(item.options);
                            return `
                                <div class="w2-s1-q p-5 rounded-2xl bg-[#faf6ed] border-2 border-[#ecdcb9] flex flex-col sm:flex-row items-center justify-between gap-6" data-q="${idx}" data-correct="${item.correct}" data-count="${item.count}">
                                    <!-- Interactive Counting Objects -->
                                    <div class="count-objects-row flex flex-wrap items-center gap-3 justify-center">
                                        ${Array.from({ length: item.count }).map((_, objIdx) => `
                                            <button type="button" class="btn-count-obj p-2 rounded-2xl bg-white border-2 border-navy/20 hover:border-navy shadow-sm transition-transform active:scale-90 relative" data-num="${objIdx + 1}" title="Count ${objIdx + 1}">
                                                ${item.svg(56)}
                                                <span class="count-badge absolute -top-2 -right-2 w-6 h-6 rounded-full bg-navy text-white text-xs font-heading font-bold flex items-center justify-center opacity-0 transition-opacity pointer-events-none">${objIdx + 1}</span>
                                            </button>
                                        `).join('')}
                                    </div>

                                    <!-- Options -->
                                    <div class="options-row flex items-center gap-3">
                                        ${shuffled.map(opt => `
                                            <button type="button" class="w2-s1-opt min-h-[56px] py-3 px-6 rounded-xl border-2 border-navy/30 bg-white hover:border-navy text-navy font-heading text-xl font-bold shadow-sm transition-all capitalize" data-val="${opt}">
                                                ${opt}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </section>
        `;

        // Section 2: What Comes Next?
        html += `
            <section class="kg-section-step hidden" id="w2-sec-1" data-step="1">
                <div class="kci-paper-card p-6 sm:p-8 mb-6">
                    <div class="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-paper-edge">
                        <div class="flex items-center gap-3">
                            <button type="button" class="btn-step-voice p-2 rounded-full hover:bg-gold-light text-navy transition-colors" data-key="ma-s2" aria-label="Listen to instruction">
                                ${SVG.speaker}
                            </button>
                            <div>
                                <h3 class="text-2xl sm:text-3xl font-heading font-bold text-navy">What Comes Next?</h3>
                                <p class="text-base text-graphite font-medium">Tap the missing number.</p>
                            </div>
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        ${W2_S2_ITEMS.map((item, idx) => {
                            const shuffled = shuffleArray(item.options);
                            return `
                                <div class="w2-s2-q p-5 rounded-2xl bg-white border-2 border-paper-edge shadow-sm flex flex-col items-center gap-5" data-q="${idx}" data-correct="${item.correct}">
                                    <!-- Number Sequence Train -->
                                    <div class="train-row flex items-center justify-center gap-3">
                                        ${item.display.map((numStr, pos) => `
                                            <div class="train-carriage w-16 h-16 rounded-2xl border-2 ${numStr === '__' ? 'border-dashed border-gold bg-gold-light blank-slot' : 'border-navy bg-lightBlue'} flex items-center justify-center font-heading font-bold text-3xl text-navy shadow-sm transition-all" data-pos="${pos}">
                                                ${numStr === '__' ? '?' : numStr}
                                            </div>
                                        `).join('')}
                                    </div>

                                    <!-- Options -->
                                    <div class="options-row flex items-center justify-center gap-3 w-full">
                                        ${shuffled.map(opt => `
                                            <button type="button" class="w2-s2-opt flex-1 min-h-[56px] py-3 px-4 rounded-xl border-2 border-navy/30 bg-white hover:border-navy text-navy font-heading text-2xl font-bold shadow-sm transition-all" data-val="${opt}">
                                                ${opt}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </section>
        `;

        // Section 3: Number Words (Draw a line)
        html += `
            <section class="kg-section-step hidden" id="w2-sec-2" data-step="2">
                <div class="kci-paper-card p-6 sm:p-8 mb-6">
                    <div class="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-paper-edge">
                        <div class="flex items-center gap-3">
                            <button type="button" class="btn-step-voice p-2 rounded-full hover:bg-gold-light text-navy transition-colors" data-key="ma-s3" aria-label="Listen to instruction">
                                ${SVG.speaker}
                            </button>
                            <div>
                                <h3 class="text-2xl sm:text-3xl font-heading font-bold text-navy">Number Words</h3>
                                <p class="text-base text-graphite font-medium">Match each number word to its digit.</p>
                            </div>
                        </div>
                    </div>

                    <div class="relative max-w-lg mx-auto py-4">
                        <svg class="line-match-canvas absolute inset-0 w-full h-full pointer-events-none z-10" id="w2-line-canvas"></svg>
                        <div class="grid grid-cols-2 gap-8 sm:gap-16 relative z-20">
                            <!-- Left: Words -->
                            <div class="flex flex-col gap-4" id="w2-match-left">
                                ${W2_S3_ITEMS.map(item => `
                                    <button type="button" class="w2-match-node left-node min-h-[56px] p-3 rounded-2xl border-2 border-navy/30 bg-white hover:border-navy flex items-center justify-center shadow-sm text-navy font-heading font-bold text-xl capitalize transition-all" data-word="${item.word}">
                                        ${item.word}
                                    </button>
                                `).join('')}
                            </div>
                            <!-- Right: Digits (shuffled) -->
                            <div class="flex flex-col gap-4" id="w2-match-right">
                                ${shuffleArray(W2_S3_ITEMS).map(item => `
                                    <button type="button" class="w2-match-node right-node min-h-[56px] p-3 rounded-2xl border-2 border-navy/30 bg-white hover:border-navy flex items-center justify-center shadow-sm text-navy font-heading font-bold text-2xl transition-all" data-digit="${item.digit}">
                                        ${item.digit}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Section 4: Count to 50
        html += `
            <section class="kg-section-step hidden" id="w2-sec-3" data-step="3">
                <div class="kci-paper-card p-6 sm:p-8 mb-6">
                    <div class="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-paper-edge">
                        <div class="flex items-center gap-3">
                            <button type="button" class="btn-step-voice p-2 rounded-full hover:bg-gold-light text-navy transition-colors" data-key="ma-s4" aria-label="Listen to instruction">
                                ${SVG.speaker}
                            </button>
                            <div>
                                <h3 class="text-2xl sm:text-3xl font-heading font-bold text-navy">Count to 50</h3>
                                <p class="text-base text-graphite font-medium">Fill in the missing numbers.</p>
                            </div>
                        </div>
                        <!-- Count along button -->
                        <div class="flex items-center gap-2">
                            <button type="button" class="btn-count-along btn btn-ghost text-sm font-heading font-bold text-navy hover:bg-gold-light px-4 py-2 rounded-xl border border-navy flex items-center gap-1.5 min-h-[44px]" id="w2-btn-count-along">
                                ${SVG.speaker}
                                <span>Count along</span>
                            </button>
                            <button type="button" class="btn-skip-count btn btn-ghost text-sm font-heading font-bold text-gray-500 hover:text-navy px-3 py-2 rounded-xl border border-gray-300 hidden min-h-[44px]" id="w2-btn-skip-count">
                                Stop
                            </button>
                        </div>
                    </div>

                    <!-- Tray of Tiles (shuffled) -->
                    <div class="tile-tray p-4 mb-6 rounded-2xl bg-paper border-2 border-dashed border-navy/30">
                        <span class="text-xs font-heading font-bold text-navy uppercase block mb-2">Number Tiles (Tap a tile, then tap a blank)</span>
                        <div class="flex flex-wrap items-center gap-3 justify-center" id="w2-tile-tray">
                            ${shuffleArray(W2_S4_TILES).map(val => `
                                <button type="button" class="w2-tray-tile min-w-[56px] min-h-[56px] p-2 rounded-xl border-2 border-navy bg-white hover:bg-gold-light text-navy font-heading font-bold text-2xl shadow-sm transition-all" data-val="${val}">
                                    ${val}
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 1-50 Grid (5 cols on phones, 10 cols on >=768px) -->
                    <div class="grid grid-cols-5 md:grid-cols-10 gap-2 sm:gap-2.5 max-w-2xl mx-auto" id="w2-grid-50">
                        ${Array.from({ length: 50 }, (_, i) => i + 1).map(num => {
                            const isBlank = W2_S4_BLANKS.includes(num);
                            if (isBlank) {
                                return `
                                    <div class="grid-cell blank-cell w-full aspect-square rounded-xl border-2 border-dashed border-gold bg-gold-light/40 flex items-center justify-center font-heading font-bold text-lg sm:text-xl text-navy cursor-pointer transition-all" data-num="${num}" data-target-num="${num}">
                                        <span class="cell-val">?</span>
                                    </div>
                                `;
                            } else {
                                return `
                                    <div class="grid-cell filled-cell w-full aspect-square rounded-xl border border-gray-200 bg-white flex items-center justify-center font-heading font-bold text-sm sm:text-base text-navy cursor-pointer hover:bg-lightBlue transition-all" data-num="${num}">
                                        ${num}
                                    </div>
                                `;
                            }
                        }).join('')}
                    </div>
                </div>
            </section>
        `;

        // Section 5: Shapes and Size
        html += `
            <section class="kg-section-step hidden" id="w2-sec-4" data-step="4">
                <div class="kci-paper-card p-6 sm:p-8 mb-6">
                    <div class="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-paper-edge">
                        <div class="flex items-center gap-3">
                            <button type="button" class="btn-step-voice p-2 rounded-full hover:bg-gold-light text-navy transition-colors" data-key="ma-s5-shape" aria-label="Listen to instruction">
                                ${SVG.speaker}
                            </button>
                            <div>
                                <h3 class="text-2xl sm:text-3xl font-heading font-bold text-navy">Shapes and Size</h3>
                                <p class="text-base text-graphite font-medium">Identify shapes, then colour by size.</p>
                            </div>
                        </div>
                    </div>

                    <!-- Part A: 3 Shape Name Questions -->
                    <div class="mb-10">
                        <h4 class="text-lg font-heading font-bold text-navy mb-4 flex items-center gap-2">
                            <span class="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center">1</span>
                            <span>Tap the shape name</span>
                        </h4>
                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            ${W2_S5_SHAPES.map((item, idx) => {
                                const shuffled = shuffleArray(item.options);
                                return `
                                    <div class="w2-shape-q p-4 rounded-2xl bg-white border-2 border-paper-edge shadow-sm flex flex-col items-center gap-4" data-q="${idx}" data-correct="${item.correct}">
                                        <div class="shape-icon p-2">
                                            ${item.svg(72)}
                                        </div>
                                        <div class="options-col flex flex-col gap-2 w-full">
                                            ${shuffled.map(opt => `
                                                <button type="button" class="w2-shape-opt min-h-[48px] py-2 px-3 rounded-xl border-2 border-navy/30 bg-white hover:border-navy text-navy font-heading text-base font-bold shadow-sm transition-all capitalize" data-val="${opt}">
                                                    ${opt}
                                                </button>
                                            `).join('')}
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- Part B: 2 Colouring Activities with Paint Palette -->
                    <div class="pt-6 border-t-2 border-paper-edge">
                        <h4 class="text-lg font-heading font-bold text-navy mb-4 flex items-center gap-2">
                            <span class="w-6 h-6 rounded-full bg-navy text-white text-xs flex items-center justify-center">2</span>
                            <span>Paint by Size</span>
                        </h4>

                        <!-- Shared Paint Palette (6 colours) -->
                        <div class="palette-bar flex flex-wrap items-center justify-center gap-3 p-3 mb-6 rounded-2xl bg-paper border-2 border-dashed border-navy/30">
                            <span class="text-xs font-heading font-bold text-navy uppercase mr-2">Paint Palette:</span>
                            ${[
                                { hex: '#f0b429', name: 'Gold' },
                                { hex: '#1e3a5f', name: 'Navy' },
                                { hex: '#e8765f', name: 'Coral' },
                                { hex: '#3f9b6a', name: 'Green' },
                                { hex: '#3f8fd1', name: 'Blue' },
                                { hex: '#8b5cf6', name: 'Purple' }
                            ].map((c, i) => `
                                <button type="button" class="paint-swatch-btn w-10 h-10 rounded-full border-2 transition-transform shadow-sm ${i === 0 ? 'scale-110 border-navy ring-2 ring-gold' : 'border-white'}" 
                                    style="background-color: ${c.hex};" 
                                    data-hex="${c.hex}" 
                                    title="${c.name} paint"></button>
                            `).join('')}
                        </div>

                        <!-- Item 4: Colour the SMALL flower -->
                        <div class="w2-colour-item p-5 mb-6 rounded-2xl bg-[#faf6ed] border-2 border-[#ecdcb9]" data-item="flower">
                            <div class="flex items-center justify-between gap-3 mb-4">
                                <div class="flex items-center gap-2">
                                    <button type="button" class="btn-step-voice p-1.5 rounded-full hover:bg-gold-light text-navy transition-colors" data-key="ma-s5-small" aria-label="Listen to instruction">
                                        ${SVG.speaker}
                                    </button>
                                    <span class="font-heading font-bold text-lg text-navy">Colour the SMALL flower.</span>
                                </div>
                            </div>
                            <div class="flex flex-wrap items-center justify-around gap-8 py-2">
                                <div class="flex flex-col items-center gap-1">
                                    ${generateColourableFlower(true, 'fl-big')}
                                    <span class="text-xs font-heading font-semibold text-gray-400">Flower A</span>
                                </div>
                                <div class="flex flex-col items-center gap-1">
                                    ${generateColourableFlower(false, 'fl-small')}
                                    <span class="text-xs font-heading font-semibold text-gray-400">Flower B</span>
                                </div>
                            </div>
                        </div>

                        <!-- Item 5: Colour the BIG house -->
                        <div class="w2-colour-item p-5 rounded-2xl bg-[#f0f7fd] border-2 border-[#cfe0f2]" data-item="house">
                            <div class="flex items-center justify-between gap-3 mb-4">
                                <div class="flex items-center gap-2">
                                    <button type="button" class="btn-step-voice p-1.5 rounded-full hover:bg-gold-light text-navy transition-colors" data-key="ma-s5-big" aria-label="Listen to instruction">
                                        ${SVG.speaker}
                                    </button>
                                    <span class="font-heading font-bold text-lg text-navy">Colour the BIG house.</span>
                                </div>
                            </div>
                            <div class="flex flex-wrap items-center justify-around gap-8 py-2">
                                <div class="flex flex-col items-center gap-1">
                                    ${generateColourableHouse(true, 'hs-big')}
                                    <span class="text-xs font-heading font-semibold text-gray-400">House A</span>
                                </div>
                                <div class="flex flex-col items-center gap-1">
                                    ${generateColourableHouse(false, 'hs-small')}
                                    <span class="text-xs font-heading font-semibold text-gray-400">House B</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;

        // Section 6: Free-Draw Canvas (Ungraded)
        html += `
            <section class="kg-section-step hidden" id="w2-sec-5" data-step="5">
                <div id="w2-draw-canvas-container"></div>
            </section>
        `;

        // Bottom Navigation Bar
        html += `
                </div><!-- /.kg-sections-container -->

                <!-- Navigation Controls (Min 56px Tall) -->
                <div class="kg-stepper-nav flex items-center justify-between gap-4 mt-8 pt-4 border-t-2 border-paper-edge">
                    <button type="button" class="btn-kg-back btn min-h-[56px] py-3 px-6 rounded-2xl border-2 border-navy text-navy bg-white hover:bg-gray-100 font-heading font-bold text-xl transition-all shadow-sm flex items-center gap-2" id="w2-btn-back">
                        <svg class="w-6 h-6 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        <span>Back</span>
                    </button>

                    <button type="button" class="btn-kg-next btn btn-gold min-h-[56px] py-3 px-8 rounded-2xl border-2 border-navy text-navy font-heading font-bold text-xl transition-all shadow-md flex items-center gap-2" id="w2-btn-next">
                        <span>Next</span>
                        <svg class="w-6 h-6 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>

                    <button type="button" class="btn-kg-verify btn btn-gold min-h-[56px] py-3 px-8 rounded-2xl border-2 border-navy text-navy font-heading font-bold text-xl transition-all shadow-xl hidden flex items-center gap-2" id="w2-btn-verify">
                        <span>Check my answers</span>
                        <svg class="w-6 h-6 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </button>
                </div>

                <!-- Footer with CC-BY and Phone -->
                <div class="mt-8 text-center text-xs text-gray-500 font-medium">
                    <span>Illustrations CC-BY 4.0 Twemoji &bull; KCI Contact: 0300-2917500</span>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Instantiate FreeDrawCanvas in Section 6
        window.kgMathsState.drawCanvas = new window.FreeDrawCanvas('#w2-draw-canvas-container', {
            prompt: 'Draw anything with a shape in it.',
            voiceKey: 'ma-draw',
            onDrawChange: (hasDrawing) => {
                updateW2Sticker(5, hasDrawing);
            },
            onSkip: () => {
                updateW2Sticker(5, true);
            }
        });
    }

    function updateW2Sticker(stepIdx, isFilled) {
        const slot = document.querySelector(`#w2-sticker-strip .sticker-slot[data-step="${stepIdx}"]`);
        if (!slot) return;
        if (isFilled) {
            slot.innerHTML = SVG.starFilled;
            slot.classList.add('border-gold', 'bg-gold-light');
            slot.classList.remove('border-gray-300');
        } else {
            slot.innerHTML = SVG.starEmpty;
            slot.classList.remove('border-gold', 'bg-gold-light');
            slot.classList.add('border-gray-300');
        }
    }

    function checkW2SectionCompletion(stepIdx) {
        const state = window.kgMathsState;
        if (stepIdx === 0) return Object.keys(state.s1Answers).length > 0;
        if (stepIdx === 1) return Object.keys(state.s2Answers).length > 0;
        if (stepIdx === 2) return Object.keys(state.s3Connections).length > 0;
        if (stepIdx === 3) return Object.keys(state.s4FilledBlanks).length > 0;
        if (stepIdx === 4) return Object.keys(state.s5ShapeAnswers).length > 0 || Object.keys(state.s5Colours).length > 0;
        if (stepIdx === 5) return (state.drawCanvas && state.drawCanvas.hasDrawing()) || (state.drawCanvas && state.drawCanvas.isSkipped);
        return false;
    }

    function registerKgMathsInteractivity() {
        const container = document.getElementById('screen-worksheet-kg-maths-nov26');
        if (!container) return;

        const state = window.kgMathsState;
        const totalSteps = W2_SECTIONS.length; // 6

        const btnBack = document.getElementById('w2-btn-back');
        const btnNext = document.getElementById('w2-btn-next');
        const btnVerify = document.getElementById('w2-btn-verify');
        const stepLabel = document.getElementById('w2-step-label');

        function updateStepUI() {
            for (let i = 0; i < totalSteps; i++) {
                const sec = document.getElementById(`w2-sec-${i}`);
                if (sec) {
                    if (i === state.currentStep) {
                        sec.classList.remove('hidden');
                        sec.classList.add('active');
                    } else {
                        sec.classList.add('hidden');
                        sec.classList.remove('active');
                    }
                }
            }

            if (stepLabel) {
                stepLabel.textContent = `Section ${state.currentStep + 1} of ${totalSteps}`;
            }

            if (btnBack) {
                btnBack.disabled = state.currentStep === 0;
                btnBack.style.opacity = state.currentStep === 0 ? '0.4' : '1';
            }

            if (state.currentStep === totalSteps - 1) {
                btnNext.classList.add('hidden');
                btnVerify.classList.remove('hidden');
            } else {
                btnNext.classList.remove('hidden');
                btnVerify.classList.add('hidden');
            }

            const secInfo = W2_SECTIONS[state.currentStep];
            if (secInfo && secInfo.voiceKey && window.KCIVoice) {
                const nextSec = W2_SECTIONS[state.currentStep + 1];
                const preloadKeys = [secInfo.voiceKey];
                if (nextSec && nextSec.voiceKey) preloadKeys.push(nextSec.voiceKey);
                window.KCIVoice.preload(preloadKeys);

                window.KCIVoice.say(secInfo.voiceKey);
            }

            if (state.currentStep === 5 && state.drawCanvas) {
                setTimeout(() => state.drawCanvas.setupCanvas(), 50);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        btnNext.onclick = () => {
            if (state.currentStep < totalSteps - 1) {
                state.currentStep++;
                updateStepUI();
            }
        };

        btnBack.onclick = () => {
            if (state.currentStep > 0) {
                state.currentStep--;
                updateStepUI();
            }
        };

        btnVerify.onclick = () => {
            gradeWorksheetKgMaths();
            if (window.showValueTipThenResults) {
                window.showValueTipThenResults();
            }
        };

        // Voice replay buttons
        container.querySelectorAll('.btn-step-voice').forEach(btn => {
            btn.onclick = () => {
                const key = btn.dataset.key;
                if (key && window.KCIVoice) window.KCIVoice.say(key);
            };
        });

        // S1: Count and Choose
        container.querySelectorAll('.w2-s1-q').forEach(qEl => {
            const qIdx = qEl.dataset.q;

            // Interactive counting objects
            qEl.querySelectorAll('.btn-count-obj').forEach(objBtn => {
                objBtn.onclick = () => {
                    const num = objBtn.dataset.num;
                    if (window.KCIVoice) window.KCIVoice.say(`num-${num}`);
                    const badge = objBtn.querySelector('.count-badge');
                    if (badge) badge.style.opacity = '1';
                    objBtn.classList.add('border-gold', 'bg-gold-light');
                };
            });

            // Options
            qEl.querySelectorAll('.w2-s1-opt').forEach(optBtn => {
                optBtn.onclick = () => {
                    qEl.querySelectorAll('.w2-s1-opt').forEach(b => {
                        b.classList.remove('bg-lightBlue', 'border-navy', 'ring-2', 'ring-gold');
                    });
                    optBtn.classList.add('bg-lightBlue', 'border-navy', 'ring-2', 'ring-gold');
                    state.s1Answers[qIdx] = optBtn.dataset.val;

                    const val = optBtn.dataset.val;
                    if (window.KCIVoice) window.KCIVoice.say(val);

                    updateW2Sticker(0, checkW2SectionCompletion(0));
                };
            });
        });

        // S2: What Comes Next?
        container.querySelectorAll('.w2-s2-q').forEach(qEl => {
            const qIdx = qEl.dataset.q;
            const blankCarriage = qEl.querySelector('.blank-slot');

            qEl.querySelectorAll('.w2-s2-opt').forEach(optBtn => {
                optBtn.onclick = () => {
                    qEl.querySelectorAll('.w2-s2-opt').forEach(b => {
                        b.classList.remove('bg-gold-light', 'border-navy', 'ring-2', 'ring-gold');
                    });
                    optBtn.classList.add('bg-gold-light', 'border-navy', 'ring-2', 'ring-gold');
                    state.s2Answers[qIdx] = parseInt(optBtn.dataset.val, 10);

                    if (blankCarriage) {
                        blankCarriage.textContent = optBtn.dataset.val;
                        blankCarriage.classList.remove('border-dashed', 'border-gold');
                        blankCarriage.classList.add('border-solid', 'border-navy', 'bg-lightBlue');
                    }

                    const val = optBtn.dataset.val;
                    if (window.KCIVoice) window.KCIVoice.say(`num-${val}`);

                    updateW2Sticker(1, checkW2SectionCompletion(1));
                };
            });
        });

        // S3: Number Words (Draw a line)
        let selectedLeftWord = null;
        const lineCanvasW2 = document.getElementById('w2-line-canvas');

        function redrawLinesW2() {
            if (!lineCanvasW2) return;
            lineCanvasW2.innerHTML = '';
            const canvasRect = lineCanvasW2.getBoundingClientRect();

            Object.entries(state.s3Connections).forEach(([word, digit]) => {
                const leftEl = container.querySelector(`.left-node[data-word="${word}"]`);
                const rightEl = container.querySelector(`.right-node[data-digit="${digit}"]`);
                if (leftEl && rightEl) {
                    const lRect = leftEl.getBoundingClientRect();
                    const rRect = rightEl.getBoundingClientRect();

                    const x1 = lRect.right - canvasRect.left;
                    const y1 = lRect.top + lRect.height / 2 - canvasRect.top;
                    const x2 = rRect.left - canvasRect.left;
                    const y2 = rRect.top + rRect.height / 2 - canvasRect.top;

                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', x1);
                    line.setAttribute('y1', y1);
                    line.setAttribute('x2', x2);
                    line.setAttribute('y2', y2);
                    line.setAttribute('stroke', '#1e3a5f');
                    line.setAttribute('stroke-width', '4');
                    line.setAttribute('stroke-linecap', 'round');
                    line.setAttribute('stroke-dasharray', '8 4');
                    lineCanvasW2.appendChild(line);
                }
            });
        }

        window.addEventListener('resize', redrawLinesW2);

        container.querySelectorAll('.w2-match-node.left-node').forEach(node => {
            node.onclick = () => {
                selectedLeftWord = node.dataset.word;
                container.querySelectorAll('.w2-match-node.left-node').forEach(n => n.classList.remove('ring-2', 'ring-gold', 'bg-gold-light'));
                node.classList.add('ring-2', 'ring-gold', 'bg-gold-light');

                if (window.KCIVoice) window.KCIVoice.say(selectedLeftWord);
            };
        });

        container.querySelectorAll('.w2-match-node.right-node').forEach(node => {
            node.onclick = () => {
                const digit = node.dataset.digit;
                if (window.KCIVoice) window.KCIVoice.say(`num-${digit}`);

                if (selectedLeftWord) {
                    state.s3Connections[selectedLeftWord] = digit;
                    container.querySelectorAll('.w2-match-node.left-node').forEach(n => n.classList.remove('ring-2', 'ring-gold', 'bg-gold-light'));
                    selectedLeftWord = null;
                    redrawLinesW2();
                    updateW2Sticker(2, checkW2SectionCompletion(2));
                }
            };
        });

        // S4: Count to 50
        let selectedTrayTile = null;

        container.querySelectorAll('.w2-tray-tile').forEach(tile => {
            tile.onclick = () => {
                selectedTrayTile = parseInt(tile.dataset.val, 10);
                container.querySelectorAll('.w2-tray-tile').forEach(t => t.classList.remove('ring-2', 'ring-gold', 'bg-gold-light'));
                tile.classList.add('ring-2', 'ring-gold', 'bg-gold-light');

                if (window.KCIVoice) window.KCIVoice.say(`num-${selectedTrayTile}`);
            };
        });

        container.querySelectorAll('#w2-grid-50 .blank-cell').forEach(blankEl => {
            blankEl.onclick = () => {
                const targetNum = parseInt(blankEl.dataset.targetNum, 10);
                if (selectedTrayTile !== null) {
                    state.s4FilledBlanks[targetNum] = selectedTrayTile;
                    blankEl.querySelector('.cell-val').textContent = selectedTrayTile;
                    blankEl.classList.remove('border-dashed', 'border-gold');
                    blankEl.classList.add('border-solid', 'border-navy', 'bg-lightBlue');

                    if (window.KCIVoice) window.KCIVoice.say(`num-${selectedTrayTile}`);

                    // Hide selected tile in tray
                    container.querySelectorAll('.w2-tray-tile').forEach(t => {
                        if (parseInt(t.dataset.val, 10) === selectedTrayTile) {
                            t.style.display = 'none';
                        }
                        t.classList.remove('ring-2', 'ring-gold', 'bg-gold-light');
                    });
                    selectedTrayTile = null;

                    updateW2Sticker(3, checkW2SectionCompletion(3));
                }
            };
        });

        // Filled cells click -> speak number
        container.querySelectorAll('#w2-grid-50 .filled-cell').forEach(cell => {
            cell.onclick = () => {
                const num = cell.dataset.num;
                if (window.KCIVoice) window.KCIVoice.say(`num-${num}`);
            };
        });

        // "Count along" 1..50
        const btnCountAlong = document.getElementById('w2-btn-count-along');
        const btnSkipCount = document.getElementById('w2-btn-skip-count');

        if (btnCountAlong && btnSkipCount) {
            btnCountAlong.onclick = async () => {
                state.isCountingAlong = true;
                btnCountAlong.classList.add('hidden');
                btnSkipCount.classList.remove('hidden');

                const keys = Array.from({ length: 50 }, (_, i) => `num-${i + 1}`);

                if (window.KCIVoice) {
                    await window.KCIVoice.sayQueue(keys, {
                        gapMs: 250,
                        onWordStart: (k, idx) => {
                            const num = idx + 1;
                            const cell = container.querySelector(`#w2-grid-50 [data-num="${num}"]`);
                            container.querySelectorAll('#w2-grid-50 .grid-cell').forEach(c => c.classList.remove('ring-4', 'ring-gold'));
                            if (cell) cell.classList.add('ring-4', 'ring-gold');
                        },
                        onComplete: () => {
                            container.querySelectorAll('#w2-grid-50 .grid-cell').forEach(c => c.classList.remove('ring-4', 'ring-gold'));
                            btnCountAlong.classList.remove('hidden');
                            btnSkipCount.classList.add('hidden');
                            state.isCountingAlong = false;
                        }
                    });
                }
            };

            btnSkipCount.onclick = () => {
                if (window.KCIVoice) window.KCIVoice.stop();
                container.querySelectorAll('#w2-grid-50 .grid-cell').forEach(c => c.classList.remove('ring-4', 'ring-gold'));
                btnCountAlong.classList.remove('hidden');
                btnSkipCount.classList.add('hidden');
                state.isCountingAlong = false;
            };
        }

        // S5: Shapes and Size
        // Shape name options
        container.querySelectorAll('.w2-shape-q').forEach(qEl => {
            const qIdx = qEl.dataset.q;
            qEl.querySelectorAll('.w2-shape-opt').forEach(optBtn => {
                optBtn.onclick = () => {
                    qEl.querySelectorAll('.w2-shape-opt').forEach(b => {
                        b.classList.remove('bg-lightBlue', 'border-navy', 'ring-2', 'ring-gold');
                    });
                    optBtn.classList.add('bg-lightBlue', 'border-navy', 'ring-2', 'ring-gold');
                    state.s5ShapeAnswers[qIdx] = optBtn.dataset.val;

                    const val = optBtn.dataset.val;
                    if (window.KCIVoice) window.KCIVoice.say(val);

                    updateW2Sticker(4, checkW2SectionCompletion(4));
                };
            });
        });

        // Paint swatches
        container.querySelectorAll('.paint-swatch-btn').forEach(btn => {
            btn.onclick = () => {
                state.activePaintColor = btn.dataset.hex;
                container.querySelectorAll('.paint-swatch-btn').forEach(b => {
                    b.classList.remove('scale-110', 'border-navy', 'ring-2', 'ring-gold');
                    b.classList.add('border-white');
                });
                btn.classList.add('scale-110', 'border-navy', 'ring-2', 'ring-gold');
                btn.classList.remove('border-white');
            };
        });

        // Colouring regions
        container.querySelectorAll('.paint-region').forEach(region => {
            region.onclick = () => {
                const regId = region.dataset.region;
                const col = state.activePaintColor || '#f0b429';
                region.setAttribute('fill', col);
                state.s5Colours[regId] = col;

                updateW2Sticker(4, checkW2SectionCompletion(4));
            };
        });

        // Initialize UI
        updateStepUI();
    }

    function gradeWorksheetKgMaths() {
        const state = window.kgMathsState;
        window.state.results = [];
        window.state.totalCorrect = 0;

        // 1. S1: Count and Choose (5 items, topic: Counting)
        W2_S1_ITEMS.forEach((item, idx) => {
            const uAns = state.s1Answers[idx] || '';
            const cAns = item.correct;
            const isCorrect = uAns === cAns;
            if (isCorrect) window.state.totalCorrect++;

            window.state.results.push({
                q: `Count ${item.count} ${item.name}`,
                userAns: uAns || 'None',
                correctAns: cAns,
                isCorrect: isCorrect,
                section: 'Counting',
                topic: 'Counting'
            });
        });

        // 2. S2: What Comes Next? (4 items, topic: Number Order)
        W2_S2_ITEMS.forEach((item, idx) => {
            const uAns = state.s2Answers[idx];
            const cAns = item.correct;
            const isCorrect = uAns === cAns;
            if (isCorrect) window.state.totalCorrect++;

            window.state.results.push({
                q: `Missing number: ${item.prompt}`,
                userAns: uAns !== undefined ? String(uAns) : 'None',
                correctAns: String(cAns),
                isCorrect: isCorrect,
                section: 'Number Order',
                topic: 'Number Order'
            });
        });

        // 3. S3: Number Words (5 items, topic: Number Words)
        W2_S3_ITEMS.forEach(item => {
            const uAns = state.s3Connections[item.word] || '';
            const cAns = item.digit;
            const isCorrect = uAns === cAns;
            if (isCorrect) window.state.totalCorrect++;

            window.state.results.push({
                q: `Match number word "${item.word}"`,
                userAns: uAns || 'None',
                correctAns: cAns,
                isCorrect: isCorrect,
                section: 'Number Words',
                topic: 'Number Words'
            });
        });

        // 4. S4: Count to 50 (5 items, topic: Number Order)
        W2_S4_BLANKS.forEach(blankNum => {
            const uAns = state.s4FilledBlanks[blankNum];
            const cAns = blankNum;
            const isCorrect = uAns === cAns;
            if (isCorrect) window.state.totalCorrect++;

            window.state.results.push({
                q: `Grid cell ${blankNum}`,
                userAns: uAns !== undefined ? String(uAns) : 'None',
                correctAns: String(cAns),
                isCorrect: isCorrect,
                section: 'Number Order',
                topic: 'Number Order'
            });
        });

        // 5. S5: Shapes and Size (5 items, topic: Shapes & Size)
        // a) 3 shape names
        W2_S5_SHAPES.forEach((item, idx) => {
            const uAns = state.s5ShapeAnswers[idx] || '';
            const cAns = item.correct;
            const isCorrect = uAns === cAns;
            if (isCorrect) window.state.totalCorrect++;

            window.state.results.push({
                q: `Shape name for ${item.shape}`,
                userAns: uAns || 'None',
                correctAns: cAns,
                isCorrect: isCorrect,
                section: 'Shapes & Size',
                topic: 'Shapes & Size'
            });
        });

        // b) 2 colouring items:
        // Item 1: "Colour the SMALL flower."
        // Target: fl-small (stem, leaf, p1, p2, p3, p4, p5, center = 8 regions). >= 60% coloured (>= 5 regions) AND fl-big has 0 coloured.
        const flSmallRegions = ['fl-small-stem', 'fl-small-leaf', 'fl-small-p1', 'fl-small-p2', 'fl-small-p3', 'fl-small-p4', 'fl-small-p5', 'fl-small-center'];
        const flBigRegions   = ['fl-big-stem', 'fl-big-leaf', 'fl-big-p1', 'fl-big-p2', 'fl-big-p3', 'fl-big-p4', 'fl-big-p5', 'fl-big-center'];

        const flSmallCount = flSmallRegions.filter(r => state.s5Colours[r]).length;
        const flBigCount = flBigRegions.filter(r => state.s5Colours[r]).length;
        const flCorrect = (flSmallCount / flSmallRegions.length >= 0.6) && (flBigCount === 0);
        if (flCorrect) window.state.totalCorrect++;

        window.state.results.push({
            q: 'Colour the SMALL flower',
            userAns: `Small: ${Math.round((flSmallCount / flSmallRegions.length) * 100)}%, Big: ${flBigCount}`,
            correctAns: 'Small >= 60%, Big = 0',
            isCorrect: flCorrect,
            section: 'Shapes & Size',
            topic: 'Shapes & Size'
        });

        // Item 2: "Colour the BIG house."
        // Target: hs-big (chimney, roof, wall, door, w1, w2 = 6 regions). >= 60% coloured (>= 4 regions) AND hs-small has 0 coloured.
        const hsBigRegions   = ['hs-big-chimney', 'hs-big-roof', 'hs-big-wall', 'hs-big-door', 'hs-big-w1', 'hs-big-w2'];
        const hsSmallRegions = ['hs-small-chimney', 'hs-small-roof', 'hs-small-wall', 'hs-small-door', 'hs-small-w1', 'hs-small-w2'];

        const hsBigCount = hsBigRegions.filter(r => state.s5Colours[r]).length;
        const hsSmallCount = hsSmallRegions.filter(r => state.s5Colours[r]).length;
        const hsCorrect = (hsBigCount / hsBigRegions.length >= 0.6) && (hsSmallCount === 0);
        if (hsCorrect) window.state.totalCorrect++;

        window.state.results.push({
            q: 'Colour the BIG house',
            userAns: `Big: ${Math.round((hsBigCount / hsBigRegions.length) * 100)}%, Small: ${hsSmallCount}`,
            correctAns: 'Big >= 60%, Small = 0',
            isCorrect: hsCorrect,
            section: 'Shapes & Size',
            topic: 'Shapes & Size'
        });

        // Save drawing dataURL into state if drawn
        if (state.drawCanvas && state.drawCanvas.hasDrawing()) {
            window.state.studentDrawing = state.drawCanvas.getDataURL();
        } else {
            window.state.studentDrawing = null;
        }

        // Print console breakdown for acceptance checks
        const report = window.computeReport ? window.computeReport(window.state.results) : null;
        console.log(`[Verify W2 Number Buddies] Total: ${window.state.results.length}/24. Correct: ${window.state.totalCorrect}`);
        if (report) {
            report.topics.forEach(t => {
                console.log(`  Topic "${t.name}": ${t.correct}/${t.total} (${t.percent}%)`);
            });
        }
    }

    // Expose to window
    window.renderKgEnglishWorksheet = renderKgEnglishWorksheet;
    window.registerKgEnglishInteractivity = registerKgEnglishInteractivity;
    window.gradeWorksheetKgEnglish = gradeWorksheetKgEnglish;

    window.renderKgMathsWorksheet = renderKgMathsWorksheet;
    window.registerKgMathsInteractivity = registerKgMathsInteractivity;
    window.gradeWorksheetKgMaths = gradeWorksheetKgMaths;

})(window);
