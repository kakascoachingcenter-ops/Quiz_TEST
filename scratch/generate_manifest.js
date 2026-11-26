const fs = require('fs');
const path = require('path');

const manifest = {};

// 1. Letters 26 (letter-a .. letter-z)
const letterPhonicsMap = {
    a: "A, for apple",
    b: "B, for banana",
    c: "C, for cake",
    d: "D, for dog",
    e: "E, for elephant",
    f: "F, for fish",
    g: "G, for grapes",
    h: "H, for heart",
    i: "I, for igloo",
    j: "J, for jump",
    k: "K, for kite",
    l: "L, for lion",
    m: "M, for moon",
    n: "N, for nest",
    o: "O, for orange",
    p: "P, for pen",
    q: "Q, for queen",
    r: "R, for rat",
    s: "S, for sun",
    t: "T, for tree",
    u: "U, for umbrella",
    v: "V, for van",
    w: "W, for water",
    x: "X, for box",
    y: "Y, for yellow",
    z: "Z, for zebra"
};

for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(97 + i);
    const key = `letter-${ch}`;
    manifest[key] = {
        text: letterPhonicsMap[ch],
        file: `audio/en/${key}.mp3`
    };
}

// 2. Letter names 26 (name-a .. name-z)
// Spelled for TTS as required:
// Ay, Bee, Cee, Dee, Ee, Eff, Gee, Aitch, Eye, Jay, Kay, El, Em, En, Oh, Pee, Cue, Ar, Ess, Tee, You, Vee, Double you, Ex, Why, Zed.
const spelledLetterNames = {
    a: "Ay",
    b: "Bee",
    c: "Cee",
    d: "Dee",
    e: "Ee",
    f: "Eff",
    g: "Gee",
    h: "Aitch",
    i: "Eye",
    j: "Jay",
    k: "Kay",
    l: "El",
    m: "Em",
    n: "En",
    o: "Oh",
    p: "Pee",
    q: "Cue",
    r: "Ar",
    s: "Ess",
    t: "Tee",
    u: "You",
    v: "Vee",
    w: "Double you",
    x: "Ex",
    y: "Why",
    z: "Zed"
};

for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(97 + i);
    const key = `name-${ch}`;
    manifest[key] = {
        text: spelledLetterNames[ch],
        file: `audio/en/${key}.mp3`
    };
}

// 3. Numbers 50 (num-1 .. num-50)
const numberWords = [
    "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty",
    "Twenty-one", "Twenty-two", "Twenty-three", "Twenty-four", "Twenty-five", "Twenty-six", "Twenty-seven", "Twenty-eight", "Twenty-nine", "Thirty",
    "Thirty-one", "Thirty-two", "Thirty-three", "Thirty-four", "Thirty-five", "Thirty-six", "Thirty-seven", "Thirty-eight", "Thirty-nine", "Forty",
    "Forty-one", "Forty-two", "Forty-three", "Forty-four", "Forty-five", "Forty-six", "Forty-seven", "Forty-eight", "Forty-nine", "Fifty"
];

for (let i = 1; i <= 50; i++) {
    const key = `num-${i}`;
    manifest[key] = {
        text: numberWords[i],
        file: `audio/en/${key}.mp3`
    };
}

// 4. Words 27
// cat rat man cap sat ran has fat am the a I apple banana cake grapes heart book pen moon triangle square circle happy sad tired angry
const wordList = [
    "cat", "rat", "man", "cap", "sat", "ran", "has", "fat", "am", "the",
    "a", "I", "apple", "banana", "cake", "grapes", "heart", "book", "pen", "moon",
    "triangle", "square", "circle", "happy", "sad", "tired", "angry"
];

for (const w of wordList) {
    manifest[w] = {
        text: w,
        file: `audio/en/${w}.mp3`
    };
}

// 5. Instructions 19 (each <= 8 words, child-friendly)
const instructions = {
    "en-intro": "Welcome Little Readers! Let us learn and play!",
    "en-alphabet": "Listen to the alphabet sounds and names.",
    "en-s1": "Tap the small partner for each letter.",
    "en-s2": "Some letters live in grass. Tap them.",
    "en-s3": "Tap the first letter of each picture.",
    "en-s4": "Draw a line from picture to word.",
    "en-s5": "Tap words in order to make sentences.",
    "en-s6": "How do they feel? Tap the word.",
    "en-draw": "Draw your favourite animal on the canvas.",
    "q-start": "Let us begin our fun worksheet now!",
    "ma-intro": "Welcome Number Buddies! Let us count together!",
    "ma-s1": "Count the objects and choose the number.",
    "ma-s2": "What comes next? Tap the missing number.",
    "ma-s3": "Match each number word to its digit.",
    "ma-s4": "Fill the blank numbers in the grid.",
    "ma-s5-shape": "Look at the shape. Tap its name.",
    "ma-s5-small": "Colour the small flower with any colour.",
    "ma-s5-big": "Colour the big house with any colour.",
    "ma-draw": "Draw anything with a shape in it."
};

for (const [key, text] of Object.entries(instructions)) {
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > 8) {
        throw new Error(`Instruction ${key} has ${wordCount} words (> 8): "${text}"`);
    }
    manifest[key] = {
        text: text,
        file: `audio/en/${key}.mp3`
    };
}

// 6. UI 6
const uiKeys = {
    "ui-verify": "Check my answers and show results.",
    "ui-well-done": "Well done! You finished the worksheet!",
    "tier-perfect": "Awesome job! You got every answer right!",
    "tier-good": "Good job! You did really great work!",
    "tier-average": "Nice effort! Keep practicing every day!",
    "tier-needs": "Keep trying! You will do even better!"
};

for (const [key, text] of Object.entries(uiKeys)) {
    manifest[key] = {
        text: text,
        file: `audio/en/${key}.mp3`
    };
}

const keyCount = Object.keys(manifest).length;
console.log(`Generated manifest with ${keyCount} keys.`);
if (keyCount !== 154) {
    throw new Error(`Expected 154 keys, but got ${keyCount}`);
}

const manifestPath = path.join(__dirname, '../audio/manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Wrote manifest to ${manifestPath}`);
