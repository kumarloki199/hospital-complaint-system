import { NavLink } from "react-router-dom";

function Navbar({ isDoctorAuthenticated }) {
  const links = [
    { to: "/", label: "Patient Portal" },
    { to: "/complaints", label: "Complaint List" },
    isDoctorAuthenticated
      ? { to: "/doctor-dashboard", label: "Doctor Dashboard" }
      : { to: "/doctor-login", label: "Doctor Login" },
  ];

  return (
    <header className="app-header">
      <div>
        <p className="eyebrow">Hospital Support</p>
        <h1>Hospital Complaint Handling System</h1>
      </div>
      <nav className="nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

export default Navbar;
