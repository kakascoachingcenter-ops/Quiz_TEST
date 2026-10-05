# Full JS changes: metadata on worksheetsConfig + filter system JS
$filePath = "f:\Tution\Worksheets\Webs\KCI_TableOf2_App\index.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# ============================================================
# STEP 1: Add metadata to worksheetsConfig entries
# ============================================================

$old_table2 = @'
            table2: {
                title: "Table of 2",
                exportPrefix: "KCI_Table2_Result",
                totalPossible: 39,
                render: null // Already in HTML
            },
'@
$new_table2 = @'
            table2: {
                title: "Table of 2",
                exportPrefix: "KCI_Table2_Result",
                totalPossible: 39,
                render: null, // Already in HTML
                // --- Metadata for Screen 2 filter / sort system ---
                subject: "Maths",
                classLevel: "KG",
                difficulty: "Easy",
                dateAdded: "2026-10-02",
                cardIcon: "&#x1F9EE;",
                cardDesc: "Multiplication practice for KG learners"
            },
'@

$old_class1 = @'
            class1: {
                title: "Class I English & EVS Worksheet",
                exportPrefix: "KCI_ClassI_Result",
                totalPossible: 74,
                render: renderClass1Worksheet
            },
'@
$new_class1 = @'
            class1: {
                title: "Class I English & EVS Worksheet",
                exportPrefix: "KCI_ClassI_Result",
                totalPossible: 74,
                render: renderClass1Worksheet,
                subject: "English",
                classLevel: "Class I",
                difficulty: "Easy",
                dateAdded: "2026-10-02",
                cardIcon: "&#x1F4D6;",
                cardDesc: "Living things, naming words, sounds, grammar &amp; more!"
            },
'@

$old_nature = @'
            nature: {
                title: "Nature Explorers — Living, Plants & Animals",
                exportPrefix: "KCI_NatureExplorers_Result",
                totalPossible: 33,
                render: renderNatureWorksheet
            },
'@
$new_nature = @'
            nature: {
                title: "Nature Explorers — Living, Plants & Animals",
                exportPrefix: "KCI_NatureExplorers_Result",
                totalPossible: 33,
                render: renderNatureWorksheet,
                subject: "EVS",
                classLevel: "KG",
                difficulty: "Easy",
                dateAdded: "2026-10-02",
                cardIcon: "&#x1F33F;",
                cardDesc: "Basic classification fun for KG learners"
            },
'@

$old_islamiat = @'
            islamiat: {
                title: "Little Believers &mdash; Islamiat Basics",
                exportPrefix: "KCI_Islamiat_Result",
                totalPossible: 21,
                render: renderIslamiatWorksheet,
                onShown: registerIslamiatScrollAnimations
            },
'@
$new_islamiat = @'
            islamiat: {
                title: "Little Believers &mdash; Islamiat Basics",
                exportPrefix: "KCI_Islamiat_Result",
                totalPossible: 21,
                render: renderIslamiatWorksheet,
                onShown: registerIslamiatScrollAnimations,
                subject: "Islamiat",
                classLevel: "KG",
                difficulty: "Easy",
                dateAdded: "2026-10-02",
                cardIcon: "&#x262A;&#xFE0F;",
                cardDesc: "Five Pillars, Prophets, Angels &amp; Holy Books"
            },
'@

$old_ninjas = @'
            numberNinjas: {
                title: "Number Ninjas &mdash; Class II Maths & Grammar",
                exportPrefix: "KCI_NumberNinjas_Result",
                totalPossible: 41,
                render: renderNumberNinjasWorksheet,
                onShown: registerNumberNinjasInputs
            },
