from pydantic import BaseModel, Field


class DoctorReplyRequest(BaseModel):
    complaint_id: int = Field(..., gt=0)
    doctor_reply: str = Field(..., min_length=2, max_length=2000)


class DoctorReplyResponse(BaseModel):
    message: str
    complaint_id: int
    status: str


class DashboardStatsResponse(BaseModel):
    total_complaints: int
    pending_complaints: int
    resolved_complaints: int
    complaints_by_category: dict[str, int]
