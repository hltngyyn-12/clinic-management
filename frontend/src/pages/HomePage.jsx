import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import usePageMeta from "../hooks/usePageMeta";

function HomePage() {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  usePageMeta(
    user ? "Tổng quan hệ thống" : "Cổng thông tin phòng khám",
    "ClinicMS giúp bệnh nhân đặt lịch khám, bác sĩ quản lý hồ sơ điều trị và quản trị viên vận hành phòng khám trên một nền tảng thống nhất.",
  );

  if (!user) {
    return (
      <div style={styles.page}>
        <section style={styles.publicHero}>
          <div style={styles.publicMain}>
            <div style={styles.kicker}>CHĂM SÓC Y TẾ THÔNG MINH</div>
            <h1 style={styles.publicTitle}>Cổng thông tin phòng khám theo chuẩn trải nghiệm bệnh viện hiện đại</h1>
            <p style={styles.publicText}>
              Từ đặt lịch khám trực tuyến, hồ sơ bệnh án số, đơn thuốc điện tử đến báo cáo vận hành, mọi quy trình đều được tổ chức rõ ràng, đáng tin cậy và dễ sử dụng.
            </p>
            <div style={styles.heroActions}>
              <button style={styles.primaryButton} onClick={() => navigate("/login")}>
                Đăng nhập hệ thống
              </button>
              <button style={styles.secondaryButton} onClick={() => navigate("/register")}>
                Tạo tài khoản bệnh nhân
              </button>
            </div>
          </div>

          <div style={styles.publicAside}>
            <div style={styles.highlightCard}>
              <span style={styles.highlightLabel}>Năng lực hiện tại</span>
              <strong style={styles.highlightValue}>3 vai trò, 18 nhóm tính năng</strong>
              <p style={styles.highlightText}>
                Bệnh nhân, bác sĩ và quản trị viên cùng làm việc trên một hệ thống, nhưng mỗi vai trò có giao diện và luồng thao tác riêng.
              </p>
            </div>
            <div style={styles.microStats}>
              <div style={styles.microStat}><strong>Online</strong><span>Đặt lịch và thanh toán đặt cọc</span></div>
              <div style={styles.microStat}><strong>Clinical</strong><span>Hồ sơ khám, kê đơn, xét nghiệm</span></div>
              <div style={styles.microStat}><strong>Operations</strong><span>Bác sĩ, danh mục, doanh thu, thông báo</span></div>
            </div>
          </div>
        </section>

        <section style={styles.serviceGrid}>
          {[
            {
              title: "Đặt lịch thuận tiện",
              description: "Bệnh nhân xem bác sĩ còn lịch trống, chọn ngày giờ và gửi lý do khám ngay trên giao diện web.",
            },
            {
              title: "Quy trình khám số hóa",
              description: "Bác sĩ xử lý ca khám, tạo hồ sơ, kê đơn và yêu cầu xét nghiệm trên cùng một không gian làm việc.",
            },
            {
              title: "Vận hành minh bạch",
              description: "Quản trị viên theo dõi dữ liệu bác sĩ, danh mục, cấu hình slot và báo cáo doanh thu tập trung.",
            },
          ].map((item) => (
            <article key={item.title} style={styles.serviceCard}>
              <div style={styles.serviceIcon}>+</div>
              <h3 style={styles.serviceTitle}>{item.title}</h3>
              <p style={styles.serviceText}>{item.description}</p>
            </article>
          ))}
        </section>
      </div>
    );
  }

  const patientCards = [
    {
      title: "Đặt lịch khám",
      description: "Chọn bác sĩ, ngày khám và khung giờ phù hợp, sau đó xác nhận lịch trực tuyến.",
      action: () => navigate("/doctors"),
    },
    {
      title: "Lịch hẹn của tôi",
      description: "Theo dõi lịch đã đặt, thanh toán đặt cọc và gửi đánh giá sau khi hoàn tất buổi khám.",
      action: () => navigate("/appointments"),
    },
    {
      title: "Lịch sử khám",
      description: "Xem lại chẩn đoán, ghi chú điều trị và thông tin của các lần khám trước đây.",
      action: () => navigate("/medical-records"),
    },
    {
      title: "Đơn thuốc điện tử",
      description: "Tra cứu đơn thuốc, liều dùng và hướng dẫn sử dụng theo từng hồ sơ khám.",
      action: () => navigate("/prescriptions"),
    },
    {
      title: "Kết quả xét nghiệm",
      description: "Theo dõi yêu cầu xét nghiệm, kết quả và kết luận mà không cần quay lại quầy tiếp nhận.",
      action: () => navigate("/test-results"),
    },
    {
      title: "Đánh giá bác sĩ",
      description: "Quản lý các phản hồi đã gửi và hoàn thiện trải nghiệm chăm sóc sau điều trị.",
      action: () => navigate("/reviews"),
    },
  ];

  const doctorCards = [
    {
      title: "Lịch khám hôm nay",
      description: "Mở không gian làm việc để xử lý danh sách bệnh nhân, hồ sơ khám, đơn thuốc và xét nghiệm.",
      action: () => navigate("/doctor/workspace"),
    },
    {
      title: "Hồ sơ bác sĩ",
      description: "Cập nhật thông tin hành nghề, số phòng, giờ làm việc và phí tư vấn để hiển thị nhất quán.",
      action: () => navigate("/doctor/profile"),
    },
  ];

  const adminCards = [
    {
      title: "Quản lý bác sĩ",
      description: "Tạo mới, cập nhật và theo dõi trạng thái hoạt động của tài khoản bác sĩ trong hệ thống.",
      action: () => navigate("/admin/doctors"),
    },
    {
      title: "Danh mục hệ thống",
      description: "Quản lý chuyên khoa và thuốc dùng cho toàn bộ quy trình khám và kê đơn.",
      action: () => navigate("/admin/catalog"),
    },
    {
      title: "Vận hành phòng khám",
      description: "Cấu hình slot, xem doanh thu và quản lý thông báo gửi đến từng nhóm người dùng.",
      action: () => navigate("/admin/operations"),
    },
  ];

  const cards =
    role === "DOCTOR" ? doctorCards : role === "ADMIN" ? adminCards : patientCards;

  const roleLabel =
    role === "DOCTOR" ? "Bác sĩ" : role === "ADMIN" ? "Quản trị viên" : "Bệnh nhân";

  return (
    <div style={styles.page}>
      <section style={styles.dashboardHero}>
        <div>
          <div style={styles.kicker}>{roleLabel}</div>
          <h1 style={styles.dashboardTitle}>Xin chào, {user.fullName || user.username}</h1>
          <p style={styles.dashboardText}>
            {role === "DOCTOR"
              ? "Truy cập nhanh toàn bộ quy trình khám bệnh trong ngày, từ tiếp nhận ca khám cho tới kê đơn và theo dõi lịch sử điều trị."
              : role === "ADMIN"
                ? "Quản trị toàn bộ dữ liệu nền, người dùng và hoạt động vận hành của phòng khám trên một giao diện rõ ràng, tập trung."
                : "Sử dụng cổng bệnh nhân để đặt lịch online, thanh toán đặt cọc, xem kết quả xét nghiệm và đơn thuốc điện tử mọi lúc."}
          </p>
        </div>

        <div style={styles.heroMetricPanel}>
          <div style={styles.heroMetricCard}>
            <span style={styles.heroMetricLabel}>Vai trò hiện tại</span>
            <strong style={styles.heroMetricValue}>{roleLabel}</strong>
          </div>
          <div style={styles.heroMetricCard}>
            <span style={styles.heroMetricLabel}>Trạng thái hệ thống</span>
            <strong style={styles.heroMetricValue}>Sẵn sàng tương tác</strong>
          </div>
        </div>
      </section>

      <section style={styles.dashboardGrid}>
        {cards.map((card) => (
          <button key={card.title} onClick={card.action} style={styles.featureCard}>
            <div style={styles.featureTop}>
              <span style={styles.featureChip}>Truy cập nhanh</span>
            </div>
            <h3 style={styles.featureTitle}>{card.title}</h3>
            <p style={styles.featureText}>{card.description}</p>
            <span style={styles.featureLink}>Mở chức năng</span>
          </button>
        ))}
      </section>
    </div>
  );
}

