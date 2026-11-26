// verify_fixes.js
const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// Extract the main script block
const scriptStart = html.lastIndexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>');
const scriptCode = html.substring(scriptStart + 8, scriptEnd);

// Validate syntax
try {
    new Function(scriptCode);
    console.log('JS syntax valid');
} catch(e) {
    console.log('JS syntax error:', e.message);
}

// Verify specific fixes
console.log('');
console.log('=== Fix verification ===');
console.log('FIX1 - setTimeout checkS1Validity:', html.includes('setTimeout(checkS1Validity, 0)'));
console.log('FIX2 - storyAudioPlayer new Audio:', html.includes("storyAudioPlayer = new Audio"));
console.log('FIX2 - no Web Speech speak:', !html.includes('window.speechSynthesis.speak'));
console.log('FIX3 - closeStoryModal stops MP3:', html.includes('storyAudioPlayer.pause()'));
console.log('FIX4 - getBestEnglishVoice removed:', !html.includes('function getBestEnglishVoice'));
console.log('No KCIIcons literals:', !html.includes('${KCIIcons'));
