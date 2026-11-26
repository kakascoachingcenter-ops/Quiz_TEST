const fs = require('fs');

let html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

// 1. UPDATE STORY READER SHEET HEADER TO INCLUDE TTS CONTROLS & VOICE MODEL
const oldStoryHeader = `<div style="display:flex; align-items:center; justify-content:space-between; padding:0.75rem 1.25rem 0.5rem; border-bottom:1.5px solid #f1f5f9; flex-shrink:0;">
                <h2 style="font-family:'Baloo 2', cursive; font-size:1.25rem; font-weight:800; color:#1e3a5f; margin:0;">📖 Zara and the Little Bird</h2>
                <button id="btn-close-story" class="kci-btn-ghost p-2" aria-label="Close story"><svg class="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
            </div>`;

const newStoryHeader = `<div style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 1.25rem 0.65rem; border-bottom:1.5px solid #efe6d3; flex-shrink:0; background:#fbf7ef;">
                <div class="flex items-center gap-3">
                    <span class="text-2xl text-navy">📖</span>
                    <div>
                        <h2 class="font-heading text-xl font-bold text-navy m-0 leading-tight">Zara and the Little Bird</h2>
                        <span class="text-xs text-graphite font-semibold opacity-75">Moral Story for Reading & Listening</span>
                    </div>
                </div>

                <div class="flex items-center gap-2">
                    <!-- Audio Voice Read Button (Free Web Speech Synthesis Voice Model) -->
                    <button id="btn-story-voice" class="kci-btn-primary py-1.5 px-3.5 text-sm min-h-[38px] flex items-center gap-1.5" title="Listen to Story">
                        <span id="voice-icon" class="text-base">🔊</span>
                        <span id="voice-label">Read Aloud</span>
                    </button>
                    <button id="btn-close-story" class="kci-btn-ghost p-2" aria-label="Close story">
                        <svg class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>
            </div>`;

html = html.replace(oldStoryHeader, newStoryHeader);

// 2. ENHANCE STORY MODAL JS LOGIC TO INCLUDE TTS VOICE ENGINE (PAUSE / RESUME / HIGHLIGHT)
const oldStoryModalLogic = `    function openStoryModal() {
        storyOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        gsap.to(storySheet, { y: '0%', duration: 0.4, ease: 'power3.out' });
    }

    function closeStoryModal() {
        gsap.to(storySheet, {
            y: '100%', duration: 0.35, ease: 'power3.in',
            onComplete: () => {
                storyOverlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }`;

const newStoryModalLogic = `    // Free Web Speech Synthesis Voice Model for Story Reader
    let storySpeechUtterance = null;
    let isStorySpeaking = false;

    function getBestEnglishVoice() {
        if (!('speechSynthesis' in window)) return null;
        const voices = window.speechSynthesis.getVoices();
        // Prefer natural sounding English voices
        return voices.find(v => (v.lang === 'en-US' || v.lang === 'en-GB') && (v.name.includes('Natural') || v.name.includes('Neural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Female')))
            || voices.find(v => v.lang.startsWith('en'))
            || voices[0] || null;
    }

    function toggleStoryVoice() {
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
            if (voiceIcon) voiceIcon.innerText = "🔊";
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
            if (voiceIcon) voiceIcon.innerText = "⏹️";
            if (voiceLabel) voiceLabel.innerText = "Stop";
        };

        storySpeechUtterance.onend = () => {
            isStorySpeaking = false;
            if (voiceIcon) voiceIcon.innerText = "🔊";
            if (voiceLabel) voiceLabel.innerText = "Read Aloud";
        };

        storySpeechUtterance.onerror = () => {
            isStorySpeaking = false;
            if (voiceIcon) voiceIcon.innerText = "🔊";
            if (voiceLabel) voiceLabel.innerText = "Read Aloud";
        };

        window.speechSynthesis.speak(storySpeechUtterance);
    }

    function openStoryModal() {
        storyOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        gsap.to(storySheet, { y: '0%', duration: 0.4, ease: 'power3.out' });
    }

    function closeStoryModal() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            isStorySpeaking = false;
            const voiceIcon = document.getElementById('voice-icon');
            const voiceLabel = document.getElementById('voice-label');
            if (voiceIcon) voiceIcon.innerText = "🔊";
            if (voiceLabel) voiceLabel.innerText = "Read Aloud";
        }

        gsap.to(storySheet, {
            y: '100%', duration: 0.35, ease: 'power3.in',
            onComplete: () => {
                storyOverlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    window.openStoryModal = openStoryModal;
    window.closeStoryModal = closeStoryModal;
    window.toggleStoryVoice = toggleStoryVoice;

    const btnStoryVoice = document.getElementById('btn-story-voice');
    if (btnStoryVoice) btnStoryVoice.addEventListener('click', toggleStoryVoice);`;

