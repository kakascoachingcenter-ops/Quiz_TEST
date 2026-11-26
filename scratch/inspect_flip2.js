const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

console.log('--- Around 6128 ---');
console.log(content.slice(6050, 6650));

console.log('--- Around 93638 ---');
console.log(content.slice(93500, 94500));
