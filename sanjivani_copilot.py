from __future__ import annotations

import argparse
import base64
import functools
import json
import os
import queue
import re
import sqlite3
import subprocess
import sys
import threading
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path
from typing import Any, Callable

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None

APP_DIR = Path(__file__).resolve().parent
DATA_DIR = APP_DIR / "data"
CONFIG_PATH = APP_DIR / "config.yaml"
DEFAULT_CONFIG_PATH = APP_DIR / "config.example.yaml"


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


def load_config(path: Path = CONFIG_PATH) -> dict[str, Any]:
    source = path if path.exists() else DEFAULT_CONFIG_PATH
    if yaml and source.exists():
        with source.open("r", encoding="utf-8") as fh:
            return yaml.safe_load(fh) or {}
    return {
        "assistant": {"name": "Sanjivani University Copilot", "wake_word": "sanjivani"},
        "llm": {"provider": "local_rules"},
        "security": {"require_approval": True, "dangerous_commands": []},
        "runtime": {"shell_timeout_seconds": 20, "monitor_interval_seconds": 30},
    }


class PIIFilter:
    PATTERNS = [
        ("SSN", re.compile(r"\b\d{3}-\d{2}-\d{4}\b")),
        ("CREDIT_CARD", re.compile(r"\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b")),
        ("EMAIL", re.compile(r"\b[\w.+-]+@[\w-]+\.[\w.-]+\b")),
        ("PHONE", re.compile(r"\b(?:\+?1[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}\b")),
        ("SECRET", re.compile(r"(?i)\b(api[_-]?key|password|token)\s*[:=]\s*['\"]?[^'\"\s]+")),
    ]

    def filter(self, text: str) -> str:
        clean = text
        for label, pattern in self.PATTERNS:
            clean = pattern.sub(f"[{label}_REDACTED]", clean)
        return clean


class SecurityGuard:
    def __init__(self, config: dict[str, Any] | None = None):
        self.config = config or load_config().get("security", {})
        self.require_approval = bool(self.config.get("require_approval", True))
        self.patterns = [re.compile(re.escape(p), re.IGNORECASE) for p in self.config.get("dangerous_commands", [])]
        DATA_DIR.mkdir(exist_ok=True)
        self.audit_log = DATA_DIR / "audit.log"

    def is_dangerous(self, command: str) -> bool:
        return any(pattern.search(command) for pattern in self.patterns)

    def can_execute(self, action: str, command: str, context: dict[str, Any] | None = None) -> bool:
        try:
            approved = self._ask_user(action, command, context or {})
            self._safe_log(action, command, approved, context or {})
            return approved
        except Exception as exc:
            self._safe_log(action, command, False, {"error": str(exc), **(context or {})})
            return False

    def _ask_user(self, action: str, command: str, context: dict[str, Any]) -> bool:
        if not self.require_approval:
            return True
        if not sys.stdin.isatty():
            return False
        danger = " DANGEROUS" if self.is_dangerous(command) else ""
        print(f"\nApproval required{danger}: {action}\nCommand: {command}")
        answer = input("Approve? Type 'yes' to continue: ").strip().lower()
        return answer == "yes"

    def _log(self, action: str, command: str, approved: bool, context: dict[str, Any]) -> None:
        record = {
            "timestamp": utc_now(),
            "action": action,
            "command": command,
            "approved": approved,
            "context": context,
        }
        self.audit_log.parent.mkdir(parents=True, exist_ok=True)
        with self.audit_log.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(record, ensure_ascii=False) + "\n")

    def _safe_log(self, action: str, command: str, approved: bool, context: dict[str, Any]) -> None:
        try:
            self._log(action, command, approved, context)
        except Exception:
            pass


def human_in_the_loop(action_type: str) -> Callable[[Callable[..., Any]], Callable[..., Any]]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @functools.wraps(func)
        def wrapper(self, *args, **kwargs):
            command = str(args[0]) if args else json.dumps(kwargs)
            context = {"function": func.__name__, "args": repr(args), "kwargs": repr(kwargs)}
            if self.guard.can_execute(action_type, command, context):
                return func(self, *args, **kwargs)
            return {"status": "denied", "reason": "User denied or approval failed"}

        return wrapper

    return decorator


