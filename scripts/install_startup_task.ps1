$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Python = Join-Path $ProjectRoot ".venv\Scripts\python.exe"
$Script = Join-Path $ProjectRoot "sanjivani_copilot.py"

if (!(Test-Path $Python)) {
    throw "Virtual environment Python not found at $Python. Run setup first."
}

$Action = New-ScheduledTaskAction -Execute $Python -Argument "`"$Script`" --mode tray" -WorkingDirectory $ProjectRoot
$Trigger = New-ScheduledTaskTrigger -AtLogOn
$Settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries

Register-ScheduledTask `
    -TaskName "Sanjivani University Copilot" `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -Description "Starts Sanjivani University Copilot at Windows login." `
    -Force

Write-Host "Installed startup task: Sanjivani University Copilot"
