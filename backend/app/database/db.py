from pathlib import Path
import sqlite3


BASE_DIR = Path(__file__).resolve().parents[1]
DB_PATH = BASE_DIR / "hospital_complaints.db"


def get_connection() -> sqlite3.Connection:
    """Return a SQLite connection with row dict-like access enabled."""
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_db() -> None:
    """Create the complaints table if it does not already exist."""
    with get_connection() as connection:
        connection.execute(
            """
            CREATE TABLE IF NOT EXISTS complaints (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                complaint_text TEXT NOT NULL,
                category TEXT NOT NULL,
                department TEXT NOT NULL,
                automatic_reply TEXT NOT NULL,
                doctor_reply TEXT,
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
            )
            """
        )
        connection.commit()
