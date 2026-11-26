const fs = require('fs');

let html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

// Insert Library UI helpers & Value of Day & Value Tip logic right before window.showResults
const sTarget = html.indexOf('function showResults() {');

const libraryAndValueLogic = `
        // ============================================================
        // PART F & G: VALUE OF THE DAY & VALUE TIP SCREEN
        // ============================================================
        function getDayOfYear(date) {
            const start = new Date(date.getFullYear(), 0, 0);
            const diff = date - start;
            const oneDay = 1000 * 60 * 60 * 24;
            return Math.floor(diff / oneDay);
        }

        function getTodayValue() {
            const approvedValues = (window.valuesData || []).filter(v => v.approved === true);
            if (approvedValues.length === 0) return null;
            const now = new Date();
            const dayNum = getDayOfYear(now);
            const idx = dayNum % approvedValues.length;
            return approvedValues[idx];
        }

        function getNextValueTip(excludeId) {
            const approvedValues = (window.valuesData || []).filter(v => v.approved === true);
            if (approvedValues.length <= 1) return approvedValues[0];
            const filtered = approvedValues.filter(v => v.id !== excludeId);
            const randIdx = Math.floor(Math.random() * filtered.length);
            return filtered[randIdx];
        }

        function renderValueOfDayCard() {
            const val = getTodayValue();
            if (!val) return;

            // Ensure Urdu font is loaded lazily for Nastaliq
            if (window.loadUrduFontIfNeeded) window.loadUrduFontIfNeeded();

            const nameEnEl = document.getElementById('vod-name-en');
            const nameUrEl = document.getElementById('vod-name-ur');
            const lineEnEl = document.getElementById('vod-line-en');
            const lineUrEl = document.getElementById('vod-line-ur');

            if (nameEnEl) nameEnEl.textContent = val.nameEn;
            if (nameUrEl) nameUrEl.textContent = val.nameUr;
            if (lineEnEl) lineEnEl.textContent = \`"\${val.lineEn}"\`;
            if (lineUrEl) lineUrEl.textContent = \`"\${val.lineUr}"\`;

            // Expand/collapse Urdu line on mobile
            const vodCard = document.getElementById('value-of-day-card');
            if (vodCard) {
                vodCard.onclick = () => {
                    if (window.innerWidth < 640 && lineUrEl) {
                        const isHidden = lineUrEl.classList.contains('hidden');
                        if (isHidden) {
                            lineUrEl.classList.remove('hidden');
                            lineUrEl.classList.add('block');
                        } else {
                            lineUrEl.classList.add('hidden');
                            lineUrEl.classList.remove('block');
                        }
                    }
                };
            }
        }

        function initLibraryUI() {
            renderValueOfDayCard();

            // Populate tab icons
            const iconWs = document.getElementById('icon-tab-worksheets');
            const iconSt = document.getElementById('icon-tab-stories');
            const iconBackF = document.getElementById('icon-back-folder');
            const iconSliders = document.getElementById('icon-filter-sliders');
            const iconEmpty = document.getElementById('icon-empty-search');
            const iconStoriesCov = document.getElementById('icon-stories-cover');

            if (iconWs) iconWs.innerHTML = KCIIcons.fileText;
            if (iconSt) iconSt.innerHTML = KCIIcons.bookOpen;
            if (iconBackF) iconBackF.innerHTML = KCIIcons.arrowLeft;
            if (iconSliders) iconSliders.innerHTML = KCIIcons.sliders;
            if (iconEmpty) iconEmpty.innerHTML = KCIIcons.sliders;
            if (iconStoriesCov) iconStoriesCov.innerHTML = KCIIcons.bookOpen;

            // Wire Worksheets & Stories tabs
            const tabWorksheets = document.getElementById('tab-worksheets');
            const tabStories = document.getElementById('tab-stories');
            const contentWorksheets = document.getElementById('tab-content-worksheets');
            const contentStories = document.getElementById('tab-content-stories');

            if (tabWorksheets && tabStories) {
                tabWorksheets.onclick = () => {
                    tabWorksheets.classList.add('active');
                    tabWorksheets.setAttribute('aria-selected', 'true');
                    tabStories.classList.remove('active');
                    tabStories.setAttribute('aria-selected', 'false');
                    contentWorksheets.style.display = 'block';
                    contentStories.style.display = 'none';
                };
                tabStories.onclick = () => {
                    tabStories.classList.add('active');
                    tabStories.setAttribute('aria-selected', 'true');
                    tabWorksheets.classList.remove('active');
                    tabWorksheets.setAttribute('aria-selected', 'false');
                    contentWorksheets.style.display = 'none';
                    contentStories.style.display = 'block';
                };
            }

            // Wire Design system route hash
            checkHashRoute();
        }

        function checkHashRoute() {
            if (window.location.hash === '#/design-system') {
                document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
                const ds = document.getElementById('screen-design-system');
                if (ds) {
                    ds.classList.add('active');
                    ds.style.display = 'block';
                    ds.style.opacity = '1';

                    // Populate design system subject SVGs
                    document.getElementById('ds-maths').innerHTML = KCIIcons.subjectMaths;
                    document.getElementById('ds-english').innerHTML = KCIIcons.subjectEnglish;
                    document.getElementById('ds-evs').innerHTML = KCIIcons.subjectEVS;
                    document.getElementById('ds-islamiat').innerHTML = KCIIcons.subjectIslamiat;
                    document.getElementById('ds-urdu').innerHTML = KCIIcons.subjectUrdu;
                }
            }
        }
        window.addEventListener('hashchange', checkHashRoute);

        // Show Value Tip Screen before Results
        function showValueTipThenResults() {
            if (window.loadUrduFontIfNeeded) window.loadUrduFontIfNeeded();

            let lastValueId = null;
            try {
                lastValueId = parseInt(sessionStorage.getItem('kci_last_value_id')) || null;
            } catch(e) {}

            const tipValue = getNextValueTip(lastValueId);
            try {
                if (tipValue) sessionStorage.setItem('kci_last_value_id', tipValue.id);
            } catch(e) {}

            if (tipValue) {
                const enName = document.getElementById('tip-value-en');
                const urName = document.getElementById('tip-value-ur');
                const enLine = document.getElementById('tip-line-en');
                const urLine = document.getElementById('tip-line-ur');

                if (enName) enName.textContent = tipValue.nameEn;
                if (urName) urName.textContent = tipValue.nameUr;
                if (enLine) enLine.textContent = \`"\${tipValue.lineEn}"\`;
                if (urLine) urLine.textContent = \`"\${tipValue.lineUr}"\`;
            }

            const activeContainer = \`#screen-worksheet-\${state.currentWorksheetId}\`;
            const tipScreen = document.getElementById('screen-value-tip');

            gsap.to(activeContainer, {
                opacity: 0, y: -20, duration: 0.35, onComplete: () => {
                    const wsEl = document.querySelector(activeContainer);
                    if (wsEl) wsEl.classList.remove('active');

                    tipScreen.classList.add('active');
                    tipScreen.style.display = 'block';
                    window.scrollTo(0, 0);

                    gsap.fromTo(tipScreen, 
                        { opacity: 0, y: 30 },
                        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
                    );

                    // Wire "See My Result" button
                    const btnSee = document.getElementById('btn-see-result');
                    btnSee.onclick = () => {
                        gsap.to(tipScreen, {
                            opacity: 0, y: -20, duration: 0.35, onComplete: () => {
                                tipScreen.classList.remove('active');
                                tipScreen.style.display = 'none';
                                showResultsReal();
                            }
                        });
                    };
                }
            });
        }
`;

html = html.slice(0, sTarget) + libraryAndValueLogic + '\n' + html.slice(sTarget);

// Now change `showResults();` inside btn-verify click handler to call `showValueTipThenResults();`
html = html.replace('showResults();\n\n            });\n        });', 'showValueTipThenResults();\n\n            });\n        });');

// Rename original `function showResults() {` to `function showResultsReal() {` so showResultsReal executes grading display untouched
html = html.replace('function showResults() {', 'function showResultsReal() {');

// Provide window.showResults alias to showResultsReal to avoid breaking any direct callers
html = html.replace('window.showResults = showResults;', 'window.showResults = showResultsReal;\nwindow.showValueTipThenResults = showValueTipThenResults;');

fs.writeFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', html, 'utf8');
console.log('Value of the Day, Value Tip Screen, and Design System logic connected!');
