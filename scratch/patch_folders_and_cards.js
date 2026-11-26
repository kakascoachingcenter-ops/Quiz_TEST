const fs = require('fs');

let html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

// Replace renderFoldersView
const sFolders = html.indexOf('function renderFoldersView() {');
const eFolders = html.indexOf('function openFolder(folderId) {');

const newRenderFoldersView = `function renderFoldersView() {
            const foldersGrid = document.getElementById('folders-grid');
            if (!foldersGrid) return;
            foldersGrid.innerHTML = '';

            // Sorted by sortKey descending, so Latest comes first
            const sortedFolders = [...worksheetFolders]
                .filter(f => Object.values(worksheetsConfig).some(cfg => cfg.folderId === f.id))
                .sort((a, b) => b.sortKey.localeCompare(a.sortKey));

            sortedFolders.forEach(folder => {
                const count = Object.values(worksheetsConfig).filter(cfg => cfg.folderId === folder.id).length;
                const tag = getFolderTag(folder.id);
                const tagClass = tag === 'LATEST' ? 'kci-stamp-latest stamp-thump' : 'kci-stamp-old';
                const countText = count === 1 ? '1 worksheet' : \`\${count} worksheets\`;

                const card = document.createElement('div');
                card.className = 'kci-folder-card';
                card.dataset.folderId = folder.id;
                card.setAttribute('role', 'button');
                card.setAttribute('tabindex', '0');
                card.setAttribute('aria-label', \`\${folder.label} folder with \${countText}\`);
                card.innerHTML = \`
                    <div class="flex items-start justify-between gap-2 mb-3">
                        <div class="flex items-center gap-3">
                            <div class="text-navy">\${KCIIcons.folder}</div>
                            <span class="text-2xl font-heading font-bold text-navy">\${folder.label}</span>
                        </div>
                        <span class="kci-stamp \${tagClass}">\${tag}</span>
                    </div>
                    <div class="flex items-center justify-between text-graphite font-semibold text-sm pt-4 border-t border-[#e5d1a8]">
                        <span>\${countText}</span>
                        <span class="text-navy flex items-center gap-1 font-heading font-bold text-base">
                            <span>Open</span>
                            <span>\${KCIIcons.arrowRight}</span>
                        </span>
                    </div>
                \`;

                const handleOpen = () => openFolder(folder.id);
                card.addEventListener('click', handleOpen);
                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleOpen();
                    }
                });

                foldersGrid.appendChild(card);
            });

            // Animate folder cards in with tactile stagger
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (!prefersReducedMotion) {
                gsap.fromTo('#folders-grid .kci-folder-card',
                    { opacity: 0, y: 15, scale: 0.98 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.35, stagger: 0.06, ease: "power2.out" }
                );
            } else {
                gsap.set('#folders-grid .kci-folder-card', { opacity: 1, y: 0, scale: 1 });
            }
        }

        // Open Folder with GSAP 3D Flap Tilt Animation
        function openFolder(folderId) {
            currentOpenedFolderId = folderId;
            const folder = worksheetFolders.find(f => f.id === folderId);
            const tag = getFolderTag(folderId);
            const tagLabel = tag === 'LATEST' ? 'Latest' : 'Old';

            // Clear any active filters from previous folder
            ['subject', 'classLevel', 'difficulty'].forEach(g => {
                filterState[g].clear();
                pendingFilter[g].clear();
            });

            const headerEl = document.getElementById('folder-detail-header');
            if (headerEl) {
                headerEl.textContent = \`\${folder ? folder.label : ''} · \${tagLabel}\`;
            }

            const foldersView = document.getElementById('folders-view');
            const detailView  = document.getElementById('folder-detail-view');
            const clickedCard = document.querySelector(\`#folders-grid .kci-folder-card[data-folder-id="\${folderId}"]\`);

            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                foldersView.style.display = 'none';
                detailView.style.display = 'block';
                detailView.style.opacity = '1';
                buildFilterSheet();
                renderSelectionGrid();
                return;
            }

            // Tilt folder front flap open (rotateX)
            if (clickedCard) {
                gsap.to(clickedCard, {
                    rotateX: -25,
                    duration: 0.25,
                    ease: "power2.out"
                });
            }

            // Papers fan out into worksheet grid
            gsap.to(foldersView, {
                opacity: 0,
                y: -10,
                duration: 0.25,
                delay: 0.1,
                ease: "power2.in",
                onComplete: () => {
                    foldersView.style.display = 'none';
                    if (clickedCard) gsap.set(clickedCard, { rotateX: 0 });
                    detailView.style.display = 'block';
                    buildFilterSheet();
                    renderSelectionGrid();
                    gsap.fromTo(detailView, 
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
                    );
                }
            });
        }
`;

html = html.slice(0, sFolders) + newRenderFoldersView + html.slice(html.indexOf('function backToFoldersView() {'));

