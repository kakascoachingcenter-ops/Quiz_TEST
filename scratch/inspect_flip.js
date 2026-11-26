const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

const regex = /flip-card/g;
let m;
while ((m = regex.exec(content)) !== null) {
  console.log(m[0], 'at', m.index);
}
