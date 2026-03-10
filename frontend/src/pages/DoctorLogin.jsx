import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const DOCTOR_USERNAME = "Dr. Venugopal";
const DOCTOR_PASSWORD = "asdfghjkl";

function DoctorLogin({ isDoctorAuthenticated, onLoginSuccess }) {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      formState.username === DOCTOR_USERNAME &&
      formState.password === DOCTOR_PASSWORD
    ) {
      // Persist the single doctor login so protected routes survive refreshes.
      localStorage.setItem("doctorAuthenticated", "true");
      onLoginSuccess();
      setError("");
      navigate("/doctor-dashboard");
      return;
    }

    setError("Invalid credentials");
  };

  if (isDoctorAuthenticated) {
    return <Navigate to="/doctor-dashboard" replace />;
  }

  return (
    <section className="auth-shell">
      <form className="panel auth-card" onSubmit={handleSubmit}>
        <div className="panel-header">
          <h2>Doctor login</h2>
          <p>Enter the configured doctor account to access the dashboard.</p>
        </div>

        <label className="field">
          <span>Username</span>
          <input
            name="username"
            value={formState.username}
            onChange={handleChange}
            placeholder="Dr. Venugopal"
          />
        </label>

        <label className="field">
          <span>Password</span>
          <input
            type="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            placeholder="asdfghjkl"
          />
        </label>

        {error ? <div className="error-text">{error}</div> : null}

        <button className="primary-button" type="submit">
          Open Dashboard
        </button>
      </form>
    </section>
  );
}

export default DoctorLogin;
