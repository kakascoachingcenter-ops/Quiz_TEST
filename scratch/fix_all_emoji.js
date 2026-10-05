const fs = require('fs');
const file = 'f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html';
let content = fs.readFileSync(file, 'utf8');

// Replace all corrupted emoji text with proper emoji or safe text
// Format: [corrupted, correct]
const fixes = [
    // Section headers with emojis
    ['Circle the Correct Answer dYZ_', 'Circle the Correct Answer ✏️'],
    ['Count the Pairs dY`?', 'Count the Pairs 👏'],
    ['Find the Table of 2 dY"?', 'Find the Table of 2 🔢'],
    ['Mini Test dY?+', 'Mini Test 🌟'],
    ['Grammar Champs Mini Test dY?+', 'Grammar Champs Mini Test 🏆'],
    ['Little Believers Mini Test dY?+', 'Little Believers Mini Test 🌟'],
    ['Match the Following dYZ_', 'Match the Following ✏️'],
    ["The Five Pillars of Islam dY\u0007O", 'The Five Pillars of Islam 🕌'],
    // Counting emojis (socks/animals)
    ['dY?ZdY?Z', '🧦🧦'],
    ['dY?YdY?Y', '🐟🐟'],
    // Animal/object emojis in questions
    // Class 1 s1 - Living things
    ['dY?\u0014 Dog', '🐶 Dog'],
    ['dY?Y Fish', '🐟 Fish'],
    ['dY?~ Elephant', '🐘 Elephant'],
    ['dY?! Elephant', '🐘 Elephant'],
    ['dY?~ Elephant', '🐘 Elephant'],
    ['dY?^ Cat', '🐱 Cat'],
    ['dY?\u0007 Dog', '🐶 Dog'],
    ['dY?_ Tiger', '🐯 Tiger'],
    ['dY?_ Animal', '🐾 Animal'],
    ['dY?, Cow', '🐮 Cow'],
    ['dY?? Snake', '🐍 Snake'],
    ['dY?? Goat', '🐐 Goat'],
    ['dY?' + "'" + ' Monkey', '🐒 Monkey'],
    ["dY?' Monkey", '🐒 Monkey'],
    ['dY?. Monkey', '🐒 Monkey'],
    ['dY?S Orange', '🍊 Orange'],
    ['dY?Z Apple', '🍎 Apple'],
    ['dY?\u0015 Penguin', '🐧 Penguin'],
    ['dY?_ Rabbit', '🐰 Rabbit'],
    ['dY?! Rabbit', '🐰 Rabbit'],
    ['dY?• Rabbit', '🐰 Rabbit'],
    ["dY?\\x95 Rabbit", '🐰 Rabbit'],
    ['dY?~ Wolf', '🐺 Wolf'],
    ['dY?! Wolf', '🐺 Wolf'],
    ['dY?' + '\\u00BC' + ' Rabbit', '🐰 Rabbit'],
    ['dY?' + '\\xBC' + ' Rabbit', '🐰 Rabbit'],
    // Islamiat pillar icons
    ['dYT?', '🕌'],
    ['dY\u0007<', '🕋'],
    ['dY"?', '📖'],
    ['dY"-', '📖'],
    ['dY?Z Cake', '🎂 Cake'],
    // Light, sun
    ['??? Sun', '☀️ Sun'],
    ['dYZr', '🎮'],
    ['dY?"', '🍬'],  // candy
    // Replace all remaining dY?x patterns with nothing (safe fallback)
    // Pill buttons
    ['dY? Domestic', '🏠 Domestic'],
    ['dY?^ Domestic', '🏠 Domestic'],
    ['dY?! Domestic', '🏠 Domestic'],
    // Mini test wolf
    ['dY?~ Wolf', '🐺 Wolf'],
    ['dY?! Wolf', '🐺 Wolf'],
    // Section 5 mini test  
    ['dY?~ Elephant is:', '🐘 Elephant is:'],
    ['dY?! Elephant is:', '🐘 Elephant is:'],
    ['1. dY?~ Elephant is:', '1. 🐘 Elephant is:'],
    ['1. dY?! Elephant is:', '1. 🐘 Elephant is:'],
    ['dY\u00B9 Window', '🪟 Window'],
    ['dY\u00B9Y Window', '🪟 Window'],
    ['dYa? Window', '🪟 Window'],
    // Nature worksheet
    ['?? Sunflower', '🌻 Sunflower'],
    ['?? Phone', '📱 Phone'],
    ['? Ball', '⚽ Ball'],
    ['?? Bicycle', '🚲 Bicycle'],
    ['?? Butterfly', '🦋 Butterfly'],
    ['?? Chair', '🪑 Chair'],
    ['?? Rose', '🌹 Rose'],
    ['?? Cactus', '🌵 Cactus'],
    ['?? Wheat', '🌾 Wheat'],
    ['?? Palm Tree', '🌴 Palm Tree'],
    ['?? Fern', '🌿 Fern'],
    ['?? Dog', '🐶 Dog'],
    ['?? Tree', '🌳 Tree'],
    ['?? Flower', '🌸 Flower'],
    ['?? Book', '📚 Book'],
    ['?? Bird', '🐦 Bird'],
    ['??? Mountain', '⛰️ Mountain'],
    ['?? Car', '🚗 Car'],
    ['?? Hat', '🎩 Hat'],
    ['?? Egg', '🥚 Egg'],
    ['?? Nest', '🪹 Nest'],
    ['?? Queen', '👸 Queen'],
    ['?? Lion', '🦁 Lion'],
    ['?? Kite', '🪁 Kite'],
    ['?? Giraffe', '🦒 Giraffe'],
    // Mini Test Nature
    ['1. ?? Flower is:', '1. 🌸 Flower is:'],
    ['2. ?? Computer is:', '2. 🖥️ Computer is:'],
    ['3. ?? Tree is a:', '3. 🌳 Tree is a:'],
    ['4. dY?! Rabbit is a:', '4. 🐰 Rabbit is a:'],
    ['5. dY?! Wolf is a:', '5. 🐺 Wolf is a:'],
    ['4. ?? Rabbit is a:', '4. 🐰 Rabbit is a:'],
    ['5. ?? Wolf is a:', '5. 🐺 Wolf is a:'],
    // Pill options
    ['?? Plant', '🌿 Plant'],
    ['?? Animal', '🐾 Animal'],
    ['?? Wild', '🌳 Wild'],
    ['?? Domestic', '🏠 Domestic'],
    ['?? Living', '🌱 Living'],
    ['?? Non-Living', '🪨 Non-Living'],
    // Mini test class 1 s8
    ['1. dY?~ Elephant', '1. 🐘 Elephant'],
    // Islamiat worship tiles
    ['dY?- label', '📖 label'],
    ['dY"- The Quran', '📖 The Quran'],
    ['dY"- The Tawrat', '📖 The Tawrat'],
    ['dY"- The Zabur', '📖 The Zabur'],
    ['dY"- The Injeel', '📖 The Injeel'],
    // Islamiat mini test
    ['Praying dYT?', 'Praying 🕌'],
    ['Playing toys dY\u0015,', 'Playing toys 🧸'],
    // isl-worship icons
    ["{ icon: 'dYT?'", "{ icon: '🕌'"],
    ["{ icon: 'dYOT'", "{ icon: '🌙'"],
    ["{ icon: 'dY\u0007<'", "{ icon: '🕋'"],
    ["{ icon: 'dY\"-'", "{ icon: '📖'"],
    ["{ icon: 'dYZr'", "{ icon: '🎮'"],
    ["{ icon: 'dY?", "{ icon: '🍬'"], // fallback for candy
    ["{ icon: 'dY\"", "{ icon: '📺'"],  // cartoons fallback
    // Counting emojis in static HTML
    // (these are in specific structure, let's handle section 5)
    // Misc Islamiat icons in opts
    ["opts: [\"Praying dYT?", "opts: [\"Praying 🕌"],
];

for (const [bad, good] of fixes) {
    if (content.includes(bad)) {
        content = content.split(bad).join(good);
        console.log(`Fixed: ${JSON.stringify(bad).substring(0, 40)}`);
    }
}

// Also do a regex cleanup for any remaining dY?x patterns (fallback replacement)
const remaining = content.match(/dY[^\s<"]{0,4}/g);
if (remaining) {
    const unique = [...new Set(remaining)];
    console.log('Remaining dY patterns:', unique.slice(0, 20));
}

fs.writeFileSync(file, content, 'utf8');
console.log('Done.');
