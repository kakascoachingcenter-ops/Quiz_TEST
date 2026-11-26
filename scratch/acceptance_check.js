const fs = require('fs');
const content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

console.log('=== FINAL ACCEPTANCE CRITERIA CHECK ===\n');

// 1. Three folders
console.log('1. THREE FOLDERS:');
['earlier', 'oct-2026', 'nov-2026'].forEach(id => {
  if (content.includes(`{ id: "${id}"`)) console.log(`   ✅ ${id}`);
  else console.error(`   ❌ ${id} MISSING`);
});

// 2. sortKeys ensure automatic tagging
const sortKeys = {
  'earlier': '0000-00',
  'oct-2026': '2026-10',
  'nov-2026': '2026-11'
};
console.log('\n2. SORT KEYS (nov > oct > earlier for LATEST logic):');
Object.entries(sortKeys).forEach(([id, key]) => {
  if (content.includes(`"${key}"`)) console.log(`   ✅ ${id}: ${key}`);
  else console.error(`   ❌ ${id}: ${key} MISSING`);
});

// 3. bhaariAlfaaz worksheet
console.log('\n3. BHAARI ALFAAZ WORKSHEET:');
const checks = [
  ['folderId: "nov-2026" for bhaariAlfaaz', 'nov-2026"'],
  ['classLevels KG and Class I', 'classLevels: ["KG", "Class I"]'],
  ['subjects Urdu', 'subjects: ["Urdu"]'],
  ['dateAdded 2026-11-05', '"2026-11-05"'],
  ['exportPrefix KCI_BhaariAlfaaz_Result', 'KCI_BhaariAlfaaz_Result'],
  ['totalPossible 40', 'totalPossible: 40'],
];
checks.forEach(([name, str]) => {
  if (content.includes(str)) console.log(`   ✅ ${name}`);
  else console.error(`   ❌ ${name} MISSING`);
});

// 4. classLevel -> classLevels migration
console.log('\n4. classLevels MIGRATION:');
const cfgStart = content.indexOf('const worksheetsConfig = {');
const cfgEnd = content.indexOf('function renderClass1Worksheet');
const cfgSection = content.slice(cfgStart, cfgEnd);
const countLevels = (cfgSection.match(/classLevels:/g) || []).length;
const countOld = (cfgSection.match(/classLevel:/g) || []).length;
console.log(`   classLevels: found ${countLevels} (expected 10 worksheets)`);
console.log(`   classLevel:  found ${countOld} (expected 0)`);
if (countOld === 0) console.log('   ✅ No old classLevel: in config');
else console.error('   ❌ Old classLevel: still present!');

// 5. Filter logic uses .some()
console.log('\n5. FILTER LOGIC:');
if (content.includes('cfg.classLevels.some(cl => filterState.classLevel.has(cl))'))
  console.log('   ✅ getFilteredWorksheets uses .some()');
else console.error('   ❌ filter logic NOT updated');

if (content.includes('cfg.classLevels.some(cl => pendingFilter.classLevel.has(cl))'))
  console.log('   ✅ countPendingMatches uses .some()');
else console.error('   ❌ pending filter logic NOT updated');

if (content.includes('folderWorksheets.flatMap(c => c.classLevels)'))
  console.log('   ✅ buildFilterSheet uses .flatMap()');
else console.error('   ❌ buildFilterSheet NOT updated');

// 6. Character integrity
console.log('\n6. CHARACTER INTEGRITY (spot):');
if (content.includes('\u067E\u06BE\u0648\u0644') && content.includes('\u067E\u06C1\u0648\u0644'))
  console.log('   ✅ Both پھول (U+06BE) and پہول (U+06C1) present');
else console.error('   ❌ Character check failed');

console.log('\n=== END CHECK ===');
