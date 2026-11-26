const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

const idx = content.indexOf("card.dataset.worksheet = wsId");
console.log(content.slice(idx, idx + 1000));
