const fs = require('fs');
const file = 'f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html';
let content = fs.readFileSync(file, 'utf8');

// The mojibake we need to fix: Latin Extended chars that represent double-encoded UTF-8
// Each corrupt emoji is 4 bytes (in UTF-8) misread as 4 Latin-1 chars, then re-encoded as UTF-8.
// The pattern for 4-byte emoji (U+1F000..): bytes are F0 9F xx yy
// Misread as Latin-1: chars are \xF0 \x9F \xxx \xyy  
// Then re-encoded as UTF-8: C3 B0 C2 9F Cx XX Cy YY
//
// Simpler: just read the actual bytes in the file and reconvert.

// Read as buffer of bytes
const buf = fs.readFileSync(file);
let result = [];
let i = 0;

while (i < buf.length) {
    // Check if this looks like a "double-UTF8" sequence
    // A double-encoded 4-byte emoji starts as: C3 B0 C2 9F ... (which is ð\x9F encoded twice)
    // C3 B0 = ð (U+00F0)  
    // C2 9F = \x9F (control char, shouldn't appear in plain HTML)
    // This pattern is distinctive of double-encoded 4-byte sequences
    
    if (i + 7 < buf.length &&
        buf[i] === 0xC3 && buf[i+1] === 0xB0 &&  // ð (U+00F0 encoded)
        buf[i+2] === 0xC2 && buf[i+3] === 0x9F) {   // \x9F (U+009F encoded)
        // This is a double-encoded 4-byte emoji starting with F0 9F
        // The next 4 bytes should be the remaining 2 bytes (each Latin1 byte re-encoded as 2-byte UTF8)
        // Byte 3 of original (0xXX where XX >= 0x80): encoded as C2 XX or Cx XX
        // Byte 4 of original (0xYY where YY >= 0x80): encoded as C2 YY or Cx YY
        
        // Extract the 4 original bytes
        let b1 = 0xF0;
        let b2 = 0x9F;
        let b3, b4;
        
        // Decode byte 3
        let j = i + 4;
        if (j + 1 < buf.length && (buf[j] === 0xC2 || (buf[j] >= 0xC0 && buf[j] <= 0xC3))) {
            b3 = buf[j+1];
            j += 2;
        } else {
            // Can't decode, pass through
            result.push(buf[i]);
            i++;
            continue;
        }
        
        // Decode byte 4
        if (j + 1 < buf.length && (buf[j] === 0xC2 || (buf[j] >= 0xC0 && buf[j] <= 0xC3))) {
            b4 = buf[j+1];
            j += 2;
        } else {
            result.push(buf[i]);
            i++;
            continue;
        }
        
        // Validate it's a valid 4-byte UTF-8 sequence
        if ((b3 & 0xC0) === 0x80 && (b4 & 0xC0) === 0x80) {
            result.push(b1, b2, b3, b4);
            i = j;
        } else {
            result.push(buf[i]);
            i++;
        }
    }
    // Check for double-encoded 3-byte sequence: E2 xx yy -> C3 A2 C2 XX Cx YY
    else if (i + 5 < buf.length &&
        buf[i] === 0xC3 && buf[i+1] === 0xA2 &&  // â (U+00E2 encoded as C3 A2)
        buf[i+2] === 0xC2) {  // followed by C2 (encoding a byte in range 80-BF)
        
        let b1 = 0xE2;
        let b2 = buf[i+3]; // the second byte
        let j = i + 4;
        
        // Decode byte 3
        if (j + 1 < buf.length && (buf[j] === 0xC2 || (buf[j] >= 0xC0 && buf[j] <= 0xC3))) {
            let b3 = buf[j+1];
            j += 2;
            
            if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
                result.push(b1, b2, b3);
                i = j;
            } else {
                result.push(buf[i]);
                i++;
            }
        } else {
            result.push(buf[i]);
            i++;
        }
    }
    // Check for double-encoded 2-byte sequence like × (C3 B7): 
    // Original: C3 97, double-encoded: C3 83 C2 97
    else if (i + 3 < buf.length &&
        buf[i] === 0xC3 && buf[i+1] === 0x83 &&
        buf[i+2] === 0xC2 && buf[i+3] >= 0x80) {
        let b1 = 0xC3;
        let b2 = buf[i+3];
        if ((b2 & 0xC0) === 0x80) {
            result.push(b1, b2);
            i += 4;
        } else {
            result.push(buf[i]);
            i++;
        }
    }
    // Check for EF BF (U+FFFD territory) double-encoded: EF B8 8F (variation selector)
    // C3 AF C2 B8 C2 8F -> EF B8 8F
    else if (i + 5 < buf.length &&
        buf[i] === 0xC3 && buf[i+1] === 0xAF &&
        buf[i+2] === 0xC2 && buf[i+3] === 0xB8 &&
        buf[i+4] === 0xC2 && buf[i+5] === 0x8F) {
        result.push(0xEF, 0xB8, 0x8F); // variation selector ️
        i += 6;
    }
    else {
        result.push(buf[i]);
        i++;
    }
}

const fixed = Buffer.from(result);
fs.writeFileSync(file, fixed);
console.log('Buffer-level encoding fix complete.');
console.log(`Original size: ${buf.length}, Fixed size: ${fixed.length}`);
