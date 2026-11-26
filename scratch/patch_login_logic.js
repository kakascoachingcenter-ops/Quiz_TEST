const fs = require('fs');

let html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

// Replace s1Inputs initialization and btnStart handling
const oldS1LogicStart = html.indexOf('const s1Inputs = [document.getElementById(\'studentName\')');
const oldS1LogicEnd = html.indexOf('// ----------------------------------------------------', oldS1LogicStart);

const newS1Logic = `const s1Inputs = [document.getElementById('studentName'), document.getElementById('studentId'), document.getElementById('studentDate')];
        const btnStart = document.getElementById('btn-start');

        // Allow only numeric in studentId dynamically
        document.getElementById('studentId').addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
            checkS1Validity();
        });

        s1Inputs.forEach(input => input.addEventListener('input', checkS1Validity));
        s1Inputs.forEach(input => input.addEventListener('change', checkS1Validity));

        function checkS1Validity() {
            const isValid = s1Inputs.every(input => input.value.trim() !== '');
            btnStart.disabled = !isValid;
            btnStart.setAttribute('aria-disabled', !isValid);
            
            // Clear any active errors when user edits fields
            const errorContainer = document.getElementById('login-error');
            if (errorContainer && !errorContainer.classList.contains('hidden')) {
                errorContainer.classList.add('hidden');
                document.getElementById('studentId').classList.remove('input-error');
            }
        }

        // Student ID Card Damped Pendulum Swing on load
        function initLoginCardAnimation() {
            const card = document.getElementById('login-card');
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion || !card) return;

            gsap.fromTo(card, 
                { rotation: 7, transformOrigin: "top center", y: -40, opacity: 0 },
                { 
                    rotation: 0, 
                    y: 0, 
                    opacity: 1, 
                    duration: 0.9, 
                    ease: "elastic.out(1, 0.45)"
                }
            );
        }
        initLoginCardAnimation();

        btnStart.addEventListener('click', () => {
            const enteredId = document.getElementById('studentId').value.trim();
            const enteredDate = document.getElementById('studentDate').value;
            
            const errorContainer = document.getElementById('login-error');
            const errorText = document.getElementById('login-error-text');
            const nameInput = document.getElementById('studentName');
            const idInput = document.getElementById('studentId');
            const screen1Card = document.getElementById('login-card') || document.querySelector('#screen-1 .bg-white');

            const showError = (msg, fieldsToHighlight) => {
                if (errorText) errorText.innerText = msg;
                else errorContainer.innerText = msg;
                errorContainer.classList.remove('hidden');
                fieldsToHighlight.forEach(el => el.classList.add('input-error'));
                gsap.fromTo(screen1Card, {x: -8}, {x: 8, duration: 0.08, yoyo: true, repeat: 4, onComplete: () => gsap.set(screen1Card, {x: 0})});
            };

            const matchedStudent = studentRoster.find(s => s.id === parseInt(enteredId));
            
            if (!matchedStudent) {
                showError("This ID isn't registered. Please check with your teacher.", [idInput]);
                return;
            }
            
            // Name Correction & Flash
            const typedName = nameInput.value.trim();
            nameInput.value = matchedStudent.name; 
            
            state.student.name = matchedStudent.name; // Use on-file name
            state.student.id = enteredId;
            state.student.date = enteredDate;
            
            // If the name was corrected, show a brief gentle flash before transitioning
            let delayMs = 0;
            if (typedName.toLowerCase() !== matchedStudent.name.toLowerCase()) {
                gsap.fromTo(nameInput, 
                    { backgroundColor: '#e8f5ed', color: '#236340', borderColor: '#3f9b6a' }, 
                    { backgroundColor: 'transparent', color: '#1e3a5f', borderColor: '#cfe0f2', duration: 0.7 }
                );
                delayMs = 0.5;
            }

            // GSAP Transition from S1 -> Selection
            gsap.to('#screen-1', {
                delay: delayMs,
                opacity: 0, y: -20, duration: 0.35, onComplete: () => {
                    document.getElementById('screen-1').classList.remove('active');
                    document.getElementById('screen-selection').classList.add('active');
                    window.scrollTo(0, 0);
                    
                    // Header greeting with canonical roster name
                    const firstName = state.student.name.split(' ')[0];
                    document.getElementById('selection-greeting').innerText = \`Assalam-o-Alaikum, \${state.student.name}!\`;
                    
                    initLibraryUI();

                    gsap.to('#screen-selection', { opacity: 1, duration: 0.1 });
                    document.getElementById('folders-view').style.display = 'block';
                    document.getElementById('folders-view').style.opacity = '1';
                    document.getElementById('folder-detail-view').style.display = 'none';
                    currentOpenedFolderId = null;
                    renderFoldersView();
                }
            });
        });
`;

html = html.slice(0, oldS1LogicStart) + newS1Logic + html.slice(oldS1LogicEnd);

fs.writeFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', html, 'utf8');
console.log('Login logic and pendulum swing animation patched successfully!');
