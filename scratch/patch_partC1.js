const fs = require('fs');
let content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// =====================================================================
// PART C step 1: Add bhaariAlfaaz to worksheetsConfig
// Insert AFTER greenThumbs config entry
// =====================================================================

const greenThumbsEnd = `                cardDesc: "Parts of a plant, what they do, and how plants make food"
            }
        };`;

const newConfigEntry = `                cardDesc: "Parts of a plant, what they do, and how plants make food"
            },
            bhaariAlfaaz: {
                title: "\uD83C\uDFB5 \u0628\u06BE\u0627\u0631\u06CC \u0627\u0644\u0641\u0627\u0638 \u2014 Heavy Words",
                exportPrefix: "KCI_BhaariAlfaaz_Result",
                totalPossible: 40,
                render: renderBhaariAlfaazWorksheet,
                subjects: ["Urdu"],
                classLevels: ["KG", "Class I"],
                difficulty: "Easy",
                dateAdded: "2026-11-05",
                folderId: "nov-2026",
                cardIcon: "\uD83C\uDFB5",
                cardDesc: \`<span class='font-nastaliq' lang='ur' dir='rtl' style='display:block; font-size:1.05rem; line-height:2;'>\u062F\u0648 \u0686\u0634\u0645\u06CC \u06BE \u0648\u0627\u0644\u06D2 \u0627\u0644\u0641\u0627\u0638</span><span style='font-size:0.85em;'>Words with the heavy \u06BE sound</span>\`
            }
        };`;

if (!content.includes(greenThumbsEnd)) {
  throw new Error('greenThumbsEnd marker not found!');
}
content = content.replace(greenThumbsEnd, newConfigEntry);
console.log('bhaariAlfaaz config entry added');

fs.writeFileSync('KCI_TableOf2_App/index.html', content, 'utf8');
console.log('Saved Part C step 1');
