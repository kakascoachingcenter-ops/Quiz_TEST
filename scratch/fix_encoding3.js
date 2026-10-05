const fs = require('fs');
const file = 'f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html';
let content = fs.readFileSync(file, 'utf8');

// The corrupted sequences are "double-UTF-8" encoded text.
// The original file had correct UTF-8. A PowerShell script read it as Windows-1252 (latin-1 superset),
// then saved it as UTF-8. This turned each original UTF-8 byte into a separate character,
// which was then UTF-8 encoded again.
// 
// Strategy: Find sequences that look like Mojibake by using a buffer-level conversion.
// We find any runs of Mojibake characters (Latin Extended sequences starting with Ã, Â, etc.)
// and convert them back to proper UTF-8.

// This function tries to "re-interpret" a string that was incorrectly double-encoded
function fixMojibake(str) {
    // Try to convert via latin1 -> proper UTF-8
    // Convert string to buffer treating each char as a Latin-1 byte
    try {
        const buf = Buffer.from(str, 'latin1');
        return buf.toString('utf8');
    } catch (e) {
        return str; // If conversion fails, return as-is
    }
}

// Apply selective conversion only to the "static" parts of the original document
// The new JavaScript code I added (like topic data, Chart.js, showResults) was added
// AFTER the corruption happened, so it's correctly encoded.
// 
// Key insight: The corrupted characters all start with specific byte patterns.
// The most common are things like xC3 xB7 (×), xF0 x9F (emoji prefix in UTF-8).
// When read as Latin-1, these become 2-4 Latin Extended chars.
// 
// Instead of a full buffer conversion (which would break the newly added correct text),
// let's use a targeted approach using regex to catch the specific patterns:

// Pattern: Mojibake for 3/4-byte UTF-8 sequences (emojis are 4 bytes = 8 mojibake chars max)
// Char codes for mojibake typically: 195 (Ã), 194 (Â), 240 (ð), etc.

