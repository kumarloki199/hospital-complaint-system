import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ArcElement,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

import { fetchComplaints, fetchDashboardStats, submitDoctorReply } from "../services/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function DoctorDashboard({ onLogout }) {
  const isDoctorAuthenticated = localStorage.getItem("doctorAuthenticated") === "true";
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({
    total_complaints: 0,
    pending_complaints: 0,
    resolved_complaints: 0,
    complaints_by_category: {},
  });
  const [replyDrafts, setReplyDrafts] = useState({});
  const [activeComplaintId, setActiveComplaintId] = useState(null);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      const [complaintData, statsData] = await Promise.all([
        fetchComplaints(),
        fetchDashboardStats(),
      ]);
      setComplaints(complaintData);
      setStats(statsData);
    } catch (requestError) {
      setError("Doctor dashboard could not load. Confirm the backend API is running.");
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleReplyChange = (complaintId, value) => {
    setReplyDrafts((current) => ({
      ...current,
      [complaintId]: value,
    }));
  };

  const handleReplySubmit = async (complaintId) => {
    const message = (replyDrafts[complaintId] || "").trim();
    if (!message) {
      return;
    }

    try {
      await submitDoctorReply(complaintId, message);
      setReplyDrafts((current) => ({ ...current, [complaintId]: "" }));
      setActiveComplaintId(null);
      await loadDashboard();
    } catch (requestError) {
      setError("Doctor reply submission failed.");
    }
  };

  const chartData = {
    labels: Object.keys(stats.complaints_by_category),
    datasets: [
      {
        label: "Complaints",
        data: Object.values(stats.complaints_by_category),
        backgroundColor: ["#0f766e", "#dc2626", "#ca8a04", "#1d4ed8", "#7c3aed"],
        borderRadius: 10,
      },
    ],
  };

  const totalsChartData = {
    labels: ["Pending", "Resolved"],
    datasets: [
      {
        data: [stats.pending_complaints, stats.resolved_complaints],
        backgroundColor: ["#f59e0b", "#10b981"],
        borderWidth: 0,
      },
    ],
  };

  const handleLogout = () => {
    onLogout();
    navigate("/doctor-login");
  };

  if (!isDoctorAuthenticated) {
    return <Navigate to="/doctor-login" replace />;
  }

  return (
    <section className="stack">
      <div className="dashboard-header-actions">
        <button className="secondary-button logout-button" type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="stats-grid">
        <article className="panel stat-card">
          <p>Total complaints</p>
          <strong>{stats.total_complaints}</strong>
        </article>
        <article className="panel stat-card">
          <p>Pending complaints</p>
          <strong>{stats.pending_complaints}</strong>
        </article>
        <article className="panel stat-card">
          <p>Resolved complaints</p>
          <strong>{stats.resolved_complaints}</strong>
        </article>
      </div>

      <div className="dashboard-chart-grid">
        <section className="panel chart-panel">
          <div className="panel-header">
            <h2>Complaint categories</h2>
          </div>
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
              },
            }}
          />
        </section>

        <section className="panel chart-panel donut-panel">
          <div className="panel-header">
            <h2>Status totals</h2>
            <p>Pending versus resolved complaints.</p>
          </div>
          <Doughnut
            data={totalsChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "bottom",
                },
              },
              cutout: "62%",
            }}
          />
        </section>
      </div>

      {error ? <div className="panel error-banner">{error}</div> : null}

      <section className="stack">
        <div className="section-heading">
          <h2>Doctor action queue</h2>
          <p>Review complaints in a table and open a reply panel for any pending case.</p>
        </div>

        <div className="panel table-panel">
          <div className="table-wrap">
            <table className="complaint-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Complaint</th>
                  <th>Category</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => (
                  <tr key={complaint.id}>
                    <td>#{complaint.id}</td>
                    <td className="table-complaint-cell">
                      <p>{complaint.complaint_text}</p>
                      <small>Auto reply: {complaint.automatic_reply}</small>
                      {complaint.doctor_reply ? (
                        <small>Doctor reply: {complaint.doctor_reply}</small>
                      ) : null}
                    </td>
                    <td>{complaint.category}</td>
                    <td>{complaint.department}</td>
                    <td>
                      <span className={`status-pill ${complaint.status}`}>{complaint.status}</span>
                    </td>
                    <td>
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() =>
                          setActiveComplaintId(
                            activeComplaintId === complaint.id ? null : complaint.id
                          )
                        }
                        disabled={complaint.status === "resolved"}
                      >
                        {complaint.status === "resolved"
                          ? "Resolved"
                          : activeComplaintId === complaint.id
                            ? "Close"
                            : "Reply"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {activeComplaintId ? (
          <article className="panel dashboard-complaint">
            {complaints
              .filter((complaint) => complaint.id === activeComplaintId)
              .map((complaint) => (
                <div key={complaint.id} className="stack">
                  <div className="complaint-card-top">
                    <div>
                      <p className="complaint-meta">{complaint.department}</p>
                      <h3>Reply to complaint #{complaint.id}</h3>
                    </div>
                    <span className={`status-pill ${complaint.status}`}>{complaint.status}</span>
                  </div>

                  <p className="complaint-text">{complaint.complaint_text}</p>

                  <div className="reply-box auto-reply">
                    <strong>Automatic reply</strong>
                    <p>{complaint.automatic_reply}</p>
                  </div>

                  <label className="field">
                    <span>Doctor reply</span>
                    <textarea
                      rows="4"
                      value={replyDrafts[complaint.id] ?? complaint.doctor_reply ?? ""}
                      onChange={(event) => handleReplyChange(complaint.id, event.target.value)}
                      disabled={complaint.status === "resolved"}
                      placeholder="Write the manual reply for the patient."
                    />
                  </label>

                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => handleReplySubmit(complaint.id)}
                    disabled={complaint.status === "resolved"}
                  >
                    {complaint.status === "resolved" ? "Resolved" : "Send Reply"}
                  </button>
                </div>
              ))}
          </article>
        ) : null}
      </section>
    </section>
  );
}

export default DoctorDashboard;
