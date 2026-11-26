/**
 * fix_emoji_final.js
 * 
 * The file's emoji bytes were decoded as Windows-1252 (not Latin-1),
 * then re-encoded as UTF-8. This script reverses that process.
 * 
 * Process: for each emoji, compute the "corrupted" byte sequence,
 * then replace it with the correct UTF-8 bytes in the file.
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');

// Windows-1252 overrides for 0x80-0x9F range
const win1252map = {
    0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026,
    0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160,
    0x8B: 0x2039, 0x8C: 0x0152, 0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019,
    0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
    0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153,
    0x9E: 0x017E, 0x9F: 0x0178,
};

// Convert a byte to its unicode codepoint using win1252
function byteToCodepoint(b) {
    if (b < 0x80) return b;          // ASCII: 1:1
    if (win1252map[b]) return win1252map[b];
    return b;                        // 0xA0-0xFF: same as latin1
}

// UTF-8 encode a codepoint
function encodeCodepoint(cp) {
    if (cp < 0x80) return [cp];
    if (cp < 0x800) return [0xC0 | (cp >> 6), 0x80 | (cp & 0x3F)];
    if (cp < 0x10000) return [0xE0 | (cp >> 12), 0x80 | ((cp >> 6) & 0x3F), 0x80 | (cp & 0x3F)];
    return [0xF0 | (cp >> 18), 0x80 | ((cp >> 12) & 0x3F), 0x80 | ((cp >> 6) & 0x3F), 0x80 | (cp & 0x3F)];
}

// Compute the corrupted byte sequence for an emoji
function computeCorrupted(emoji) {
    const originalBytes = Buffer.from(emoji, 'utf8');
    const corruptedBytes = [];
    for (const b of originalBytes) {
        const cp = byteToCodepoint(b);
        corruptedBytes.push(...encodeCodepoint(cp));
    }
    return Buffer.from(corruptedBytes);
}

// All emojis that might appear in the file
const emojis = [
    // Common UI
    '✅', '🌟', '🏆', '🎯', '✏️', '✏',
    // Animals
    '🐶', '🐱', '🐟', '🐘', '🐯', '🐾', '🐮', '🐍', '🐐', '🐒',
    '🐧', '🐰', '🐺', '🐦', '🐢', '🐓', '🐋', '🐊', '🐸', '🐛',
    '🐝', '🐠', '🐙', '🐬', '🐿️', '🦎', '🐲', '🦕', '🦖', '🐳',
    '🐡', '🦭', '🦁', '🦒', '🦓', '🦜', '🦅', '🦩', '🦆', '🦊',
    '🦋', '🦔', '🦈',
    // Additional animal variants
    '🐕', '🐄', '🐈', '🐇', '🐓', '🐑',
    // Plants / Nature
    '🌹', '🌵', '🌾', '🌴', '🌿', '🌳', '🌸', '🌻', '🌱', '🌺',
    '🍀', '🍁', '🌲', '🪸', '🌍', '🌏', '🌊', '🌋', '🌀', '🌈',
    '🌙', '☀️', '⛰️', '🏔️', '🗻', '🌄', '🌅', '🏞️', '🌑', '🌕',
    '⭐', '🌠', '🌌', '🪐', '🌬️', '🌧️', '🌤️', '🌩️', '❄️',
    // Objects / Items
    '🧦', '🎩', '📚', '📱', '🚗', '🚲', '🪑', '🏠', '🧸', '🪟',
    '🪨', '🪺', '🪁', '🥚', '📖', '📺', '🎮', '🍬', '🍊', '🍎',
    '🎂', '📢', '🎨', '📝', '💡', '🎉', '🔍', '💰', '💎', '🔑',
    '🗝️', '🎁', '🌐', '📊', '📈', '📉', '🗓️', '⏰', '🔔', '🏅',
    '🥇', '🔢', '📷', '🎥', '🎬', '🎵', '🎶', '🎸', '🥁', '🎺',
    '🎻', '🎹', '🎤', '🎧', '🔬', '🧲', '⚗️', '🧪', '🧬', '🔋',
    '💻', '🖥️', '🚀', '🛸', '🎓', '📐', '📏', '🔭',
    // Food extras
    '🍦', '🍺', '🍼', '🥤', '🍰', '🧁', '🫙', '🪣', '🏺',
    // Islamiat/worship extras
    '🙏', '🪙', '👀',
    // UI symbols  
    '👍', '👏', '👸', '💫', '❗', '❓', '⚠️', '⚡', '⚽', '♟️',
    '🕌', '🕋', '⛪', '🕍', '🛕', '🗼', '🎠', '🎡', '🎢', '🎪',
    '🎭', '🎲', '🏫', '🏥', '🏦', '🏛️',
];

let buf = fs.readFileSync(filePath);
let totalFixed = 0;

// Build repair list, sort by corrupted length desc
const repairs = [];
const seen = new Set();
for (const emoji of emojis) {
    const key = emoji;
    if (seen.has(key)) continue;
    seen.add(key);
    
    const corrupted = computeCorrupted(emoji);
    const correct = Buffer.from(emoji, 'utf8');
    
    // Only replace if the sizes differ (otherwise no double-encoding occurred)
    if (corrupted.equals(correct)) continue;
    
    repairs.push({ emoji, corrupted, correct });
}
repairs.sort((a, b) => b.corrupted.length - a.corrupted.length);

for (const { emoji, corrupted, correct } of repairs) {
    // Count & replace all occurrences
    let count = 0;
    let pos = 0;
    const parts = [];
    
    while (true) {
        let found = -1;
        for (let i = pos; i <= buf.length - corrupted.length; i++) {
            let match = true;
            for (let j = 0; j < corrupted.length; j++) {
                if (buf[i + j] !== corrupted[j]) { match = false; break; }
            }
            if (match) { found = i; break; }
        }
        if (found === -1) break;
        
        parts.push(buf.slice(pos, found));
        parts.push(correct);
        pos = found + corrupted.length;
        count++;
    }
    
    if (count > 0) {
        parts.push(buf.slice(pos));
        buf = Buffer.concat(parts);
        totalFixed += count;
        console.log(`Fixed ${count}x: ${emoji}`);
    }
}

fs.writeFileSync(filePath, buf);
console.log(`\nTotal replacements: ${totalFixed}`);

// Verify
const result = fs.readFileSync(filePath, 'utf8');
const mojibake = result.match(/ðŸ[\S]{0,5}/g);
if (mojibake && mojibake.length > 0) {
    const unique = [...new Set(mojibake)];
    console.log(`\n⚠ Remaining mojibake patterns (${unique.length}):`, unique.slice(0, 10));
} else {
    console.log('\n✓ No mojibake patterns found!');
}
