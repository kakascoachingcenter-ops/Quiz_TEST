const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

let pos = 0;
while (true) {
  const idx = content.indexOf('.ws-card', pos);
  if (idx === -1) break;
  console.log('at', idx, ':', content.slice(idx - 40, idx + 100));
  pos = idx + 1;
}
