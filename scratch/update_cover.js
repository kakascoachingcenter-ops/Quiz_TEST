const fs = require('fs');
let html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

const sIdx = html.indexOf('const worksheetsConfig = {');
const eIdx = html.indexOf('function renderClass1Worksheet');
let cfgSection = html.slice(sIdx, eIdx);

// Add cover: null right after folderId: ...
cfgSection = cfgSection.replace(/(folderId:\s*["'][^"']+["'],)/g, '$1\n                cover: null,');

html = html.slice(0, sIdx) + cfgSection + html.slice(eIdx);
fs.writeFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', html, 'utf8');
console.log('Cover field added to worksheetsConfig successfully!');
