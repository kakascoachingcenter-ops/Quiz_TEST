const fs = require('fs');

let html = fs.readFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', 'utf8');

// --- 1. HEAD & FONTS & TAILWIND ---
// Replace font imports: only Fredoka (600, 700), Nunito (400, 600, 700), and font-display: swap
const oldFontTag = /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Baloo\+2[^"]+" rel="stylesheet">/;
const newFontTag = `<link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="tokens.css">
    <script src="valuesData.js"></script>
    <script src="icons.js"></script>`;

html = html.replace(oldFontTag, newFontTag);

// Replace Tailwind config
const oldTailwindConfig = /tailwind\.config\s*=\s*\{[\s\S]*?fontFamily:\s*\{[\s\S]*?\}\s*\}\s*\}/;
const newTailwindConfig = `tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        navy: '#1e3a5f',
                        gold: '#f0b429',
                        paper: '#fbf7ef',
                        'paper-edge': '#efe6d3',
                        graphite: '#3a3f47',
                        'ruled-blue': '#cfe0f2',
                        success: '#3f9b6a',
                        coral: '#e8765f',
                        info: '#3f8fd1',
                        lightBlue: '#eaf1fb'
                    },
                    fontFamily: {
                        heading: ['Fredoka', 'cursive', 'sans-serif'],
                        body: ['Nunito', 'sans-serif'],
                        urdu: ['"Noto Nastaliq Urdu"', 'serif']
                    }
                }
            }
        }`;
html = html.replace(oldTailwindConfig, newTailwindConfig);

// Lazy load Urdu Nastaliq font only when Urdu content is rendered
const lazyUrduCode = `
    <script>
        window.loadUrduFontIfNeeded = function() {
            if (document.getElementById('kci-urdu-font-link')) return;
            const link = document.createElement('link');
            link.id = 'kci-urdu-font-link';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap';
            document.head.appendChild(link);
        };
    </script>
`;
html = html.replace('</head>', `${lazyUrduCode}\n</head>`);

fs.writeFileSync('f:/Tution/Worksheets/Webs/KCI_TableOf2_App/index.html', html, 'utf8');
console.log('Part A & fonts patched successfully!');