'@
$new_ninjas = @'
            numberNinjas: {
                title: "Number Ninjas &mdash; Class II Maths & Grammar",
                exportPrefix: "KCI_NumberNinjas_Result",
                totalPossible: 41,
                render: renderNumberNinjasWorksheet,
                onShown: registerNumberNinjasInputs,
                subject: "Maths",
                classLevel: "Class II",
                difficulty: "Medium",
                dateAdded: "2026-10-02",
                cardIcon: "&#x1F4D0;",
                cardDesc: "3-digit addition/subtraction + nouns &amp; verbs"
            },
'@

$old_grammar = @'
            grammarChamps: {
                title: "Grammar Champs &mdash; Class III Nouns, Verbs & Articles",
                exportPrefix: "KCI_GrammarChamps_Result",
                totalPossible: 41,
                render: renderGrammarChampsWorksheet,
                onShown: registerGrammarChampsInputs
            }
'@
$new_grammar = @'
            grammarChamps: {
                title: "Grammar Champs &mdash; Class III Nouns, Verbs & Articles",
                exportPrefix: "KCI_GrammarChamps_Result",
                totalPossible: 41,
                render: renderGrammarChampsWorksheet,
                onShown: registerGrammarChampsInputs,
                subject: "English",
                classLevel: "Class III",
                difficulty: "Medium",
                dateAdded: "2026-10-02",
                cardIcon: "&#x270D;&#xFE0F;",
                cardDesc: "Types of nouns, -ing verbs, and a/an articles"
            }
'@

# Apply all config substitutions
$content = $content.Replace($old_table2, $new_table2)
$content = $content.Replace($old_class1, $new_class1)
$content = $content.Replace($old_nature, $new_nature)
$content = $content.Replace($old_islamiat, $new_islamiat)
$content = $content.Replace($old_ninjas, $new_ninjas)
$content = $content.Replace($old_grammar, $new_grammar)

Write-Host "Config metadata replacements done."

# ============================================================
# STEP 2: Replace old card click listener (.ws-card forEach)
#         with event delegation on #ws-grid
#         AND remove the old GSAP entrance on .ws-card
# ============================================================
$old_cardClick = @'
        // ----------------------------------------------------
        // SCREEN 2: Worksheet Selection Interactivity
        // ----------------------------------------------------
        document.querySelectorAll('.ws-card').forEach(card => {
            card.addEventListener('click', () => {
                const wsId = card.dataset.worksheet;
                state.currentWorksheetId = wsId;
                state.totalPossible = worksheetsConfig[wsId].totalPossible;
                
                // Update Main Subtitle
                document.getElementById('main-subtitle').innerText = worksheetsConfig[wsId].title;
                
                // Render if dynamic
                if (worksheetsConfig[wsId].render) {
                    worksheetsConfig[wsId].render();
                }
                
                const targetScreen = '#screen-worksheet-' + wsId;
                
                // GSAP Transition from Selection -> Worksheet
                gsap.to('#screen-selection', {
                    opacity: 0, y: -20, duration: 0.4, onComplete: () => {
                        document.getElementById('screen-selection').classList.remove('active');
                        document.querySelector(targetScreen).classList.add('active');
                        window.scrollTo(0, 0);
                        
                        gsap.to(targetScreen, { opacity: 1, duration: 0.1 });
                        gsap.to(`${targetScreen} .gs-reveal`, {
                            opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)"
                        });

                        // Let any worksheet run post-activation setup (e.g. ScrollTrigger registration)
                        if (worksheetsConfig[wsId] && worksheetsConfig[wsId].onShown) {
                            worksheetsConfig[wsId].onShown();
                        }
                    }
                });
            });
        });
'@

