// find_syntax_error.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const scriptStart = html.lastIndexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');
const scriptCode = html.substring(scriptStart + 8, scriptEnd);

const lines = scriptCode.split('\n');
console.log('Total JS lines:', lines.length);

// Binary search for the error
function testUpTo(lineNum) {
    try {
        new Function(lines.slice(0, lineNum).join('\n'));
        return true;
    } catch(e) {
        return false;
    }
}

let lo = 1, hi = lines.length;
while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (testUpTo(mid)) {
        lo = mid + 1;
    } else {
        hi = mid;
    }
}

console.log('Error near line:', lo);
const start = Math.max(0, lo - 5);
const end = Math.min(lines.length, lo + 5);
for (let i = start; i < end; i++) {
    console.log(`${i+1}: ${lines[i]}`);
}
