const fs = require('fs');
const voiceCode = fs.readFileSync('KCI_TableOf2_App/modules/voice.js', 'utf8');

const idx = voiceCode.indexOf('function speakSynthesis');
console.log(voiceCode.substring(idx, idx + 1000));
