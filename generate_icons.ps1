New-Item -ItemType Directory -Path 'e:\ChromeGame\icons' -Force | Out-Null
Add-Type -AssemblyName System.Drawing

$sizes = @(16, 48, 128)
foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = 'AntiAlias'
    
    # Black background
    $g.Clear([System.Drawing.Color]::FromArgb(0, 0, 0))
    
    # Neon Pink brush
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 0, 255))
    
    # Draw an "Invader" 
    $s = $size / 11.0 # 11 grid cells wide
    
    # helper for drawing pixel blocks
    function DrawBlock($x, $y) {
        $g.FillRectangle($brush, [float]($x*$s), [float]($y*$s), [float]$s, [float]$s)
    }
    
    # simple 11x8 invader layout
    $pixels = @(
        "  X     X  ",
        "   X   X   ",
        "  XXXXXXX  ",
        " XX XXX XX ",
        "XXXXXXXXXXX",
        "X XXXXXXX X",
        "X X     X X",
        "   XX XX   "
    )
    
    $yOffset = 2
    for ($y=0; $y -lt $pixels.Length; $y++) {
        $row = $pixels[$y]
        for ($x=0; $x -lt $row.Length; $x++) {
            if ($row[$x] -eq 'X') {
                DrawBlock $x ($y + $yOffset)
            }
        }
    }
    
    $g.Dispose()
    $bmp.Save('e:\ChromeGame\icons\icon' + $size + '.png', [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Host 'Created icon' $size 'x' $size
}
Write-Host 'All icons created!'
