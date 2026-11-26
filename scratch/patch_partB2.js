const fs = require('fs');
let content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// =====================================================================
// PART B step 2: Fix filter logic - getFilteredWorksheets
// OLD: filterState.classLevel.has(cfg.classLevel)
// NEW: cfg.classLevels.some(cl => filterState.classLevel.has(cl))
// =====================================================================

// Fix in getFilteredWorksheets()
content = content.replace(
  `const classOk = filterState.classLevel.size === 0 || 
                        filterState.classLevel.has(cfg.classLevel);`,
  `const classOk = filterState.classLevel.size === 0 || 
                        cfg.classLevels.some(cl => filterState.classLevel.has(cl));`
);

// Fix in countPendingMatches()
content = content.replace(
  `const classOk = pendingFilter.classLevel.size === 0 || 
                        pendingFilter.classLevel.has(cfg.classLevel);`,
  `const classOk = pendingFilter.classLevel.size === 0 || 
                        cfg.classLevels.some(cl => pendingFilter.classLevel.has(cl));`
);

console.log('Filter logic updated');

// =====================================================================
// PART B step 3: Fix card rendering - one chip per classLevel
// OLD: <span ...>${cfg.classLevel}</span>
// NEW: one chip per classLevels item
// =====================================================================
content = content.replace(
  `                        <div class="flex flex-wrap gap-1 justify-center mb-3">
                            \${subjectChips}
                            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-lightBlue text-navy border border-blue-200">\${cfg.classLevel}</span>
                            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-lightBlue text-navy border border-blue-200">\${cfg.difficulty}</span>
                        </div>`,
  `                        <div class="flex flex-wrap gap-1 justify-center mb-3">
                            \${subjectChips}
                            \${cfg.classLevels.map(cl => \`<span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-lightBlue text-navy border border-blue-200">\${cl}</span>\`).join(' ')}
                            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-lightBlue text-navy border border-blue-200">\${cfg.difficulty}</span>
                        </div>`
);

console.log('Card chips updated');

// =====================================================================
// PART B step 4: Fix buildFilterSheet - classLevels collection
// OLD: folderWorksheets.map(c => c.classLevel)
// NEW: collect from classLevels array
// =====================================================================
content = content.replace(
  `            const classLevels = [...new Set(folderWorksheets.map(c => c.classLevel))];`,
  `            const classLevels = [...new Set(folderWorksheets.flatMap(c => c.classLevels))];`
);

console.log('buildFilterSheet classLevels collection updated');

// Verify no raw cfg.classLevel remain (outside of classLevels)
const remaining = [];
let pos = 0;
while (true) {
  const idx = content.indexOf('cfg.classLevel', pos);
  if (idx === -1) break;
  remaining.push({ idx, ctx: content.slice(Math.max(0, idx-20), idx+50) });
  pos = idx + 1;
}
if (remaining.length > 0) {
  console.warn('WARNING: remaining cfg.classLevel occurrences:');
  remaining.forEach(r => console.warn(r.idx, r.ctx));
} else {
  console.log('✅ No stray cfg.classLevel references remain');
}

fs.writeFileSync('KCI_TableOf2_App/index.html', content, 'utf8');
console.log('Saved Part B step 2-4');
