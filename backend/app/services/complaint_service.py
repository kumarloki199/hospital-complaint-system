from fastapi import HTTPException

from app.database.db import get_connection
from app.services.nlp_service import nlp_service


def submit_complaint(complaint_text: str) -> dict:
    match = nlp_service.get_best_match(complaint_text)

    with get_connection() as connection:
        cursor = connection.execute(
            """
            INSERT INTO complaints (
                complaint_text,
                category,
                department,
                automatic_reply,
                status
            )
            VALUES (?, ?, ?, ?, 'pending')
            """,
            (
                complaint_text,
                match["category"],
                match["department"],
                match["automatic_reply"],
            ),
        )
        connection.commit()

    return {
        "complaint_id": cursor.lastrowid,
        "automatic_reply": match["automatic_reply"],
        "category": match["category"],
        "department": match["department"],
        "status": "pending",
    }


def list_complaints() -> list[dict]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT
                id,
                complaint_text,
                category,
                department,
                automatic_reply,
                doctor_reply,
                status,
                created_at,
                updated_at
            FROM complaints
            ORDER BY datetime(created_at) DESC, id DESC
            """
        ).fetchall()

    return [dict(row) for row in rows]


def reply_to_complaint(complaint_id: int, doctor_reply: str) -> dict:
    with get_connection() as connection:
        complaint = connection.execute(
            "SELECT id FROM complaints WHERE id = ?",
            (complaint_id,),
        ).fetchone()

        if complaint is None:
            raise HTTPException(status_code=404, detail="Complaint not found")

        connection.execute(
            """
            UPDATE complaints
            SET doctor_reply = ?, status = 'resolved', updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (doctor_reply, complaint_id),
        )
        connection.commit()

    return {
        "message": "Doctor reply submitted successfully",
        "complaint_id": complaint_id,
        "status": "resolved",
    }


def get_dashboard_stats() -> dict:
    with get_connection() as connection:
        total = connection.execute("SELECT COUNT(*) AS count FROM complaints").fetchone()["count"]
        pending = connection.execute(
            "SELECT COUNT(*) AS count FROM complaints WHERE status = 'pending'"
        ).fetchone()["count"]
        resolved = connection.execute(
            "SELECT COUNT(*) AS count FROM complaints WHERE status = 'resolved'"
        ).fetchone()["count"]
        category_rows = connection.execute(
            """
            SELECT category, COUNT(*) AS count
            FROM complaints
            GROUP BY category
            ORDER BY count DESC, category ASC
            """
        ).fetchall()

    return {
        "total_complaints": total,
        "pending_complaints": pending,
        "resolved_complaints": resolved,
        "complaints_by_category": {row["category"]: row["count"] for row in category_rows},
    }
