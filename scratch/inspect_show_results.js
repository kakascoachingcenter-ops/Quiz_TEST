const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

const idx = content.indexOf('function showResults');
console.log(content.slice(idx, idx + 3500));
