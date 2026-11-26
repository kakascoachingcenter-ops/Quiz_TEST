const fs = require('fs');

let html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

// Replace the broken Lenis block with a clean, robust, syntax-error-free initialization
const oldLenisBlock = `        // Sync Lenis with GSAP ScrollTrigger if present
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(500, 33);
        } else {
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
        } }
        requestAnimationFrame(raf);`;

const newLenisBlock = `        // Sync Lenis with GSAP ScrollTrigger if present
        if (typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(500, 33);
        } else {
            function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
            requestAnimationFrame(raf);
        }`;

html = html.replace(oldLenisBlock, newLenisBlock);

// Also verify date initialization and checkS1Validity
// Ensure that date is populated on DOMContentLoaded as well as immediately, and that checkS1Validity requires only ID
const dateFixTarget = `// Date init (default today: YYYY-MM-DD string for universal cross-browser input[type=date] support)
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
        }`;

const robustDateFix = `// Date init: automatically set today's date cross-browser (never requires manual entry)
        function initAutoDate() {
            const dateEl = document.getElementById('studentDate');
            if (!dateEl) return;
            const now = new Date();
            const yyyy = now.getFullYear();
            const mm = String(now.getMonth() + 1).padStart(2, '0');
            const dd = String(now.getDate()).padStart(2, '0');
            dateEl.value = \`\${yyyy}-\${mm}-\${dd}\`;
            if (!dateEl.value) {
                try { dateEl.valueAsDate = now; } catch(e) {}
            }
        }
        initAutoDate();`;

html = html.replace(dateFixTarget, robustDateFix);

// Also make checkS1Validity ensure that if date is empty for any reason, it automatically sets it
const oldCheckFn = `function checkS1Validity() {
            // Valid if ID is entered and Date is valid.
            // Name is also valid if filled or will be auto-corrected upon submit
            const idVal = studentIdInput.value.trim();
            const dateVal = studentDateInput.value.trim();
            const nameVal = studentNameInput.value.trim();

            const isValid = idVal !== '' && dateVal !== '';
            btnStart.disabled = !isValid;
            btnStart.setAttribute('aria-disabled', !isValid);`;

const newCheckFn = `function checkS1Validity() {
            // Ensure date is automatically filled with today's date
            if (!studentDateInput.value) {
                initAutoDate();
            }

            const idVal = studentIdInput.value.trim();
            const dateVal = studentDateInput.value.trim();

            // Button is enabled as soon as a student ID is typed
            const isValid = idVal.length > 0;
            btnStart.disabled = !isValid;
            btnStart.setAttribute('aria-disabled', !isValid);`;

html = html.replace(oldCheckFn, newCheckFn);

fs.writeFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', html, 'utf8');
console.log('Fixed syntax error and date auto-setting!');
