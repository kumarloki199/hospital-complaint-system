import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import ComplaintList from "./pages/ComplaintList";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorLogin from "./pages/DoctorLogin";
import UserComplaint from "./pages/UserComplaint";
import "./styles.css";

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/doctor-login" replace />;
  }

  return children;
}

function App() {
  const [isDoctorAuthenticated, setIsDoctorAuthenticated] = useState(false);

  useEffect(() => {
    const storedLoginState = localStorage.getItem("doctorAuthenticated");
    setIsDoctorAuthenticated(storedLoginState === "true");
  }, []);

  const handleDoctorLogout = () => {
    localStorage.removeItem("doctorAuthenticated");
    setIsDoctorAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar isDoctorAuthenticated={isDoctorAuthenticated} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<UserComplaint />} />
            <Route path="/complaints" element={<ComplaintList />} />
            <Route
              path="/doctor-login"
              element={
                <DoctorLogin
                  isDoctorAuthenticated={isDoctorAuthenticated}
                  onLoginSuccess={() => setIsDoctorAuthenticated(true)}
                />
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute isAuthenticated={isDoctorAuthenticated}>
                  <DoctorDashboard onLogout={handleDoctorLogout} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
