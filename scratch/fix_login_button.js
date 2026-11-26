const fs = require('fs');

let html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

// Locate checkS1Validity block
const oldBlockStart = html.indexOf('// Date init (default today)');
const oldBlockEnd = html.indexOf('// Student ID Card Damped Pendulum Swing on load');

const newBlock = `// Date init (default today: YYYY-MM-DD string for universal cross-browser input[type=date] support)
        const dateInput = document.getElementById('studentDate');
        if (dateInput) {
            try {
                const today = new Date();
                const yyyy = today.getFullYear();
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const dd = String(today.getDate()).padStart(2, '0');
                dateInput.value = \`\${yyyy}-\${mm}-\${dd}\`;
            } catch(e) {
                dateInput.valueAsDate = new Date();
            }
        }

        // ----------------------------------------------------
        // SCREEN 1: Validation and Transitions
        // ----------------------------------------------------
        const studentIdInput = document.getElementById('studentId');
        const studentNameInput = document.getElementById('studentName');
        const studentDateInput = document.getElementById('studentDate');
        const s1Inputs = [studentNameInput, studentIdInput, studentDateInput];
        const btnStart = document.getElementById('btn-start');

        // Allow only numeric in studentId dynamically and auto-fill student name if recognized
        studentIdInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            
            const numVal = parseInt(this.value.trim());
            if (!isNaN(numVal)) {
                const matched = studentRoster.find(s => s.id === numVal);
                if (matched && (!studentNameInput.value.trim() || studentNameInput.dataset.autofilled === 'true')) {
                    studentNameInput.value = matched.name;
                    studentNameInput.dataset.autofilled = 'true';
                }
            } else if (studentNameInput.dataset.autofilled === 'true') {
                studentNameInput.value = '';
                studentNameInput.dataset.autofilled = 'false';
            }
            checkS1Validity();
        });

        // If user manually modifies name, untag autofilled
        studentNameInput.addEventListener('input', function() {
            this.dataset.autofilled = 'false';
        });

        s1Inputs.forEach(input => {
            if (input) {
                input.addEventListener('input', checkS1Validity);
                input.addEventListener('change', checkS1Validity);
                input.addEventListener('blur', checkS1Validity);
            }
        });

        function checkS1Validity() {
            // Valid if ID is entered and Date is valid.
            // Name is also valid if filled or will be auto-corrected upon submit
            const idVal = studentIdInput.value.trim();
            const dateVal = studentDateInput.value.trim();
            const nameVal = studentNameInput.value.trim();

            const isValid = idVal !== '' && dateVal !== '';
            btnStart.disabled = !isValid;
            btnStart.setAttribute('aria-disabled', !isValid);
            
            // Clear any active errors when user edits fields
            const errorContainer = document.getElementById('login-error');
            if (errorContainer && !errorContainer.classList.contains('hidden')) {
                errorContainer.classList.add('hidden');
                studentIdInput.classList.remove('input-error');
            }
        }

        // Ensure validity check runs right on init
        checkS1Validity();

        `;

html = html.slice(0, oldBlockStart) + newBlock + html.slice(oldBlockEnd);

fs.writeFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', html, 'utf8');
console.log('Fixed date formatting, auto-fill, and button enablement!');
