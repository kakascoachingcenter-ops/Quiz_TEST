const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');
const idx = content.indexOf('id="screen-worksheet-urduDost"');
console.log(content.slice(idx - 200, idx + 1200));
