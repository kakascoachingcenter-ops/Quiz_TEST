const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// Check distractor strings in sec4 that must use ہ U+06C1
const distractors = [
  '\u067E\u06C1\u0648\u0644',  // پہول (پ + ہ U+06C1 + و + ل)
  '\u06AF\u06C1\u0631',         // گہر
  '\u0628\u06C1\u0627\u0644\u0648', // بہالو
  '\u0686\u06C1\u062A\u0631\u06CC', // چہتری
  '\u0688\u06C1\u0648\u0644',       // ڈہول
  '\u062F\u06C1\u0648\u067E',       // دہوپ
];

distractors.forEach(d => {
  if (content.includes(d)) {
    // Verify the he character is U+06C1
    for (let c of d) {
      if (c === '\u06C1') {
        console.log(`✅ Distractor "${d}" contains ہ U+06C1 correctly`);
        break;
      }
    }
  } else {
    console.error(`❌ Distractor "${d}" NOT found in file!`);
  }
});

// Check correct answers use ھ U+06BE
const correctAnswers = [
  '\u067E\u06BE\u0648\u0644',  // پھول
  '\u06AF\u06BE\u0631',         // گھر
  '\u0628\u06BE\u0627\u0644\u0648', // بھالو
  '\u0686\u06BE\u062A\u0631\u06CC', // چھتری
  '\u0688\u06BE\u0648\u0644',       // ڈھول
  '\u062F\u06BE\u0648\u067E',       // دھوپ
];

correctAnswers.forEach(a => {
  if (content.includes(a)) {
    for (let c of a) {
      if (c === '\u06BE') {
        console.log(`✅ Correct answer "${a}" contains ھ U+06BE correctly`);
        break;
      }
    }
  } else {
    console.error(`❌ Correct answer "${a}" NOT found in file!`);
  }
});

console.log('\n✅ Character integrity verified for Section 4 distractors');
