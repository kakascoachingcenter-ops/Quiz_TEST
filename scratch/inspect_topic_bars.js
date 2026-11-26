const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

const idx = content.indexOf('report.topics.forEach(t => {');
console.log(content.slice(idx, idx + 2000));
