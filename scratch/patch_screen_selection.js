const fs = require('fs');

let html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

// Replace Screen Selection
const sSelStart = html.indexOf('<!-- SCREEN 2: Worksheet Selection -->');
const sSelEnd = html.indexOf('<!-- Story Reader Bottom Sheet Modal -->');

const newScreenSelection = `<!-- SCREEN 2: Folder / Library Screen (Tactile Classroom Desk) -->
        <main id="screen-selection" class="screen max-w-6xl mx-auto px-4">
            
            <!-- Greeting & Value of the Day -->
            <div class="mb-8">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 id="selection-greeting" class="text-3xl sm:text-4xl font-heading font-bold text-navy">
                            Assalam-o-Alaikum, Student!
                        </h2>
                        <p class="text-gray-600 font-medium text-base mt-1">Welcome back to your learning desk.</p>
                    </div>

                    <!-- Notebook Index Tabs: Worksheets | Stories -->
                    <div class="kci-tab-bar" role="tablist" aria-label="Library Navigation">
                        <button id="tab-worksheets" class="kci-tab-item active" role="tab" aria-selected="true" aria-controls="tab-content-worksheets">
                            <span id="icon-tab-worksheets"></span>
                            <span>Worksheets</span>
                        </button>
                        <button id="tab-stories" class="kci-tab-item" role="tab" aria-selected="false" aria-controls="tab-content-stories">
                            <span id="icon-tab-stories"></span>
                            <span>Stories</span>
                        </button>
                    </div>
                </div>

                <!-- VALUE OF THE DAY CARD (Pinned Sticky Note) -->
                <div id="value-of-day-card" class="kci-sticky-note cursor-pointer" role="region" aria-label="Value of the Day">
                    <!-- Red Push Pin Graphic -->
                    <svg class="kci-pin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="7" r="5" fill="#e8765f"/>
                        <path d="M12 12V22" stroke="#1e3a5f" stroke-width="2.5" stroke-linecap="round"/>
                        <circle cx="10" cy="5.5" r="1.5" fill="#ffffff" fill-opacity="0.8"/>
                    </svg>

                    <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-paper-edge pb-2 mb-3">
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-bold uppercase tracking-wider text-navy bg-paper-edge px-2 py-0.5 rounded-full">Value of the Day</span>
                            <h3 id="vod-name-en" class="text-xl font-heading font-bold text-navy">Honesty</h3>
                        </div>
                        <div id="vod-name-ur" class="text-xl font-bold text-navy font-nastaliq" dir="rtl" lang="ur">سچائی</div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                        <p id="vod-line-en" class="text-base text-graphite font-semibold italic">"We always tell the truth, even when it is hard."</p>
                        <p id="vod-line-ur" class="text-lg text-graphite font-semibold font-nastaliq text-right hidden sm:block" dir="rtl" lang="ur">"ہم ہمیشہ سچ بولتے ہیں، چاہے مشکل ہو۔"</p>
                    </div>
                    <div class="sm:hidden text-center mt-2">
                        <span id="vod-expand-hint" class="text-xs font-bold text-navy opacity-60">Tap to toggle Urdu line</span>
                    </div>
                </div>
            </div>

            <!-- TAB CONTENT 1: WORKSHEETS -->
            <div id="tab-content-worksheets">
                <!-- FOLDERS VIEW (Default view on tab) -->
                <div id="folders-view" class="max-w-4xl mx-auto">
                    <div id="folders-grid" class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <!-- Injected dynamically by renderFoldersView() -->
                    </div>
                </div>

                <!-- INSIDE FOLDER VIEW (Hidden by default, shown when folder is opened) -->
                <div id="folder-detail-view" style="display: none; opacity: 0;">
                    <div class="flex flex-wrap items-center justify-between gap-4 max-w-6xl mx-auto mb-6">
                        <button id="btn-back-to-folders" class="kci-btn-secondary py-2 px-4 text-base min-h-[44px]">
                            <span id="icon-back-folder"></span>
                            <span>All Folders</span>
                        </button>
                        <div id="folder-detail-header" class="text-2xl font-heading font-bold text-navy">
                            <!-- e.g. OCT-2026 · Latest -->
                        </div>
                    </div>

                    <!-- Filter Bar -->
                    <div id="filter-bar" class="flex items-center justify-between flex-wrap gap-3 mb-4">
                        <button id="btn-open-filters" class="kci-btn-secondary min-h-[44px] py-2 px-4 text-sm relative">
                            <span id="icon-filter-sliders"></span>
                            <span>Filters</span>
                            <span id="filter-active-count" class="kci-sticker w-6 h-6 text-xs ml-1 hidden">0</span>
                        </button>
                    </div>

                    <!-- Active Chip Row (visible when filters applied) -->
                    <div id="active-chip-row" class="hidden flex-wrap items-center gap-2 mb-6">
                        <!-- Populated dynamically by JS -->
                    </div>

                    <!-- Dynamic Worksheet Grid (JS-rendered) -->
                    <div id="ws-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <!-- Cards injected by renderSelectionGrid() -->
                        <div id="ws-empty-state" class="hidden col-span-full text-center py-12 kci-paper-card p-8">
                            <div class="w-16 h-16 mx-auto mb-3 text-gold opacity-80" id="icon-empty-search"></div>
                            <h4 class="text-2xl font-heading font-bold text-navy mb-2">No worksheets match these filters</h4>
                            <p class="text-graphite font-medium">Try clearing or switching filters to explore more worksheets.</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TAB CONTENT 2: STORIES (Clothesline ready for next phase, restyled with tokens) -->
            <div id="tab-content-stories" style="display: none;">
                <div class="kci-paper-card p-8 text-center max-w-2xl mx-auto my-8">
                    <div class="w-16 h-16 mx-auto mb-4 text-navy" id="icon-stories-cover"></div>
                    <h3 class="text-2xl font-heading font-bold text-navy mb-2">Interactive Reading Library</h3>
                    <p class="text-graphite font-medium mb-6">Explore captivating moral stories designed to spark curiosity, improve reading comprehension, and practice Urdu and English vocabulary.</p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                        <div class="p-4 rounded-xl border-2 border-paper-edge bg-paper hover:border-gold transition-all cursor-pointer" onclick="openStoryModal()">
                            <div class="kci-stamp kci-stamp-latest mb-2">Featured Story</div>
                            <h4 class="font-heading font-bold text-lg text-navy">Zara and the Little Bird</h4>
                            <p class="text-sm text-graphite opacity-80 mt-1">A story about compassion, caring for animals, and kindness.</p>
                            <button class="mt-4 kci-btn-secondary text-sm py-1.5 px-3 min-h-[38px] w-full">Read Story</button>
                        </div>

                        <div class="p-4 rounded-xl border-2 border-dashed border-paper-edge bg-paper opacity-70">
                            <div class="kci-stamp kci-stamp-old mb-2">Coming Soon</div>
                            <h4 class="font-heading font-bold text-lg text-navy">The Kind Little Tree</h4>
                            <p class="text-sm text-graphite opacity-80 mt-1">A bilingual tale about patience, sharing, and the beauty of giving.</p>
                            <button class="mt-4 kci-btn-ghost text-sm py-1.5 px-3 min-h-[38px] w-full" disabled>In Preparation</button>
                        </div>
                    </div>
                </div>
            </div>

        </main>

        <!-- VALUE TIP INTERSTITIAL SCREEN (Between Worksheet & Results) -->
        <main id="screen-value-tip" class="screen max-w-lg mx-auto px-4" style="display: none; opacity: 0;">
            <div class="kci-paper-card p-8 sm:p-10 text-center relative overflow-hidden">
                <!-- Golden notebook clip accent -->
                <div class="w-20 h-3 bg-gold mx-auto mb-6 rounded-full opacity-80"></div>

                <div class="inline-block px-3 py-1 bg-paper-edge border border-paper-edge rounded-full text-xs font-heading font-bold text-navy uppercase tracking-wider mb-4">
                    A thought before your result
                </div>

                <div class="my-6 p-6 rounded-2xl bg-paper border border-paper-edge">
                    <h3 id="tip-value-en" class="text-2xl font-heading font-bold text-navy mb-1">Honesty</h3>
                    <div id="tip-value-ur" class="text-2xl font-bold text-navy font-nastaliq mb-4" dir="rtl" lang="ur">سچائی</div>

                    <p id="tip-line-en" class="text-lg text-graphite font-semibold mb-3">"We always tell the truth, even when it is hard."</p>
                    <p id="tip-line-ur" class="text-xl text-graphite font-semibold font-nastaliq" dir="rtl" lang="ur">"ہم ہمیشہ سچ بولتے ہیں، چاہے مشکل ہو۔"</p>
                </div>

                <button id="btn-see-result" class="kci-btn-primary w-full text-xl py-4">
                    <span>See My Result</span>
                    <span class="inline-block" aria-hidden="true">${'${KCIIcons.arrowRight}'}</span>
                </button>
            </div>
        </main>

        <!-- DESIGN SYSTEM & LIVING STYLE GUIDE ROUTE (#/design-system) -->
        <main id="screen-design-system" class="screen max-w-5xl mx-auto px-4 py-8" style="display: none; opacity: 0;">
            <div class="kci-paper-card p-8 mb-8">
                <div class="flex items-center justify-between border-b border-paper-edge pb-4 mb-6">
                    <div>
                        <h2 class="text-3xl font-heading font-bold text-navy">Tactile Classroom Desk — Design System</h2>
                        <p class="text-sm text-graphite font-medium">Living Style Guide & Component Library (#/design-system)</p>
                    </div>
                    <button onclick="window.location.hash=''; window.location.reload();" class="kci-btn-secondary text-sm py-2 px-4">
                        ← Exit Style Guide
                    </button>
                </div>

                <!-- 1. TOKENS: PALETTE -->
                <div class="mb-8">
                    <h3 class="text-xl font-heading font-bold text-navy mb-3">1. Colour Palette (Contrast >= 4.5:1)</h3>
                    <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 text-xs font-bold text-center">
                        <div class="p-4 rounded-xl border border-paper-edge shadow-sm bg-navy text-white">Navy<br>#1e3a5f</div>
                        <div class="p-4 rounded-xl border border-paper-edge shadow-sm bg-gold text-navy">Gold<br>#f0b429</div>
                        <div class="p-4 rounded-xl border border-paper-edge shadow-sm bg-paper text-graphite">Paper<br>#fbf7ef</div>
                        <div class="p-4 rounded-xl border border-paper-edge shadow-sm bg-paper-edge text-graphite">Paper Edge<br>#efe6d3</div>
                        <div class="p-4 rounded-xl border border-paper-edge shadow-sm bg-graphite text-white">Graphite<br>#3a3f47</div>
                        <div class="p-4 rounded-xl border border-paper-edge shadow-sm bg-ruled-blue text-navy">Ruled Blue<br>#cfe0f2</div>
                        <div class="p-4 rounded-xl border border-paper-edge shadow-sm bg-success text-white">Success<br>#3f9b6a</div>
                        <div class="p-4 rounded-xl border border-paper-edge shadow-sm bg-coral text-white">Coral<br>#e8765f</div>
                        <div class="p-4 rounded-xl border border-paper-edge shadow-sm bg-info text-white">Info<br>#3f8fd1</div>
                    </div>
                </div>

                <!-- 2. BUTTONS -->
                <div class="mb-8">
                    <h3 class="text-xl font-heading font-bold text-navy mb-3">2. Buttons (Default, Hover, Active, Disabled)</h3>
                    <div class="flex flex-wrap gap-4 items-center">
                        <button class="kci-btn-primary">Primary Gold</button>
                        <button class="kci-btn-secondary">Secondary Outline</button>
                        <button class="kci-btn-ghost">Ghost Action</button>
                        <button class="kci-btn-primary" disabled>Disabled</button>
                    </div>
                </div>

                <!-- 3. CHIPS, STICKERS, STAMPS -->
                <div class="mb-8">
                    <h3 class="text-xl font-heading font-bold text-navy mb-3">3. Chips, Stickers & Stamps</h3>
                    <div class="flex flex-wrap gap-4 items-center">
                        <span class="kci-chip">Default Chip</span>
                        <span class="kci-chip active">Active Chip</span>
                        <span class="kci-sticker">NEW</span>
                        <span class="kci-stamp kci-stamp-latest">LATEST</span>
                        <span class="kci-stamp kci-stamp-old">OLD</span>
                    </div>
                </div>

                <!-- 4. NOTICES -->
                <div class="mb-8">
                    <h3 class="text-xl font-heading font-bold text-navy mb-3">4. Notices</h3>
                    <div class="space-y-3 max-w-xl">
                        <div class="kci-notice kci-notice-success">Great job! All answers are correctly placed.</div>
                        <div class="kci-notice kci-notice-error">This ID isn't registered. Please check with your teacher.</div>
                        <div class="kci-notice kci-notice-info">Practice reading each line out loud with clear pronunciation.</div>
                    </div>
                </div>

                <!-- 5. SUBJECT SVGS -->
                <div class="mb-8">
                    <h3 class="text-xl font-heading font-bold text-navy mb-3">5. Subject Icons</h3>
                    <div class="flex flex-wrap gap-6 items-center">
                        <div class="text-center"><span id="ds-maths"></span><div class="text-xs font-bold mt-1 text-navy">Maths</div></div>
                        <div class="text-center"><span id="ds-english"></span><div class="text-xs font-bold mt-1 text-navy">English</div></div>
                        <div class="text-center"><span id="ds-evs"></span><div class="text-xs font-bold mt-1 text-navy">EVS</div></div>
                        <div class="text-center"><span id="ds-islamiat"></span><div class="text-xs font-bold mt-1 text-navy">Islamiat</div></div>
                        <div class="text-center"><span id="ds-urdu"></span><div class="text-xs font-bold mt-1 text-navy">Urdu</div></div>
                    </div>
                </div>
            </div>
        </main>`;

html = html.slice(0, sSelStart) + newScreenSelection + html.slice(sSelEnd);

fs.writeFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', html, 'utf8');
console.log('Screen selection, Value tip & Design system inserted successfully!');
