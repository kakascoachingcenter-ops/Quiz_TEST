const fs = require('fs');
let content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// =====================================================================
// PART B step 5: also fix isUrduTopic detection to include bhaariAlfaaz
// (will update once we see the showResults check - prepare now)
// =====================================================================

// Fix topic label rendering: urduDost OR bhaariAlfaaz
content = content.replace(
  `                const isUrduTopic = state.currentWorksheetId === 'urduDost';`,
  `                const isUrduTopic = state.currentWorksheetId === 'urduDost' || state.currentWorksheetId === 'bhaariAlfaaz';`
);

console.log('isUrduTopic expanded to include bhaariAlfaaz');

// Fix showResults subtitle for bhaariAlfaaz
content = content.replace(
  `            if (state.currentWorksheetId === 'urduDost') {
                document.getElementById('res-subtitle').innerHTML =
                    \`<span class="font-nastaliq" dir="rtl" lang="ur" style="font-size:1rem; line-height:2;">اردو دوست</span> — Results Summary\`;
            } else {`,
  `            if (state.currentWorksheetId === 'urduDost') {
                document.getElementById('res-subtitle').innerHTML =
                    \`<span class="font-nastaliq" dir="rtl" lang="ur" style="font-size:1rem; line-height:2;">اردو دوست</span> — Results Summary\`;
            } else if (state.currentWorksheetId === 'bhaariAlfaaz') {
                document.getElementById('res-subtitle').innerHTML =
                    \`<span class="font-nastaliq" dir="rtl" lang="ur" style="font-size:1rem; line-height:2;">بھاری الفاظ</span> — Results Summary\`;
            } else {`
);

console.log('showResults subtitle updated');

fs.writeFileSync('KCI_TableOf2_App/index.html', content, 'utf8');
console.log('Saved Part B step 5');
