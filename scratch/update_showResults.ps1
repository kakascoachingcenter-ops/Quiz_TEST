$filePath = "f:\Tution\Worksheets\Webs\KCI_TableOf2_App\index.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Find the start of showResults and the end (which is right before fireConfetti)
$startToken = "        function showResults() {"
$endToken = "        // ----------------------------------------------------`n        // CONFETTI ANIMATION"
$startIdx = $content.IndexOf($startToken)
$endIdx = $content.IndexOf($endToken)

if ($startIdx -lt 0 -or $endIdx -lt 0) {
    Write-Host "Error finding showResults bounds."
    exit 1
}

$newShowResults = @'
        function getPerformanceTier(percentage) {
            if (percentage >= 90) return { label: 'Awesome', tagText: 'Perfect ⭐', colorHex: '#2e7d32' };
            if (percentage >= 70) return { label: 'Good', tagText: 'Good 👍', colorHex: '#1e88e5' };
            if (percentage >= 50) return { label: 'Average', tagText: 'Average 😐', colorHex: '#f0b429' };
            return { label: 'Needs More Work', tagText: 'Needs More Work 📚', colorHex: '#d1453a' };
        }

        function showResults() {
            // Update Subtitle dynamically
            document.getElementById('res-subtitle').innerText = `${worksheetsConfig[state.currentWorksheetId].title} — Results Summary`;
            
            // Populate Student Data
            document.getElementById('res-name').innerText = state.student.name;
            document.getElementById('res-id').innerText = state.student.id;
            
            const d = new Date(state.student.date);
            document.getElementById('res-date').innerText = d.toLocaleDateString();
            
            const overallPct = Math.round((state.totalCorrect / state.totalPossible) * 100);
            const overallTier = getPerformanceTier(overallPct);

            document.getElementById('res-message').innerText = `${overallPct}% — ${overallTier.label}! ${overallTier.tagText.split(' ')[1]}`;
            document.getElementById('res-message').style.backgroundColor = overallTier.colorHex;

            // Group results by topic
            const topics = {};
            state.results.forEach(r => {
                const topic = r.topic || "General";
                if (!topics[topic]) topics[topic] = { correct: 0, total: 0 };
                topics[topic].total++;
                if (r.isCorrect) topics[topic].correct++;
            });

            // Populate Topic Breakdown
            const reviewList = document.getElementById('topic-breakdown-list');
            reviewList.innerHTML = '';

            const weakTopics = [];
            let index = 0;

            for (const [topicName, data] of Object.entries(topics)) {
                const topicPct = Math.round((data.correct / data.total) * 100);
                const tier = getPerformanceTier(topicPct);
                if (topicPct < 70) weakTopics.push(topicName);

                const row = document.createElement('div');
                row.className = 'topic-row flex flex-col gap-2 p-3 bg-white rounded-lg border border-gray-100 shadow-sm';
                
                row.innerHTML = `
                    <div class="flex justify-between items-center text-navy font-bold text-lg font-baloo">
                        <span>${topicName}</span>
                        <span>${topicPct}% — ${tier.tagText}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div class="topic-bar-fill h-3 rounded-full" style="width: 0%; background-color: ${tier.colorHex};" data-target-width="${topicPct}%"></div>
                    </div>
                `;
                reviewList.appendChild(row);
                index++;
            }

            // Summary Line
            const summaryEl = document.getElementById('res-summary-line');
            if (weakTopics.length > 0) {
                summaryEl.innerText = `Let's practice a bit more: ${weakTopics.join(', ')}`;
            } else {
                summaryEl.innerText = `Great work across every topic!`;
            }
            
            // Transition Active Worksheet -> Results
            const targetScreen = `#screen-worksheet-${state.currentWorksheetId}`;
            
            // Disable Export buttons initially
            document.getElementById('btn-pdf').disabled = true;
            document.getElementById('btn-img').disabled = true;
            document.getElementById('btn-pdf').classList.add('opacity-50', 'cursor-not-allowed');
            document.getElementById('btn-img').classList.add('opacity-50', 'cursor-not-allowed');

            gsap.to(targetScreen, {
                opacity: 0, y: -20, duration: 0.4, onComplete: () => {
                    document.querySelector(targetScreen).classList.remove('active');
                    document.getElementById('screen-results').classList.add('active');
                    window.scrollTo(0, 0);
                    
                    // Reveal results card
                    gsap.to('#screen-results', { opacity: 1, duration: 0.1 });
                    gsap.from('#results-card', { y: 50, opacity: 0, duration: 0.6, ease: "back.out(1.2)" });

                    // Render Chart.js Doughnut
                    const ctx = document.getElementById('score-chart').getContext('2d');
                    if (window.scoreChartInstance) window.scoreChartInstance.destroy();

                    window.scoreChartInstance = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Score', 'Remaining'],
                            datasets: [{
                                data: [overallPct, 100 - overallPct],
                                backgroundColor: [overallTier.colorHex, '#e5e7eb'],
                                borderWidth: 0,
                                cutout: '75%',
                                borderRadius: 5
                            }]
                        },
                        options: {
                            animation: {
                                duration: 1000,
                                easing: 'easeOutQuart'
                            },
                            plugins: {
                                legend: { display: false },
                                tooltip: { enabled: false }
                            },
                            responsive: true,
                            maintainAspectRatio: false
                        }
                    });

                    // Animate Topic Bars
                    document.querySelectorAll('.topic-bar-fill').forEach((bar, i) => {
                        gsap.to(bar, {
                            width: bar.dataset.targetWidth,
                            duration: 1,
                            ease: "power2.out",
                            delay: 0.2 + (i * 0.1)
                        });
                    });

                    // Animate Score Number
                    const scoreObj = { val: 0 };
                    gsap.to(scoreObj, {
                        val: overallPct,
                        duration: 1,
                        ease: "power2.out",
                        onUpdate: () => {
                            document.getElementById('score-num').innerText = Math.round(scoreObj.val);
                        },
                        onComplete: () => {
                            fireConfetti();
                            
                            // Re-enable export buttons after ALL animations finish
                            setTimeout(() => {
                                document.getElementById('btn-pdf').disabled = false;
                                document.getElementById('btn-img').disabled = false;
                                document.getElementById('btn-pdf').classList.remove('opacity-50', 'cursor-not-allowed');
                                document.getElementById('btn-img').classList.remove('opacity-50', 'cursor-not-allowed');
                            }, 500); // give it a little extra buffer
                        }
                    });
                }
            });
        }

'@

$content = $content.Substring(0, $startIdx) + $newShowResults + $content.Substring($endIdx)

$content = $content -replace "`r`n", "`n"
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "showResults function rewritten successfully."
