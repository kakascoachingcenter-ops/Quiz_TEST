const fs = require('fs');
let content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// =====================================================================
// PART A: Add nov-2026 folder
// =====================================================================
content = content.replace(
  `const worksheetFolders = [
            { id: "earlier",  label: "Earlier Worksheets", sortKey: "0000-00" },
            { id: "oct-2026", label: "OCT-2026",           sortKey: "2026-10" },
        ];`,
  `const worksheetFolders = [
            { id: "earlier",  label: "Earlier Worksheets", sortKey: "0000-00" },
            { id: "oct-2026", label: "OCT-2026",           sortKey: "2026-10" },
            { id: "nov-2026", label: "NOV-2026",           sortKey: "2026-11" },
        ];`
);

console.log('Part A done: nov-2026 folder added');

// Verify
if (content.includes('"nov-2026"')) console.log('  ✅ nov-2026 present');
else throw new Error('nov-2026 NOT found!');

fs.writeFileSync('KCI_TableOf2_App/index.html', content, 'utf8');
console.log('Saved Part A');
