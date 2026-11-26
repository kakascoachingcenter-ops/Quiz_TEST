const fs = require('fs');

let html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

// Replace footer
const oldFooterRegex = /<!-- Global Footer -->[\s\S]*?id="global-footer">[\s\S]*?<\/div>/;
const newFooter = `<!-- Global Footer (Tactile Letterhead Style) -->
        <footer class="kci-footer no-print" id="global-footer">
            <div class="flex items-center justify-center gap-2">
                <span class="inline-block" aria-hidden="true">${'${KCIIcons.phone}'}</span>
                <span>KAKA'S COACHING INSTITUTE &mdash; 0300-2917500</span>
            </div>
        </footer>`;

html = html.replace(oldFooterRegex, newFooter);

// Replace Results footer
const oldResFooterRegex = /<!-- Results Footer \(for export\) -->[\s\S]*?0300-2917500[\s\S]*?<\/div>/;
const newResFooter = `<!-- Results Footer (Tactile Letterhead Style for Export) -->
                <div class="kci-footer text-center mt-8 pt-4 border-t-2 border-paper-edge" style="opacity: 0.9;">
                    <div class="flex items-center justify-center gap-2 text-sm font-bold text-navy">
                        <span class="inline-block">${'${KCIIcons.phone}'}</span>
                        <span>KAKA'S COACHING INSTITUTE &mdash; 0300-2917500</span>
                    </div>
                </div>`;

html = html.replace(oldResFooterRegex, newResFooter);

// Replace download/retry buttons on Results screen
const oldResActionsRegex = /<div class="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 justify-center no-print">[\s\S]*?<\/div>\s*<\/main>/;
const newResActions = `<div class="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 justify-center no-print">
                <button id="btn-pdf" class="kci-btn-secondary border-coral text-coral hover:bg-coral-light text-base">
                    <span class="inline-block" aria-hidden="true">${'${KCIIcons.download}'}</span>
                    <span>Download PDF</span>
                </button>
                <button id="btn-img" class="kci-btn-secondary border-success text-success hover:bg-success-light text-base">
                    <span class="inline-block" aria-hidden="true">${'${KCIIcons.download}'}</span>
                    <span>Download Image</span>
                </button>
                <button id="btn-retry" class="kci-btn-primary text-base">
                    <span class="inline-block" aria-hidden="true">${'${KCIIcons.rotateCw}'}</span>
                    <span>Try Again</span>
                </button>
                <button id="btn-choose-another" class="kci-btn-secondary text-base">
                    <span class="inline-block" aria-hidden="true">${'${KCIIcons.arrowLeft}'}</span>
                    <span>All Worksheets</span>
                </button>
            </div>
        </main>`;

html = html.replace(oldResActionsRegex, newResActions);

// Restyle Results Card
html = html.replace('id="results-card" class="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-lightBlue relative overflow-hidden"', 'id="results-card" class="kci-paper-card p-6 sm:p-10 relative overflow-hidden"');

// Restyle Filter Sheet
const oldFilterSheetHeader = `<div id="filter-sheet-header">
                <h2>Filter Worksheets</h2>
                <button id="btn-close-sheet" aria-label="Close filters">&#x2715;</button>
            </div>`;
const newFilterSheetHeader = `<div id="filter-sheet-header" class="flex items-center justify-between p-4 border-b border-paper-edge">
                <h2 class="text-xl font-heading font-bold text-navy">Filter Worksheets</h2>
                <button id="btn-close-sheet" class="kci-btn-ghost p-2" aria-label="Close filters">${'${KCIIcons.x}'}</button>
            </div>`;
html = html.replace(oldFilterSheetHeader, newFilterSheetHeader);

// Restyle Filter Sheet footer buttons
const oldFilterSheetFooter = `<div id="filter-sheet-footer">
                <button id="btn-clear-all-sheet">Clear All</button>
                <button id="btn-apply-filters">Apply (6)</button>
            </div>`;
const newFilterSheetFooter = `<div id="filter-sheet-footer" class="p-4 border-t border-paper-edge flex gap-3">
                <button id="btn-clear-all-sheet" class="kci-btn-secondary flex-1 text-sm py-2">Clear All</button>
                <button id="btn-apply-filters" class="kci-btn-primary flex-2 text-sm py-2">Apply</button>
            </div>`;
html = html.replace(oldFilterSheetFooter, newFilterSheetFooter);

// Restyle Story Reader Bottom Sheet
const oldStorySheetHeader = `<button id="btn-close-story" aria-label="Close story" style="background:#f1f5f9; border:none; border-radius:9999px; width:2rem; height:2rem; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:1rem; color:#64748b;">✕</button>`;
const newStorySheetHeader = `<button id="btn-close-story" class="kci-btn-ghost p-2" aria-label="Close story">${'${KCIIcons.x}'}</button>`;
html = html.replace(oldStorySheetHeader, newStorySheetHeader);

fs.writeFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', html, 'utf8');
console.log('Footers, buttons, and sheets restyled successfully!');
