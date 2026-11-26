$filePath = "f:\Tution\Worksheets\Webs\KCI_TableOf2_App\index.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Class 1
$content = $content.Replace('c1-s1" data-q="s1-${i}"', 'c1-s1" data-topic="Living Things" data-q="s1-${i}"')
$content = $content.Replace('c1-s2a" data-q="s2a-${i}"', 'c1-s2a" data-topic="Naming Words" data-q="s2a-${i}"')
$content = $content.Replace('c1-s3" data-q="s3-${i}"', 'c1-s3" data-topic="Beginning Sounds" data-q="s3-${i}"')
$content = $content.Replace('c1-s4" data-q="s4-${i}"', 'c1-s4" data-topic="Reading Comprehension" data-q="s4-${i}"')
$content = $content.Replace('c1-s5" data-q="s5-${i}"', 'c1-s5" data-topic="Articles" data-q="s5-${i}"')
$content = $content.Replace('c1-s6" data-q="s6-${i}"', 'c1-s6" data-topic="Singular/Plural" data-q="s6-${i}"')
$content = $content.Replace('c1-s7" data-q="s7-${i}"', 'c1-s7" data-topic="This/That" data-q="s7-${i}"')

# Class 1 Mini Test
$c1_mt_old = @'
            const s8Items = [
                {q:"1. 🐘 Elephant is:", a:"Living", opts:["🌱 Living", "🪨 Non-Living"]},
                {q:"2. Which is a Naming Word?", a:"River", opts:["Jump", "River", "Fast", "Loudly"]},
                {q:"3. 🪁 Window begins with: (Bonus: beyond T!)", a:"W", opts:["W", "V", "U"]},
                {q:"4. ___ orange (a/an)", a:"an", opts:["a", "an"]},
                {q:"5. Plural of 'Woman'", a:"Women", opts:["Womans", "Women", "Womens"]}
            ];
            html += `<div class="section-card gs-reveal">${secHeader("Super Challenge — Mini Test", "Show what you learned!")}<div class="space-y-4">`;
            s8Items.forEach((item, i) => {
                html += `
                    <div class="bg-white p-4 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 s4-question c1-s8" data-q="s8-${i}" data-ans="${item.a}">
'@
$c1_mt_new = @'
            const s8Items = [
                {q:"1. 🐘 Elephant is:", a:"Living", opts:["🌱 Living", "🪨 Non-Living"], t:"Living Things"},
                {q:"2. Which is a Naming Word?", a:"River", opts:["Jump", "River", "Fast", "Loudly"], t:"Naming Words"},
                {q:"3. 🪁 Window begins with: (Bonus: beyond T!)", a:"W", opts:["W", "V", "U"], t:"Beginning Sounds"},
                {q:"4. ___ orange (a/an)", a:"an", opts:["a", "an"], t:"Articles"},
                {q:"5. Plural of 'Woman'", a:"Women", opts:["Womans", "Women", "Womens"], t:"Singular/Plural"}
            ];
            html += `<div class="section-card gs-reveal">${secHeader("Super Challenge — Mini Test", "Show what you learned!")}<div class="space-y-4">`;
            s8Items.forEach((item, i) => {
                html += `
                    <div class="bg-white p-4 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 s4-question c1-s8" data-topic="${item.t}" data-q="s8-${i}" data-ans="${item.a}">
'@
$content = $content.Replace($c1_mt_old, $c1_mt_new)


# Islamiat Static Sections
$content = $content.Replace('class="bg-white p-4 rounded-xl text-center shadow-sm cursor-pointer isl-s1 s4-question"', 'class="bg-white p-4 rounded-xl text-center shadow-sm cursor-pointer isl-s1 s4-question" data-topic="Five Pillars"')
$content = $content.Replace('class="bg-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 s4-question isl-s2"', 'class="bg-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 s4-question isl-s2" data-topic="Prophets"')

# Islamiat Mini Test
$isl_mt_old = @'
                {q: "What is the first pillar of Islam?", a: "Shahadah", opts: ["Salah", "Zakah", "Shahadah"]},
                {q: "Who is the last Prophet?", a: "Prophet Muhammad ﷺ", opts: ["Prophet Isa (AS)", "Prophet Muhammad ﷺ", "Prophet Musa (AS)"]},
                {q: "Which book was given to Prophet Dawood (AS)?", a: "The Zabur", opts: ["The Quran", "The Tawrat", "The Zabur"]},
                {q: "Which angel brings messages from Allah?", a: "Angel Jibreel (AS)", opts: ["Angel Mikaeel (AS)", "Angel Jibreel (AS)", "Angel Izraeel (AS)"]},
                {q: "How many times do Muslims pray each day?", a: "5", opts: ["3", "5", "7"]}
            ];
            html += `<div class="section-card gs-reveal">${secHeader("Little Believers Mini Test 🌟", "Show what you learned!")}<div class="space-y-4">`;
            mtItems.forEach((item, i) => {
                html += `
                    <div class="bg-white p-4 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 s4-question isl-mt" data-q="mt-${i}" data-ans="${item.a}">
'@
$isl_mt_new = @'
                {q: "What is the first pillar of Islam?", a: "Shahadah", opts: ["Salah", "Zakah", "Shahadah"], t:"Five Pillars"},
                {q: "Who is the last Prophet?", a: "Prophet Muhammad ﷺ", opts: ["Prophet Isa (AS)", "Prophet Muhammad ﷺ", "Prophet Musa (AS)"], t:"Prophets"},
                {q: "Which book was given to Prophet Dawood (AS)?", a: "The Zabur", opts: ["The Quran", "The Tawrat", "The Zabur"], t:"Angels & Books"},
                {q: "Which angel brings messages from Allah?", a: "Angel Jibreel (AS)", opts: ["Angel Mikaeel (AS)", "Angel Jibreel (AS)", "Angel Izraeel (AS)"], t:"Angels & Books"},
                {q: "How many times do Muslims pray each day?", a: "5", opts: ["3", "5", "7"], t:"Five Pillars"}
            ];
            html += `<div class="section-card gs-reveal">${secHeader("Little Believers Mini Test 🌟", "Show what you learned!")}<div class="space-y-4">`;
            mtItems.forEach((item, i) => {
                html += `
                    <div class="bg-white p-4 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 s4-question isl-mt" data-topic="${item.t}" data-q="mt-${i}" data-ans="${item.a}">
'@
$content = $content.Replace($isl_mt_old, $isl_mt_new)


# Number Ninjas
$content = $content.Replace('<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 nn-s1a">', '<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 nn-s1a" data-topic="Addition">')
$content = $content.Replace('<div class="flex items-center gap-3 nn-s1b"', '<div class="flex items-center gap-3 nn-s1b" data-topic="Addition"')
$content = $content.Replace('<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 nn-s2a">', '<div class="grid grid-cols-2 sm:grid-cols-4 gap-4 nn-s2a" data-topic="Subtraction">')
$content = $content.Replace('<div class="flex items-center gap-3 nn-s2b"', '<div class="flex items-center gap-3 nn-s2b" data-topic="Subtraction"')
$content = $content.Replace('nn-s3" data-q="s3-${i}"', 'nn-s3" data-topic="Nouns" data-q="s3-${i}"')
$content = $content.Replace('nn-s4" data-q="s4-${i}"', 'nn-s4" data-topic="Verbs" data-q="s4-${i}"')

# Number Ninjas Mini Test
$nn_mt_old = @'
    // Math Mini Test
    const mtMathItems = [
        {q: "320 + 150 =", a: "470"}, {q: "450 - 200 =", a: "250"}, {q: "600 + 300 =", a: "900"}, {q: "850 - 450 =", a: "400"}
    ];
    html += `<div class="section-card gs-reveal">${secHeader("Mini Test: Math 🧮", "Quick calculations!")}<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">`;
    mtMathItems.forEach((item, i) => {
        html += `
            <div class="flex items-center justify-between bg-white p-4 rounded-xl border border-blue-100 shadow-sm nn-mt" data-q="mtm-${i}" data-ans="${item.a}">
'@
$nn_mt_new = @'
    // Math Mini Test
    const mtMathItems = [
        {q: "320 + 150 =", a: "470", t:"Addition"}, {q: "450 - 200 =", a: "250", t:"Subtraction"}, {q: "600 + 300 =", a: "900", t:"Addition"}, {q: "850 - 450 =", a: "400", t:"Subtraction"}
    ];
    html += `<div class="section-card gs-reveal">${secHeader("Mini Test: Math 🧮", "Quick calculations!")}<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">`;
    mtMathItems.forEach((item, i) => {
        html += `
            <div class="flex items-center justify-between bg-white p-4 rounded-xl border border-blue-100 shadow-sm nn-mt" data-topic="${item.t}" data-q="mtm-${i}" data-ans="${item.a}">
'@
$content = $content.Replace($nn_mt_old, $nn_mt_new)

$nn_mt2_old = @'
    const mtGrammarItems = [
        {q: "Which word is a noun?", a: "School", opts: ["Run", "School", "Fast"]},
        {q: "Which word is an action word (verb)?", a: "Jump", opts: ["Cat", "Jump", "Happy"]},
        {q: "The dog is ___ (bark).", a: "barking", opts: ["barks", "barking", "barked"]}
    ];
    html += `<div class="section-card gs-reveal">${secHeader("Mini Test: Grammar ✍️", "Show your skills!")}<div class="space-y-4">`;
    mtGrammarItems.forEach((item, i) => {
        html += `
            <div class="bg-white p-4 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 s4-question nn-mt-pills" data-q="mtg-${i}" data-ans="${item.a}">
'@
$nn_mt2_new = @'
    const mtGrammarItems = [
        {q: "Which word is a noun?", a: "School", opts: ["Run", "School", "Fast"], t:"Nouns"},
        {q: "Which word is an action word (verb)?", a: "Jump", opts: ["Cat", "Jump", "Happy"], t:"Verbs"},
        {q: "The dog is ___ (bark).", a: "barking", opts: ["barks", "barking", "barked"], t:"Verbs"}
    ];
    html += `<div class="section-card gs-reveal">${secHeader("Mini Test: Grammar ✍️", "Show your skills!")}<div class="space-y-4">`;
    mtGrammarItems.forEach((item, i) => {
        html += `
            <div class="bg-white p-4 rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4 s4-question nn-mt-pills" data-topic="${item.t}" data-q="mtg-${i}" data-ans="${item.a}">
'@
$content = $content.Replace($nn_mt2_old, $nn_mt2_new)


# Grammar Champs
$content = $content.Replace('gc-s1" data-q="s1-${i}"', 'gc-s1" data-topic="Nouns" data-q="s1-${i}"')
$content = $content.Replace('gc-s2" data-q="s2-${i}"', 'gc-s2" data-topic="Verbs" data-q="s2-${i}"')
$content = $content.Replace('gc-s3" data-q="s3-${i}"', 'gc-s3" data-topic="Articles" data-q="s3-${i}"')

# Grammar Champs Mini Test
$gc_mt_old = @'
    const mtItems = [
        {q: "\"a herd of sheep\" is a ___ noun", a: "Collective", opts: ["Common", "Proper", "Collective"]},
        {q: "She is ___ (write) her name.", a: "writing", opts: ["writeing", "writing", "writting"]},
        {q: "___ owl", a: "an", opts: ["a", "an"]},
        {q: "\"London\" is a ___ noun", a: "Proper", opts: ["Common", "Proper", "Collective"]},
        {q: "He is ___ (run) home.", a: "running", opts: ["runing", "running", "runnning"]}
    ];
    html += `<div class="section-card gs-reveal">` + secHeader("Grammar Champs Mini Test 🏆", "Mixed review!") + `<div class="space-y-4">`;
    mtItems.forEach((item, i) => {
        html += `
            <div class="bg-white p-4 rounded-xl flex flex-col xl:flex-row xl:items-center justify-between gap-4 s4-question gc-mt" data-q="mt-${i}" data-ans="${item.a}">
'@
$gc_mt_new = @'
    const mtItems = [
        {q: "\"a herd of sheep\" is a ___ noun", a: "Collective", opts: ["Common", "Proper", "Collective"], t:"Nouns"},
        {q: "She is ___ (write) her name.", a: "writing", opts: ["writeing", "writing", "writting"], t:"Verbs"},
        {q: "___ owl", a: "an", opts: ["a", "an"], t:"Articles"},
        {q: "\"London\" is a ___ noun", a: "Proper", opts: ["Common", "Proper", "Collective"], t:"Nouns"},
        {q: "He is ___ (run) home.", a: "running", opts: ["runing", "running", "runnning"], t:"Verbs"}
    ];
    html += `<div class="section-card gs-reveal">` + secHeader("Grammar Champs Mini Test 🏆", "Mixed review!") + `<div class="space-y-4">`;
    mtItems.forEach((item, i) => {
        html += `
            <div class="bg-white p-4 rounded-xl flex flex-col xl:flex-row xl:items-center justify-between gap-4 s4-question gc-mt" data-topic="${item.t}" data-q="mt-${i}" data-ans="${item.a}">
'@
$content = $content.Replace($gc_mt_old, $gc_mt_new)


$content = $content -replace "`r`n", "`n"
[System.IO.File]::WriteAllText($filePath, $content, [System.Text.Encoding]::UTF8)
Write-Host "Topics injected into dynamic worksheets."
