const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

const wsIds = ['greenThumbs', 'urduDost'];
wsIds.forEach(id => {
  console.log(`=== Matches for ${id} ===`);
  let pos = 0;
  while (true) {
    const idx = content.indexOf(id, pos);
    if (idx === -1) break;
    console.log(`at ${idx}:`, content.slice(Math.max(0, idx - 40), Math.min(content.length, idx + 80)).replace(/\n/g, ' '));
    pos = idx + id.length;
  }
});
