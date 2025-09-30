$ErrorActionPreference = 'Stop'

$ws = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop 'Todo App.lnk'

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot '..')
$startCmd = Resolve-Path (Join-Path $projectRoot 'start_todo.cmd')

$lnk = $ws.CreateShortcut($shortcutPath)
$lnk.TargetPath = 'cmd.exe'
$lnk.Arguments = '/c "' + $startCmd + '"'
$lnk.WorkingDirectory = $projectRoot
$lnk.IconLocation = "$env:SystemRoot\System32\SHELL32.dll,165"
$lnk.Save()

Write-Output "Created shortcut: $shortcutPath"


