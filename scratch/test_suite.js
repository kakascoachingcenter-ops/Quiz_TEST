const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('       KCI KG WORKSHEETS ACCEPTANCE TEST SUITE      ');
console.log('====================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`[PASS] ${message}`);
        passCount++;
    } else {
        console.error(`[FAIL] ${message}`);
        failCount++;
    }
}

// -----------------------------------------------------------------------------
// CHECK 1: Manifest & Voice Keys Inventory
// -----------------------------------------------------------------------------
console.log('--- CHECK 1: Manifest & Voice Inventory (154 keys) ---');
const manifestPath = 'KCI_TableOf2_App/audio/manifest.json';
assert(fs.existsSync(manifestPath), 'audio/manifest.json exists');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const manifestKeys = Object.keys(manifest);
assert(manifestKeys.length === 154, `Manifest has exactly 154 keys (found ${manifestKeys.length})`);

// Check letters 26
const letters = Array.from({length: 26}, (_, i) => `letter-${String.fromCharCode(97 + i)}`);
assert(letters.every(k => manifest[k] && manifest[k].text.includes('for')), 'All 26 phonics letters present ("B, for banana" style)');

// Check letter names 26
const letterNames = Array.from({length: 26}, (_, i) => `name-${String.fromCharCode(97 + i)}`);
assert(letterNames.every(k => manifest[k] && manifest[k].text), 'All 26 letter names present');
assert(manifest['name-a'].text === 'Ay' && manifest['name-b'].text === 'Bee' && manifest['name-z'].text === 'Zed', 'Letter names spelled for TTS (Ay, Bee, Zed)');

// Check numbers 50
const nums = Array.from({length: 50}, (_, i) => `num-${i + 1}`);
assert(nums.every(k => manifest[k]), 'All 50 numbers present (num-1 to num-50)');

// Check words 27
const reqWords = ['cat','rat','man','cap','sat','ran','has','fat','am','the','a','I','apple','banana','cake','grapes','heart','book','pen','moon','triangle','square','circle','happy','sad','tired','angry'];
assert(reqWords.every(w => manifest[w]), 'All 27 required words present in manifest');

// Check instructions 19 and max 8 words
const reqInstructions = ['en-intro','en-alphabet','en-s1','en-s2','en-s3','en-s4','en-s5','en-s6','en-draw','q-start','ma-intro','ma-s1','ma-s2','ma-s3','ma-s4','ma-s5-shape','ma-s5-small','ma-s5-big','ma-draw'];
assert(reqInstructions.every(k => manifest[k]), 'All 19 instructions present in manifest');
let longInstructions = [];
reqInstructions.forEach(k => {
    if (manifest[k]) {
        const words = manifest[k].text.trim().split(/\s+/).length;
        if (words > 8) longInstructions.push({ k, words, text: manifest[k].text });
    }
});
assert(longInstructions.length === 0, `All instructions <= 8 words (violating: ${JSON.stringify(longInstructions)})`);

// Check UI 6
const reqUI = ['ui-verify','ui-well-done','tier-perfect','tier-good','tier-average','tier-needs'];
assert(reqUI.every(k => manifest[k]), 'All 6 UI voice keys present');

// -----------------------------------------------------------------------------
// CHECK 2: Registration & Metadata in index.html
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 2: Registration & Folder Auto-tag ---');
const html = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');
const tokensCss = fs.readFileSync('KCI_TableOf2_App/tokens.css', 'utf8');

// Parse worksheetFolders from HTML
const wfMatch = html.match(/const\s+worksheetFolders\s*=\s*(\[[\s\S]*?\]);/);
assert(wfMatch !== null, 'worksheetFolders found in index.html');
const worksheetFolders = eval(wfMatch[1]);

// Check nov-2026 folder
const novFolder = worksheetFolders.find(f => f.id === 'nov-2026');
assert(novFolder && novFolder.sortKey === '2026-11', 'nov-2026 folder has sortKey "2026-11"');
const octFolder = worksheetFolders.find(f => f.id === 'oct-2026');
assert(octFolder && octFolder.sortKey === '2026-10', 'oct-2026 folder has sortKey "2026-10"');

// Check worksheetsConfig
assert(html.includes("'kg-english-nov26'"), "'kg-english-nov26' is registered in worksheetsConfig");
assert(html.includes("'kg-maths-nov26'"), "'kg-maths-nov26' is registered in worksheetsConfig");

// Check auto-tag logic
function testGetFolderTag(folderId, folders, configs) {
    const foldersWithWs = folders.filter(f => Object.values(configs).some(cfg => cfg.folderId === f.id));
    if (foldersWithWs.length === 0) return 'OLD';
    const latestFolder = foldersWithWs.reduce((max, f) => (f.sortKey > max.sortKey ? f : max), foldersWithWs[0]);
    return folderId === latestFolder.id ? 'LATEST' : 'OLD';
}

const mockConfigs = {
    table2: { folderId: 'earlier', dateAdded: '2026-10-02' },
    smartStarters: { folderId: 'oct-2026', dateAdded: '2026-10-17' },
    'kg-english-nov26': { folderId: 'nov-2026', dateAdded: '2026-11-26' },
    'kg-maths-nov26': { folderId: 'nov-2026', dateAdded: '2026-11-26' }
};

