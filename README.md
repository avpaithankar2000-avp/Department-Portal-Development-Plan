# Sanjivani University Copilot

Sanjivani University Copilot is a Windows-first desktop AI assistant inspired by the attached Jarvis OS Agent guide. It is built around a master agent that coordinates seven modules:

- `AgentBrain` plans user requests.
- `VisionSystem` captures the screen.
- `Executor` performs approved OS actions.
- `Memory` stores local conversation history.
- `SecurityGuard` asks for approval and writes an audit log.
- `PIIFilter` redacts sensitive data before planning.
- `ProactiveMonitor` runs background checks.

The default mode is intentionally conservative. It can run in CLI mode without an API key using local rules for simple actions. Cloud LLM support can be added by setting `llm.provider` in `config.yaml`.

## Setup

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item config.example.yaml config.yaml
python sanjivani_copilot.py --mode cli
```

Try:

```text
open notepad
type Hello from Sanjivani University Copilot
remember my exam portal opens in Edge
recall exam portal
```

## Run On Windows Startup

After setup, run:

```powershell
.\scripts\install_startup_task.ps1
```

This creates a Windows scheduled task that starts the assistant in tray mode when the current user logs in.

## Modes

```powershell
python sanjivani_copilot.py --mode cli
python sanjivani_copilot.py --mode voice
python sanjivani_copilot.py --mode tray
```

Voice and tray modes depend on optional desktop packages and Windows audio permissions.

## Safety

Every executor method is wrapped with `@human_in_the_loop`. If approval UI fails, the action is denied. The assistant logs every decision to `data/audit.log`.