// Let's do it differently - use a lookup table approach with the actual Unicode codepoints
const table = [
    // [mojibake_string, correct_string]
    // × (multiply sign U+00D7)
    ['\u00C3\u00D7', '\u00D7'],
    // Common emojis that appear in the document
    // 🗣️ U+1F5E3 U+FE0F  
    ['\u00F0\u009F\u0097\u00A3\u00EF\u00B8\u008F', '\uD83D\uDDE3\uFE0F'],
    // 🧩 U+1F9E9
    ['\u00F0\u009F\u00A7\u00A9', '\uD83E\uDDE9'],
    // ✅ U+2705
    ['\u00E2\u009C\u0085', '\u2705'],
    // 📥 U+1F4E5
    ['\u00F0\u009F\u0093\u00A5', '\uD83D\uDCE5'],
    // 🖼️ U+1F5BC U+FE0F
    ['\u00F0\u009F\u0096\u00BC\u00EF\u00B8\u008F', '\uD83D\uDDBC\uFE0F'],
    // 🔄 U+1F504
    ['\u00F0\u009F\u0094\u0084', '\uD83D\uDD04'],
    // 📞 U+1F4DE
    ['\u00F0\u009F\u0093\u009E', '\uD83D\uDCDE'],
    // 📚 U+1F4DA
    ['\u00F0\u009F\u0093\u009A', '\uD83D\uDCDA'],
    // 🎉 U+1F389
    ['\u00F0\u009F\u008E\u0089', '\uD83C\uDF89'],
    // 🌟 U+1F31F
    ['\u00F0\u009F\u008C\u009F', '\uD83C\uDF1F'],
    // 💪 U+1F4AA
    ['\u00F0\u009F\u0092\u00AA', '\uD83D\uDCAA'],
    // → U+2192
    ['\u00E2\u0086\u0092', '\u2192'],
    // ﷺ U+FDF2
    ['\u00EF\u00B7\u00BA', '\uFDF2'],
    // — U+2014
    ['\u00E2\u0080\u0094', '\u2014'],
    // ⭐ U+2B50
    ['\u00E2\u00AD\u0090', '\u2B50'],
    // 👍 U+1F44D
    ['\u00F0\u009F\u0091\u008D', '\uD83D\uDC4D'],
    // 😐 U+1F610
    ['\u00F0\u009F\u0098\u0090', '\uD83D\uDE10'],
    // 🚀 U+1F680
    ['\u00F0\u009F\u009A\u0080', '\uD83D\uDE80'],
    // 🐶 U+1F436
    ['\u00F0\u009F\u0090\u00B6', '\uD83D\uDC36'],
    // 🌳 U+1F333
    ['\u00F0\u009F\u008C\u00B3', '\uD83C\uDF33'],
    // 🪑 U+1FA91
    ['\u00F0\u009F\u00AA\u0091', '\uD83E\uDEA1'],
    // 🐟 U+1F41F
    ['\u00F0\u009F\u0090\u009F', '\uD83D\uDC1F'],
    // 🚗 U+1F697
    ['\u00F0\u009F\u009A\u0097', '\uD83D\uDE97'],
    // 🌸 U+1F338
    ['\u00F0\u009F\u008C\u00B8', '\uD83C\uDF38'],
    // 🐦 U+1F426
    ['\u00F0\u009F\u0090\u00A6', '\uD83D\uDC26'],
    // ⛰️ U+26F0 U+FE0F
    ['\u00E2\u009B\u00B0\u00EF\u00B8\u008F', '\u26F0\uFE0F'],
    // 🦋 U+1F98B
    ['\u00F0\u009F\u00A6\u008B', '\uD83E\uDD8B'],
    // 🍎 U+1F34E
    ['\u00F0\u009F\u008D\u008E', '\uD83C\uDF4E'],
    // ⚽ U+26BD
    ['\u00E2\u009A\u00BD', '\u26BD'],
    // 🐱 U+1F431
    ['\u00F0\u009F\u0090\u00B1', '\uD83D\uDC31'],
    // 🥚 U+1F95A
    ['\u00F0\u009F\u00A5\u009A', '\uD83E\uDD5A'],
    // 🐐 U+1F410
    ['\u00F0\u009F\u0090\u0090', '\uD83D\uDC10'],
    // 🎩 U+1F3A9
    ['\u00F0\u009F\u008E\u00A9', '\uD83C\uDFA9'],
    // 🦁 U+1F981
    ['\u00F0\u009F\u00A6\u0081', '\uD83E\uDD81'],
    // 🐒 U+1F412
    ['\u00F0\u009F\u0090\u0092', '\uD83D\uDC12'],
    // 🪹 U+1FAB9 (nest) - fallback to just Nest
    ['\u00F0\u009F\u00AA\u00B9', '\uD83E\uDEB9'],
    // 🍊 U+1F34A
    ['\u00F0\u009F\u008D\u008A', '\uD83C\uDF4A'],
    // 🐧 U+1F427
    ['\u00F0\u009F\u0090\u00A7', '\uD83D\uDC27'],
    // 👸 U+1F478
    ['\u00F0\u009F\u0091\u00B8', '\uD83D\uDC78'],
    // 🐰 U+1F430
    ['\u00F0\u009F\u0090\u00B0', '\uD83D\uDC30'],
    // ☀️ U+2600 U+FE0F
    ['\u00E2\u0098\u0080\u00EF\u00B8\u008F', '\u2600\uFE0F'],
    // 🐯 U+1F42F
    ['\u00F0\u009F\u0090\u00AF', '\uD83D\uDC2F'],
    // 🌻 U+1F33B
    ['\u00F0\u009F\u008C\u00BB', '\uD83C\uDF3B'],
    // 📱 U+1F4F1
    ['\u00F0\u009F\u0093\u00B1', '\uD83D\uDCF1'],
    // 🚲 U+1F6B2
    ['\u00F0\u009F\u009A\u00B2', '\uD83D\uDEB2'],
    // 🌹 U+1F339
    ['\u00F0\u009F\u008C\u00B9', '\uD83C\uDF39'],
    // 🐘 U+1F418
    ['\u00F0\u009F\u0090\u0098', '\uD83D\uDC18'],
    // 🌵 U+1F335
    ['\u00F0\u009F\u008C\u00B5', '\uD83C\uDF35'],
    // 🌾 U+1F33E
    ['\u00F0\u009F\u008C\u00BE', '\uD83C\uDF3E'],
    // 🐮 U+1F42E
    ['\u00F0\u009F\u0090\u00AE', '\uD83D\uDC2E'],
    // 🌴 U+1F334
    ['\u00F0\u009F\u008C\u00B4', '\uD83C\uDF34'],
    // 🐍 U+1F40D
    ['\u00F0\u009F\u0090\u008D', '\uD83D\uDC0D'],
    // 🌿 U+1F33F
    ['\u00F0\u009F\u008C\u00BF', '\uD83C\uDF3F'],
    // 🐢 U+1F422
    ['\u00F0\u009F\u0090\u00A2', '\uD83D\uDC22'],
    // 🦒 U+1F992
    ['\u00F0\u009F\u00A6\u0092', '\uD83E\uDD92'],
    // 🖥️ U+1F5A5 U+FE0F
    ['\u00F0\u009F\u0096\u00A5\u00EF\u00B8\u008F', '\uD83D\uDDA5\uFE0F'],
    // 🐺 U+1F43A
    ['\u00F0\u009F\u0090\u00BA', '\uD83D\uDC3A'],
    // 🌱 U+1F331
    ['\u00F0\u009F\u008C\u00B1', '\uD83C\uDF31'],
    // 🪨 U+1FAA8
    ['\u00F0\u009F\u00AA\u00A8', '\uD83E\uDEA8'],
    // 🐾 U+1F43E
    ['\u00F0\u009F\u0090\u00BE', '\uD83D\uDC3E'],
    // 🏠 U+1F3E0
    ['\u00F0\u009F\u008F\u00A0', '\uD83C\uDFE0'],
    // 👏 U+1F44F
    ['\u00F0\u009F\u0091\u008F', '\uD83D\uDC4F'],
    // 🏆 U+1F3C6
    ['\u00F0\u009F\u008F\u0086', '\uD83C\uDFC6'],
    // 🧮 U+1F9EE
    ['\u00F0\u009F\u00A7\u00AE', '\uD83E\uDDEE'],
    // ✍️ U+270D U+FE0F
    ['\u00E2\u009C\u008D\u00EF\u00B8\u008F', '\u270D\uFE0F'],
    // 🥇 U+1F947
    ['\u00F0\u009F\u00A5\u0087', '\uD83E\uDD47'],
    // 🙏 U+1F64F
    ['\u00F0\u009F\u009F\u008F', '\uD83D\uDE4F'],
    // 🧠 U+1F9E0
    ['\u00F0\u009F\u00A7\u00A0', '\uD83E\uDDE0'],
    // 🕌 U+1F54C
    ['\u00F0\u009F\u0095\u008C', '\uD83D\uDD4C'],
    // 🕋 U+1F54B
    ['\u00F0\u009F\u0095\u008B', '\uD83D\uDD4B'],
    // 🌙 U+1F319
    ['\u00F0\u009F\u008C\u0099', '\uD83C\uDF19'],
    // 🏫 U+1F3EB
    ['\u00F0\u009F\u008F\u00AB', '\uD83C\uDFEB'],
    // 🪁 U+1FA81
    ['\u00F0\u009F\u00AA\u0081', '\uD83E\uDE81'],
    // 👩‍🏫 teacher emoji
    ['\u00F0\u009F\u0091\u00A9\u00E2\u0080\u008D\u00F0\u009F\u008F\u00AB', '\uD83D\uDC69\u200D\uD83C\uDFEB'],
];

let count = 0;
for (const [bad, good] of table) {
    const before = content;
    content = content.split(bad).join(good);
    if (content !== before) count++;
}

fs.writeFileSync(file, content, 'utf8');
console.log(`Fixed ${count} encoding patterns.`);
