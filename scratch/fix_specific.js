const fs = require('fs');
const file = 'f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace the still-corrupted lines in getPerformanceTier
// The corrupted sequences for 👍 and 😐 in the tagText fields
// Let me detect and replace them precisely
const thumbsUp = '\uD83D\uDC4D'; // 👍
const neutral = '\uD83D\uDE10';  // 😐

// The corrupted text lines contain 'ðŸ'' (for 👍) and 'ðŸ˜' (for 😐)  
// These are specific byte sequences we need to replace
// Let's do it by finding the containing lines and replacing them

const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("label: 'Good'") && lines[i].includes('tagText')) {
        lines[i] = `            if (percentage >= 70) return { label: 'Good', tagText: 'Good ${thumbsUp}', colorHex: '#1e88e5' };`;
    }
    if (lines[i].includes("label: 'Average'") && lines[i].includes('tagText')) {
        lines[i] = `            if (percentage >= 50) return { label: 'Average', tagText: 'Average ${neutral}', colorHex: '#f0b429' };`;
    }
    // Fix the "Let's Get Started! 🚀" in login screen if corrupted
    if (lines[i].includes("Let") && lines[i].includes("Get Started") && !lines[i].includes('\uD83D\uDE80')) {
        lines[i] = lines[i].replace(/Let.*?Get Started.*?<\/h3>/, `Let's Get Started! \uD83D\uDE80</h3>`);
    }
    // Fix "?? Living" and "?? Non-Living" emojis in pill buttons 
    if (lines[i].includes("?? Living")) {
        lines[i] = lines[i].split('?? Living').join('\uD83C\uDF31 Living');
    }
    if (lines[i].includes("?? Non-Living")) {
        lines[i] = lines[i].split('?? Non-Living').join('\uD83E\uDEA8 Non-Living');
    }
    if (lines[i].includes("?? Plant")) {
        lines[i] = lines[i].split('?? Plant').join('\uD83C\uDF3F Plant');
    }
    if (lines[i].includes("dY?_ Animal")) {
        lines[i] = lines[i].split('dY?_ Animal').join('\uD83D\uDC3E Animal');
    }
    if (lines[i].includes("dY? Domestic")) {
        lines[i] = lines[i].split('dY? Domestic').join('\uD83C\uDFE0 Domestic');
    }
    // Fix the verify button text
    if (lines[i].includes('btn-verify') && lines[i].includes('Verify')) {
        // It's in a button element
    }
}

content = lines.join('\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Specific emoji fixes applied.');
