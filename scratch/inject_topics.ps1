$filePath = "f:\Tution\Worksheets\Webs\KCI_TableOf2_App\index.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# 1. Table of 2: single topic
$content = $content.Replace('<main id="screen-worksheet-table2" class="screen worksheet-container">', '<main id="screen-worksheet-table2" class="screen worksheet-container" data-topic="Multiplication by 2">')

# 2. Nature Explorers: single topic
$content = $content.Replace('<main id="screen-worksheet-nature" class="screen worksheet-container">', '<main id="screen-worksheet-nature" class="screen worksheet-container" data-topic="Living Things, Plants & Animals Basics">')

# 3. Class I: multi-topic (dynamic HTML in JS)
# Section 1: Living/Non-Living -> Living Things
$content = $content.Replace('secHeader("Section 1: Living or Non-Living?", "Tap what it is.") + `<div class="space-y-4">`', 'secHeader("Section 1: Living or Non-Living?", "Tap what it is.") + `<div class="space-y-4" data-topic="Living Things">`')
# Section 2A: Naming Words -> Naming Words
$content = $content.Replace('secHeader("Section 2A: Naming Words", "Tap the type of naming word.") + `<div class="space-y-4">`', 'secHeader("Section 2A: Naming Words", "Tap the type of naming word.") + `<div class="space-y-4" data-topic="Naming Words">`')
# Section 3: Beginning Sounds -> Beginning Sounds
$content = $content.Replace('secHeader("Section 3: Beginning Sounds", "Tap the correct starting letter.") + `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">`', 'secHeader("Section 3: Beginning Sounds", "Tap the correct starting letter.") + `<div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-topic="Beginning Sounds">`')
# Section 4: Reading Comprehension -> Reading Comprehension
$content = $content.Replace('secHeader("Section 4: Reading Comprehension", "Read and answer the questions.") + `', 'secHeader("Section 4: Reading Comprehension", "Read and answer the questions.") + `<div data-topic="Reading Comprehension">` + `')
# Wait, Section 4 has its own internal structure. Let's look closely at renderClass1Worksheet