$new_cardClick = @'
        // ----------------------------------------------------
        // SCREEN 2: Worksheet Selection Interactivity
        // Card clicks use event delegation on #ws-grid so
        // dynamically-rendered cards are automatically wired.
        // ----------------------------------------------------
        function launchWorksheet(wsId) {
            state.currentWorksheetId = wsId;
            state.totalPossible = worksheetsConfig[wsId].totalPossible;
            document.getElementById('main-subtitle').innerText = worksheetsConfig[wsId].title;
            if (worksheetsConfig[wsId].render) { worksheetsConfig[wsId].render(); }
            const targetScreen = '#screen-worksheet-' + wsId;
            gsap.to('#screen-selection', {
                opacity: 0, y: -20, duration: 0.4, onComplete: () => {
                    document.getElementById('screen-selection').classList.remove('active');
                    document.querySelector(targetScreen).classList.add('active');
                    window.scrollTo(0, 0);
                    gsap.to(targetScreen, { opacity: 1, duration: 0.1 });
                    gsap.to(`${targetScreen} .gs-reveal`, {
                        opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)"
                    });
                    if (worksheetsConfig[wsId] && worksheetsConfig[wsId].onShown) {
                        worksheetsConfig[wsId].onShown();
                    }
                }
            });
        }

        document.getElementById('ws-grid').addEventListener('click', (e) => {
            const card = e.target.closest('.ws-card');
            if (!card) return;
            const wsId = card.dataset.worksheet;
            if (wsId && worksheetsConfig[wsId]) launchWorksheet(wsId);
        });
'@

$content = $content.Replace($old_cardClick, $new_cardClick)
Write-Host "Card click delegation replaced."

# ============================================================
# STEP 3: Replace the GSAP card entrance in login handler
#         (gsap.fromTo('.ws-card' ...)) with renderSelectionGrid call
# ============================================================
$old_loginTransition = @'
                    gsap.to('#screen-selection', { opacity: 1, duration: 0.1 });
                    gsap.fromTo('.ws-card', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.2, ease: "back.out(1.2)" });
'@
$new_loginTransition = @'
                    gsap.to('#screen-selection', { opacity: 1, duration: 0.1 });
                    renderSelectionGrid();
                    buildFilterSheet();
'@

$content = $content.Replace($old_loginTransition, $new_loginTransition)
Write-Host "Login transition updated."

# ============================================================
# STEP 4: Replace "Choose Another" button handler
#         to re-render grid when returning to selection screen
# ============================================================
$old_chooseAnother = @'
                    // Go to Selection Screen
                    document.getElementById('screen-selection').classList.add('active');
                    gsap.to('#screen-selection', { opacity: 1, y: 0, duration: 0.4 });
                    window.scrollTo(0, 0);
'@
$new_chooseAnother = @'
                    // Go to Selection Screen
                    document.getElementById('screen-selection').classList.add('active');
                    gsap.to('#screen-selection', { opacity: 1, y: 0, duration: 0.4 });
                    window.scrollTo(0, 0);
                    renderSelectionGrid();
'@

$content = $content.Replace($old_chooseAnother, $new_chooseAnother)
Write-Host "Choose-another handler updated."

