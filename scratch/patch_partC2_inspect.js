const fs = require('fs');
let content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// =====================================================================
// PART C step 2: Add HTML container for bhaariAlfaaz
// Insert AFTER greenThumbs screen main
// =====================================================================

const greenThumbsScreen = `        <!-- SCREEN 11: Smart Starters Worksheet -->`;

// Let me find the actual string after greenThumbs screen
const idx = content.indexOf('id="screen-worksheet-greenThumbs"');
console.log('greenThumbs screen at:', idx);
const afterGT = content.slice(idx, idx + 500);
console.log('After GT:', afterGT);