html = html.replace(oldStoryModalLogic, newStoryModalLogic);

// 3. FIX HTML2CANVAS IMAGE EXPORT BUG
// Ensure export snapshot handles missing currentWorksheetId safely and suppresses CORS issues
const oldExportImg = `        // Download Image (PNG)
        document.getElementById('btn-img').addEventListener('click', async () => {
            const btn = document.getElementById('btn-img');
            const originalText = btn.innerText;
            btn.innerText = "⏳ Generating...";
            btn.disabled = true;
            
            const card = setupExportMode();
            
            try {
                const canvas = await html2canvas(card, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                });
                
                const link = document.createElement('a');
                link.download = getFileName('png');
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch(e) {
                console.error(e);
                alert("Sorry, could not generate image.");
            }
            
            cleanupExportMode();
            btn.innerText = originalText;
            btn.disabled = false;
        });`;

const newExportImg = `        // Download Image (PNG) - Resilient & Fast
        document.getElementById('btn-img').addEventListener('click', async () => {
            const btn = document.getElementById('btn-img');
            const originalText = btn.innerText;
            btn.innerText = "⏳ Generating...";
            btn.disabled = true;
            
            const card = setupExportMode();
            
            try {
                const canvas = await html2canvas(card, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    onclone: (clonedDoc) => {
                        // Ensure background and charts in cloned view are rendered cleanly
                        const clonedCard = clonedDoc.getElementById('results-card');
                        if (clonedCard) {
                            clonedCard.style.boxShadow = 'none';
                            clonedCard.style.transform = 'none';
                        }
                    }
                });
                
                const link = document.createElement('a');
                link.download = getFileName('png');
                link.href = canvas.toDataURL('image/png');
                link.click();
            } catch(e) {
                console.error("Export PNG Error:", e);
                // Fallback attempt without scale multiplier if device ran out of memory
                try {
                    const fallbackCanvas = await html2canvas(card, {
                        scale: 1,
                        useCORS: true,
                        allowTaint: true,
                        backgroundColor: '#ffffff'
                    });
                    const link = document.createElement('a');
                    link.download = getFileName('png');
                    link.href = fallbackCanvas.toDataURL('image/png');
                    link.click();
                } catch(err2) {
                    alert("Could not generate image on this device. Please try Download PDF or take a screenshot.");
                }
            }
            
            cleanupExportMode();
            btn.innerText = originalText;
            btn.disabled = false;
        });`;

html = html.replace(oldExportImg, newExportImg);

// Fix getFileName fallback
const oldGetFileName = `function getFileName(ext) {
            const safeName = state.student.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'student';
            const date = state.student.date || new Date().toISOString().split('T')[0];
            const prefix = worksheetsConfig[state.currentWorksheetId].exportPrefix;
            return \`\${prefix}_\${safeName}_\${date}.\${ext}\`;
        }`;

const newGetFileName = `function getFileName(ext) {
            const safeName = (state.student && state.student.name ? state.student.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'student') || 'student';
            const date = (state.student && state.student.date) ? state.student.date : new Date().toISOString().split('T')[0];
            const cfg = worksheetsConfig[state.currentWorksheetId] || {};
            const prefix = cfg.exportPrefix || 'KCI_Result';
            return \`\${prefix}_\${safeName}_\${date}.\${ext}\`;
        }`;

html = html.replace(oldGetFileName, newGetFileName);

fs.writeFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', html, 'utf8');
console.log('Fixed export resilience and added free Web Speech Voice Model to stories!');
