$filePath = "f:\Tution\Worksheets\Webs\KCI_TableOf2_App\index.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# 1. Update `#screen-results` HTML
$oldResultsHtml = @'
        <!-- SCREEN 7: Results -->
        <main id="screen-results" class="screen">
            <div id="results-card" class="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-lightBlue relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-4 bg-navy"></div>
                
                <!-- Results Header -->
                <div class="text-center mb-8 pb-8 border-b-2 border-gray-100 pt-4">
                    <img src="logo.svg" class="w-20 h-20 mx-auto mb-4 rounded-xl object-contain shadow-sm bg-white" alt="KCI Logo">
                    <h2 class="text-3xl font-baloo font-bold text-navy mb-2">KAKA'S COACHING INSTITUTE</h2>
                    <h3 id="res-subtitle" class="text-xl text-gray-500 font-bold">Results Summary</h3>
                </div>
                
                <!-- Student Info -->
                <div class="flex flex-wrap justify-between gap-4 bg-lightBlue p-4 rounded-xl mb-8 font-medium">
                    <div><span class="text-gray-500 text-sm block">Student</span><span id="res-name" class="text-lg font-bold"></span></div>
                    <div><span class="text-gray-500 text-sm block">ID</span><span id="res-id" class="text-lg font-bold"></span></div>
                    <div><span class="text-gray-500 text-sm block">Date</span><span id="res-date" class="text-lg font-bold"></span></div>
                </div>
                
                <!-- Score Block -->
                <div class="text-center mb-10 py-6">
                    <div class="inline-block relative">
                        <svg class="w-48 h-48 mx-auto transform -rotate-90" viewBox="0 0 36 36">
                            <path class="text-gray-100" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                            <path id="score-ring" class="text-gold transition-all duration-1000 ease-out" stroke-width="3" stroke-dasharray="0, 100" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        </svg>
                        <div class="absolute inset-0 flex flex-col items-center justify-center">
                            <div class="text-5xl font-baloo font-bold text-navy"><span id="score-num">0</span></div>
                            <div class="text-lg text-gray-500 font-bold">out of <span id="score-total">39</span></div>
                        </div>
                    </div>
                    
                    <div class="mt-6">
                        <div id="res-percent" class="text-2xl font-bold text-navy mb-2">0%</div>
                        <div id="res-message" class="text-xl font-medium px-4 py-2 bg-yellow-50 text-yellow-800 rounded-lg inline-block border border-yellow-200"></div>
                    </div>
                </div>
                
                <!-- Breakdown -->
                <div class="mt-8">
                    <h3 class="text-2xl font-baloo font-bold text-navy mb-4 border-b-2 border-gray-100 pb-2">What to Review</h3>
                    <div id="review-list" class="space-y-4">
                        <!-- Populated by JS -->
                    </div>
                </div>
                
                <!-- Results Footer (for export) -->
                <div class="text-center mt-10 pt-6 border-t-2 border-gray-100 text-navy font-bold text-sm sm:text-base" style="opacity: 0.8;">
                    📞 KAKA'S COACHING INSTITUTE — 0300-2917500
                </div>
            </div>
            
            <!-- Actions -->
            <div class="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 justify-center no-print">
                <button id="btn-pdf" class="btn bg-red-500 hover:bg-red-600 border-red-600 text-lg opacity-50 cursor-not-allowed" disabled>📥 Download PDF</button>
                <button id="btn-img" class="btn bg-green-500 hover:bg-green-600 border-green-600 text-lg opacity-50 cursor-not-allowed" disabled>🖼️ Download Image</button>
                <button id="btn-retry" class="btn btn-gold text-lg">🔄 Try Again</button>
                <button id="btn-choose-another" class="btn bg-blue-500 hover:bg-blue-600 text-lg">📚 Choose Another</button>
            </div>
        </main>
'@

$newResultsHtml = @'
        <!-- SCREEN 7: Results -->
        <main id="screen-results" class="screen">
            <div id="results-card" class="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-lightBlue relative overflow-hidden">
                <div class="absolute top-0 left-0 w-full h-4 bg-navy"></div>
                
                <!-- Results Header -->
                <div class="text-center mb-8 pb-8 border-b-2 border-gray-100 pt-4">
                    <img src="logo.svg" class="w-20 h-20 mx-auto mb-4 rounded-xl object-contain shadow-sm bg-white" alt="KCI Logo">
                    <h2 class="text-3xl font-baloo font-bold text-navy mb-2">KAKA'S COACHING INSTITUTE</h2>
                    <h3 id="res-subtitle" class="text-xl text-gray-500 font-bold">Results Summary</h3>
                </div>
                
                <!-- Student Info -->
                <div class="flex flex-wrap justify-between gap-4 bg-lightBlue p-4 rounded-xl mb-8 font-medium">
                    <div><span class="text-gray-500 text-sm block">Student</span><span id="res-name" class="text-lg font-bold"></span></div>
                    <div><span class="text-gray-500 text-sm block">ID</span><span id="res-id" class="text-lg font-bold"></span></div>
                    <div><span class="text-gray-500 text-sm block">Date</span><span id="res-date" class="text-lg font-bold"></span></div>
                </div>
                
                <!-- Score Block -->
                <div class="text-center mb-10 py-6">
                    <div class="relative w-56 h-56 mx-auto">
                        <canvas id="score-chart"></canvas>
                        <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <div class="text-5xl font-baloo font-bold text-navy"><span id="score-num">0</span>%</div>
                        </div>
                    </div>
                    
                    <div class="mt-6">
                        <div id="res-message" class="text-xl font-bold px-4 py-2 rounded-lg inline-block text-white shadow-md"></div>
                    </div>
                </div>
                
                <!-- Topic Breakdown -->
                <div class="mt-8">
                    <h3 class="text-2xl font-baloo font-bold text-navy mb-4 border-b-2 border-gray-100 pb-2">Topic Performance</h3>
                    <div id="topic-breakdown-list" class="space-y-5">
                        <!-- Populated by JS -->
                    </div>
                </div>

                <!-- Summary Line -->
                <div class="mt-8 text-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <p id="res-summary-line" class="text-lg font-medium text-navy"></p>
                </div>
                
                <!-- Results Footer (for export) -->
                <div class="text-center mt-10 pt-6 border-t-2 border-gray-100 text-navy font-bold text-sm sm:text-base" style="opacity: 0.8;">
                    📞 KAKA'S COACHING INSTITUTE — 0300-2917500
                </div>
            </div>
            
            <!-- Actions -->
            <div class="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 justify-center no-print">
                <button id="btn-pdf" class="btn bg-red-500 hover:bg-red-600 border-red-600 text-lg opacity-50 cursor-not-allowed" disabled>📥 Download PDF</button>
                <button id="btn-img" class="btn bg-green-500 hover:bg-green-600 border-green-600 text-lg opacity-50 cursor-not-allowed" disabled>🖼️ Download Image</button>
                <button id="btn-retry" class="btn btn-gold text-lg">🔄 Try Again</button>
                <button id="btn-choose-another" class="btn bg-blue-500 hover:bg-blue-600 text-lg">📚 Choose Another</button>
            </div>
        </main>
'@

# Normalize line endings to avoid replacement issues
$oldResultsHtml = $oldResultsHtml -replace "`r`n", "`n"
$newResultsHtml = $newResultsHtml -replace "`r`n", "`n"
$content = $content -replace "`r`n", "`n"

$content = $content.Replace($oldResultsHtml, $newResultsHtml)
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Replaced HTML structure for screen-results."
