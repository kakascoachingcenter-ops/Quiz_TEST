const fs = require('fs');
const vm = require('vm');

function checkFileSyntax(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');
    try {
        new vm.Script(code);
        console.log(`${filePath}: Syntax Valid!`);
        return true;
    } catch (e) {
        console.error(`${filePath}: Syntax Error:`, e);
        return false;
    }
}

checkFileSyntax('KCI_TableOf2_App/modules/voice.js');
checkFileSyntax('KCI_TableOf2_App/modules/freeDraw.js');
checkFileSyntax('KCI_TableOf2_App/modules/kgWorksheets.js');

// Also check index.html embedded scripts
const html = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');
const scriptRegex = /<script(?:\s+type="text\/javascript")?>([\s\S]*?)<\/script>/gi;
let m;
let scriptIdx = 0;
while ((m = scriptRegex.exec(html)) !== null) {
    const scriptContent = m[1].trim();
    if (scriptContent.length > 0 && !m[0].includes('src=')) {
        scriptIdx++;
        try {
            new vm.Script(scriptContent);
            console.log(`index.html inline script #${scriptIdx} (${scriptContent.length} chars): Syntax Valid!`);
        } catch (e) {
            console.error(`index.html inline script #${scriptIdx} Syntax Error:`, e);
        }
    }
}
