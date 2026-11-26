const fs = require('fs');
let content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// Find where to insert the render function - after gradeWorksheetUrduDost ends
// and before the SMART STARTERS section
const insertPoint = `// ============================================================
// SMART STARTERS — CLASS I MATHS & READING (Part D)
// ============================================================`;

if (!content.includes(insertPoint)) {
  throw new Error('insertPoint not found!');
}

const renderFn = `// ============================================================
// BHAARI ALFAAZ — HEAVY WORDS WORKSHEET
// بھاری الفاظ — do-chashmi he (U+06BE = ھ) worksheet
// All Urdu text uses Noto Nastaliq Urdu. UI chrome stays LTR/English.
// ============================================================

function renderBhaariAlfaazWorksheet() {
    const container = document.getElementById('screen-worksheet-bhaariAlfaaz');
    if (container.children.length > 2) return; // Already rendered

    // ---- SECTION 1 DATA: Flip card grid ----
    const flipCards = [
        { id: 'bh',  letter: '\u0628\u06BE', word: '\u0628\u06BE\u0627\u0644\u0648', emoji: '\uD83D\uDC3B' },
        { id: 'ph',  letter: '\u067E\u06BE', word: '\u067E\u06BE\u0648\u0644',  emoji: '\uD83C\uDF38' },
        { id: 'th',  letter: '\u062A\u06BE', word: '\u062A\u06BE\u06CC\u0644\u0627', emoji: '\uD83D\uDECD\uFE0F' },
        { id: 'tth', letter: '\u0679\u06BE', word: '\u0679\u06BE\u0646\u0688\u0627', emoji: '\uD83E\uDDCA' },
        { id: 'jh',  letter: '\u062C\u06BE', word: '\u062C\u06BE\u0646\u0688\u0627', emoji: '\uD83C\uDDF5\uD83C\uDDF0' },
        { id: 'ch',  letter: '\u0686\u06BE', word: '\u0686\u06BE\u062A\u0631\u06CC', emoji: '\u2602\uFE0F' },
        { id: 'dh',  letter: '\u062F\u06BE', word: '\u062F\u06BE\u0648\u067E',  emoji: '\u2600\uFE0F' },
        { id: 'ddh', letter: '\u0688\u06BE', word: '\u0688\u06BE\u0648\u0644',  emoji: '\uD83E\uDD41' },
        { id: 'rrh', letter: '\u0691\u06BE', word: '\u0633\u06CC\u0691\u06BE\u06CC', emoji: '\uD83E\uDEDC' },
        { id: 'kh',  letter: '\u06A9\u06BE', word: '\u06A9\u06BE\u0644\u0648\u0646\u0627', emoji: '\uD83E\uDDF8' },
        { id: 'gh',  letter: '\u06AF\u06BE', word: '\u06AF\u06BE\u0631',   emoji: '\uD83C\uDFE0' }
    ];

    // ---- SECTION 2 DATA: Find the heavy word (6 items, topic بھاری الفاظ کی پہچان) ----
    const sec2 = [
        { opts: ['\u067E\u06BE\u0648\u0644','\u067E\u062A\u0627','\u067E\u0627\u0646\u06CC'],     ans: '\u067E\u06BE\u0648\u0644' },
        { opts: ['\u06AF\u0627\u0691\u06CC','\u06AF\u06BE\u0631','\u06AF\u06CC\u0646\u062F'],     ans: '\u06AF\u06BE\u0631' },
        { opts: ['\u06C1\u0627\u062A\u06BE\u06CC','\u06C1\u0648\u0627','\u06C1\u0631\u0646'],    ans: '\u06C1\u0627\u062A\u06BE\u06CC' },
        { opts: ['\u06A9\u062A\u0627\u0628','\u06A9\u06CC\u0644\u0627','\u06A9\u06BE\u0627\u0646\u0627'], ans: '\u06A9\u06BE\u0627\u0646\u0627' },
        { opts: ['\u0628\u0644\u06CC','\u0628\u06BE\u0627\u0644\u0648','\u0628\u0637\u062E'],     ans: '\u0628\u06BE\u0627\u0644\u0648' },
        { opts: ['\u0686\u06BE\u062A\u0631\u06CC','\u0686\u0627\u0628\u06CC','\u0686\u0627\u0646\u062F'], ans: '\u0686\u06BE\u062A\u0631\u06CC' }
    ];

    // ---- SECTION 3 DATA: Identify the heavy letter (10 items, topic بھاری حروف) ----
    const sec3 = [
        { word: '\u0628\u06BE\u0627\u0644\u0648', emoji: '\uD83D\uDC3B', ans: '\u0628\u06BE', opts: ['\u0628\u06BE','\u067E\u06BE','\u062A\u06BE'] },
        { word: '\u067E\u06BE\u0648\u0644',  emoji: '\uD83C\uDF38', ans: '\u067E\u06BE', opts: ['\u067E\u06BE','\u0628\u06BE','\u0679\u06BE'] },
        { word: '\u062A\u06BE\u06CC\u0644\u0627', emoji: '\uD83D\uDECD\uFE0F', ans: '\u062A\u06BE', opts: ['\u062A\u06BE','\u0679\u06BE','\u062F\u06BE'] },
        { word: '\u0679\u06BE\u0646\u0688\u0627', emoji: '\uD83E\uDDCA', ans: '\u0679\u06BE', opts: ['\u0679\u06BE','\u062A\u06BE','\u0688\u06BE'] },
        { word: '\u062C\u06BE\u0646\u0688\u0627', emoji: '\uD83C\uDDF5\uD83C\uDDF0', ans: '\u062C\u06BE', opts: ['\u062C\u06BE','\u0686\u06BE','\u06AF\u06BE'] },
        { word: '\u0686\u06BE\u062A\u0631\u06CC', emoji: '\u2602\uFE0F', ans: '\u0686\u06BE', opts: ['\u0686\u06BE','\u062C\u06BE','\u06A9\u06BE'] },
        { word: '\u062F\u06BE\u0648\u067E',  emoji: '\u2600\uFE0F', ans: '\u062F\u06BE', opts: ['\u062F\u06BE','\u0688\u06BE','\u0628\u06BE'] },
        { word: '\u0688\u06BE\u0648\u0644',  emoji: '\uD83E\uDD41', ans: '\u0688\u06BE', opts: ['\u0688\u06BE','\u062F\u06BE','\u0679\u06BE'] },
        { word: '\u06A9\u06BE\u0644\u0648\u0646\u0627', emoji: '\uD83E\uDDF8', ans: '\u06A9\u06BE', opts: ['\u06A9\u06BE','\u06AF\u06BE','\u067E\u06BE'] },
        { word: '\u06AF\u06BE\u0631',   emoji: '\uD83C\uDFE0', ans: '\u06AF\u06BE', opts: ['\u06AF\u06BE','\u06A9\u06BE','\u062C\u06BE'] }
    ];

    // ---- SECTION 4 DATA: Correct spelling (6 items, topic املا) ----
    // Distractors deliberately use round he ہ (U+06C1) — DO NOT NORMALIZE
    const sec4 = [
        { emoji: '\uD83C\uDF38', ans: '\u067E\u06BE\u0648\u0644', opts: ['\u067E\u06BE\u0648\u0644','\u067E\u06C1\u0648\u0644','\u067E\u0648\u0644'] },
        { emoji: '\uD83C\uDFE0', ans: '\u06AF\u06BE\u0631', opts: ['\u06AF\u06BE\u0631','\u06AF\u06C1\u0631','\u06AF\u0631'] },
        { emoji: '\uD83D\uDC3B', ans: '\u0628\u06BE\u0627\u0644\u0648', opts: ['\u0628\u06BE\u0627\u0644\u0648','\u0628\u06C1\u0627\u0644\u0648','\u0628\u0627\u0644\u0648'] },
        { emoji: '\u2602\uFE0F', ans: '\u0686\u06BE\u062A\u0631\u06CC', opts: ['\u0686\u06BE\u062A\u0631\u06CC','\u0686\u06C1\u062A\u0631\u06CC','\u0686\u062A\u0631\u06CC'] },
        { emoji: '\uD83E\uDD41', ans: '\u0688\u06BE\u0648\u0644', opts: ['\u0688\u06BE\u0648\u0644','\u0688\u06C1\u0648\u0644','\u0688\u0648\u0644'] },
        { emoji: '\u2600\uFE0F', ans: '\u062F\u06BE\u0648\u067E', opts: ['\u062F\u06BE\u0648\u067E','\u062F\u06C1\u0648\u067E','\u062F\u0648\u067E'] }
    ];

    // ---- SECTION 5 DATA: Light or Heavy? (8 items, topic بھاری الفاظ کی پہچان) ----
    const sec5 = [
        { word: '\u0628\u06BE\u0627\u0626\u06CC', ans: '\u0628\u06BE\u0627\u0631\u06CC' },
        { word: '\u0628\u0644\u06CC',    ans: '\u06C1\u0644\u06A9\u0627' },
        { word: '\u067E\u06BE\u0644',    ans: '\u0628\u06BE\u0627\u0631\u06CC' },
        { word: '\u06A9\u062A\u0627\u0628',   ans: '\u06C1\u0644\u06A9\u0627' },
        { word: '\u06C1\u0627\u062A\u06BE',   ans: '\u0628\u06BE\u0627\u0631\u06CC' },
        { word: '\u067E\u0627\u0646\u06CC',   ans: '\u06C1\u0644\u06A9\u0627' },
        { word: '\u06AF\u06BE\u0648\u0691\u0627',  ans: '\u0628\u06BE\u0627\u0631\u06CC' },
        { word: '\u0686\u0627\u0646\u062F',   ans: '\u06C1\u0644\u06A9\u0627' }
    ];

    // ---- SECTION 6 DATA: Join with ھ (6 items, topic بھاری حروف) ----
    // Distractors use round he ہ (U+06C1) — DO NOT NORMALIZE
    const sec6 = [
        { base: '\u067E', ans: '\u067E\u06BE', opts: ['\u067E\u06BE','\u067E\u06C1','\u067E'] },
        { base: '\u0679', ans: '\u0679\u06BE', opts: ['\u0679\u06BE','\u0679\u06C1','\u0679'] },
        { base: '\u062C', ans: '\u062C\u06BE', opts: ['\u062C\u06BE','\u062C\u06C1','\u062C'] },
        { base: '\u062F', ans: '\u062F\u06BE', opts: ['\u062F\u06BE','\u062F\u06C1','\u062F'] },
        { base: '\u06A9', ans: '\u06A9\u06BE', opts: ['\u06A9\u06BE','\u06A9\u06C1','\u06A9'] },
        { base: '\u06AF', ans: '\u06AF\u06BE', opts: ['\u06AF\u06BE','\u06AF\u06C1','\u06AF'] }
    ];

    // ---- MINI TEST DATA (4 items, topic varies) ----
    const miniTest = [
        { prompt: '\u0628\u06BE\u0627\u0631\u06CC \u0644\u0641\u0638 \u06A9\u0648\u0646 \u0633\u0627 \u06C1\u06D2\u061F', opts: ['\u0628\u06BE\u0627\u0626\u06CC','\u0628\u06C1\u0646','\u0627\u0628\u0648'], ans: '\u0628\u06BE\u0627\u0626\u06CC', topic: '\u0628\u06BE\u0627\u0631\u06CC \u0627\u0644\u0641\u0627\u0638 \u06A9\u06CC \u067E\u06C1\u0686\u0627\u0646' },
        { prompt: '\uD83E\uDD52 \u06A9\u06BE\u06CC\u0631\u0627 \u2014 \u06A9\u0648\u0646 \u0633\u0627 \u0628\u06BE\u0627\u0631\u06CC \u062D\u0631\u0641 \u06C1\u06D2\u061F', opts: ['\u06A9\u06BE','\u06AF\u06BE','\u062C\u06BE'], ans: '\u06A9\u06BE', topic: '\u0628\u06BE\u0627\u0631\u06CC \u062D\u0631\u0648\u0641' },
        { prompt: '\uD83D\uDC11 \u0635\u062D\u06CC\u062D \u0627\u0645\u0644\u0627 \u0686\u0646\u06CC\u06BA', opts: ['\u0628\u06BE\u06CC\u0691','\u0628\u06C1\u06CC\u0691','\u0628\u06CC\u0691'], ans: '\u0628\u06BE\u06CC\u0691', topic: '\u0627\u0645\u0644\u0627' },
        { prompt: '\uD83D\uDC03 \u0628\u06BE\u06CC\u0646\u0633 \u2014 \u06C1\u0644\u06A9\u0627 \u06CC\u0627 \u0628\u06BE\u0627\u0631\u06CC\u061F', opts: ['\u0628\u06BE\u0627\u0631\u06CC','\u06C1\u0644\u06A9\u0627'], ans: '\u0628\u06BE\u0627\u0631\u06CC', topic: '\u0628\u06BE\u0627\u0631\u06CC \u0627\u0644\u0641\u0627\u0638 \u06A9\u06CC \u067E\u06C1\u0686\u0627\u0646' }
    ];

    // Helper to shuffle array (Fisher-Yates) - for option randomization per attempt
    function shuffle(arr) {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    // Build HTML
    let html = '';
    let sectionCount = 1;

    // RTL container wraps ALL content sections (matches Urdu Dost pattern)
    html += \`<div class="urdu-rtl-container" dir="rtl" lang="ur">\`;

    // === SECTION HEADER HELPER ===
    const secHeader = (titleUrdu, subtitleUrdu) => \`
        <div class="flex items-center gap-4 mb-2">
            <div class="badge">\${sectionCount++}</div>
            <h3 class="text-2xl font-nastaliq font-bold">\${titleUrdu}</h3>
        </div>
        \${subtitleUrdu ? \`<p class="text-lg mb-6 font-nastaliq font-medium text-navy bg-white/50 inline-block px-4 py-2 rounded-lg">\${subtitleUrdu}</p>\` : ''}
    \`;

    // ==========================================
    // SECTION 1: بھاری حروف سیکھیں (NOT graded)
    // ==========================================
    html += \`<div class="section-card gs-reveal">
        \${secHeader('\u0628\u06BE\u0627\u0631\u06CC \u062D\u0631\u0648\u0641 \u0633\u06CC\u06A9\u06BE\u06CC\u06BA', null)}

        <!-- Animated Demo -->
        <div class="mb-8 flex flex-col items-center gap-4">
            <p class="font-nastaliq text-xl text-navy text-center leading-loose" style="line-height:2.4;">
                \u062F\u0648 \u0686\u0634\u0645\u06CC \u06BE \u0644\u06AF\u0627\u0646\u06D2 \u0633\u06D2 \u062D\u0631\u0641 \u06A9\u06CC \u0622\u0648\u0627\u0632 \u0628\u06BE\u0627\u0631\u06CC \u06C1\u0648 \u062C\u0627\u062A\u06CC \u06C1\u06D2\u06D4
            </p>
            <div id="bh-demo-container" dir="ltr" class="flex items-center justify-center gap-6 my-4 select-none">
                <div id="bh-base" class="text-6xl font-nastaliq text-navy opacity-0" style="font-size:4rem; line-height:1.6;">\u0628</div>
                <div id="bh-plus" class="text-3xl text-gray-400 opacity-0">+</div>
                <div id="bh-he"   class="text-6xl font-nastaliq text-navy opacity-0" style="font-size:4rem; line-height:1.6;">\u06BE</div>
                <div id="bh-eq"   class="text-3xl text-gray-400 opacity-0">=</div>
                <div id="bh-result" class="text-6xl font-nastaliq font-bold text-gold opacity-0" style="font-size:4.5rem; line-height:1.6;">\u0628\u06BE</div>
                <div id="bh-puff" class="text-3xl opacity-0" aria-hidden="true">\uD83D\uDCA8</div>
            </div>
            <button id="bh-demo-replay" class="btn btn-gold px-6 py-2 rounded-xl text-lg font-baloo">↺ Replay</button>
        </div>

        <!-- Flip Cards Grid -->
        <div id="bh-flip-grid" class="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-4" dir="ltr">
        \${flipCards.map(c => \`
            <div class="flip-card cursor-pointer" data-card-id="\${c.id}" style="height:140px;" aria-label="\${c.letter} — \${c.word}">
                <div class="flip-card-inner rounded-2xl" id="bh-card-inner-\${c.id}">
                    <div class="flip-card-front bg-white rounded-2xl border-2 border-blue-200 flex flex-col items-center justify-center shadow-md p-3">
                        <div class="font-nastaliq font-bold text-navy" style="font-size:2.5rem; line-height:1.6;">\${c.letter}</div>
                    </div>
                    <div class="flip-card-back bg-navy rounded-2xl flex flex-col items-center justify-center text-white p-2 gap-1">
                        <div class="text-3xl">\${c.emoji}</div>
                        <div class="font-nastaliq text-center font-bold" style="font-size:1.1rem; line-height:1.8;">\${c.word}</div>
                        <button class="bh-audio-btn text-xl" data-audio-id="\${c.id}" style="display:none;" aria-label="Play audio">\uD83D\uDD0A</button>
                    </div>
                </div>
            </div>
        \`).join('')}
        </div>
    </div>\`;

    // =========================================================
    // SECTION 2: بھاری لفظ پہچانیں (GRADED 6, topic بھاری الفاظ کی پہچان)
    // =========================================================
    html += \`<div class="section-card gs-reveal">
        \${secHeader('\u0628\u06BE\u0627\u0631\u06CC \u0644\u0641\u0638 \u067E\u06C1\u0686\u0627\u0646\u06CC\u06BA', '\u0648\u06C1 \u0644\u0641\u0638 \u0686\u0646\u06CC\u06BA \u062C\u0633 \u0645\u06CC\u06BA \u0628\u06BE\u0627\u0631\u06CC \u06BE \u06C1\u06D2\u06D4')}
        <div class="space-y-4">\`;

    sec2.forEach((item, i) => {
        const shuffled = shuffle(item.opts);
        html += \`
        <div class="bg-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ud-question ba-s2"
             data-q="ba-s2-\${i}" data-ans="\${item.ans}" data-topic="\u0628\u06BE\u0627\u0631\u06CC \u0627\u0644\u0641\u0627\u0638 \u06A9\u06CC \u067E\u06C1\u0686\u0627\u0646">
            <div class="font-nastaliq font-bold text-navy" style="font-size:1.5rem; line-height:2.2;">\${i+1}.</div>
            <div class="flex flex-wrap gap-3 justify-end">
                \${shuffled.map(o => \`<div class="urdu-pill ud-opt" data-val="\${o}">\${o}</div>\`).join('')}
            </div>
        </div>\`;
    });

    html += \`</div></div>\`;

    // =========================================================
    // SECTION 3: پہلا بھاری حرف (GRADED 10, topic بھاری حروف)
    // =========================================================
    html += \`<div class="section-card gs-reveal">
        \${secHeader('\u067E\u06C1\u0644\u0627 \u0628\u06BE\u0627\u0631\u06CC \u062D\u0631\u0641', '\u062A\u0635\u0648\u06CC\u0631 \u062F\u06CC\u06A9\u06BE \u06A9\u0631 \u0628\u06BE\u0627\u0631\u06CC \u062D\u0631\u0641 \u0686\u0646\u06CC\u06BA\u06D4')}
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">\`;

    sec3.forEach((item, i) => {
        const shuffled = shuffle(item.opts);
        html += \`
        <div class="bg-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ud-question ba-s3"
             data-q="ba-s3-\${i}" data-ans="\${item.ans}" data-topic="\u0628\u06BE\u0627\u0631\u06CC \u062D\u0631\u0648\u0641">
            <div class="flex items-center gap-3">
                <span style="font-size:2rem;">\${item.emoji}</span>
                <span class="font-nastaliq font-bold text-navy" style="font-size:1.5rem; line-height:2.2;">\${item.word}</span>
            </div>
            <div class="flex gap-3 justify-end flex-wrap">
                \${shuffled.map(o => \`<div class="urdu-pill ud-opt" data-val="\${o}">\${o}</div>\`).join('')}
            </div>
        </div>\`;
    });

    html += \`</div></div>\`;

    // =========================================================
    // SECTION 4: صحیح املا (GRADED 6, topic املا)
    // =========================================================
    html += \`<div class="section-card gs-reveal">
        \${secHeader('\u0635\u062D\u06CC\u062D \u0627\u0645\u0644\u0627', '\u062A\u0635\u0648\u06CC\u0631 \u062F\u06CC\u06A9\u06BE \u06A9\u0631 \u0635\u062D\u06CC\u062D \u0644\u0641\u0638 \u0686\u0646\u06CC\u06BA\u06D4')}
        <div class="space-y-4">\`;

    sec4.forEach((item, i) => {
        const shuffled = shuffle(item.opts);
        html += \`
        <div class="bg-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ud-question ba-s4"
             data-q="ba-s4-\${i}" data-ans="\${item.ans}" data-topic="\u0627\u0645\u0644\u0627">
            <div style="font-size:2.5rem;">\${item.emoji}</div>
            <div class="flex gap-3 justify-end flex-wrap">
                \${shuffled.map(o => \`<div class="urdu-pill ud-opt" data-val="\${o}">\${o}</div>\`).join('')}
            </div>
        </div>\`;
    });

    html += \`</div></div>\`;

    // =========================================================
    // SECTION 5: ہلکا یا بھاری؟ (GRADED 8, topic بھاری الفاظ کی پہچان)
    // =========================================================
    html += \`<div class="section-card gs-reveal">
        \${secHeader('\u06C1\u0644\u06A9\u0627 \u06CC\u0627 \u0628\u06BE\u0627\u0631\u06CC\u061F', '\u06C1\u0631 \u0644\u0641\u0638 \u06A9\u06CC \u0642\u0633\u0645 \u0628\u062A\u0627\u0626\u06CC\u06BA\u06D4')}
        <div class="space-y-4">\`;

    sec5.forEach((item, i) => {
        html += \`
        <div class="bg-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ud-question ba-s5"
             data-q="ba-s5-\${i}" data-ans="\${item.ans}" data-topic="\u0628\u06BE\u0627\u0631\u06CC \u0627\u0644\u0641\u0627\u0638 \u06A9\u06CC \u067E\u06C1\u0686\u0627\u0646">
            <div class="font-nastaliq font-bold text-navy" style="font-size:2rem; line-height:2.2;">\${i+1}. \${item.word}</div>
            <div class="flex gap-4 justify-end">
                <div class="urdu-pill ud-opt" data-val="\u06C1\u0644\u06A9\u0627">\u06C1\u0644\u06A9\u0627</div>
                <div class="urdu-pill ud-opt" data-val="\u0628\u06BE\u0627\u0631\u06CC">\u0628\u06BE\u0627\u0631\u06CC</div>
            </div>
        </div>\`;
    });

    html += \`</div></div>\`;

    // =========================================================
    // SECTION 6: ھ کے ساتھ جوڑیں (GRADED 6, topic بھاری حروف)
    // =========================================================
    html += \`<div class="section-card gs-reveal">
        \${secHeader('\u06BE \u06A9\u06D2 \u0633\u0627\u062A\u06BE \u062C\u0648\u0691\u06CC\u06BA', '\u062F\u0631\u0633\u062A \u062C\u0648\u0691 \u0686\u0646\u06CC\u06BA\u06D4')}
        <div class="space-y-4">\`;

    sec6.forEach((item, i) => {
        const shuffled = shuffle(item.opts);
        // RTL equation: in RTL flow the display order will be: base + ھ = ؟
        html += \`
        <div class="bg-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ud-question ba-s6"
             data-q="ba-s6-\${i}" data-ans="\${item.ans}" data-topic="\u0628\u06BE\u0627\u0631\u06CC \u062D\u0631\u0648\u0641">
            <div class="font-nastaliq font-bold text-navy urdu-join-prompt">\${i+1}. \${item.base} + \u06BE = \u061F</div>
            <div class="flex gap-3 justify-end flex-wrap">
                \${shuffled.map(o => \`<div class="urdu-pill ud-opt" data-val="\${o}">\${o}</div>\`).join('')}
            </div>
        </div>\`;
    });

    html += \`</div></div>\`;

    // =========================================================
    // MINI TEST: اردو چیلنج (GRADED 4, mixed topics)
    // =========================================================
    html += \`<div class="section-card gs-reveal">
        \${secHeader('\u0627\u0631\u062F\u0648 \u0686\u06CC\u0644\u0646\u062C \uD83C\uDFC6', '\u0645\u06A9\u0633 \u0633\u0648\u0627\u0644\u0627\u062A \u2014 \u0622\u067E \u062A\u06CC\u0627\u0631 \u06C1\u06CC\u06BA!')}
        <div class="space-y-4">\`;

    miniTest.forEach((item, i) => {
        const shuffled = shuffle(item.opts);
        html += \`
        <div class="bg-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ud-question ba-mt"
             data-q="ba-mt-\${i}" data-ans="\${item.ans}" data-topic="\${item.topic}">
            <div class="font-nastaliq font-bold text-navy urdu-join-prompt">\${i+1}. \${item.prompt}</div>
            <div class="flex gap-3 justify-end flex-wrap">
                \${shuffled.map(o => \`<div class="urdu-pill ud-opt" data-val="\${o}">\${o}</div>\`).join('')}
            </div>
        </div>\`;
    });

    html += \`</div></div>\`;

    // Close RTL container
    html += \`</div>\`;

    // Inject before the submit button
    container.insertAdjacentHTML('afterbegin', html);

    // Wire pill interactivity (reuses same pattern as Urdu Dost)
    setupBhaariAlfaazPillsInteractivity();

    // Wire Section 1 GSAP demo animation
    requestAnimationFrame(() => {
        playBhaariDemo();
        document.getElementById('bh-demo-replay').addEventListener('click', playBhaariDemo);
        checkBhaariAudio();
    });
}

// ============================================================
// BHAARI ALFAAZ — SECTION 1 GSAP DEMO ANIMATION
// ============================================================
function playBhaariDemo() {
    const base = document.getElementById('bh-base');
    const plus = document.getElementById('bh-plus');
    const he   = document.getElementById('bh-he');
    const eq   = document.getElementById('bh-eq');
    const res  = document.getElementById('bh-result');
    const puff = document.getElementById('bh-puff');
    if (!base) return;

    // Reset
    gsap.set([base, plus, he, eq, res, puff], { opacity: 0, x: 0, scale: 1 });

    const tl = gsap.timeline();
    // Base letter slides in from right
    tl.to(base, { opacity: 1, x: 0, duration: 0.4, ease: 'back.out(1.4)' }, 0.2);
    tl.to(plus, { opacity: 1, duration: 0.3 }, 0.5);
    // ھ slides in from left
    tl.fromTo(he, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'back.out(1.4)' }, 0.7);
    tl.to(eq, { opacity: 1, duration: 0.3 }, 1.0);
    // Result pops in with scale
    tl.fromTo(res, { scale: 0, opacity: 0 }, { scale: 1.2, opacity: 1, duration: 0.4, ease: 'back.out(2)' }, 1.3);
    tl.to(res, { scale: 1, duration: 0.2 }, 1.7);
    // Puff
    tl.fromTo(puff, { opacity: 0, y: 10 }, { opacity: 1, y: -10, duration: 0.4 }, 1.5);
    tl.to(puff, { opacity: 0, y: -30, duration: 0.5 }, 2.0);
}

// ============================================================
// BHAARI ALFAAZ — OPTIONAL AUDIO (silent on missing files)
// ============================================================
(function() {
    const sharedAudio = new Audio();
    sharedAudio.preload = 'none';
    // Unlock on first user tap (iOS requirement)
    document.addEventListener('click', function unlock() {
        sharedAudio.play().catch(() => {});
        sharedAudio.pause();
        document.removeEventListener('click', unlock);
    }, { once: true });
    window._bhaariAudio = sharedAudio;
})();

function checkBhaariAudio() {
    const buttons = document.querySelectorAll('.bh-audio-btn');
    buttons.forEach(btn => {
        const id = btn.dataset.audioId;
        const src = 'audio/heavy-' + id + '.mp3';
        // Probe: create a hidden audio element, listen for canplaythrough or error
        const probe = new Audio();
        probe.preload = 'none';
        probe.addEventListener('canplaythrough', () => {
            btn.style.display = '';
        }, { once: true });
        probe.addEventListener('error', () => {
            btn.style.display = 'none';
        }, { once: true });
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't flip the card again
            const a = window._bhaariAudio;
            a.src = src;
            a.play().catch(() => {});
        });
        probe.src = src;
        probe.load();
    });
}

// ============================================================
// BHAARI ALFAAZ — PILL INTERACTIVITY (same as Urdu Dost)
// ============================================================
function setupBhaariAlfaazPillsInteractivity() {
    const container = document.getElementById('screen-worksheet-bhaariAlfaaz');
    if (!container || container.dataset.bhaariEventsSet === 'true') return;
    container.dataset.bhaariEventsSet = 'true';

    container.addEventListener('click', (e) => {
        const pill = e.target.closest('.ud-opt');
        if (!pill) return;
        const q = pill.closest('.ud-question');
        if (!q) return;

        q.querySelectorAll('.ud-opt').forEach(p => p.classList.remove('selected', 'urdu-pill-error'));
        q.classList.remove('pill-error');
        pill.classList.add('selected');

        gsap.fromTo(pill, { scale: 0.9 }, { scale: 1.05, duration: 0.3, ease: 'back.out(2)' });
    });
}

// ============================================================
// BHAARI ALFAAZ — GRADING FUNCTION
// ============================================================
function gradeWorksheetBhaariAlfaaz() {
    state.results = [];
    state.totalCorrect = 0;

    const gradePillsUrdu = (selector) => {
        document.querySelectorAll(selector).forEach(q => {
            const cAns   = q.dataset.ans;
            const topic  = q.dataset.topic || '\u0639\u0645\u0648\u0645\u06CC';
            const selectedPill = q.querySelector('.ud-opt.selected');
            const uAns   = selectedPill ? selectedPill.dataset.val : null;
            const isCorrect = (uAns !== null) && (uAns === cAns);

            if (isCorrect) state.totalCorrect++;

            const promptEl = q.querySelector('.urdu-join-prompt, .urdu-stimulus, [style*="font-size"]');
            const qText = promptEl ? promptEl.innerText.trim() : '\u0633\u0648\u0627\u0644';

            state.results.push({
                q: qText,
                userAns: uAns || '\u062C\u0648\u0627\u0628 \u0646\u06C1\u06CC\u06BA',
                correctAns: cAns,
                isCorrect: isCorrect,
                section: topic,
                topic: topic
            });
        });
    };

    gradePillsUrdu('.ba-s2');
    gradePillsUrdu('.ba-s3');
    gradePillsUrdu('.ba-s4');
    gradePillsUrdu('.ba-s5');
    gradePillsUrdu('.ba-s6');
    gradePillsUrdu('.ba-mt');
}

// ============================================================
// SMART STARTERS — CLASS I MATHS & READING (Part D)
// ============================================================`;

content = content.replace(insertPoint, renderFn);
console.log('Render/Grade functions inserted');

fs.writeFileSync('KCI_TableOf2_App/index.html', content, 'utf8');
console.log('Saved Part C step 3 (render + grade functions)');
