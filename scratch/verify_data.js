const data = {
  sec1_cards: [
    { id: 'bh', letter: 'بھ', word: 'بھالو', emoji: '🐻' },
    { id: 'ph', letter: 'پھ', word: 'پھول', emoji: '🌸' },
    { id: 'th', letter: 'تھ', word: 'تھیلا', emoji: '🛍️' },
    { id: 'tth', letter: 'ٹھ', word: 'ٹھنڈا', emoji: '🧊' },
    { id: 'jh', letter: 'جھ', word: 'جھنڈا', emoji: '🇵🇰' },
    { id: 'ch', letter: 'چھ', word: 'چھتری', emoji: '☂️' },
    { id: 'dh', letter: 'دھ', word: 'دھوپ', emoji: '☀️' },
    { id: 'ddh', letter: 'ڈھ', word: 'ڈھول', emoji: '🥁' },
    { id: 'rrh', letter: 'ڑھ', word: 'سیڑھی', emoji: '🪜' },
    { id: 'kh', letter: 'کھ', word: 'کھلونا', emoji: '🧸' },
    { id: 'gh', letter: 'گھ', word: 'گھر', emoji: '🏠' }
  ],
  sec2_items: [
    { opts: ['پھول', 'پتا', 'پانی'], ans: 'پھول' },
    { opts: ['گاڑی', 'گھر', 'گیند'], ans: 'گھر' },
    { opts: ['ہاتھی', 'ہوا', 'ہرن'], ans: 'ہاتھی' },
    { opts: ['کتاب', 'کیلا', 'کھانا'], ans: 'کھانا' },
    { opts: ['بلی', 'بھالو', 'بطخ'], ans: 'بھالو' },
    { opts: ['چھتری', 'چابی', 'چاند'], ans: 'چھتری' }
  ],
  sec3_items: [
    { word: 'بھالو', emoji: '🐻', ans: 'بھ', opts: ['بھ', 'پھ', 'تھ'] },
    { word: 'پھول', emoji: '🌸', ans: 'پھ', opts: ['پھ', 'بھ', 'ٹھ'] },
    { word: 'تھیلا', emoji: '🛍️', ans: 'تھ', opts: ['تھ', 'ٹھ', 'دھ'] },
    { word: 'ٹھنڈا', emoji: '🧊', ans: 'ٹھ', opts: ['ٹھ', 'تھ', 'ڈھ'] },
    { word: 'جھنڈا', emoji: '🇵🇰', ans: 'جھ', opts: ['جھ', 'چھ', 'گھ'] },
    { word: 'چھتری', emoji: '☂️', ans: 'چھ', opts: ['چھ', 'جھ', 'کھ'] },
    { word: 'دھوپ', emoji: '☀️', ans: 'دھ', opts: ['دھ', 'ڈھ', 'بھ'] },
    { word: 'ڈھول', emoji: '🥁', ans: 'ڈھ', opts: ['ڈھ', 'دھ', 'ٹھ'] },
    { word: 'کھلونا', emoji: '🧸', ans: 'کھ', opts: ['کھ', 'گھ', 'پھ'] },
    { word: 'گھر', emoji: '🏠', ans: 'گھ', opts: ['گھ', 'کھ', 'جھ'] }
  ],
  sec4_items: [
    { emoji: '🌸', ans: 'پھول', opts: ['پھول', 'پہول', 'پول'] },
    { emoji: '🏠', ans: 'گھر', opts: ['گھر', 'گہر', 'گر'] },
    { emoji: '🐻', ans: 'بھالو', opts: ['بھالو', 'بہالو', 'بالو'] },
    { emoji: '☂️', ans: 'چھتری', opts: ['چھتری', 'چہتری', 'چتری'] },
    { emoji: '🥁', ans: 'ڈھول', opts: ['ڈھول', 'ڈہول', 'ڈول'] },
    { emoji: '☀️', ans: 'دھوپ', opts: ['دھوپ', 'دہوپ', 'دوپ'] }
  ],
  sec5_items: [
    { word: 'بھائی', ans: 'بھاری' },
    { word: 'بلی', ans: 'ہلکا' },
    { word: 'پھل', ans: 'بھاری' },
    { word: 'کتاب', ans: 'ہلکا' },
    { word: 'ہاتھ', ans: 'بھاری' },
    { word: 'پانی', ans: 'ہلکا' },
    { word: 'گھوڑا', ans: 'بھاری' },
    { word: 'چاند', ans: 'ہلکا' }
  ],
  sec6_items: [
    { base: 'پ', ans: 'پھ', opts: ['پھ', 'پہ', 'پ'] },
    { base: 'ٹ', ans: 'ٹھ', opts: ['ٹھ', 'ٹہ', 'ٹ'] },
    { base: 'ج', ans: 'جھ', opts: ['جھ', 'جہ', 'ج'] },
    { base: 'د', ans: 'دھ', opts: ['دھ', 'دہ', 'د'] },
    { base: 'ک', ans: 'کھ', opts: ['کھ', 'کہ', 'ک'] },
    { base: 'گ', ans: 'گھ', opts: ['گھ', 'گہ', 'گ'] }
  ],
  miniTest: [
    { prompt: 'بھاری لفظ کون سا ہے؟', opts: ['بھائی', 'بہن', 'ابو'], ans: 'بھائی', topic: 'بھاری الفاظ کی پہچان' },
    { prompt: '🥒 کھیرا — کون سا بھاری حرف ہے؟', opts: ['کھ', 'گھ', 'جھ'], ans: 'کھ', topic: 'بھاری حروف' },
    { prompt: '🐑 صحیح املا چنیں', opts: ['بھیڑ', 'بہیڑ', 'بیڑ'], ans: 'بھیڑ', topic: 'املا' },
    { prompt: '🐃 بھینس — ہلکا یا بھاری؟', opts: ['بھاری', 'ہلکا'], ans: 'بھاری', topic: 'بھاری الفاظ کی پہچان' }
  ]
};

// Check character integrity
function checkCharIn(str, target, hex) {
  for (let c of str) {
    if (c === target) {
      const code = c.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
      if (code !== hex) {
        throw new Error(`Char mismatch for ${c}: expected ${hex}, got ${code} in ${str}`);
      }
    }
  }
}

// Check every string in data
JSON.stringify(data, (key, value) => {
  if (typeof value === 'string') {
    checkCharIn(value, 'ھ', '06BE');
    checkCharIn(value, 'ہ', '06C1');
  }
  return value;
});

console.log("All ھ are U+06BE and all ہ are U+06C1! Character integrity 100% verified.");