// Replace renderSelectionGrid
const sGrid = html.indexOf('function renderSelectionGrid() {');
const eGrid = html.indexOf('function updateActiveChipRow() {');

const newRenderSelectionGrid = `function renderSelectionGrid() {
            const grid        = document.getElementById('ws-grid');
            const emptyState  = document.getElementById('ws-empty-state');
            const filtered    = getFilteredWorksheets();

            // Remove all previous cards (keep empty state element)
            Array.from(grid.querySelectorAll('.ws-card')).forEach(c => c.remove());

            if (filtered.length === 0) {
                emptyState.classList.remove('hidden');
                emptyState.classList.add('block');
            } else {
                emptyState.classList.add('hidden');
                emptyState.classList.remove('block');

                // Subject SVG mapping helper
                function getSubjectIcon(subjects) {
                    const primary = subjects[0] || '';
                    if (primary === 'Maths') return KCIIcons.subjectMaths;
                    if (primary === 'English') return KCIIcons.subjectEnglish;
                    if (primary === 'EVS') return KCIIcons.subjectEVS;
                    if (primary === 'Islamiat') return KCIIcons.subjectIslamiat;
                    if (primary === 'Urdu') return KCIIcons.subjectUrdu;
                    return KCIIcons.subjectMaths;
                }

                filtered.forEach(([wsId, cfg]) => {
                    const isNew  = isNewWorksheet(cfg.dateAdded);
                    const badge  = isNew
                        ? \`<span class="kci-sticker absolute -top-3 -right-3">NEW</span>\`
                        : \`<span class="kci-chip text-xs absolute top-3 right-3 opacity-60">Current</span>\`;
                    
                    const subjectChips = cfg.subjects.map(s => 
                        \`<span class="kci-chip text-xs">\${s}</span>\`
                    ).join(' ');

                    // Check if worksheet has photo cover
                    const coverHtml = cfg.cover ? \`
                        <div class="relative mb-4 w-full aspect-[4/3] rounded-lg overflow-hidden border-4 border-white shadow-md">
                            <div class="kci-washi-tape"></div>
                            <img src="\${cfg.cover}" alt="\${cfg.title}" class="w-full h-full object-cover">
                        </div>
                    \` : \`
                        <div class="mb-4 flex items-center justify-center">
                            \${getSubjectIcon(cfg.subjects)}
                        </div>
                    \`;

                    const card = document.createElement('div');
                    card.className = 'ws-card kci-paper-card flex flex-col h-full p-6 text-center cursor-pointer relative';
                    card.dataset.worksheet = wsId;
                    card.setAttribute('role', 'button');
                    card.setAttribute('tabindex', '0');
                    card.setAttribute('aria-label', \`\${cfg.title} worksheet\`);

                    card.innerHTML = \`
                        \${badge}
                        \${coverHtml}
                        <h4 class="text-xl font-heading font-bold text-navy mb-2 leading-snug">\${cfg.title}</h4>
                        <div class="text-sm text-graphite font-medium mb-4">\${cfg.cardDesc}</div>
                        <div class="flex-grow"></div>
                        <div class="flex flex-wrap gap-1.5 justify-center mb-4">
                            \${subjectChips}
                            \${cfg.classLevels.map(cl => \`<span class="kci-chip text-xs">\${cl}</span>\`).join(' ')}
                            <span class="kci-chip text-xs bg-paper-edge text-navy font-bold">\${cfg.difficulty}</span>
                        </div>
                        <button class="kci-btn-primary w-full text-lg py-2.5 mt-auto" tabindex="-1">
                            <span>Start</span>
                            <span class="inline-block">\${KCIIcons.arrowRight}</span>
                        </button>
                    \`;

                    const handleLaunch = () => launchWorksheet(wsId);
                    card.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleLaunch();
                        }
                    });

                    grid.appendChild(card);
                });

                // GSAP tactile entrance stagger
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (!prefersReducedMotion) {
                    const itemsToAnimate = Array.from(grid.querySelectorAll('.ws-card')).slice(0, 8);
                    gsap.fromTo(itemsToAnimate,
                        { opacity: 0, y: 18 },
                        { opacity: 1, y: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" }
                    );
                } else {
                    gsap.set(grid.querySelectorAll('.ws-card'), { opacity: 1, y: 0 });
                }
            }

            // Sync filter button badge
            const count     = totalActiveFilters();
            const countEl   = document.getElementById('filter-active-count');
            if (countEl) {
                countEl.textContent = count;
                if (count > 0) {
                    countEl.classList.remove('hidden');
                    countEl.classList.add('inline-flex');
                } else {
                    countEl.classList.add('hidden');
                    countEl.classList.remove('inline-flex');
                }
            }

            updateActiveChipRow();
        }
`;

html = html.slice(0, sGrid) + newRenderSelectionGrid + html.slice(eGrid);

fs.writeFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', html, 'utf8');
console.log('Folders, 3D tilt, and PaperCard worksheets patched successfully!');