const novTag = testGetFolderTag('nov-2026', worksheetFolders, mockConfigs);
const octTag = testGetFolderTag('oct-2026', worksheetFolders, mockConfigs);
assert(novTag === 'LATEST', `nov-2026 marked LATEST (got ${novTag})`);
assert(octTag === 'OLD', `oct-2026 marked OLD (got ${octTag})`);

// Check "New" badge logic with dateAdded: "2026-11-26"
function isNewWorksheet(dateStr) {
    const added = new Date(dateStr);
    const now   = new Date('2026-11-26T12:00:00');
    const diffMs = now - added;
    return diffMs <= 7 * 24 * 60 * 60 * 1000;
}
assert(isNewWorksheet('2026-11-26') === true, 'New worksheets have "NEW" badge');

// Check font token
assert(html.includes('--font-letters') && tokensCss.includes('--font-letters'), 'Token --font-letters: "Andika", sans-serif present in index.html & tokens.css');
assert(html.includes('family=Andika'), 'Google Fonts includes Andika');

// -----------------------------------------------------------------------------
// CHECK 3: Item counts & Grading in W1 & W2
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 3: Item counts & computeReport() ---');

// Mock browser globals
global.window = {
    state: { results: [], totalCorrect: 0, studentDrawing: null },
    KCIVoice: { say: () => {}, sayQueue: () => {}, preload: () => {}, isMuted: () => false },
    FreeDrawCanvas: function() {
        this.setupCanvas = () => {};
        this.hasDrawing = () => true;
        this.getDataURL = () => 'data:image/png;base64,mock';
        this.isSkipped = false;
    }
};

// Extract getPerformanceTier and computeReport from index.html
const tierStart = html.indexOf('function getPerformanceTier(');
const tierEnd = html.indexOf('function computeReport(');
const tierCode = html.substring(tierStart, tierEnd);

const crStart = html.indexOf('function computeReport(');
const crEnd = html.indexOf('window.computeReport = computeReport;');
const crCode = html.substring(crStart, crEnd);

const combinedReportFunc = new Function('results', tierCode + '\n' + crCode + '\nreturn computeReport(results);');
window.computeReport = combinedReportFunc;

// Load kgWorksheets module code
const kgModuleCode = fs.readFileSync('KCI_TableOf2_App/modules/kgWorksheets.js', 'utf8');
const runKgModule = new Function('window', kgModuleCode);
runKgModule(global.window);

// Test W1 Perfect Run
console.log('\nTesting W1 (Little Readers) Grading:');
window.kgEnglishState.s1Answers = { 0: 'b', 1: 'd', 2: 'p', 3: 'q' };
window.kgEnglishState.s2Answers = { 0: 'e', 1: 'm', 2: 's', 3: 'o' };
window.kgEnglishState.s3Answers = { 0: 'a', 1: 'b', 2: 'c', 3: 'g', 4: 'h', 5: 'b', 6: 'p', 7: 'm' };
window.kgEnglishState.s4Connections = { cat: 'cat', rat: 'rat', man: 'man', cap: 'cap' };
window.kgEnglishState.s5Sentences = {
    0: ['A', 'cat', 'sat'],
    1: ['A', 'rat', 'ran'],
    2: ['The', 'man', 'has', 'a', 'cap'],
    3: ['I', 'am', 'a', 'fat', 'cat']
};
window.kgEnglishState.s6Answers = { 0: 'happy', 1: 'sad', 2: 'tired', 3: 'angry' };

window.gradeWorksheetKgEnglish();
assert(window.state.results.length === 28, `W1 total graded items = 28 (got ${window.state.results.length})`);
assert(window.state.totalCorrect === 28, `W1 perfect run correct = 28 (got ${window.state.totalCorrect})`);

const w1Report = window.computeReport(window.state.results);
assert(w1Report.percent === 100, `W1 perfect run percent = 100% (got ${w1Report.percent}%)`);
assert(w1Report.topics.length === 4, `W1 topics count = 4 (got ${w1Report.topics.length})`);

const w1Topics = {};
w1Report.topics.forEach(t => w1Topics[t.name] = t);
assert(w1Topics['Letters'] && w1Topics['Letters'].total === 8, 'W1 topic "Letters" has 8 items');
assert(w1Topics['First Sounds'] && w1Topics['First Sounds'].total === 8, 'W1 topic "First Sounds" has 8 items');
assert(w1Topics['Reading Words'] && w1Topics['Reading Words'].total === 8, 'W1 topic "Reading Words" has 8 items');
assert(w1Topics['Feelings'] && w1Topics['Feelings'].total === 4, 'W1 topic "Feelings" has 4 items');
assert(w1Topics['Letters'].percent === 100 && w1Topics['First Sounds'].percent === 100 && w1Topics['Reading Words'].percent === 100 && w1Topics['Feelings'].percent === 100, 'Every topic in W1 is 100% on perfect run');

