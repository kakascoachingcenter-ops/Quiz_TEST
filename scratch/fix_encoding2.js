const fs = require('fs');
const file = 'f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html';
let content = fs.readFileSync(file, 'utf8');

// Full comprehensive dictionary of all mojibake that may be present
// These are UTF-8 bytes misread as Windows-1252, then saved as UTF-8 again
const replacements = {
    // Multiply sign
    'Ã—': '×',
    // Emojis - multi-byte sequences misread
    'ðŸ—£ï¸': '🗣️',
    'ðŸ§©': '🧩',
    'ðŸ"¥': '📥',
    'ðŸ–¼ï¸': '🖼️',
    'ðŸ"„': '🔄',
    'ðŸ"ž': '📞',
    'ðŸ"š': '📚',
    'ðŸŽ‰': '🎉',
    'ðŸŒŸ': '🌟',
    'ðŸ'ª': '💪',
    'âœ…': '✅',
    'â†'': '→',
    'ï·º': 'ﷺ',
    'â€"': '—',
    'â­': '⭐',
    // Thumbs up 👍
    'ðŸ'': '👍',
    // Neutral face 😐
    'ðŸ˜': '😐',
    // Rocket 🚀
    'ðŸš€': '🚀',
    // Animals
    'ðŸ¶': '🐶',
    'ðŸŒ³': '🌳',
    'ðŸª'': '🪑',
    'ðŸŸ': '🐟',
    'ðŸš—': '🚗',
    'ðŸŒ¸': '🌸',
    'ðŸ¦': '🐦',
    'â›°ï¸': '⛰️',
    'ðŸ¦‹': '🦋',
    'ðŸŽ': '🍎',
    'âš½': '⚽',
    'ðŸ±': '🐱',
    'ðŸ¥š': '🥚',
    'ðŸ ': '🐐',
    'ðŸŽ©': '🎩',
    'ðŸ¦': '🦁',
    'ðŸ'': '🐒',
    'ðŸª¹': '🪹',
    'ðŸŠ': '🍊',
    'ðŸ§': '🐧',
    'ðŸ'¸': '👸',
    'ðŸ°': '🐰',
    'â˜€ï¸': '☀️',
    'ðŸ¯': '🐯',
    'ðŸ•': '🐶',
    'ðŸŒ»': '🌻',
    'ðŸ"±': '📱',
    'ðŸš²': '🚲',
    'ðŸŒ¹': '🌹',
    'ðŸ˜': '🐘',
    'ðŸŒµ': '🌵',
    'ðŸŒ¾': '🌾',
    'ðŸ„': '🐮',
    'ðŸŒ´': '🌴',
    'ðŸ': '🐍',
    'ðŸŒ¿': '🌿',
    'ðŸ¢': '🐢',
    'ðŸˆ': '🐱',
    'ðŸ¦'': '🦒',
    'ðŸ–¥ï¸': '🖥️',
    'ðŸ‡': '🐰',
    'ðŸº': '🐺',
    'ðŸŒ±': '🌱',
    'ðŸª¨': '🪨',
    'ðŸ¾': '🐾',
    'ðŸ ': '🏠',
    'ðŸ' ': '👏',
    'ðŸ"ˆ': '📈',
    // Plants and nature
    'ðŸŒ½': '🌽',
    'ðŸƒ': '🍃',
    // Islamiat specific
    'ðŸ•Œ': '🕌',
    'ðŸ•‹': '🕋',
    'ðŸŒ™': '🌙',
    // School
    'ðŸ«': '🏫',
    'ðŸ'': '💎',
    'ðŸ†': '🏆',
    'ðŸ¦Š': '🦊',
    // Number Ninjas
    'ðŸ§®': '🧮',
    'âœï¸': '✍️',
    // Grammar Champs
    'ðŸ¥‡': '🥇',
    // Misc
    'ðŸ' ': '👐',
    'ðŸ¤': '🤝',
    'ðŸ™': '🙏',
    'ðŸ§ ': '🧠',
    'ðŸ'©â€ðŸ«': '👩‍🏫',
    'ðŸ§'â€ðŸ«': '🧑‍🏫',
};

for (const [bad, good] of Object.entries(replacements)) {
    content = content.split(bad).join(good);
}

// Also fix any remaining isolated Ã (0xC3) sequences that weren't caught
// These are patterns like Ã¨ Ã© Ã  etc.
// Actually let's do a buffer-level fix for the specific characters in the original document
// Strategy: find all occurrences of the 2-byte pattern 0xC3 0xXX where it looks like a mojibake emoji start
// Instead, let's just do a targeted buffer level repair

// Write fixed content
fs.writeFileSync(file, content, 'utf8');
console.log('Fixed encoding issues.');
