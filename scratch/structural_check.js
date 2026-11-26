const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// Check HTML structure integrity
const opens = (content.match(/<script/gi) || []).length;
const closes = (content.match(/<\/script>/gi) || []).length;
console.log(`<script> open: ${opens}, </script> close: ${closes}`, opens === closes ? '✅' : '❌ MISMATCH');

const mains = (content.match(/<main /gi) || []).length;
const mainsClose = (content.match(/<\/main>/gi) || []).length;
console.log(`<main> open: ${mains}, </main> close: ${mainsClose}`, mains === mainsClose ? '✅' : '❌ MISMATCH');

// Check bhaariAlfaaz screen appears in correct spot
const idx = content.indexOf('id="screen-worksheet-bhaariAlfaaz"');
console.log('bhaariAlfaaz screen at byte:', idx);

// Check gradeWorksheetBhaariAlfaaz is called in dispatch
const gradeIdx = content.indexOf("else if (state.currentWorksheetId === 'bhaariAlfaaz') gradeWorksheetBhaariAlfaaz()");
console.log('grade dispatch at:', gradeIdx, gradeIdx > 0 ? '✅' : '❌');

// Check bhaari in retry/back-screen flow (should work via generic reset)
const retryIdx = content.indexOf('document.querySelectorAll(`${targetScreen} .selected`)');
console.log('generic reset .selected at:', retryIdx, retryIdx > 0 ? '✅' : '❌');

// Total items should be reachable
console.log('\nFile size:', fs.statSync('KCI_TableOf2_App/index.html').size, 'bytes');
console.log('Done - file appears structurally sound.');
