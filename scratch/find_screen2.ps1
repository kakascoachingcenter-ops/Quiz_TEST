# Replace Screen 2 static card grid with dynamic infrastructure
$filePath = "f:\Tution\Worksheets\Webs\KCI_TableOf2_App\index.html"
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

$oldBlock = @'
        <!-- SCREEN 2: Worksheet Selection -->
        <main id="screen-selection" class="screen max-w-7xl mx-auto">
            <h3 id="selection-greeting" class="text-3xl font-baloo font-bold text-center mb-8">Hi! Which worksheet would you like to try today?</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
                <!-- Card 1 -->
'@

$idx = $content.IndexOf($oldBlock)
Write-Host "Found at index: $idx"
if ($idx -eq -1) {
    Write-Host "ERROR: Old block not found"
    exit 1
}