# ============================================================
# STEP 5: Inject the entire Filter System JS just before </script>
# ============================================================
$filterJS = @'

        // ============================================================
        // SCREEN 2 — FILTER SYSTEM
        // ============================================================

        // Active filter state — OR within group, AND across groups
        const filterState = {
            subject:    new Set(),
            classLevel: new Set(),
            difficulty: new Set()
        };

        // Pending state (inside the sheet, not yet applied)
        const pendingFilter = {
            subject:    new Set(),
            classLevel: new Set(),
            difficulty: new Set()
        };

        // ------------------------------------------------------------------
        // Helpers
        // ------------------------------------------------------------------
        function isNewWorksheet(dateStr) {
            const added = new Date(dateStr);
            const now   = new Date();
            const diffMs = now - added;
            return diffMs <= 7 * 24 * 60 * 60 * 1000; // 7 days in ms
        }

        function getFilteredWorksheets() {
            return Object.entries(worksheetsConfig)
                .filter(([, cfg]) => {
                    const subjectOk    = filterState.subject.size    === 0 || filterState.subject.has(cfg.subject);
                    const classOk      = filterState.classLevel.size === 0 || filterState.classLevel.has(cfg.classLevel);
                    const difficultyOk = filterState.difficulty.size === 0 || filterState.difficulty.has(cfg.difficulty);
                    return subjectOk && classOk && difficultyOk;
                })
                .sort((a, b) => {
                    // Newest first (descending dateAdded)
                    const dA = new Date(a[1].dateAdded);
                    const dB = new Date(b[1].dateAdded);
                    if (dB - dA !== 0) return dB - dA;
                    return 0; // preserve insertion order for same date
                });
        }

        function countPendingMatches() {
            return Object.entries(worksheetsConfig)
                .filter(([, cfg]) => {
                    const subjectOk    = pendingFilter.subject.size    === 0 || pendingFilter.subject.has(cfg.subject);
                    const classOk      = pendingFilter.classLevel.size === 0 || pendingFilter.classLevel.has(cfg.classLevel);
                    const difficultyOk = pendingFilter.difficulty.size === 0 || pendingFilter.difficulty.has(cfg.difficulty);
                    return subjectOk && classOk && difficultyOk;
                }).length;
        }

        function totalActiveFilters() {
            return filterState.subject.size + filterState.classLevel.size + filterState.difficulty.size;
        }

        // ------------------------------------------------------------------
        // renderSelectionGrid — builds card HTML from config, sorted + filtered
        // ------------------------------------------------------------------
        function renderSelectionGrid() {
            const grid        = document.getElementById('ws-grid');
            const emptyState  = document.getElementById('ws-empty-state');
            const filtered    = getFilteredWorksheets();

            // Remove all previous cards (keep empty state element)
            Array.from(grid.querySelectorAll('.ws-card')).forEach(c => c.remove());

            if (filtered.length === 0) {
                emptyState.classList.add('visible');
            } else {
                emptyState.classList.remove('visible');
                filtered.forEach(([wsId, cfg]) => {
                    const isNew  = isNewWorksheet(cfg.dateAdded);
                    const badge  = isNew
                        ? `<span class="ws-badge ws-badge-new">&#x2728; NEW</span>`
                        : `<span class="ws-badge ws-badge-current">Current</span>`;
                    const card   = document.createElement('div');
                    card.className = 'ws-card flex flex-col h-full bg-white rounded-2xl shadow-xl border-4 border-lightBlue hover:border-gold transition-colors cursor-pointer p-6 text-center';
                    card.dataset.worksheet = wsId;
                    card.style.position = 'relative';
                    card.innerHTML = `
                        ${badge}
                        <div class="text-5xl mb-3">${cfg.cardIcon}</div>
                        <h4 class="text-xl font-baloo font-bold text-navy mb-1 leading-snug pr-10">${cfg.title}</h4>
                        <p class="text-sm text-gray-500 font-medium mb-4">${cfg.cardDesc}</p>
                        <div class="flex-grow"></div>
                        <div class="flex flex-wrap gap-1 justify-center mb-3">
                            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-lightBlue text-navy border border-blue-200">${cfg.subject}</span>
                            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-lightBlue text-navy border border-blue-200">${cfg.classLevel}</span>
                            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-lightBlue text-navy border border-blue-200">${cfg.difficulty}</span>
                        </div>
                        <button class="mt-auto btn btn-gold w-full text-xl py-3 rounded-xl hover:scale-105 transition-transform">Start &#x2192;</button>
                    `;
                    grid.appendChild(card);
                });

                // Animate cards in
                gsap.fromTo(grid.querySelectorAll('.ws-card'),
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.45, stagger: 0.08, ease: "back.out(1.2)" }
                );
            }

            // Sync filter button badge
            const count     = totalActiveFilters();
            const countEl   = document.getElementById('filter-active-count');
            countEl.textContent = count;
            if (count > 0) {
                countEl.classList.add('visible');
            } else {
                countEl.classList.remove('visible');
            }

            updateActiveChipRow();
        }

        // ------------------------------------------------------------------
        // updateActiveChipRow — shows removable tags for applied filters
        // ------------------------------------------------------------------
        function updateActiveChipRow() {
            const row = document.getElementById('active-chip-row');
            row.innerHTML = '';

            const allActive = [
                ...Array.from(filterState.subject).map(v    => ({ group: 'subject',    value: v })),
                ...Array.from(filterState.classLevel).map(v => ({ group: 'classLevel', value: v })),
                ...Array.from(filterState.difficulty).map(v => ({ group: 'difficulty', value: v }))
            ];

            if (allActive.length === 0) {
                row.classList.remove('visible');
                return;
            }

            row.classList.add('visible');

            allActive.forEach(({ group, value }) => {
                const chip = document.createElement('button');
                chip.className = 'active-chip';
                chip.innerHTML = `${value} <span class="active-chip-x">&#x2715;</span>`;
                chip.addEventListener('click', () => {
                    filterState[group].delete(value);
                    // Sync pending state too
                    pendingFilter[group].delete(value);
                    renderSelectionGrid();
                    syncSheetChips();
                });
                row.appendChild(chip);
            });

            if (allActive.length > 1) {
                const clearBtn = document.createElement('button');
                clearBtn.id = 'clear-all-filters';
                clearBtn.textContent = 'Clear all filters';
                clearBtn.addEventListener('click', () => {
                    ['subject', 'classLevel', 'difficulty'].forEach(g => {
                        filterState[g].clear();
                        pendingFilter[g].clear();
                    });
                    renderSelectionGrid();
                    syncSheetChips();
                });
                row.appendChild(clearBtn);
            }
        }

        // ------------------------------------------------------------------
        // buildFilterSheet — populates chip groups dynamically from config
        // ------------------------------------------------------------------
        function buildFilterSheet() {
            const body = document.getElementById('filter-sheet-body');
            body.innerHTML = '';

            // Derive unique values for each facet (preserving insertion order)
            const subjects    = [...new Set(Object.values(worksheetsConfig).map(c => c.subject))];
            const classLevels = [...new Set(Object.values(worksheetsConfig).map(c => c.classLevel))];
            const difficulties= [...new Set(Object.values(worksheetsConfig).map(c => c.difficulty))];

            const groups = [
                { key: 'subject',    label: 'Subject',     values: subjects },
                { key: 'classLevel', label: 'Class Level', values: classLevels },
                { key: 'difficulty', label: 'Difficulty',  values: difficulties }
            ];

            groups.forEach(({ key, label, values }) => {
                const group = document.createElement('div');
                group.className = 'filter-group';

                const labelEl = document.createElement('div');
                labelEl.className = 'filter-group-label';
                labelEl.textContent = label;
                group.appendChild(labelEl);

                const wrap = document.createElement('div');
                wrap.className = 'filter-chips-wrap';

                values.forEach(val => {
                    const chip = document.createElement('button');
                    chip.className = 'filter-chip';
                    chip.dataset.group = key;
                    chip.dataset.value = val;
                    chip.textContent = val;
                    if (pendingFilter[key].has(val)) chip.classList.add('active');
                    chip.addEventListener('click', () => {
                        if (pendingFilter[key].has(val)) {
                            pendingFilter[key].delete(val);
                            chip.classList.remove('active');
                        } else {
                            pendingFilter[key].add(val);
                            chip.classList.add('active');
                        }
                        updateApplyBtn();
                    });
                    wrap.appendChild(chip);
                });

                group.appendChild(wrap);
                body.appendChild(group);
            });

            updateApplyBtn();
        }

        function updateApplyBtn() {
            const count = countPendingMatches();
            document.getElementById('btn-apply-filters').textContent = `Apply (${count})`;
        }

        function syncSheetChips() {
            // Sync visual state of chips in open sheet with filterState
            document.querySelectorAll('#filter-sheet-body .filter-chip').forEach(chip => {
                const group = chip.dataset.group;
                const val   = chip.dataset.value;
                chip.classList.toggle('active', filterState[group] && filterState[group].has(val));
                // Also sync pendingFilter
                if (filterState[group] && filterState[group].has(val)) {
                    pendingFilter[group].add(val);
                } else {
                    pendingFilter[group] && pendingFilter[group].delete(val);
                }
            });
            updateApplyBtn();
        }

        // ------------------------------------------------------------------
        // Sheet open / close (GSAP animated)
        // ------------------------------------------------------------------
        function openFilterSheet() {
            // Sync pending to current applied state
            ['subject', 'classLevel', 'difficulty'].forEach(g => {
                pendingFilter[g] = new Set(filterState[g]);
            });
            syncSheetChips();

            document.getElementById('filter-overlay').classList.add('open');
            document.body.style.overflow = 'hidden';
            gsap.to('#filter-sheet', { y: '0%', duration: 0.42, ease: 'power3.out' });
        }

        function closeFilterSheet() {
            gsap.to('#filter-sheet', {
                y: '100%', duration: 0.35, ease: 'power3.in',
                onComplete: () => {
                    document.getElementById('filter-overlay').classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        }

        // ------------------------------------------------------------------
        // Swipe-down gesture to close sheet
        // ------------------------------------------------------------------
        (function setupSwipeClose() {
            const sheet   = document.getElementById('filter-sheet');
            const handle  = document.getElementById('filter-sheet-handle');
            let startY = 0, isDragging = false;

            function onTouchStart(e) {
                startY = e.touches[0].clientY;
                isDragging = true;
            }
            function onTouchMove(e) {
                if (!isDragging) return;
                const dy = e.touches[0].clientY - startY;
                if (dy > 0) {
                    gsap.set(sheet, { y: dy });
                }
            }
            function onTouchEnd(e) {
                if (!isDragging) return;
                isDragging = false;
                const dy = e.changedTouches[0].clientY - startY;
                if (dy > 100) {
                    closeFilterSheet();
                } else {
                    gsap.to(sheet, { y: 0, duration: 0.25, ease: 'power2.out' });
                }
            }

            [sheet, handle].forEach(el => {
                el.addEventListener('touchstart', onTouchStart, { passive: true });
                el.addEventListener('touchmove',  onTouchMove,  { passive: true });
                el.addEventListener('touchend',   onTouchEnd);
            });
        })();

        // ------------------------------------------------------------------
        // Wire filter UI buttons
        // ------------------------------------------------------------------
        document.getElementById('btn-open-filters').addEventListener('click', openFilterSheet);
        document.getElementById('btn-close-sheet').addEventListener('click', closeFilterSheet);
        document.getElementById('filter-overlay').addEventListener('click', closeFilterSheet);

        document.getElementById('btn-clear-all-sheet').addEventListener('click', () => {
            ['subject', 'classLevel', 'difficulty'].forEach(g => pendingFilter[g].clear());
            document.querySelectorAll('#filter-sheet-body .filter-chip').forEach(c => c.classList.remove('active'));
            updateApplyBtn();
        });

        document.getElementById('btn-apply-filters').addEventListener('click', () => {
            ['subject', 'classLevel', 'difficulty'].forEach(g => {
                filterState[g] = new Set(pendingFilter[g]);
            });
            renderSelectionGrid();
            closeFilterSheet();
        });

'@

# Insert filterJS before the closing </script>
$closeScript = '</script>'
$lastScriptIdx = $content.LastIndexOf($closeScript)
if ($lastScriptIdx -eq -1) {
    Write-Host "ERROR: Could not find closing </script>"
    exit 1
}

$content = $content.Insert($lastScriptIdx, $filterJS)
Write-Host "Filter JS injected."

# Save file
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "All changes saved successfully."
