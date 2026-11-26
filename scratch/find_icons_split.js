const fs = require('fs');
const html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

const sIdx = html.indexOf('<script>\n        // STUDENT ROSTER');
let pos = 0;
let inHtml = [];
let inJs = [];
while ((pos = html.indexOf('${KCIIcons.', pos)) !== -1) {
    if (pos < sIdx) {
        inHtml.push({ pos, text: html.slice(pos, pos + 25) });
    } else {
        inJs.push({ pos, text: html.slice(pos, pos + 25) });
    }
    pos += 11;
}
console.log('In raw HTML (needs literal SVG):', inHtml);
console.log('In JS strings:', inJs);
