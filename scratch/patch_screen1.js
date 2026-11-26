const fs = require('fs');

let html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

// Replace Screen 1 (Login)
const s1Start = html.indexOf('<main id="screen-1"');
const s1End = html.indexOf('</main>', s1Start) + 7;

const newScreen1 = `<!-- SCREEN 1: Student ID Card Login -->
        <main id="screen-1" class="screen active max-w-md mx-auto">
            <div class="kci-id-lanyard-wrap" id="login-lanyard-wrap">
                <!-- Lanyard strap and clip -->
                <div class="kci-lanyard-strap"></div>
                <div class="kci-lanyard-clip"></div>
                
                <!-- Physical Student ID Card -->
                <div class="kci-id-card relative" id="login-card">
                    <!-- Punched Hole -->
                    <div class="kci-id-hole" aria-hidden="true"></div>

                    <!-- Header & Logo -->
                    <div class="text-center mb-6">
                        <img src="logo.svg" alt="KCI Logo" class="w-20 h-20 mx-auto mb-2 object-contain" style="filter: drop-shadow(0 2px 8px rgba(30,58,95,0.15));">
                        <h2 class="text-2xl font-heading font-bold text-navy tracking-tight leading-tight">KAKA'S COACHING INSTITUTE</h2>
                        <div class="inline-block mt-2 px-3 py-1 bg-paper-edge border border-paper-edge rounded-full text-xs font-bold text-navy tracking-wider uppercase">
                            Student ID Card
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <label for="studentId" class="block font-heading font-bold text-sm text-navy mb-1 pl-1">Student ID (Numeric)</label>
                            <input type="text" inputmode="numeric" pattern="[0-9]*" id="studentId" class="kci-input-ruled text-2xl tracking-widest text-center" placeholder="e.g. 1019" required aria-required="true">
                        </div>

                        <div>
                            <label for="studentName" class="block font-heading font-bold text-sm text-navy mb-1 pl-1">Student Name</label>
                            <input type="text" id="studentName" class="kci-input-ruled text-lg" placeholder="Enter your name" required aria-required="true">
                        </div>
                        
                        <div>
                            <label for="studentDate" class="block font-heading font-bold text-sm text-navy mb-1 pl-1">Date</label>
                            <input type="date" id="studentDate" class="kci-input-ruled text-base" required aria-required="true">
                        </div>
                    </div>
                    
                    <div class="mt-8 text-center">
                        <div id="login-error" class="hidden kci-notice kci-notice-error text-left mb-4" role="alert">
                            <span class="text-xl" aria-hidden="true">ℹ️</span>
                            <span id="login-error-text">This ID isn't registered. Please check with your teacher.</span>
                        </div>
                        <button id="btn-start" class="kci-btn-primary w-full" disabled aria-disabled="true">
                            <span>Continue</span>
                            <span class="inline-block" aria-hidden="true">${'${KCIIcons.arrowRight}'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </main>`;

html = html.slice(0, s1Start) + newScreen1 + html.slice(s1End);

fs.writeFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', html, 'utf8');
console.log('Login screen replaced successfully!');
