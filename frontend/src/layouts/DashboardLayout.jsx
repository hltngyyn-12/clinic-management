import { Outlet, Link } from "react-router-dom";

function DashboardLayout() {
  const role = localStorage.getItem("role");

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>ClinicMS</h2>

        <nav style={styles.nav}>
          <Link to="/" style={styles.link}>Trang chủ</Link>

          {role === "PATIENT" && (
            <>
              <Link to="/appointments" style={styles.link}>Lịch hẹn của tôi</Link>
              <Link to="/medical-records" style={styles.link}>Lịch sử khám</Link>
            </>
          )}

          {role === "DOCTOR" && (
            <Link to="/doctor/workspace" style={styles.link}>Lịch làm việc</Link>
          )}

          {role === "ADMIN" && (
            <Link to="/admin/doctors" style={styles.link}>Quản trị hệ thống</Link>
          )}
        </nav>

        <button
          style={styles.logout}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login";
          }}
        >
          Đăng xuất
        </button>
      </div>

      <div style={styles.main}>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;

const styles = {
  container: { display: "flex", minHeight: "100vh" },
  sidebar: {
    width: "250px",
    background: "#111827",
    color: "#fff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: { marginBottom: "20px" },
  nav: { display: "flex", flexDirection: "column", gap: "10px" },
  link: { color: "#ccc", textDecoration: "none", padding: "10px", borderRadius: "8px" },
  main: { flex: 1, padding: "30px", background: "#f5f7fb" },
  logout: { padding: "10px", background: "#ef4444", color: "#fff", border: "none", borderRadius: "8px" },
};
