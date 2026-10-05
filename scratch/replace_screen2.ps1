# Full Screen 2 replacement + bottom sheet injection + worksheetsConfig metadata + JS filter system
$filePath = "f:\Tution\Worksheets\Webs\KCI_TableOf2_App\index.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# ============================================================
# STEP 1: Replace Screen 2 static card grid
# ============================================================
$oldScreen2 = @'
        <!-- SCREEN 2: Worksheet Selection -->
        <main id="screen-selection" class="screen max-w-7xl mx-auto">
            <h3 id="selection-greeting" class="text-3xl font-baloo font-bold text-center mb-8">Hi! Which worksheet would you like to try today?</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                <!-- Card 1 -->
                <div class="ws-card flex flex-col h-full bg-white rounded-2xl shadow-xl border-4 border-lightBlue hover:border-gold transition-colors cursor-pointer p-6 text-center" data-worksheet="table2">
                    <div class="text-5xl mb-3">&#x1F9EE;</div>
                    <h4 class="text-xl font-baloo font-bold text-navy mb-1 leading-snug">Maths Marvels &#x2014; Table of 2</h4>
                    <p class="text-sm text-gray-500 font-medium mb-4">Multiplication practice for KG learners</p>
                    <div class="flex-grow"></div>
                    <button class="mt-auto btn btn-gold w-full text-xl py-3 rounded-xl hover:scale-105 transition-transform">Start &rarr;</button>
                </div>
'@

$idx = $content.IndexOf($oldScreen2)
if ($idx -eq -1) {
    # Try a shorter, unique anchor instead
    $anchor = '        <!-- SCREEN 2: Worksheet Selection -->'
    $idx = $content.IndexOf($anchor)
    Write-Host "Anchor search result: $idx"
    
    # Find the </main> that closes this screen
    $endTag = '        </main>'
    $endIdx = $content.IndexOf($endTag, $idx) + $endTag.Length
    
    $oldBlock = $content.Substring($idx, $endIdx - $idx)
    Write-Host "Old block length: $($oldBlock.Length)"
    Write-Host "Old block preview: $($oldBlock.Substring(0, 100))"
    
    $newBlock = @'
        <!-- SCREEN 2: Worksheet Selection -->
        <main id="screen-selection" class="screen max-w-7xl mx-auto">
            <h3 id="selection-greeting" class="text-3xl font-baloo font-bold text-center mb-8">Hi! Which worksheet would you like to try today?</h3>

            <!-- Filter Bar -->
            <div id="filter-bar">
                <button id="btn-open-filters">
                    &#x1F50D; Filters
                    <span id="filter-active-count">0</span>
                </button>
            </div>

            <!-- Active Chip Row (visible when filters applied) -->
            <div id="active-chip-row">
                <!-- Populated dynamically by JS -->
            </div>

            <!-- Dynamic Worksheet Grid (JS-rendered) -->
            <div id="ws-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                <!-- Cards injected by renderSelectionGrid() -->
                <div id="ws-empty-state">
                    <div class="text-5xl mb-4">&#x1F50D;</div>
                    <p class="text-xl font-baloo font-bold text-navy mb-2">No worksheets match these filters yet!</p>
                    <p class="text-gray-500 font-medium">Try clearing one filter to see more.</p>
                </div>
            </div>
        </main>

        <!-- Filter Sheet Overlay -->
        <div id="filter-overlay"></div>

        <!-- Bottom Sheet Filter Drawer -->
        <div id="filter-sheet">
            <div id="filter-sheet-handle"></div>
            <div id="filter-sheet-header">
                <h2>Filter Worksheets</h2>
                <button id="btn-close-sheet" aria-label="Close filters">&#x2715;</button>
            </div>
            <div id="filter-sheet-body">
                <!-- Filter groups injected by buildFilterSheet() -->
            </div>
            <div id="filter-sheet-footer">
                <button id="btn-clear-all-sheet">Clear All</button>
                <button id="btn-apply-filters">Apply (6)</button>
            </div>
        </div>
'@

    $content = $content.Remove($idx, $endIdx - $idx).Insert($idx, $newBlock)
    Write-Host "Replacement done. New block length: $($newBlock.Length)"
} else {
    Write-Host "Exact match found at $idx"
}

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "File saved successfully."
