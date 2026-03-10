from fastapi import APIRouter

from app.models.complaint_model import ComplaintResponse
from app.models.doctor_model import (
    DashboardStatsResponse,
    DoctorReplyRequest,
    DoctorReplyResponse,
)
from app.services.complaint_service import (
    get_dashboard_stats,
    list_complaints,
    reply_to_complaint,
)


router = APIRouter(tags=["Doctor"])


@router.get("/doctor/complaints", response_model=list[ComplaintResponse])
def get_complaints() -> list[dict]:
    return list_complaints()


@router.post("/doctor/reply", response_model=DoctorReplyResponse)
def submit_doctor_reply(payload: DoctorReplyRequest) -> dict:
    return reply_to_complaint(payload.complaint_id, payload.doctor_reply.strip())


@router.get("/dashboard/stats", response_model=DashboardStatsResponse)
def dashboard_stats() -> dict:
    return get_dashboard_stats()
