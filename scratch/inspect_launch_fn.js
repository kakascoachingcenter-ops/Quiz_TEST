const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

const idx = content.indexOf('function launchWorksheet');
console.log(content.slice(idx - 100, idx + 2000));
