import { useEffect, useState } from "react";

import ComplaintCard from "../components/ComplaintCard";
import { fetchComplaints } from "../services/api";

function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const data = await fetchComplaints();
        setComplaints(data);
      } catch (requestError) {
        setError("Could not fetch complaints from the backend.");
      } finally {
        setLoading(false);
      }
    };

    loadComplaints();
  }, []);

  return (
    <section className="stack">
      <div className="section-heading">
        <h2>Complaint records</h2>
        <p>Full complaint list with automatic replies, doctor replies, and status updates.</p>
      </div>

      {loading ? <div className="panel empty-state">Loading complaints...</div> : null}
      {error ? <div className="panel error-banner">{error}</div> : null}

      {!loading && !error && complaints.length === 0 ? (
        <div className="panel empty-state">No complaint records found.</div>
      ) : null}

      {!loading && !error
        ? complaints.map((complaint) => <ComplaintCard key={complaint.id} complaint={complaint} />)
        : null}
    </section>
  );
}

export default ComplaintList;
