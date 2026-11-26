const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// Sec 6 distractors using round he ہ U+06C1
const sec6Distractors = [
  '\u067E\u06C1',  // پہ
  '\u0679\u06C1',  // ٹہ
  '\u062C\u06C1',  // جہ
  '\u062F\u06C1',  // دہ
  '\u06A9\u06C1',  // کہ
  '\u06AF\u06C1',  // گہ
];

// Sec 6 correct answers using do-chashmi he ھ U+06BE
const sec6Correct = [
  '\u067E\u06BE',  // پھ
  '\u0679\u06BE',  // ٹھ
  '\u062C\u06BE',  // جھ
  '\u062F\u06BE',  // دھ
  '\u06A9\u06BE',  // کھ
  '\u06AF\u06BE',  // گھ
];

console.log('--- Section 6 Distractors (must be U+06C1) ---');
sec6Distractors.forEach(d => {
  if (content.includes(d)) console.log(`✅ ${d} (U+06C1) found`);
  else console.error(`❌ ${d} NOT found`);
});

console.log('--- Section 6 Correct Answers (must be U+06BE) ---');
sec6Correct.forEach(a => {
  if (content.includes(a)) console.log(`✅ ${a} (U+06BE) found`);
  else console.error(`❌ ${a} NOT found`);
});

// Check total file size
const size = fs.statSync('KCI_TableOf2_App/index.html').size;
console.log('\nFile size:', size, 'bytes');
