# Injecting data-topic into grading helpers and results.push

$filePath = "f:\Tution\Worksheets\Webs\KCI_TableOf2_App\index.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# 1. Update gradeInputs
$old_gradeInputs = @'
        const gradeInputs = (selector, sectionName, getQText) => {
            document.querySelectorAll(selector).forEach((input, index) => {
                const uAns = input.value.trim();
                const cAns = input.dataset.ans;
                if (!cAns) return; // Skip ungraded items
                const isCorrect = uAns.toLowerCase() === cAns.toLowerCase();
                if(isCorrect) state.totalCorrect++;
                
                state.results.push({
                    q: getQText ? getQText(input, index) : `Blank ${index+1}`,
                    userAns: uAns,
                    correctAns: cAns,
                    isCorrect: isCorrect,
                    section: sectionName
                });
            });
        };
'@
$new_gradeInputs = @'
        const gradeInputs = (selector, sectionName, getQText) => {
            document.querySelectorAll(selector).forEach((input, index) => {
                const uAns = input.value.trim();
                const cAns = input.dataset.ans;
                if (!cAns) return; // Skip ungraded items
                const isCorrect = uAns.toLowerCase() === cAns.toLowerCase();
                if(isCorrect) state.totalCorrect++;
                
                const qWrapper = input.closest('.s4-question') || input.closest('.section-card') || input;
                const topic = qWrapper.dataset.topic || "General";

                state.results.push({
                    q: getQText ? getQText(input, index) : `Blank ${index+1}`,
                    userAns: uAns,
                    correctAns: cAns,
                    isCorrect: isCorrect,
                    section: sectionName,
                    topic: topic
                });
            });
        };
'@

# 2. Update gradePills
$old_gradePills = @'
        const gradePills = (selector, sectionName) => {
            document.querySelectorAll(selector).forEach(q => {
                const qTextEl = q.querySelector('.font-baloo');
                const qText = qTextEl ? qTextEl.innerText.trim().replace(/ ?\?$/, '') + ' ?' : 'Question';
                const cAns = q.dataset.ans;
                const selectedPill = q.querySelector('.selected');
                const uAns = selectedPill ? selectedPill.innerText.replace(/[^a-zA-Z -]/g, '').trim() : 'None';
                // For exact matches checking, especially on pills with emojis:
                let isCorrect = uAns === cAns;
                if (selectedPill && selectedPill.dataset.val) {
                    isCorrect = selectedPill.dataset.val === cAns;
                } else if (uAns.includes(cAns)) {
                    isCorrect = true; // basic fallback for emoji inclusion
                }

                if(isCorrect) state.totalCorrect++;
                
                state.results.push({
                    q: qText,
                    userAns: selectedPill ? selectedPill.innerText.trim() : 'None',
                    correctAns: cAns,
                    isCorrect: isCorrect,
                    section: sectionName
                });
            });
        };
'@
$new_gradePills = @'
        const gradePills = (selector, sectionName) => {
            document.querySelectorAll(selector).forEach(q => {
                const qTextEl = q.querySelector('.font-baloo');
                const qText = qTextEl ? qTextEl.innerText.trim().replace(/ ?\?$/, '') + ' ?' : 'Question';
                const cAns = q.dataset.ans;
                const selectedPill = q.querySelector('.selected');
                const uAns = selectedPill ? selectedPill.innerText.replace(/[^a-zA-Z -]/g, '').trim() : 'None';
                // For exact matches checking, especially on pills with emojis:
                let isCorrect = uAns === cAns;
                if (selectedPill && selectedPill.dataset.val) {
                    isCorrect = selectedPill.dataset.val === cAns;
                } else if (uAns.includes(cAns)) {
                    isCorrect = true; // basic fallback for emoji inclusion
                }

                if(isCorrect) state.totalCorrect++;
                
                const topic = q.dataset.topic || "General";

                state.results.push({
                    q: qText,
                    userAns: selectedPill ? selectedPill.innerText.trim() : 'None',
                    correctAns: cAns,
                    isCorrect: isCorrect,
                    section: sectionName,
                    topic: topic
                });
            });
        };