export default HomePage;

const styles = {
  page: {
    display: "grid",
    gap: "26px",
  },
  publicHero: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.3fr) minmax(280px, 0.78fr)",
    gap: "20px",
  },
  publicMain: {
    borderRadius: "32px",
    padding: "40px",
    background: "linear-gradient(160deg, #ffffff, #f4f9fd)",
    border: "1px solid rgba(147, 170, 193, 0.16)",
    boxShadow: "0 28px 60px rgba(19, 39, 66, 0.08)",
  },
  publicAside: {
    display: "grid",
    gap: "16px",
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
  publicTitle: {
    margin: "18px 0 0",
    fontSize: "48px",
    lineHeight: 1.08,
    letterSpacing: "-0.04em",
    color: "#16324f",
  },
  publicText: {
    margin: "18px 0 0",
    maxWidth: "760px",
    color: "#5f758d",
    lineHeight: 1.8,
    fontSize: "16px",
  },
  heroActions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "26px",
  },
  primaryButton: {
    border: "none",
    borderRadius: "16px",
    background: "#0f4c81",
    color: "#fff",
    padding: "14px 20px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 16px 30px rgba(15, 76, 129, 0.16)",
  },
  secondaryButton: {
    border: "1px solid rgba(147, 170, 193, 0.22)",
    borderRadius: "16px",
    background: "#fff",
    color: "#16324f",
    padding: "14px 20px",
    fontWeight: 700,
    cursor: "pointer",
  },
  highlightCard: {
    borderRadius: "28px",
    padding: "26px",
    background: "linear-gradient(160deg, #0f4c81, #2d6ea5)",
    color: "#fff",
    boxShadow: "0 24px 46px rgba(15, 76, 129, 0.2)",
  },
  highlightLabel: {
    display: "block",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.76)",
  },
  highlightValue: {
    display: "block",
    marginTop: "10px",
    fontSize: "28px",
    lineHeight: 1.2,
  },
  highlightText: {
    margin: "12px 0 0",
    color: "rgba(255,255,255,0.84)",
    lineHeight: 1.7,
  },
  microStats: {
    display: "grid",
    gap: "12px",
  },
  microStat: {
    borderRadius: "22px",
    padding: "18px",
    background: "rgba(255,255,255,0.92)",
    border: "1px solid rgba(147, 170, 193, 0.16)",
    boxShadow: "0 14px 28px rgba(19, 39, 66, 0.06)",
    display: "grid",
    gap: "6px",
    color: "#16324f",
  },
  serviceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },
  serviceCard: {
    background: "rgba(255,255,255,0.94)",
    borderRadius: "26px",
    padding: "24px",
    border: "1px solid rgba(147, 170, 193, 0.16)",
    boxShadow: "0 16px 30px rgba(19, 39, 66, 0.06)",
  },
  serviceIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    display: "grid",
    placeItems: "center",
    background: "#edf4ff",
    color: "#0f4c81",
    fontWeight: 800,
    fontSize: "24px",
  },
  serviceTitle: {
    margin: "18px 0 0",
    fontSize: "22px",
    color: "#16324f",
  },
  serviceText: {
    margin: "12px 0 0",
    color: "#5f758d",
    lineHeight: 1.7,
  },
  dashboardHero: {
    borderRadius: "30px",
    padding: "34px",
    background: "linear-gradient(160deg, #ffffff, #f4f9fd)",
    border: "1px solid rgba(147, 170, 193, 0.16)",
    boxShadow: "0 24px 52px rgba(19, 39, 66, 0.07)",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.2fr) minmax(260px, 0.75fr)",
    gap: "20px",
    alignItems: "center",
  },
  dashboardTitle: {
    margin: "18px 0 0",
    fontSize: "42px",
    lineHeight: 1.1,
    letterSpacing: "-0.04em",
  },
  dashboardText: {
    margin: "16px 0 0",
    color: "#5f758d",
    lineHeight: 1.8,
    maxWidth: "760px",
  },
  heroMetricPanel: {
    display: "grid",
    gap: "14px",
  },
  heroMetricCard: {
    padding: "20px",
    borderRadius: "22px",
    background: "#f7fbff",
    border: "1px solid rgba(147, 170, 193, 0.16)",
  },
  heroMetricLabel: {
    display: "block",
    fontSize: "12px",
    color: "#7d95ad",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  heroMetricValue: {
    display: "block",
    marginTop: "8px",
    fontSize: "24px",
    color: "#16324f",
  },
  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },
  featureCard: {
    textAlign: "left",
    border: "1px solid rgba(147, 170, 193, 0.16)",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.94)",
    padding: "24px",
    cursor: "pointer",
    boxShadow: "0 16px 32px rgba(19, 39, 66, 0.06)",
  },
  featureTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  featureChip: {
    display: "inline-flex",
    borderRadius: "999px",
    padding: "7px 10px",
    background: "#edf4ff",
    color: "#0f4c81",
    fontWeight: 800,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  featureTitle: {
    margin: "18px 0 0",
    fontSize: "22px",
    color: "#16324f",
  },
  featureText: {
    margin: "12px 0 0",
    color: "#5f758d",
    lineHeight: 1.7,
    minHeight: "74px",
  },
  featureLink: {
    marginTop: "18px",
    display: "inline-flex",
    color: "#0f4c81",
    fontWeight: 800,
  },
};
