import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function MainLayout() {
  const { user, setUser, role } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const patientLinks = [
    { to: "/", label: "Home" },
    { to: "/doctors", label: "Book" },
    { to: "/appointments", label: "Appointments" },
    { to: "/medical-records", label: "History" },
    { to: "/prescriptions", label: "Prescriptions" },
    { to: "/test-results", label: "Tests" },
    { to: "/reviews", label: "Reviews" },
  ];

  const doctorLinks = [
    { to: "/", label: "Home" },
    { to: "/doctor/workspace", label: "Workspace" },
    { to: "/doctor/profile", label: "Profile" },
  ];

  const links = role === "DOCTOR" ? doctorLinks : patientLinks;

  return (
    <div style={{ minHeight: "100vh", background: "#eef2ff" }}>
      <div style={styles.navbar}>
        <div onClick={() => navigate("/")} style={styles.brand}>
          ClinicMS
        </div>

        {user && (
          <div style={styles.linkWrap}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  ...styles.link,
                  background: isActive ? "#dbeafe" : "transparent",
                  color: isActive ? "#0f172a" : "#475569",
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        )}

        <div style={styles.authWrap}>
          {!user ? (
            <>
              <button onClick={() => navigate("/login")} style={styles.ghostButton}>
                Login
              </button>
              <button onClick={() => navigate("/register")} style={styles.primaryButton}>
                Register
              </button>
            </>
          ) : (
            <>
              <div style={styles.avatar}>{user.username?.charAt(0).toUpperCase()}</div>
              <div>
                <div style={styles.userName}>{user.username}</div>
                <div style={styles.userRole}>{role}</div>
              </div>
              <button onClick={handleLogout} style={styles.ghostButton}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      <div style={{ padding: "30px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;

const styles = {
  navbar: {
    minHeight: "74px",
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 26px",
    gap: "18px",
    flexWrap: "wrap",
    position: "sticky",
    top: 0,
    zIndex: 20,
  },
  brand: {
    fontSize: "22px",
    fontWeight: 800,
    color: "#0f172a",
    cursor: "pointer",
  },
  linkWrap: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },
  link: {
    textDecoration: "none",
    borderRadius: "999px",
    padding: "10px 14px",
    fontWeight: 600,
  },
  authWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
  },
  ghostButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "999px",
    background: "#fff",
    color: "#0f172a",
    padding: "10px 14px",
    fontWeight: 600,
    cursor: "pointer",
  },
  primaryButton: {
    border: "none",
    borderRadius: "999px",
    background: "#0f766e",
    color: "#fff",
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#0f766e",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
  },
  userName: {
    fontWeight: 700,
    color: "#0f172a",
  },
  userRole: {
    color: "#64748b",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
};
