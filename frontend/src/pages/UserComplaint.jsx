import { useEffect, useState } from "react";

import ComplaintForm from "../components/ComplaintForm";
import ComplaintCard from "../components/ComplaintCard";
import { fetchComplaints, submitComplaint } from "../services/api";

function UserComplaint() {
  const [complaints, setComplaints] = useState([]);
  const [latestReply, setLatestReply] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const recentComplaints = complaints.slice(0, 2);

  const loadComplaints = async () => {
    try {
      const data = await fetchComplaints();
      setComplaints(data);
    } catch (requestError) {
      setError("Unable to load complaints. Confirm the backend is running on port 8000.");
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleSubmitComplaint = async (complaintText) => {
    setLoading(true);
    setError("");

    try {
      const response = await submitComplaint(complaintText);
      setLatestReply(response);
      await loadComplaints();
      return true;
    } catch (requestError) {
      setError("Complaint submission failed. Try again after backend startup.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-grid">
      <ComplaintForm onSubmit={handleSubmitComplaint} loading={loading} />

      <div className="stack">
        {latestReply ? (
          <section className="panel highlight-panel">
            <div className="panel-header">
              <h2>Automatic reply</h2>
              <p>Generated using sentence-embedding similarity against the complaint dataset.</p>
            </div>
            <p className="reply-preview">{latestReply.automatic_reply}</p>
            <div className="reply-tags">
              <span>{latestReply.category}</span>
              <span>{latestReply.department}</span>
              <span>{latestReply.status}</span>
            </div>
          </section>
        ) : null}

        {error ? <div className="panel error-banner">{error}</div> : null}

        <section className="stack">
          <div className="section-heading">
            <h2>Recent complaints</h2>
            <p>Showing only the two latest submissions from the complaint history.</p>
          </div>

          {recentComplaints.length === 0 ? (
            <div className="panel empty-state">No complaints submitted yet.</div>
          ) : (
            recentComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))
          )}
        </section>
      </div>
    </section>
  );
}

export default UserComplaint;
