import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={styles.hero}>
        <div>
          <h1 style={styles.title}>Clinic Management</h1>
          <p style={styles.subtitle}>
            Đăng nhập để đặt lịch khám, thanh toán đặt cọc và theo dõi hồ sơ sức
            khỏe online.
          </p>
          <button
            style={styles.primaryButton}
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const patientCards = [
    {
      title: "Book Appointment",
      description: "Chọn bác sĩ, ngày khám và giờ khám online.",
      action: () => navigate("/doctors"),
    },
    {
      title: "Appointment & Deposit",
      description: "Thanh toán đặt cọc và đánh giá bác sĩ sau khám.",
      action: () => navigate("/appointments"),
    },
    {
      title: "Medical History",
      description: "Xem lại lịch sử khám và chẩn đoán.",
      action: () => navigate("/medical-records"),
    },
    {
      title: "Prescriptions",
      description: "Xem đơn thuốc điện tử.",
      action: () => navigate("/prescriptions"),
    },
    {
      title: "Test Results",
      description: "Theo dõi kết quả xét nghiệm online.",
      action: () => navigate("/test-results"),
    },
    {
      title: "My Reviews",
      description: "Kiểm tra các đánh giá bạn đã gửi.",
      action: () => navigate("/reviews"),
    },
  ];

  const doctorCards = [
    {
      title: "Create Medical Record",
      description: "Ghi nhận chẩn đoán cho bệnh nhân sau buổi khám.",
      action: () => navigate("/doctor/create-record"),
    },
  ];

  const cards = role === "DOCTOR" ? doctorCards : patientCards;

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <div style={styles.badge}>{role || "USER"}</div>
          <h1 style={styles.title}>Welcome, {user.username}</h1>
          <p style={styles.subtitle}>
            {role === "DOCTOR"
              ? "Truy cập nhanh các công việc khám bệnh."
              : "Hãy trải nghiệm tính năng đặt lịch, thanh toán, xem lịch sử khám, đơn thuốc, kết quả xét nghiệm và đánh giá bác sĩ."}
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        {cards.map((card) => (
          <button key={card.title} onClick={card.action} style={styles.card}>
            <h3 style={styles.cardTitle}>{card.title}</h3>
            <p style={styles.cardDescription}>{card.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;

const styles = {
  page: {
    display: "grid",
    gap: "24px",
  },
  hero: {
    background: "linear-gradient(145deg, #0f172a, #155e75)",
    color: "#fff",
    borderRadius: "28px",
    padding: "34px",
    minHeight: "220px",
    display: "flex",
    alignItems: "center",
  },
  badge: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.15)",
    fontWeight: 700,
    fontSize: "12px",
    letterSpacing: "0.08em",
  },
  title: {
    margin: "14px 0 0",
    fontSize: "38px",
  },
  subtitle: {
    margin: "14px 0 0",
    maxWidth: "760px",
    color: "#dbeafe",
    lineHeight: 1.6,
  },
  primaryButton: {
    marginTop: "20px",
    border: "none",
    borderRadius: "14px",
    background: "#facc15",
    color: "#1f2937",
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  card: {
    textAlign: "left",
    border: "none",
    borderRadius: "20px",
    background: "#fff",
    padding: "22px",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
  },
  cardTitle: {
    margin: 0,
    color: "#0f172a",
  },
  cardDescription: {
    margin: "10px 0 0",
    color: "#64748b",
    lineHeight: 1.5,
  },
};
