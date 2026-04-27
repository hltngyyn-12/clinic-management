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
    { to: "/", label: "Trang chủ" },
    { to: "/doctors", label: "Đặt lịch khám" },
    { to: "/appointments", label: "Lịch hẹn" },
    { to: "/medical-records", label: "Lịch sử khám" },
    { to: "/prescriptions", label: "Đơn thuốc" },
    { to: "/test-results", label: "Xét nghiệm" },
    { to: "/reviews", label: "Đánh giá" },
  ];

  const doctorLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/doctor/workspace", label: "Lịch làm việc" },
    { to: "/doctor/profile", label: "Hồ sơ bác sĩ" },
  ];

  const adminLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/admin/doctors", label: "Quản lý bác sĩ" },
    { to: "/admin/catalog", label: "Danh mục" },
    { to: "/admin/operations", label: "Vận hành" },
  ];

  const links =
    role === "DOCTOR" ? doctorLinks : role === "ADMIN" ? adminLinks : patientLinks;

  const roleLabel =
    role === "DOCTOR" ? "Bác sĩ" : role === "ADMIN" ? "Quản trị viên" : "Bệnh nhân";

  return (
    <div style={styles.pageShell}>
      <div style={styles.topbar}>
        <div style={styles.topbarWrap}>
          <span>Hotline: 1900 6868</span>
          <span>Thời gian làm việc: 07:00 - 19:00</span>
          <span>Đặt lịch và quản lý hồ sơ khám trực tuyến</span>
        </div>
      </div>

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <button type="button" onClick={() => navigate("/")} style={styles.brandButton}>
            <span style={styles.brandMark}>+</span>
            <span>
              <span style={styles.brandName}>ClinicMS</span>
              <span style={styles.brandTag}>Hệ thống quản lý phòng khám hiện đại</span>
            </span>
          </button>

          {user ? (
            <nav style={styles.navWrap}>
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  style={({ isActive }) => ({
                    ...styles.navLink,
                    background: isActive ? "#edf4ff" : "transparent",
                    color: isActive ? "#0f4c81" : "#47627d",
                    borderColor: isActive ? "rgba(15, 76, 129, 0.16)" : "transparent",
                  })}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          ) : (
            <div style={styles.welcomeText}>
              Cổng thông tin dành cho bệnh nhân, bác sĩ và quản trị viên trong cùng một hệ thống.
            </div>
          )}

          <div style={styles.authWrap}>
            {!user ? (
              <>
                <button onClick={() => navigate("/login")} style={styles.ghostButton}>
                  Đăng nhập
                </button>
                <button onClick={() => navigate("/register")} style={styles.primaryButton}>
                  Tạo tài khoản
                </button>
              </>
            ) : (
              <div style={styles.userCard}>
                <div style={styles.avatar}>{user.username?.charAt(0).toUpperCase()}</div>
                <div style={styles.userMeta}>
                  <div style={styles.userName}>{user.fullName || user.username}</div>
                  <div style={styles.userRole}>{roleLabel}</div>
                </div>
                <button onClick={handleLogout} style={styles.ghostButton}>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <Outlet />
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div>
            <strong style={styles.footerBrand}>ClinicMS</strong>
            <p style={styles.footerText}>
              Nền tảng quản lý phòng khám theo phong cách y tế hiện đại, giúp tối ưu trải nghiệm bệnh nhân và vận hành nội bộ.
            </p>
          </div>
          <div style={styles.footerMeta}>
            <span>Đặt lịch trực tuyến</span>
            <span>Đơn thuốc điện tử</span>
            <span>Kết quả xét nghiệm online</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;

const styles = {
  pageShell: {
    minHeight: "100vh",
    position: "relative",
  },
  topbar: {
    background: "#0f4c81",
    color: "rgba(255,255,255,0.88)",
    fontSize: "13px",
  },
  topbarWrap: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "10px 18px",
    display: "flex",
    gap: "18px",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  header: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    background: "rgba(243, 248, 252, 0.92)",
    backdropFilter: "blur(14px)",
    borderBottom: "1px solid rgba(147, 170, 193, 0.16)",
  },
  headerInner: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "18px",
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: "16px",
    alignItems: "center",
  },
  brandButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    color: "#16324f",
  },
  brandMark: {
    width: "46px",
    height: "46px",
    borderRadius: "16px",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, #0f4c81, #4f8fcf)",
    color: "#fff",
    fontWeight: 800,
    fontSize: "24px",
    boxShadow: "0 12px 22px rgba(15, 76, 129, 0.22)",
  },
  brandName: {
    display: "block",
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  brandTag: {
    display: "block",
    marginTop: "2px",
    color: "#6b8198",
    fontSize: "12px",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  navWrap: {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    flexWrap: "wrap",
    minWidth: 0,
  },
  navLink: {
    padding: "10px 14px",
    borderRadius: "999px",
    border: "1px solid transparent",
    fontWeight: 700,
    fontSize: "14px",
    textDecoration: "none",
  },
  welcomeText: {
    color: "#5f758d",
    lineHeight: 1.5,
    textAlign: "center",
    fontSize: "14px",
  },
  authWrap: {
    display: "flex",
    justifyContent: "flex-end",
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "#dceeff",
    color: "#0f4c81",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
    border: "1px solid rgba(15, 76, 129, 0.14)",
  },
  userMeta: {
    minWidth: "122px",
  },
  userName: {
    fontWeight: 800,
    color: "#16324f",
  },
  userRole: {
    color: "#6c8299",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  ghostButton: {
    border: "1px solid rgba(147, 170, 193, 0.28)",
    borderRadius: "999px",
    background: "#fff",
    color: "#14304a",
    padding: "10px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  primaryButton: {
    border: "none",
    borderRadius: "999px",
    background: "#0f4c81",
    color: "#fff",
    padding: "10px 18px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(15, 76, 129, 0.16)",
  },
  main: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "32px 18px 48px",
  },
  footer: {
    marginTop: "24px",
    borderTop: "1px solid rgba(147, 170, 193, 0.16)",
    background: "rgba(255,255,255,0.5)",
  },
  footerInner: {
    maxWidth: "1320px",
    margin: "0 auto",
    padding: "26px 18px 36px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: "20px",
    alignItems: "center",
  },
  footerBrand: {
    color: "#16324f",
    fontSize: "18px",
  },
  footerText: {
    margin: "10px 0 0",
    color: "#5f758d",
    lineHeight: 1.7,
    maxWidth: "720px",
  },
  footerMeta: {
    display: "grid",
    gap: "10px",
    color: "#6c8299",
    textAlign: "right",
    fontWeight: 600,
  },
};