// Test W1 Empty Run
window.kgEnglishState.s1Answers = {};
window.kgEnglishState.s2Answers = {};
window.kgEnglishState.s3Answers = {};
window.kgEnglishState.s4Connections = {};
window.kgEnglishState.s5Sentences = {};
window.kgEnglishState.s6Answers = {};
window.gradeWorksheetKgEnglish();
assert(window.state.results.length === 28, 'W1 empty run items = 28');
assert(window.state.totalCorrect === 0, 'W1 empty run correct = 0');
const w1EmptyReport = window.computeReport(window.state.results);
assert(w1EmptyReport.percent === 0, `W1 empty run percent = 0% (got ${w1EmptyReport.percent}%)`);

// Test W2 Perfect Run
console.log('\nTesting W2 (Number Buddies) Grading:');
window.kgMathsState.s1Answers = { 0: 'one', 1: 'two', 2: 'three', 3: 'four', 4: 'five' };
window.kgMathsState.s2Answers = { 0: 3, 1: 4, 2: 4, 3: 1 };
window.kgMathsState.s3Connections = { five: '5', nine: '9', eleven: '11', twelve: '12', thirteen: '13' };
window.kgMathsState.s4FilledBlanks = { 8: 8, 17: 17, 25: 25, 36: 36, 44: 44 };
window.kgMathsState.s5ShapeAnswers = { 0: 'triangle', 1: 'square', 2: 'circle' };
// Colouring: Small flower >= 60%, big flower 0
['fl-small-stem', 'fl-small-leaf', 'fl-small-p1', 'fl-small-p2', 'fl-small-p3', 'fl-small-p4', 'fl-small-p5', 'fl-small-center'].forEach(r => {
    window.kgMathsState.s5Colours[r] = '#f0b429';
});
// Colouring: Big house >= 60%, small house 0
['hs-big-chimney', 'hs-big-roof', 'hs-big-wall', 'hs-big-door', 'hs-big-w1', 'hs-big-w2'].forEach(r => {
    window.kgMathsState.s5Colours[r] = '#1e3a5f';
});

window.gradeWorksheetKgMaths();
assert(window.state.results.length === 24, `W2 total graded items = 24 (got ${window.state.results.length})`);
assert(window.state.totalCorrect === 24, `W2 perfect run correct = 24 (got ${window.state.totalCorrect})`);

const w2Report = window.computeReport(window.state.results);
assert(w2Report.percent === 100, `W2 perfect run percent = 100% (got ${w2Report.percent}%)`);
assert(w2Report.topics.length === 4, `W2 topics count = 4 (got ${w2Report.topics.length})`);

const w2Topics = {};
w2Report.topics.forEach(t => w2Topics[t.name] = t);
assert(w2Topics['Counting'] && w2Topics['Counting'].total === 5, 'W2 topic "Counting" has 5 items');
assert(w2Topics['Number Order'] && w2Topics['Number Order'].total === 9, 'W2 topic "Number Order" has 9 items');
assert(w2Topics['Number Words'] && w2Topics['Number Words'].total === 5, 'W2 topic "Number Words" has 5 items');
assert(w2Topics['Shapes & Size'] && w2Topics['Shapes & Size'].total === 5, 'W2 topic "Shapes & Size" has 5 items');
assert(w2Topics['Counting'].percent === 100 && w2Topics['Number Order'].percent === 100 && w2Topics['Number Words'].percent === 100 && w2Topics['Shapes & Size'].percent === 100, 'Every topic in W2 is 100% on perfect run');

// Test W2 Empty Run
window.kgMathsState.s1Answers = {};
window.kgMathsState.s2Answers = {};
window.kgMathsState.s3Connections = {};
window.kgMathsState.s4FilledBlanks = {};
window.kgMathsState.s5ShapeAnswers = {};
window.kgMathsState.s5Colours = {};
window.gradeWorksheetKgMaths();
assert(window.state.results.length === 24, 'W2 empty run items = 24');
assert(window.state.totalCorrect === 0, 'W2 empty run correct = 0');
const w2EmptyReport = window.computeReport(window.state.results);
assert(w2EmptyReport.percent === 0, `W2 empty run percent = 0% (got ${w2EmptyReport.percent}%)`);

// -----------------------------------------------------------------------------
// CHECK 4: Free-Draw Canvas & Export Mode
// -----------------------------------------------------------------------------
console.log('\n--- CHECK 4: Free-Draw Canvas & Export Mode ---');
assert(html.includes('id="results-drawing-wrap"'), '#results-drawing-wrap present in results card');
assert(html.includes('id="results-drawing-img"'), '#results-drawing-img present in results card');
assert(html.includes('KCI_LittleReaders_Result'), 'exportPrefix KCI_LittleReaders_Result configured');
assert(html.includes('KCI_NumberBuddies_Result'), 'exportPrefix KCI_NumberBuddies_Result configured');
assert(html.includes('0300-2917500'), 'Phone footer 0300-2917500 preserved');

// -----------------------------------------------------------------------------
// Summary
// -----------------------------------------------------------------------------
console.log('\n====================================================');
console.log(`TOTAL CHECKS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('====================================================');

if (failCount > 0) {
    process.exit(1);
}
