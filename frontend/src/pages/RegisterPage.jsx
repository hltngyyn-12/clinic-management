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
    "Tạo tài khoản bệnh nhân trên ClinicMS để đặt lịch khám online, xem đơn thuốc điện tử và theo dõi kết quả xét nghiệm.",
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
      const response = await axios.post("http://localhost:8080/api/auth/register", form);
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
          <div style={styles.kicker}>Đăng ký tài khoản mới</div>
          <h1 style={styles.title}>Tạo tài khoản bệnh nhân để bắt đầu sử dụng dịch vụ trực tuyến</h1>
          <p style={styles.subtitle}>
            Sau khi đăng ký, bạn có thể đặt lịch khám online, thanh toán đặt cọc, xem lịch sử khám và nhận kết quả xét nghiệm ngay trên hệ thống.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              <input type="text" name="username" placeholder="Tên đăng nhập" value={form.username} onChange={handleChange} style={styles.input} />
              <input type="text" name="fullName" placeholder="Họ và tên" value={form.fullName} onChange={handleChange} style={styles.input} />
              <input type="email" name="email" placeholder="Địa chỉ email" value={form.email} onChange={handleChange} style={styles.input} />
              <input type="password" name="password" placeholder="Mật khẩu" value={form.password} onChange={handleChange} style={styles.input} />
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
          <h2 style={styles.sideTitle}>Một trải nghiệm bệnh nhân gọn gàng, tin cậy và dễ theo dõi</h2>
          <ul style={styles.list}>
            <li>Đặt lịch theo bác sĩ, ngày và khung giờ mong muốn</li>
            <li>Thanh toán đặt cọc cho lịch hẹn trực tuyến</li>
            <li>Xem lại lịch sử khám và chẩn đoán điều trị</li>
            <li>Tra cứu đơn thuốc điện tử mọi lúc</li>
            <li>Nhận kết quả xét nghiệm online và đánh giá bác sĩ sau khám</li>
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
