from pathlib import Path
import os

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
DATABASE_DIR = ROOT / "database"
CHALLENGES_PATH = DATA_DIR / "challenges.json"
SOURCE_PATH = CHALLENGES_PATH
BUNDLED_CHALLENGES_PATH = Path(os.environ.get("BUNDLED_CHALLENGES_PATH", CHALLENGES_PATH))
VALIDATION_REPORT_PATH = DATA_DIR / "validation_report.json"
DB_PATH = Path(os.environ.get("PRACTICE_DB_PATH", DATABASE_DIR / "practice.db"))
IMPORTS_DIR = DATA_DIR / "imports"
VERSIONS_DIR = DATA_DIR / "versions"
