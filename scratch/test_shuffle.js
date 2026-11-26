const fs = require('fs');

global.window = {
    state: { results: [], totalCorrect: 0, studentDrawing: null },
    KCIVoice: { say: () => {}, sayQueue: () => {}, preload: () => {}, isMuted: () => false },
    FreeDrawCanvas: function() {
        this.setupCanvas = () => {};
        this.hasDrawing = () => false;
        this.getDataURL = () => null;
        this.isSkipped = false;
    }
};

const kgModuleCode = fs.readFileSync('KCI_TableOf2_App/modules/kgWorksheets.js', 'utf8');
const runKgModule = new Function('window', kgModuleCode);
runKgModule(global.window);

// Test W1 S1 options shuffling
const html = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');
const tierStart = html.indexOf('function getPerformanceTier(');
const tierEnd = html.indexOf('function computeReport(');
const tierCode = html.substring(tierStart, tierEnd);

const crStart = html.indexOf('function computeReport(');
const crEnd = html.indexOf('window.computeReport = computeReport;');
const crCode = html.substring(crStart, crEnd);

const combinedReportFunc = new Function('results', tierCode + '\n' + crCode + '\nreturn computeReport(results);');
window.computeReport = combinedReportFunc;

// Simulate attempt 1 with correct answers
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
const attempt1Correct = window.state.totalCorrect;
const attempt1Total = window.state.results.length;

// Attempt 2: reset and regrade with same answers
window.state.results = [];
window.state.totalCorrect = 0;
window.gradeWorksheetKgEnglish();
const attempt2Correct = window.state.totalCorrect;
const attempt2Total = window.state.results.length;

console.log('Attempt 1 Correct:', attempt1Correct, '/', attempt1Total);
console.log('Attempt 2 Correct:', attempt2Correct, '/', attempt2Total);

if (attempt1Correct === 28 && attempt2Correct === 28) {
    console.log('[PASS] Same answers yield exact same 28/28 grading across attempts!');
} else {
    console.error('[FAIL] Grading differed between attempts');
    process.exit(1);
}
