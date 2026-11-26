const fs = require('fs');
const html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

const sIdx = html.indexOf('<script>');
let pos = 0;
while ((pos = html.indexOf('${KCIIcons.', pos)) !== -1) {
    const isInsideScript = pos > sIdx;
    console.log('Found at pos', pos, 'inside script?', isInsideScript, 'Context:', html.slice(pos - 30, pos + 45).replace(/\n/g, ' '));
    pos += 11;
}
