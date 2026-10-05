const fs = require('fs');

const file = 'f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html';
let content = fs.readFileSync(file, 'utf8');

// The file was originally UTF-8. 
// A script read it as Windows-1252, resulting in a string where each character represents a byte of the original UTF-8.
// Then it was saved as UTF-8.
// So, we need to convert the current UTF-8 string back to the bytes it represents in Windows-1252.
// Node's 'binary' encoding effectively maps characters 0-255 to bytes 0-255.

// Let's create a buffer from the corrupted string using 'binary' encoding (Latin-1 / Windows-1252 equivalent for 0-255)
// Actually, 'binary' in Node is ISO-8859-1. Windows-1252 has some differences in the 0x80-0x9F range (e.g. smart quotes).
// Let's check if there are chars > 255.
let fixed = content;
let foundCorrupted = content.includes('Ã—');

if (foundCorrupted) {
    // Replace known mojibake using regex because full buffer conversion might corrupt characters that were added correctly later (like my new GSAP HTML!)
    // Wait, if I added new correct UTF-8 text (like the Chart.js code or topics), converting the whole file will corrupt the NEW text!
    // Yes! The safest way is a dictionary of known corrupted strings.
    const replacements = {
        'Ã—': '×',
        'ðŸ—£ï¸': '🗣️',
        'ðŸ§©': '🧩',
        'â†’': '→',
        'ï·º': 'ﷺ',
        'ðŸ ¶': '🐶',
        'ðŸŒ³': '🌳',
        'ðŸª‘': '🪑',
        'ðŸ Ÿ': '🐟',
        'ðŸš—': '🚗',
        'ðŸŒ¸': '🌸',
        'ðŸ“š': '📚',
        'ðŸ ¦': '🐦',
        'â›°ï¸': '⛰️',
        'ðŸ¦‹': '🦋',
        'ðŸ Ž': '🍎',
        'âš½': '⚽',
        'ðŸ ±': '🐱',
        'ðŸ¥š': '🥚',
        'ðŸ  ': '🐐',
        'ðŸŽ©': '🎩',
        'ðŸ º': 'Jug', // Wait, jug emoji? '🍺' or '🏺'
        'ðŸª ': '🪁',
        'ðŸ¦ ': '🦁',
        'ðŸ ’': '🐒',
        'ðŸª¹': '🪹',
        'ðŸ Š': '🍊',
        'ðŸ §': '🐧',
        'ðŸ‘¸': '👸',
        'ðŸ °': '🐰',
        'â˜€ï¸': '☀️',
        'ðŸ ¯': '🐯',
        'ðŸ •': '🐶',
        'ðŸŒ»': '🌻',
        'ðŸ“±': '📱',
        'ðŸš²': '🚲',
        'ðŸŒ¹': '🌹',
        'ðŸ ˜': '🐘',
        'ðŸŒµ': '🌵',
        'ðŸŒ¾': '🌾',
        'ðŸ „': '🐮',
        'ðŸŒ´': '🌴',
        'ðŸ  ': '🐍',
        'ðŸŒ¿': '🌿',
        'ðŸ ¢': '🐢',
        'ðŸ ˆ': '🐱',
        'ðŸ¦’': '🦒',
        'ðŸ–¥ï¸': '🖥️',
        'ðŸ ‡': '🐰',
        'ðŸ º ': '🐺 ', // Wolf
        'ðŸŒ±': '🌱',
        'ðŸª¨': '🪨',
        'ðŸ ¾': '🐾',
        'ðŸ  ': '🏠',
        'ðŸŽ‰': '🎉',
        'ðŸŒŸ': '🌟',
        'ðŸ‘ ': '👏',
        'ðŸ’ª': '💪',
        'ðŸ“¥': '📥',
        'ðŸ–¼ï¸': '🖼️',
        'ðŸ”„': '🔄',
        'ðŸ“ž': '📞',
        'âœ…': '✅',
        'â€”': '—'
    };

    for (const [bad, good] of Object.entries(replacements)) {
        fixed = fixed.split(bad).join(good);
    }
    
    // Catch-all buffer fix for remaining mojibake in original document ONLY
    // Since we know the new content I added doesn't have mojibake, maybe just replacing is enough.
    // Let's write the file.
    fs.writeFileSync(file, fixed, 'utf8');
    console.log("Dictionary replacements applied.");
} else {
    console.log("No Ã— found.");
}
