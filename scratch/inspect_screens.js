const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// Find all screen-worksheet-
const regex = /id="(screen-worksheet-[^"]+)"/g;
let m;
while ((m = regex.exec(content)) !== null) {
  console.log(m[1], 'at', m.index);
}
