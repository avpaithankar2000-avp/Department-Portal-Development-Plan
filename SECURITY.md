# Security Model

Sanjivani University Copilot follows a fail-secure Human-In-The-Loop model.

- OS actions require explicit approval.
- Approval defaults to denied on errors.
- Dangerous command patterns are highlighted before approval.
- PII is redacted before text is sent to the planning layer.
- Subprocess calls use timeouts.
- PyAutoGUI fail-safe is enabled when available.
- Local memory is stored in SQLite under `data/`.

Never place real API keys in the repository. Keep `config.yaml` local.
