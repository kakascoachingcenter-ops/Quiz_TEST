$s = 'Ã—'
$b = [System.Text.Encoding]::GetEncoding(1252).GetBytes($s)
$fixed = [System.Text.Encoding]::UTF8.GetString($b)
Write-Host "Original: $s"
Write-Host "Fixed: $fixed"
