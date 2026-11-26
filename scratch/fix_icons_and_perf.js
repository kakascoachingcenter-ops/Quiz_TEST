const fs = require('fs');

let html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

// Load icons.js synchronously right in head
// Let's replace icon literals in raw HTML with their real SVGs
const KCIIcons = {
    phone: `<svg class="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    arrowRight: `<svg class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,
    arrowLeft: `<svg class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    x: `<svg class="w-4 h-4 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    download: `<svg class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    rotateCw: `<svg class="w-5 h-5 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`,
    folder: `<svg class="w-6 h-6 inline-block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>`
};

// Replace raw ${KCIIcons.xxx} in HTML structure with pure SVG strings
html = html.replace(/\$\{KCIIcons\.phone\}/g, KCIIcons.phone);
html = html.replace(/\$\{KCIIcons\.arrowRight\}/g, KCIIcons.arrowRight);
html = html.replace(/\$\{KCIIcons\.arrowLeft\}/g, KCIIcons.arrowLeft);
html = html.replace(/\$\{KCIIcons\.x\}/g, KCIIcons.x);
html = html.replace(/\$\{KCIIcons\.download\}/g, KCIIcons.download);
html = html.replace(/\$\{KCIIcons\.rotateCw\}/g, KCIIcons.rotateCw);
html = html.replace(/\$\{KCIIcons\.folder\}/g, KCIIcons.folder);

// Also replace inside renderFoldersView and renderSelectionGrid where escaped string may linger
html = html.replace(/\\\$\{KCIIcons\.folder\}/g, KCIIcons.folder);
html = html.replace(/\\\$\{KCIIcons\.arrowRight\}/g, KCIIcons.arrowRight);

// Optimize Lenis configuration for smooth 60fps scrolling
const oldLenisCode = /const lenis = new Lenis\(\{[\s\S]*?\}\);[\s\S]*?requestAnimationFrame\(raf\);/;
const optimizedLenisCode = `// Initialize Lenis for responsive 60fps scrolling
        const lenis = new Lenis({
            duration: 0.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false
        });
        window.lenis = lenis;
        
        // Sync Lenis with GSAP ScrollTrigger if present
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

html = html.replace(oldLenisCode, optimizedLenisCode);

fs.writeFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', html, 'utf8');
console.log('Fixed all raw icon interpolations and optimized Lenis!');
