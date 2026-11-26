const fs = require('fs');
let content = fs.readFileSync('KCI_TableOf2_App/index.html', 'utf8');

// =====================================================================
// PART C step 4: Wire validation for bhaariAlfaaz
// Add after: "Validate Urdu Dost: every ud-question must have a ud-opt selected"
// =====================================================================
const urduDostValidation = `                // Validate Urdu Dost: every ud-question must have a ud-opt selected
                if (state.currentWorksheetId === 'urduDost') {
                    document.querySelectorAll(\`\${activeContainer} .ud-question\`).forEach(q => {
                        const selected = q.querySelector('.ud-opt.selected');
                        if (!selected) {
                            isValid = false;
                            q.classList.add('pill-error');
                            if (!firstInvalid) firstInvalid = q;
                        }
                    });
                }`;

const bhaariValidation = `                // Validate Urdu Dost: every ud-question must have a ud-opt selected
                if (state.currentWorksheetId === 'urduDost') {
                    document.querySelectorAll(\`\${activeContainer} .ud-question\`).forEach(q => {
                        const selected = q.querySelector('.ud-opt.selected');
                        if (!selected) {
                            isValid = false;
                            q.classList.add('pill-error');
                            if (!firstInvalid) firstInvalid = q;
                        }
                    });
                }

                // Validate Bhaari Alfaaz: every ud-question must have a ud-opt selected
                if (state.currentWorksheetId === 'bhaariAlfaaz') {
                    document.querySelectorAll(\`\${activeContainer} .ud-question\`).forEach(q => {
                        const selected = q.querySelector('.ud-opt.selected');
                        if (!selected) {
                            isValid = false;
                            q.classList.add('pill-error');
                            if (!firstInvalid) firstInvalid = q;
                        }
                    });
                }`;

if (!content.includes(urduDostValidation)) {
  throw new Error('urduDostValidation marker not found!');
}
content = content.replace(urduDostValidation, bhaariValidation);
console.log('Validation for bhaariAlfaaz added');

// =====================================================================
// PART C step 5: Wire grading dispatch
// =====================================================================
const gradingDispatch = `                else if (state.currentWorksheetId === 'urduDost') gradeWorksheetUrduDost();
                else if (state.currentWorksheetId === 'smartStarters') gradeWorksheetSmartStarters();
                else if (state.currentWorksheetId === 'greenThumbs') gradeWorksheetGreenThumbs();`;

const gradingDispatchNew = `                else if (state.currentWorksheetId === 'urduDost') gradeWorksheetUrduDost();
                else if (state.currentWorksheetId === 'bhaariAlfaaz') gradeWorksheetBhaariAlfaaz();
                else if (state.currentWorksheetId === 'smartStarters') gradeWorksheetSmartStarters();
                else if (state.currentWorksheetId === 'greenThumbs') gradeWorksheetGreenThumbs();`;

if (!content.includes(gradingDispatch)) {
  throw new Error('gradingDispatch marker not found!');
}
content = content.replace(gradingDispatch, gradingDispatchNew);
console.log('Grading dispatch for bhaariAlfaaz added');

fs.writeFileSync('KCI_TableOf2_App/index.html', content, 'utf8');
console.log('Saved Part C step 4-5');
