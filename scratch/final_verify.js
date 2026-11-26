const fs = require('fs');
let content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// The retry/back reset blocks are symmetric in two places.
// In both, the urduDost has no special reset code (it's pure pill-based).
// bhaariAlfaaz is also pure pill-based, so no extra reset code is needed.
// The generic reset already handles:
//   document.querySelectorAll(`${targetScreen} .selected`).forEach(el => el.classList.remove('selected'));
//   document.querySelectorAll(`${targetScreen} .pill-error`).forEach(el => el.classList.remove('pill-error'));
// So no extra handling is required.

// === VERIFY: Ensure the new worksheet screen and config are correct ===
const checks = [
  'id="screen-worksheet-bhaariAlfaaz"',
  'bhaariAlfaaz: {',
  '"nov-2026"',
  'classLevels: ["KG", "Class I"]',
  'renderBhaariAlfaazWorksheet',
  'gradeWorksheetBhaariAlfaaz',
  'function playBhaariDemo',
  'function setupBhaariAlfaazPillsInteractivity',
  'function gradeWorksheetBhaariAlfaaz',
  'ba-s2',
  'ba-s3',
  'ba-s4',
  'ba-s5',
  'ba-s6',
  'ba-mt',
];

let allOk = true;
checks.forEach(str => {
  if (!content.includes(str)) {
    console.error('MISSING:', str);
    allOk = false;
  } else {
    console.log('✅', str);
  }
});

// Verify classLevel (singular) no longer exists in worksheetsConfig
const cfgStart = content.indexOf('const worksheetsConfig = {');
const cfgEnd = content.indexOf('function renderClass1Worksheet');
const cfgSection = content.slice(cfgStart, cfgEnd);
const badClassLevel = /classLevel:\s*"/.test(cfgSection);
if (badClassLevel) {
  console.error('❌ OLD classLevel: still found in worksheetsConfig!');
  allOk = false;
} else {
  console.log('✅ No old classLevel: in worksheetsConfig');
}

// Verify character integrity in the file (spot check key strings)
// بھاری = U+0628 U+06BE U+0627 U+0631 U+06CC
// First بھ in "بھاری" should have ھ=U+06BE
const bhaariIdx = content.indexOf('\u0628\u06BE\u0627\u0631\u06CC');
if (bhaariIdx === -1) {
  console.error('❌ بھاری (with U+06BE) not found!');
  allOk = false;
} else {
  console.log('✅ بھاری with U+06BE present at', bhaariIdx);
}

console.log(allOk ? '\n✅ ALL CHECKS PASSED' : '\n❌ SOME CHECKS FAILED');
