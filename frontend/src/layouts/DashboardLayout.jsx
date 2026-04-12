import { Outlet, Link } from "react-router-dom";

function DashboardLayout() {
  const role = localStorage.getItem("role");

  return (
    <div style={styles.container}>
      
      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🏥 ClinicMS</h2>

        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>🏠 Home</Link>

          {role === "PATIENT" && (
            <>
              <Link to="/appointments" style={styles.link}>📅 My Appointments</Link>
              <Link to="/medical-record" style={styles.link}>📋 Medical Record</Link>
            </>
          )}

          {role === "DOCTOR" && (
            <>
              <Link to="/doctor/create-record" style={styles.link}>🩺 Create Record</Link>
            </>
          )}

          {role === "ADMIN" && (
            <>
              <Link to="/admin" style={styles.link}>⚙️ Admin Panel</Link>
            </>
          )}
        </nav>

        <button
          style={styles.logout}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          🚪 Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
  },

  sidebar: {
    width: "250px",
    background: "#111827",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logo: {
    marginBottom: "20px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  link: {
    color: "#ccc",
    textDecoration: "none",
    padding: "10px",
    borderRadius: "8px",
  },

  main: {
    flex: 1,
    padding: "30px",
    background: "#f5f7fb",
  },

  logout: {
    padding: "10px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },
};