import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta";

function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "PATIENT",
  });

  const [loading, setLoading] = useState(false);

  usePageMeta(
    "Đăng ký tài khoản",
    "Tạo tài khoản trên ClinicMS để đặt lịch khám trực tuyến, thanh toán đặt cọc, xem đơn thuốc, kết quả xét nghiệm và lịch sử khám bệnh.",
  );

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.username || !form.email || !form.password || !form.fullName) {
      alert("Vui lòng điền đầy đủ thông tin đăng ký.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        form,
      );
      alert(response.data?.message || "Tạo tài khoản thành công.");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Tạo tài khoản thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        <section style={styles.card}>
          <div style={styles.kicker}>Tạo tài khoản mới</div>
          <h1 style={styles.title}>
            Đăng ký tài khoản để chủ động đặt lịch và theo dõi quá trình điều
            trị
          </h1>
          <p style={styles.subtitle}>
            Sau khi đăng ký, bạn có thể tự tạo lịch hẹn, xem hồ sơ khám bệnh,
            theo dõi đơn thuốc và nhận kết quả xét nghiệm trực tuyến trên cùng
            một tài khoản.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                value={form.username}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                type="text"
                name="fullName"
                placeholder="Họ và tên"
                value={form.fullName}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                type="email"
                name="email"
                placeholder="Địa chỉ email"
                value={form.email}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={form.password}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <button style={styles.button} disabled={loading}>
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>

          <p style={styles.footerText}>
            Đã có tài khoản?{" "}
            <span style={styles.linkText} onClick={() => navigate("/login")}>
              Đăng nhập ngay
            </span>
          </p>
        </section>

        <section style={styles.sideCard}>
          <div style={styles.sideBadge}>Lợi ích khi sử dụng ClinicMS</div>
          <h2 style={styles.sideTitle}>
            Một tài khoản duy nhất để theo dõi toàn bộ hành trình khám bệnh
          </h2>
          <ul style={styles.list}>
            <li>Đặt lịch khám theo bác sĩ, ngày khám và khung giờ mong muốn</li>
            <li>
              Theo dõi trạng thái lịch hẹn và hoàn tất thanh toán đặt cọc trực
              tuyến
            </li>
            <li>Tra cứu hồ sơ khám bệnh, chẩn đoán và lịch tái khám khi cần</li>
            <li>Xem đơn thuốc điện tử và hướng dẫn sử dụng thuốc rõ ràng</li>
            <li>Nhận kết quả xét nghiệm và gửi đánh giá sau buổi khám</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "28px",
  },
  shell: {
    width: "100%",
    maxWidth: "1120px",
    display: "grid",
    gridTemplateColumns: "minmax(380px, 1.05fr) minmax(300px, 0.82fr)",
    gap: "24px",
    alignItems: "stretch",
  },
  card: {
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(147, 170, 193, 0.16)",
    padding: "34px",
    borderRadius: "32px",
    boxShadow: "0 22px 48px rgba(19, 39, 66, 0.08)",
  },
  kicker: {
    display: "inline-flex",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#edf4ff",
    color: "#0f4c81",
    fontWeight: 800,
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  title: {
    margin: "18px 0 0",
    fontSize: "36px",
    lineHeight: 1.12,
    letterSpacing: "-0.03em",
  },
  subtitle: {
    margin: "14px 0 0",
    color: "#5f758d",
    lineHeight: 1.75,
  },
  form: {
    display: "grid",
    gap: "18px",
    marginTop: "28px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
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
  sideCard: {
    borderRadius: "32px",
    padding: "34px",
    background: "linear-gradient(160deg, #ffffff, #f4f9fd)",
    border: "1px solid rgba(147, 170, 193, 0.16)",
    boxShadow: "0 22px 48px rgba(19, 39, 66, 0.07)",
    display: "grid",
    alignContent: "center",
  },
  sideBadge: {
    display: "inline-flex",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "#edf4ff",
    color: "#0f4c81",
    fontWeight: 800,
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  sideTitle: {
    margin: "18px 0 0",
    fontSize: "30px",
    lineHeight: 1.18,
  },
  list: {
    margin: "18px 0 0",
    paddingLeft: "20px",
    lineHeight: 1.9,
    color: "#5f758d",
  },
};
