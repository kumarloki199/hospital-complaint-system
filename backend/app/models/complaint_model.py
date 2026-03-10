from pydantic import BaseModel, Field


class ComplaintCreate(BaseModel):
    complaint_text: str = Field(..., min_length=5, max_length=2000)


class ComplaintResponse(BaseModel):
    id: int
    complaint_text: str
    category: str
    department: str
    automatic_reply: str
    doctor_reply: str | None
    status: str
    created_at: str
    updated_at: str


class ComplaintSubmitResponse(BaseModel):
    complaint_id: int
    automatic_reply: str
    category: str
    department: str
    status: str
