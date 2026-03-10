import { useState } from "react";

function ComplaintForm({ onSubmit, loading }) {
  const [complaintText, setComplaintText] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!complaintText.trim()) {
      return;
    }

    const shouldReset = await onSubmit(complaintText.trim());
    if (shouldReset) {
      setComplaintText("");
    }
  };

  return (
    <form className="panel form-panel" onSubmit={handleSubmit}>
      <div className="panel-header">
        <h2>Submit a complaint</h2>
        <p>Describe the issue clearly so the correct department can review it.</p>
      </div>

      <label className="field">
        <span>Complaint details</span>
        <textarea
          value={complaintText}
          onChange={(event) => setComplaintText(event.target.value)}
          rows="6"
          placeholder="Example: I have been waiting too long for my cardiology follow-up and my symptoms are getting worse."
        />
      </label>

      <button className="primary-button" type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit Complaint"}
      </button>
    </form>
  );
}

export default ComplaintForm;
