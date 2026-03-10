from fastapi import APIRouter

from app.models.complaint_model import ComplaintCreate, ComplaintSubmitResponse
from app.services.complaint_service import submit_complaint


router = APIRouter(tags=["Complaints"])


@router.post("/submit-complaint", response_model=ComplaintSubmitResponse)
def create_complaint(payload: ComplaintCreate) -> dict:
    return submit_complaint(payload.complaint_text.strip())
