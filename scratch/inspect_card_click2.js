const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

const idx = content.indexOf("ws-card");
console.log(content.slice(idx, idx + 2000));
