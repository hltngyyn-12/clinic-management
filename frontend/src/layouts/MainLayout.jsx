import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function MainLayout() {
  const { user, setUser, role } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const notificationRef = useRef(null);
  const accountRef = useRef(null);

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
    { to: "/doctor/profile", label: "Quản lý hồ sơ" },
  ];

  const adminLinks = [
    { to: "/", label: "Trang chủ" },
    { to: "/admin/doctors", label: "Quản lý bác sĩ" },
    { to: "/admin/catalog", label: "Danh mục hệ thống" },
    { to: "/admin/operations", label: "Vận hành phòng khám" },
  ];

  const links =
    role === "DOCTOR"
      ? doctorLinks
      : role === "ADMIN"
        ? adminLinks
        : patientLinks;

  const roleLabel =
    role === "DOCTOR"
      ? "Bác sĩ"
      : role === "ADMIN"
        ? "Quản trị viên"
        : "Bệnh nhân";

  const profilePath = role === "PATIENT" ? "/patient/profile" : null;

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    api
      .get("/api/notifications/me")
      .then((response) => {
        setNotifications(response.data?.data || []);
      })
      .catch(() => {
        setNotifications([]);
      });
  }, [user, role]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notificationLabel = useMemo(() => {
    if (notifications.length === 0) return "Không có thông báo mới";
    if (notifications.length === 1) return "1 thông báo";
    return `${notifications.length} thông báo`;
  }, [notifications.length]);

  return (
    <div style={styles.pageShell}>
      <div style={styles.topbar}>
        <div style={styles.topbarWrap}>
          <span>Hotline tư vấn và đặt lịch: 1900 6868</span>
          <span>Thời gian tiếp nhận khám: 07:00 - 19:00 mỗi ngày</span>
          <span>
            Đặt lịch trực tuyến, tra cứu hồ sơ và kết quả xét nghiệm trên cùng
            một cổng thông tin
          </span>
        </div>
      </div>

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={styles.brandButton}
          >
            <span style={styles.brandMark}>
              <svg
                viewBox="0 0 64 64"
                aria-hidden="true"
                style={styles.brandLogo}
              >
                <circle cx="32" cy="32" r="30" fill="rgba(255,255,255,0.16)" />
                <path
                  d="M32 14c7.6 0 13.8 6.2 13.8 13.8 0 10.4-13.8 22.2-13.8 22.2S18.2 38.2 18.2 27.8C18.2 20.2 24.4 14 32 14Z"
                  fill="#ffffff"
                />
                <path
                  d="M35.8 23.4h-7.6v5.4h-5.4v7.6h5.4v5.4h7.6v-5.4h5.4v-7.6h-5.4Z"
                  fill="#0f4c81"
                />
              </svg>
            </span>
            <span>
              <span style={styles.brandName}>ClinicMS</span>
              <span style={styles.brandTag}>Hệ thống quản lý phòng khám</span>
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
                    borderColor: isActive
                      ? "rgba(15, 76, 129, 0.16)"
                      : "transparent",
                  })}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          ) : (
            <div style={styles.welcomeText}>
              Nền tảng hỗ trợ tiếp nhận lịch khám, lưu trữ hồ sơ điều trị và
              điều hành hoạt động phòng khám trên cùng một hệ thống.
            </div>
          )}

          <div style={styles.authWrap}>
            {!user ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  style={styles.ghostButton}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate("/register")}
                  style={styles.primaryButton}
                >
                  Đăng ký
                </button>
              </>
            ) : (
              <div style={styles.userCard}>
                <div ref={notificationRef} style={styles.notificationWrap}>
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationOpen((prev) => !prev);
                      setAccountOpen(false);
                    }}
                    style={styles.notificationButton}
                    aria-label="Thông báo hệ thống"
                  >
                    <span style={styles.bellIcon}>🔔</span>
                    {notifications.length > 0 ? (
                      <span style={styles.notificationBadge}>
                        {notifications.length}
                      </span>
                    ) : null}
                  </button>

                  {notificationOpen && (
                    <div style={styles.dropdown}>
                      <div style={styles.dropdownHeader}>
                        <strong>Thông báo hệ thống</strong>
                        <span style={styles.dropdownMeta}>
                          {notificationLabel}
                        </span>
                      </div>

                      {notifications.length === 0 ? (
                        <div style={styles.emptyDropdown}>
                          Hiện chưa có thông báo nào dành cho tài khoản này.
                        </div>
                      ) : (
                        <div style={styles.dropdownList}>
                          {notifications.map((item) => (
                            <article key={item.id} style={styles.dropdownItem}>
                              <div style={styles.dropdownItemTop}>
                                <strong style={styles.dropdownTitle}>
                                  {item.title}
                                </strong>
                                <span style={styles.dropdownDate}>
                                  {item.createdAt}
                                </span>
                              </div>
                              <p style={styles.dropdownMessage}>
                                {item.message}
                              </p>
                            </article>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div ref={accountRef} style={styles.accountMenuWrap}>
                  <button
                    type="button"
                    onClick={() => {
                      setAccountOpen((prev) => !prev);
                      setNotificationOpen(false);
                    }}
                    style={styles.accountButton}
                    aria-label="Mở menu tài khoản"
                  >
                    <div style={styles.avatar}>
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.userMeta}>
                      <div style={styles.userName}>
                        {user.fullName || user.username}
                      </div>
                      <div style={styles.userRole}>{roleLabel}</div>
                    </div>
                    <span style={styles.chevron}>▾</span>
                  </button>

                  {accountOpen && (
                    <div style={styles.accountDropdown}>
                      {profilePath ? (
                        <button
                          type="button"
                          style={styles.accountMenuItem}
                          onClick={() => {
                            setAccountOpen(false);
                            navigate(profilePath);
                          }}
                        >
                          Hồ sơ
                        </button>
                      ) : null}
                      <button
                        type="button"
                        style={{ ...styles.accountMenuItem, color: "#991b1b" }}
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
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
              ClinicMS là nền tảng quản lý phòng khám được thiết kế để kết nối
              quy trình đặt lịch, thăm khám, kê đơn, xét nghiệm và vận hành nội
              bộ trên một hệ thống đồng bộ, rõ ràng và dễ theo dõi.
            </p>
          </div>
          <div style={styles.footerMeta}>
            <span>Đặt lịch khám trực tuyến nhanh và thuận tiện</span>
            <span>Hồ sơ bệnh án điện tử và đơn thuốc đồng bộ</span>
            <span>Báo cáo vận hành và quản trị dữ liệu tập trung</span>
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
    boxShadow: "0 12px 22px rgba(15, 76, 129, 0.22)",
  },
  brandLogo: {
    width: "28px",
    height: "28px",
    display: "block",
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
    position: "relative",
  },
  notificationWrap: {
    position: "relative",
  },
  accountMenuWrap: {
    position: "relative",
  },
  notificationButton: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    border: "1px solid rgba(15, 76, 129, 0.14)",
    background: "#ffffff",
    color: "#0f4c81",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    position: "relative",
    boxShadow: "0 10px 18px rgba(15, 76, 129, 0.08)",
  },
  bellIcon: {
    fontSize: "18px",
    lineHeight: 1,
  },
  notificationBadge: {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    minWidth: "20px",
    height: "20px",
    borderRadius: "999px",
    background: "#dc2626",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 800,
    display: "grid",
    placeItems: "center",
    padding: "0 4px",
  },
  dropdown: {
    position: "absolute",
    top: "56px",
    right: 0,
    width: "380px",
    maxHeight: "420px",
    overflow: "hidden",
    background: "#fff",
    borderRadius: "20px",
    border: "1px solid rgba(147, 170, 193, 0.18)",
    boxShadow: "0 24px 48px rgba(19, 39, 66, 0.16)",
    zIndex: 60,
  },
  dropdownHeader: {
    padding: "16px 18px",
    borderBottom: "1px solid rgba(147, 170, 193, 0.16)",
    display: "grid",
    gap: "6px",
  },
  dropdownMeta: {
    color: "#6b8198",
    fontSize: "13px",
  },
  emptyDropdown: {
    padding: "18px",
    color: "#5f758d",
    lineHeight: 1.6,
  },
  dropdownList: {
    maxHeight: "340px",
    overflowY: "auto",
    display: "grid",
  },
  dropdownItem: {
    padding: "16px 18px",
    borderBottom: "1px solid rgba(147, 170, 193, 0.12)",
    display: "grid",
    gap: "8px",
  },
  dropdownItemTop: {
    display: "grid",
    gap: "4px",
  },
  dropdownTitle: {
    color: "#16324f",
    fontSize: "15px",
  },
  dropdownDate: {
    color: "#7a8fa6",
    fontSize: "12px",
  },
  dropdownMessage: {
    margin: 0,
    color: "#45617d",
    lineHeight: 1.65,
    fontSize: "14px",
  },
  accountButton: {
    border: "1px solid rgba(15, 76, 129, 0.14)",
    background: "#ffffff",
    borderRadius: "999px",
    padding: "8px 12px 8px 8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    boxShadow: "0 10px 18px rgba(15, 76, 129, 0.08)",
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
    flexShrink: 0,
  },
  userMeta: {
    minWidth: "122px",
    textAlign: "left",
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
  chevron: {
    color: "#7891aa",
    fontSize: "12px",
  },
  accountDropdown: {
    position: "absolute",
    top: "60px",
    right: 0,
    minWidth: "180px",
    background: "#fff",
    borderRadius: "18px",
    border: "1px solid rgba(147, 170, 193, 0.18)",
    boxShadow: "0 24px 48px rgba(19, 39, 66, 0.16)",
    padding: "8px",
    display: "grid",
    gap: "6px",
    zIndex: 60,
  },
  accountMenuItem: {
    border: "none",
    background: "#fff",
    color: "#16324f",
    padding: "12px 14px",
    borderRadius: "12px",
    textAlign: "left",
    fontWeight: 700,
    cursor: "pointer",
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
