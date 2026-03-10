function ComplaintCard({ complaint }) {
  return (
    <article className="panel complaint-card">
      <div className="complaint-card-top">
        <div>
          <p className="complaint-meta">{complaint.department}</p>
          <h3>{complaint.category}</h3>
        </div>
        <span className={`status-pill ${complaint.status}`}>{complaint.status}</span>
      </div>

      <p className="complaint-text">{complaint.complaint_text}</p>

      <div className="reply-box auto-reply">
        <strong>Automatic reply</strong>
        <p>{complaint.automatic_reply}</p>
      </div>

      {complaint.doctor_reply ? (
        <div className="reply-box manual-reply">
          <strong>Doctor reply</strong>
          <p>{complaint.doctor_reply}</p>
        </div>
      ) : null}
    </article>
  );
}

export default ComplaintCard;
