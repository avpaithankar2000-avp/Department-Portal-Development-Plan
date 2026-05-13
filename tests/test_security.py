from sanjivani_copilot import SecurityGuard


def test_dangerous_command_detection():
    guard = SecurityGuard({"require_approval": True, "dangerous_commands": ["del /f", "format"]})

    assert guard.is_dangerous("del /f C:\\important.txt")
    assert guard.is_dangerous("FORMAT C:")
    assert not guard.is_dangerous("echo hello")


def test_security_denies_when_not_interactive(tmp_path):
    guard = SecurityGuard({"require_approval": True, "dangerous_commands": []})
    guard.audit_log = tmp_path / "audit.log"

    assert guard.can_execute("shell", "echo hello", {}) is False
    assert guard.audit_log.exists()
