const fs = require('fs');
let content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// Find the closing </main> of greenThumbs screen and insert new screen after it
const gtScreenClose = `            <!-- Submit Green Thumbs -->
            <div class="text-center mt-12 mb-8 gs-reveal">
                <button class="btn-verify btn btn-gold text-2xl py-4 px-12 w-full sm:w-auto shadow-xl border-4 border-white">
                    ✅ Verify My Answers
                </button>
            </div>
        </main>`;

const bhaariScreen = `            <!-- Submit Green Thumbs -->
            <div class="text-center mt-12 mb-8 gs-reveal">
                <button class="btn-verify btn btn-gold text-2xl py-4 px-12 w-full sm:w-auto shadow-xl border-4 border-white">
                    ✅ Verify My Answers
                </button>
            </div>
        </main>

        <!-- SCREEN: بھاری الفاظ — Heavy Words Worksheet -->
        <main id="screen-worksheet-bhaariAlfaaz" class="screen worksheet-container">
            <!-- Content rendered dynamically by renderBhaariAlfaazWorksheet() -->
            <!-- NOTE: Worksheet content will have dir="rtl" lang="ur".
                 The shell <main> stays LTR so global header/footer/submit stay unaffected. -->

            <!-- Submit Bhaari Alfaaz — stays LTR chrome as per spec -->
            <div class="text-center mt-12 mb-8 gs-reveal">
                <button class="btn-verify btn btn-gold text-2xl py-4 px-12 w-full sm:w-auto shadow-xl border-4 border-white">
                    ✅ Verify My Answers
                </button>
                <p class="urdu-canvas-note" id="bhaari-canvas-note">
                    ⚠️ Known limitation: Nastaliq font may not fully rasterize in PDF/PNG export via html2canvas.
                    Topic labels will still be correct; only the visual script quality in the exported image may vary.
                </p>
            </div>
        </main>`;

if (!content.includes(gtScreenClose)) {
  throw new Error('gtScreenClose marker not found!');
}
content = content.replace(gtScreenClose, bhaariScreen);
console.log('bhaariAlfaaz HTML container added');

fs.writeFileSync('KCI_TableOf2_App/index.html', content, 'utf8');
console.log('Saved Part C step 2');
