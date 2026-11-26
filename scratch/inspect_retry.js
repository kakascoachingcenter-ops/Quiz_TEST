const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

console.log('--- At 294700 ---');
console.log(content.slice(294500, 296000));

console.log('--- At 300500 ---');
console.log(content.slice(300300, 301800));
