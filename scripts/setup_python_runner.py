"""Build the offline execution image and create a local shared token."""
from pathlib import Path
import secrets
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def main():
    subprocess.run(["docker", "build", "-f", "runner/Dockerfile", "-t", "study-helper-python:3.14.2-v2", "."], cwd=ROOT, check=True)
    directory = ROOT / ".python-runner"
    directory.mkdir(exist_ok=True)
    token = directory / "token"
    if not token.exists():
        token.write_text(secrets.token_urlsafe(48), encoding="utf-8")
        token.chmod(0o600)
    # Compose reads this as the host user, so its non-root app does not need
    # permission to read a host-owned 0600 bind-mounted secret file.
    env_file = directory / "compose.env"
    env_file.write_text("PYTHON_RUNNER_TOKEN=" + token.read_text().strip() + "\n", encoding="utf-8")
    env_file.chmod(0o600)
    print("Python image ready. Start python -m runner.controller for native Streamlit, or docker compose -f compose.yaml -f compose.python.yaml up --build -d.")


if __name__ == "__main__":
    main()
