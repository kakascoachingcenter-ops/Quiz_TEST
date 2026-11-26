const items = [
  // Section 2: 6 items (بھاری الفاظ کی پہچان)
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 2', ans: 'پھول' },
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 2', ans: 'گھر' },
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 2', ans: 'ہاتھی' },
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 2', ans: 'کھانا' },
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 2', ans: 'بھالو' },
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 2', ans: 'چھتری' },
  // Section 3: 10 items (بھاری حروف)
  { topic: 'بھاری حروف', sec: 'Section 3', ans: 'بھ' },
  { topic: 'بھاری حروف', sec: 'Section 3', ans: 'پھ' },
  { topic: 'بھاری حروف', sec: 'Section 3', ans: 'تھ' },
  { topic: 'بھاری حروف', sec: 'Section 3', ans: 'ٹھ' },
  { topic: 'بھاری حروف', sec: 'Section 3', ans: 'جھ' },
  { topic: 'بھاری حروف', sec: 'Section 3', ans: 'چھ' },
  { topic: 'بھاری حروف', sec: 'Section 3', ans: 'دھ' },
  { topic: 'بھاری حروف', sec: 'Section 3', ans: 'ڈھ' },
  { topic: 'بھاری حروف', sec: 'Section 3', ans: 'کھ' },
  { topic: 'بھاری حروف', sec: 'Section 3', ans: 'گھ' },
  // Section 4: 6 items (املا)
  { topic: 'املا', sec: 'Section 4', ans: 'پھول' },
  { topic: 'املا', sec: 'Section 4', ans: 'گھر' },
  { topic: 'املا', sec: 'Section 4', ans: 'بھالو' },
  { topic: 'املا', sec: 'Section 4', ans: 'چھتری' },
  { topic: 'املا', sec: 'Section 4', ans: 'ڈھول' },
  { topic: 'املا', sec: 'Section 4', ans: 'دھوپ' },
  // Section 5: 8 items (بھاری الفاظ کی پہچان)
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 5', ans: 'بھاری' },
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 5', ans: 'ہلکا' },
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 5', ans: 'بھاری' },
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 5', ans: 'ہلکا' },
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 5', ans: 'بھاری' },
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 5', ans: 'ہلکا' },
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 5', ans: 'بھاری' },
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Section 5', ans: 'ہلکا' },
  // Section 6: 6 items (بھاری حروف)
  { topic: 'بھاری حروف', sec: 'Section 6', ans: 'پھ' },
  { topic: 'بھاری حروف', sec: 'Section 6', ans: 'ٹھ' },
  { topic: 'بھاری حروف', sec: 'Section 6', ans: 'جھ' },
  { topic: 'بھاری حروف', sec: 'Section 6', ans: 'دھ' },
  { topic: 'بھاری حروف', sec: 'Section 6', ans: 'کھ' },
  { topic: 'بھاری حروف', sec: 'Section 6', ans: 'گھ' },
  // Mini Test: 4 items
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Mini Test', ans: 'بھائی' },
  { topic: 'بھاری حروف', sec: 'Mini Test', ans: 'کھ' },
  { topic: 'املا', sec: 'Mini Test', ans: 'بھیڑ' },
  { topic: 'بھاری الفاظ کی پہچان', sec: 'Mini Test', ans: 'بھاری' }
];

console.log('Total items:', items.length);
const topics = {};
items.forEach(it => {
  topics[it.topic] = (topics[it.topic] || 0) + 1;
});
console.log('Topic counts:', topics);
