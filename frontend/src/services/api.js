import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const submitComplaint = async (complaintText) => {
  const { data } = await api.post("/submit-complaint", {
    complaint_text: complaintText,
  });
  return data;
};

export const fetchComplaints = async () => {
  const { data } = await api.get("/doctor/complaints");
  return data;
};

export const submitDoctorReply = async (complaintId, doctorReply) => {
  const { data } = await api.post("/doctor/reply", {
    complaint_id: complaintId,
    doctor_reply: doctorReply,
  });
  return data;
};

export const fetchDashboardStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return data;
};

export default api;
