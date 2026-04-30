import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";
import usePageMeta from "../hooks/usePageMeta";

function LoginPage() {
  const [form, setForm] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  usePageMeta(
    "Đăng nhập hệ thống",
    "Đăng nhập ClinicMS để truy cập cổng bệnh nhân, không gian làm việc của bác sĩ hoặc khu vực quản trị vận hành phòng khám trên hệ thống.",
  );

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const normalizeRole = (user) => {
    if (!user) return null;
    if (typeof user.role === "string" && user.role.trim())
      return user.role.trim().toUpperCase();
    if (Array.isArray(user.roles) && user.roles.length > 0)
      return String(user.roles[0]).replace("ROLE_", "").toUpperCase();
    if (Array.isArray(user.authorities) && user.authorities.length > 0)
      return String(user.authorities[0]).replace("ROLE_", "").toUpperCase();
    return null;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.usernameOrEmail.trim() || !form.password.trim()) {
      alert("Vui lòng nhập tên đăng nhập hoặc email và mật khẩu.");
      return;
    }

    try {
      setLoading(true);

      const loginRes = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          usernameOrEmail: form.usernameOrEmail.trim(),
          password: form.password.trim(),
        },
      );

      const loginData = loginRes.data?.data || loginRes.data;
      const token = loginData?.token;

      if (!token) {
        alert("Hệ thống chưa trả về thông tin phiên đăng nhập.");
        return;
      }

      localStorage.setItem("token", token);

      const meRes = await axios.get("http://localhost:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const meData = meRes.data?.data || meRes.data;
      const role = normalizeRole(meData);
      const normalizedUser = { ...meData, role };

      localStorage.setItem("user", JSON.stringify(normalizedUser));
      if (role) localStorage.setItem("role", role);

      setUser(normalizedUser);
      alert("Đăng nhập thành công.");

      if (role === "DOCTOR") {
        navigate("/doctor/workspace");
      } else if (role === "ADMIN") {
        navigate("/admin/doctors");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(getErrorMessage(error, "Đăng nhập thất bại."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.hero}>
          <div style={styles.heroBadge}>Truy cập an toàn</div>
          <h1 style={styles.heroTitle}>
            Đăng nhập để sử dụng đầy đủ các chức năng dành cho bệnh nhân, bác sĩ
            và quản trị viên
          </h1>
          <p style={styles.heroText}>
            Từ cùng một tài khoản hệ thống, mỗi vai trò sẽ được đưa đến đúng khu
            vực làm việc của mình: bệnh nhân quản lý lịch hẹn và hồ sơ điều trị,
            bác sĩ xử lý ca khám trong ngày, còn quản trị viên điều hành dữ liệu
            và hoạt động phòng khám.
          </p>
          <div style={styles.featureList}>
            <span style={styles.featureItem}>Đặt lịch khám trực tuyến</span>
            <span style={styles.featureItem}>Hồ sơ bệnh án điện tử</span>
            <span style={styles.featureItem}>
              Bảng điều hành vận hành phòng khám
            </span>
          </div>
        </section>

        <section style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.title}>Đăng nhập hệ thống</h2>
            <p style={styles.subtitle}>
              Nhập thông tin tài khoản để tiếp tục làm việc trên ClinicMS.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Tên đăng nhập hoặc email</label>
              <input
                type="text"
                name="usernameOrEmail"
                value={form.usernameOrEmail}
                onChange={handleChange}
                placeholder="Nhập tên đăng nhập hoặc email đã đăng ký"
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu của bạn"
                style={styles.input}
              />
            </div>

            <button type="submit" disabled={loading} style={styles.button}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p style={styles.footerText}>
            Chưa có tài khoản?{" "}
            <span style={styles.linkText} onClick={() => navigate("/register")}>
              Tạo tài khoản
            </span>
          </p>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "28px",
  },
  shell: {
    width: "100%",
    maxWidth: "1180px",
    display: "grid",
    gridTemplateColumns: "minmax(320px, 1.08fr) minmax(360px, 0.92fr)",
    gap: "24px",
    alignItems: "stretch",
  },
  hero: {
    borderRadius: "32px",
    padding: "40px",
    background: "linear-gradient(160deg, #0f4c81, #4f8fcf)",
    color: "#fff",
    display: "grid",
    alignContent: "center",
    boxShadow: "0 28px 60px rgba(15, 76, 129, 0.16)",
  },
  heroBadge: {
    display: "inline-flex",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.14)",
    fontWeight: 800,
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  heroTitle: {
    margin: "18px 0 0",
    fontSize: "42px",
    lineHeight: 1.1,
    letterSpacing: "-0.03em",
  },
  heroText: {
    margin: "16px 0 0",
    maxWidth: "560px",
    color: "rgba(255,255,255,0.88)",
    lineHeight: 1.75,
  },
  featureList: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "24px",
  },
  featureItem: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.14)",
    fontWeight: 700,
  },
  card: {
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(147, 170, 193, 0.16)",
    borderRadius: "32px",
    padding: "34px",
    boxShadow: "0 22px 48px rgba(19, 39, 66, 0.08)",
  },
  cardHeader: {
    marginBottom: "24px",
  },
  title: {
    margin: 0,
    fontSize: "30px",
  },
  subtitle: {
    margin: "12px 0 0",
    color: "#5f758d",
    lineHeight: 1.6,
  },
  form: {
    display: "grid",
    gap: "16px",
  },
  field: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontWeight: 700,
    color: "#16324f",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "16px",
    border: "1px solid rgba(147, 170, 193, 0.26)",
    fontSize: "15px",
    background: "#fff",
  },
  button: {
    width: "100%",
    padding: "14px",
    borderRadius: "16px",
    border: "none",
    background: "#0f4c81",
    color: "#fff",
    fontWeight: 800,
    cursor: "pointer",
    marginTop: "6px",
    boxShadow: "0 14px 26px rgba(15, 76, 129, 0.16)",
  },
  footerText: {
    textAlign: "center",
    marginTop: "20px",
    marginBottom: 0,
    color: "#5f758d",
  },
  linkText: {
    color: "#0f4c81",
    cursor: "pointer",
    fontWeight: 800,
  },
};
