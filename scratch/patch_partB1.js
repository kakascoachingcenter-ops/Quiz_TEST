const fs = require('fs');
let content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// =====================================================================
// PART B: classLevel -> classLevels in worksheetsConfig
// =====================================================================

const replacements = [
  // table2
  [`                classLevel: "KG",
                difficulty: "Easy",
                dateAdded: "2026-10-02",
                folderId: "earlier",
                cardIcon: "&#x1F9EE;",`,
   `                classLevels: ["KG"],
                difficulty: "Easy",
                dateAdded: "2026-10-02",
                folderId: "earlier",
                cardIcon: "&#x1F9EE;",`],
  // class1
  [`                classLevel: "Class I",
                difficulty: "Easy",
                dateAdded: "2026-10-02",
                folderId: "earlier",
                cardIcon: "&#x1F4D6;",`,
   `                classLevels: ["Class I"],
                difficulty: "Easy",
                dateAdded: "2026-10-02",
                folderId: "earlier",
                cardIcon: "&#x1F4D6;",`],
  // nature
  [`                classLevel: "KG",
                difficulty: "Easy",
                dateAdded: "2026-10-02",
                folderId: "earlier",
                cardIcon: "&#x1F33F;",`,
   `                classLevels: ["KG"],
                difficulty: "Easy",
                dateAdded: "2026-10-02",
                folderId: "earlier",
                cardIcon: "&#x1F33F;",`],
  // islamiat
  [`                classLevel: "KG",
                difficulty: "Easy",
                dateAdded: "2026-10-02",
                folderId: "earlier",
                cardIcon: "&#x262A;&#xFE0F;",`,
   `                classLevels: ["KG"],
                difficulty: "Easy",
                dateAdded: "2026-10-02",
                folderId: "earlier",
                cardIcon: "&#x262A;&#xFE0F;",`],
  // numberNinjas
  [`                classLevel: "Class II",
                difficulty: "Medium",
                dateAdded: "2026-10-02",`,
   `                classLevels: ["Class II"],
                difficulty: "Medium",
                dateAdded: "2026-10-02",`],
  // grammarChamps
  [`                classLevel: "Class III",
                difficulty: "Medium",
                dateAdded: "2026-10-02",`,
   `                classLevels: ["Class III"],
                difficulty: "Medium",
                dateAdded: "2026-10-02",`],
  // urduDost
  [`                classLevel: "Class I",
                difficulty: "Easy",
                dateAdded: "2026-10-05",`,
   `                classLevels: ["Class I"],
                difficulty: "Easy",
                dateAdded: "2026-10-05",`],
  // smartStarters
  [`                classLevel: "Class I",
                difficulty: "Medium",
                dateAdded: "2026-10-17",`,
   `                classLevels: ["Class I"],
                difficulty: "Medium",
                dateAdded: "2026-10-17",`],
  // greenThumbs
  [`                classLevel: "Class I",
                difficulty: "Easy",
                dateAdded: "2026-10-20",`,
   `                classLevels: ["Class I"],
                difficulty: "Easy",
                dateAdded: "2026-10-20",`],
];

for (const [from, to] of replacements) {
  if (!content.includes(from)) {
    console.error('NOT FOUND:', JSON.stringify(from.slice(0, 60)));
    throw new Error('String not found!');
  }
  content = content.replace(from, to);
}

console.log('classLevel strings replaced in worksheetsConfig');

fs.writeFileSync('KCI_TableOf2_App/index.html', content, 'utf8');
console.log('Saved Part B step 1');