'@

# 3. Update gradeIslamiatWorshipGrid
$old_gradeWorship = @'
            state.results.push({
                q: 'Ways to Worship Allah — tap-all-that-apply grid',
                userAns: selectedIds.length ? selectedIds.join(', ') : 'None selected',
                correctAns: correctIds.join(', '),
                isCorrect,
                section: 'Section 3: Ways to Worship Allah'
            });
'@
$new_gradeWorship = @'
            state.results.push({
                q: 'Ways to Worship Allah — tap-all-that-apply grid',
                userAns: selectedIds.length ? selectedIds.join(', ') : 'None selected',
                correctAns: correctIds.join(', '),
                isCorrect,
                section: 'Section 3: Ways to Worship Allah',
                topic: 'Ways to Worship'
            });
'@

# 4. Update gradeIslamiatDragDrop
$old_gradeDragDrop = @'
                state.results.push({
                    q: reviewQ,
                    userAns: userAnsLabel,
                    correctAns: pair.correctLabel,
                    isCorrect,
                    section: 'Section 4: Match the Following'
                });
'@
$new_gradeDragDrop = @'
                state.results.push({
                    q: reviewQ,
                    userAns: userAnsLabel,
                    correctAns: pair.correctLabel,
                    isCorrect,
                    section: 'Section 4: Match the Following',
                    topic: pair.dragId.startsWith('zone') || pair.dragId.includes('eel') ? 'Angels & Books' : 'Prophets'
                });
'@

# 5. Update gradeDigitGroups
$old_gradeDigit = @'
    const gradeDigitGroups = (selector, sectionName, offset) => {
        document.querySelectorAll(selector).forEach((group, index) => {
            const inputs = group.querySelectorAll('.nn-digit');
            let isAllCorrect = true;
            let attemptedCount = 0;
            inputs.forEach(inp => {
                if(inp.value.trim() !== '') attemptedCount++;
                if (inp.value.trim() !== inp.dataset.ans) {
                    isAllCorrect = false;
                }
            });
            if (attemptedCount > 0 && isAllCorrect) {
                state.totalCorrect++;
            }
            if (attemptedCount > 0) {
                state.results.push({
                    q: `Question ${index + offset}`,
                    userAns: isAllCorrect ? 'Correct' : 'Mistakes made',
                    correctAns: 'Correct steps',
                    isCorrect: isAllCorrect,
                    section: sectionName
                });
            }
        });
    };
'@
$new_gradeDigit = @'
    const gradeDigitGroups = (selector, sectionName, offset) => {
        document.querySelectorAll(selector).forEach((group, index) => {
            const inputs = group.querySelectorAll('.nn-digit');
            let isAllCorrect = true;
            let attemptedCount = 0;
            inputs.forEach(inp => {
                if(inp.value.trim() !== '') attemptedCount++;
                if (inp.value.trim() !== inp.dataset.ans) {
                    isAllCorrect = false;
                }
            });
            if (attemptedCount > 0 && isAllCorrect) {
                state.totalCorrect++;
            }
            if (attemptedCount > 0) {
                const topic = group.closest('[data-topic]') ? group.closest('[data-topic]').dataset.topic : "Maths";
                state.results.push({
                    q: `Question ${index + offset}`,
                    userAns: isAllCorrect ? 'Correct' : 'Mistakes made',
                    correctAns: 'Correct steps',
                    isCorrect: isAllCorrect,
                    section: sectionName,
                    topic: topic
                });
            }
        });
    };
'@

$content = $content.Replace($old_gradeInputs, $new_gradeInputs)
$content = $content.Replace($old_gradePills, $new_gradePills)
$content = $content.Replace($old_gradeWorship, $new_gradeWorship)
$content = $content.Replace($old_gradeDragDrop, $new_gradeDragDrop)
$content = $content.Replace($old_gradeDigit, $new_gradeDigit)

[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Helper function data-topic extraction added."