class Memory:
    def __init__(self, db_path: Path = DATA_DIR / "sanjivani_memory.db"):
        DATA_DIR.mkdir(exist_ok=True)
        self.db_path = db_path
        self._init_db()

    def _connect(self) -> sqlite3.Connection:
        return sqlite3.connect(self.db_path)

    def _init_db(self) -> None:
        with self._connect() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS conversations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT NOT NULL,
                    user_input TEXT NOT NULL,
                    response TEXT NOT NULL,
                    action_taken TEXT
                )
                """
            )
            conn.execute("CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp)")

    def save(self, user_input: str, response: str, action_taken: str = "") -> None:
        with self._connect() as conn:
            conn.execute(
                "INSERT INTO conversations(timestamp, user_input, response, action_taken) VALUES (?, ?, ?, ?)",
                (utc_now(), user_input, response, action_taken),
            )

    def search(self, query: str, limit: int = 3) -> list[dict[str, str]]:
        words = [w for w in re.findall(r"\w+", query.lower()) if len(w) > 2]
        if not words:
            return []
        like_clauses = " OR ".join(["lower(user_input || ' ' || response) LIKE ?"] * len(words))
        params = [f"%{word}%" for word in words]
        with self._connect() as conn:
            rows = conn.execute(
                f"""
                SELECT timestamp, user_input, response, action_taken
                FROM conversations
                WHERE {like_clauses}
                ORDER BY id DESC
                LIMIT ?
                """,
                [*params, limit],
            ).fetchall()
        return [
            {"timestamp": row[0], "user_input": row[1], "response": row[2], "action_taken": row[3] or ""}
            for row in rows
        ]


class VisionSystem:
    def capture_screen(self) -> str:
        try:
            from PIL import ImageGrab

            img = ImageGrab.grab()
            buffer = BytesIO()
            img.save(buffer, format="PNG")
            return base64.b64encode(buffer.getvalue()).decode("ascii")
        except Exception as exc:
            return json.dumps({"status": "unavailable", "error": str(exc)})


class AgentBrain:
    def __init__(self, config: dict[str, Any], assistant_name: str):
        self.config = config
        self.assistant_name = assistant_name
        self.provider = config.get("provider", "local_rules")

    def plan(self, user_input: str, memories: list[dict[str, str]]) -> list[dict[str, Any]]:
        text = user_input.strip()
        lower = text.lower()
        if lower.startswith("remember "):
            return [{"type": "remember", "text": text.removeprefix("remember ").strip()}]
        if lower.startswith("recall ") or lower.startswith("search memory "):
            query = re.sub(r"^(recall|search memory)\s+", "", text, flags=re.IGNORECASE)
            return [{"type": "recall", "query": query, "memories": memories}]
        if lower.startswith("open "):
            return [{"type": "open_app", "name": text[5:].strip()}]
        if lower.startswith("type "):
            return [{"type": "type_text", "text": text[5:]}]
        if lower.startswith("run "):
            return [{"type": "run_shell", "command": text[4:].strip()}]
        if "screen" in lower or "screenshot" in lower:
            return [{"type": "screenshot"}]
        return [{"type": "respond", "text": f"{self.assistant_name} heard you. I can open apps, type text, run approved commands, remember notes, and recall memory."}]


class Executor:
    def __init__(self, guard: SecurityGuard, timeout_seconds: int = 20):
        self.guard = guard
        self.timeout_seconds = timeout_seconds
        try:
            import pyautogui

            pyautogui.FAILSAFE = True
            pyautogui.PAUSE = 0.5
            self.pyautogui = pyautogui
        except Exception:
            self.pyautogui = None

    @human_in_the_loop("shell")
    def run_shell(self, command: str) -> dict[str, Any]:
        completed = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            timeout=self.timeout_seconds,
        )
        return {"status": "ok", "returncode": completed.returncode, "stdout": completed.stdout, "stderr": completed.stderr}

    @human_in_the_loop("open_app")
    def open_app(self, app_name: str) -> dict[str, str]:
        subprocess.Popen(app_name, shell=True)
        return {"status": "ok", "message": f"Opened {app_name}"}

    @human_in_the_loop("type_text")
    def type_text(self, text: str) -> dict[str, str]:
        if not self.pyautogui:
            return {"status": "unavailable", "message": "pyautogui is not installed or cannot access the desktop"}
        self.pyautogui.write(text)
        return {"status": "ok", "message": "Text typed"}

    @human_in_the_loop("click")
    def click(self, x: int, y: int) -> dict[str, str]:
        if not self.pyautogui:
            return {"status": "unavailable", "message": "pyautogui is not installed or cannot access the desktop"}
        self.pyautogui.click(x, y)
        return {"status": "ok", "message": f"Clicked {x},{y}"}


class ProactiveMonitor:
    def __init__(self, agent: "SanjivaniAgent", interval_seconds: int = 30):
        self.agent = agent
        self.interval_seconds = interval_seconds
        self.events: queue.Queue[str] = queue.Queue()
        self._stop = threading.Event()
        self._thread: threading.Thread | None = None

    def start(self) -> None:
        if self._thread and self._thread.is_alive():
            return
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def stop(self) -> None:
        self._stop.set()

    def _run(self) -> None:
        while not self._stop.wait(self.interval_seconds):
            self.events.put("Monitor heartbeat: assistant is running.")


@dataclass
class SanjivaniAgent:
    config: dict[str, Any]

    def __post_init__(self) -> None:
        assistant_config = self.config.get("assistant", {})
        self.name = assistant_config.get("name", "Sanjivani University Copilot")
        security = self.config.get("security", {})
        runtime = self.config.get("runtime", {})
        self.pii = PIIFilter()
        self.memory = Memory()
        self.guard = SecurityGuard(security)
        self.vision = VisionSystem()
        self.brain = AgentBrain(self.config.get("llm", {}), self.name)
        self.executor = Executor(self.guard, int(runtime.get("shell_timeout_seconds", 20)))
        self.monitor = ProactiveMonitor(self, int(runtime.get("monitor_interval_seconds", 30)))

    def process(self, user_input: str) -> str:
        clean_input = self.pii.filter(user_input)
        memories = self.memory.search(clean_input)
        plan = self.brain.plan(clean_input, memories)
        results: list[str] = []
        for action in plan:
            result = self.dispatch(action)
            results.append(result)
        response = "\n".join(results)
        self.memory.save(user_input, response, json.dumps(plan))
        return response

    def dispatch(self, action: dict[str, Any]) -> str:
        action_type = action.get("type")
        if action_type == "open_app":
            return json.dumps(self.executor.open_app(action["name"]), ensure_ascii=False)
        if action_type == "type_text":
            return json.dumps(self.executor.type_text(action["text"]), ensure_ascii=False)
        if action_type == "run_shell":
            return json.dumps(self.executor.run_shell(action["command"]), ensure_ascii=False)
        if action_type == "screenshot":
            captured = self.vision.capture_screen()
            return "Screenshot captured." if not captured.startswith("{") else captured
        if action_type == "remember":
            self.memory.save(action["text"], "Saved memory", "remember")
            return "Saved that to memory."
        if action_type == "recall":
            memories = action.get("memories", [])
            if not memories:
                return "I could not find a matching memory yet."
            return "\n".join(f"- {m['user_input']} -> {m['response']}" for m in memories)
        return action.get("text", "Done.")


def run_cli(agent: SanjivaniAgent) -> None:
    print(f"{agent.name} is ready. Type 'exit' to quit.")
    while True:
        try:
            user_input = input("> ").strip()
        except (EOFError, KeyboardInterrupt):
            print()
            return
        if user_input.lower() in {"exit", "quit"}:
            return
        if user_input:
            print(agent.process(user_input))


def run_voice(agent: SanjivaniAgent) -> None:
    try:
        import pyttsx3
        import speech_recognition as sr
    except ImportError:
        print("Voice mode needs SpeechRecognition and pyttsx3. Install requirements.txt first.")
        return
    recognizer = sr.Recognizer()
    speaker = pyttsx3.init()
    print(f"{agent.name} voice mode is listening. Press Ctrl+C to stop.")
    with sr.Microphone() as source:
        while True:
            audio = recognizer.listen(source)
            try:
                text = recognizer.recognize_google(audio)
                response = agent.process(text)
                print(f"You: {text}\n{agent.name}: {response}")
                speaker.say(response)
                speaker.runAndWait()
            except Exception as exc:
                print(f"Voice input failed: {exc}")


def run_tray(agent: SanjivaniAgent) -> None:
    agent.monitor.start()
    try:
        import pystray
        from PIL import Image, ImageDraw
    except ImportError:
        print("Tray mode needs pystray and Pillow. Running background monitor loop instead.")
        try:
            while True:
                time.sleep(60)
        except KeyboardInterrupt:
            agent.monitor.stop()
        return

    image = Image.new("RGB", (64, 64), "white")
    draw = ImageDraw.Draw(image)
    draw.ellipse((8, 8, 56, 56), fill="#0f766e")
    draw.text((23, 21), "S", fill="white")

    def quit_app(icon, _item):
        agent.monitor.stop()
        icon.stop()

    icon = pystray.Icon(agent.name, image, agent.name, menu=pystray.Menu(pystray.MenuItem("Quit", quit_app)))
    icon.run()


def main() -> int:
    parser = argparse.ArgumentParser(description="Sanjivani University Copilot")
    parser.add_argument("--mode", choices=["cli", "voice", "tray"], default="cli")
    args = parser.parse_args()
    agent = SanjivaniAgent(load_config())
    if args.mode == "voice":
        run_voice(agent)
    elif args.mode == "tray":
        run_tray(agent)
    else:
        run_cli(agent)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
