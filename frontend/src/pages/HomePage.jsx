import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import usePageMeta from "../hooks/usePageMeta";

function HomePage() {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  usePageMeta(
    user ? "Trang chủ" : "ClinicMS | Hệ thống quản lý phòng khám",
    "ClinicMS giúp bệnh nhân đặt lịch khám trực tuyến, theo dõi lịch sử điều trị; hỗ trợ bác sĩ quản lý hồ sơ bệnh án điện tử; đồng thời giúp phòng khám vận hành lịch làm việc, thuốc, chuyên khoa và doanh thu trên một nền tảng thống nhất.",
  );

  if (!user) {
    return (
      <div style={styles.page}>
        <section style={styles.publicHero}>
          <div style={styles.publicMain}>
            <div style={styles.kicker}>Nền tảng quản lý phòng khám</div>
            <h1 style={styles.publicTitle}>
              Đặt lịch khám, theo dõi điều trị và vận hành phòng khám trên một
              hệ thống thống nhất
            </h1>
            <p style={styles.publicText}>
              ClinicMS được xây dựng cho mô hình phòng khám hiện đại: bệnh nhân
              chủ động chọn bác sĩ và khung giờ phù hợp, bác sĩ xử lý hồ sơ bệnh
              án điện tử ngay trong ngày khám, còn bộ phận quản trị theo dõi
              lịch làm việc, danh mục chuyên môn và báo cáo vận hành trên cùng
              một nền tảng.
            </p>
            <div style={styles.heroActions}>
              <button
                style={styles.primaryButton}
                onClick={() => navigate("/login")}
              >
                Đăng nhập hệ thống
              </button>
              <button
                style={styles.secondaryButton}
                onClick={() => navigate("/register")}
              >
                Tạo tài khoản
              </button>
            </div>
          </div>

          <div style={styles.publicAside}>
            <div style={styles.highlightCard}>
              <span style={styles.highlightLabel}>Phạm vi vận hành</span>
              <strong style={styles.highlightValue}>
                Bệnh nhân, bác sĩ và quản trị viên trên cùng một nền tảng
              </strong>
              <p style={styles.highlightText}>
                Mỗi vai trò có khu vực làm việc riêng, nhưng toàn bộ dữ liệu đều
                được đồng bộ để quy trình tiếp nhận, khám bệnh, kê đơn và theo
                dõi sau khám diễn ra liền mạch hơn.
              </p>
            </div>
            <div style={styles.microStats}>
              <div style={styles.microStat}>
                <strong>Đặt lịch rõ ràng</strong>
                <span>
                  Xem bác sĩ, khung giờ còn trống và tạo lịch hẹn trực tuyến
                  trong vài bước.
                </span>
              </div>
              <div style={styles.microStat}>
                <strong>Hồ sơ điều trị tập trung</strong>
                <span>
                  Lưu chẩn đoán, đơn thuốc, chỉ định xét nghiệm và lịch sử khám
                  bệnh ở cùng một nơi.
                </span>
              </div>
              <div style={styles.microStat}>
                <strong>Quản trị vận hành thuận tiện</strong>
                <span>
                  Theo dõi bác sĩ, thuốc, chuyên khoa, slot khám và doanh thu
                  trên giao diện thống nhất.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section style={styles.serviceGrid}>
          {[
            {
              title: "Đặt lịch khám chủ động, không cần chờ gọi điện",
              description:
                "Người bệnh có thể tra cứu bác sĩ theo chuyên khoa, xem thời gian còn trống và gửi yêu cầu thăm khám trực tiếp trên website, giảm bớt các bước đặt lịch thủ công.",
            },
            {
              title: "Theo dõi điều trị thuận tiện hơn sau mỗi lần khám",
              description:
                "Hồ sơ khám bệnh, đơn thuốc điện tử, kết quả xét nghiệm và nhận xét sau khám được lưu lại đầy đủ để cả bệnh nhân lẫn bác sĩ dễ tra cứu khi cần.",
            },
            {
              title: "Vận hành phòng khám nhất quán và dễ kiểm soát",
              description:
                "Phòng khám có thể quản lý bác sĩ, chuyên khoa, thuốc, lịch làm việc, thông báo và báo cáo doanh thu trên cùng một hệ thống thay vì tách rời nhiều công cụ.",
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
      title: "Đặt lịch khám theo bác sĩ và khung giờ phù hợp",
      description:
        "Tra cứu bác sĩ theo chuyên khoa, xem lịch trống và tạo lịch hẹn mới phù hợp với nhu cầu thăm khám của bạn.",
      action: () => navigate("/doctors"),
    },
    {
      title: "Theo dõi lịch hẹn và hoàn tất thanh toán đặt cọc",
      description:
        "Quản lý các lịch đã đặt, kiểm tra trạng thái thanh toán và xem hóa đơn cho từng lần khám ngay trong cổng bệnh nhân.",
      action: () => navigate("/appointments"),
    },
    {
      title: "Xem lại lịch sử khám và thông tin điều trị",
      description:
        "Tra cứu các chẩn đoán, ghi chú điều trị và lịch tái khám từ những lần khám trước để theo dõi sức khỏe đầy đủ hơn.",
      action: () => navigate("/medical-records"),
    },
    {
      title: "Kiểm tra đơn thuốc điện tử",
      description:
        "Xem tên thuốc, liều dùng, thời gian sử dụng và hướng dẫn dùng thuốc theo từng hồ sơ khám bệnh.",
      action: () => navigate("/prescriptions"),
    },
    {
      title: "Nhận kết quả xét nghiệm trực tuyến",
      description:
        "Theo dõi chỉ định xét nghiệm, kết quả và kết luận chuyên môn mà không cần chờ nhận bản giấy tại quầy.",
      action: () => navigate("/test-results"),
    },
    {
      title: "Gửi đánh giá sau buổi khám",
      description:
        "Chia sẻ trải nghiệm thăm khám và mức độ hài lòng để phòng khám tiếp tục cải thiện chất lượng dịch vụ.",
      action: () => navigate("/reviews"),
    },
  ];

  const doctorCards = [
    {
      title: "Xử lý lịch khám và hồ sơ bệnh án trong ngày",
      description:
        "Tiếp nhận lịch hẹn, ghi chẩn đoán, lập hồ sơ bệnh án, kê đơn thuốc và chỉ định xét nghiệm ngay trong không gian làm việc của bác sĩ.",
      action: () => navigate("/doctor/workspace"),
    },
    {
      title: "Cập nhật hồ sơ chuyên môn và lịch làm việc",
      description:
        "Quản lý thông tin hiển thị cho bệnh nhân như chuyên khoa, thời gian làm việc, số phòng và phần giới thiệu chuyên môn.",
      action: () => navigate("/doctor/profile"),
    },
  ];

  const adminCards = [
    {
      title: "Quản lý tài khoản và hồ sơ bác sĩ",
      description:
        "Theo dõi danh sách bác sĩ, tạo mới hoặc cập nhật thông tin hành nghề và trạng thái hoạt động trên hệ thống.",
      action: () => navigate("/admin/doctors"),
    },
    {
      title: "Duy trì danh mục chuyên khoa và thuốc",
      description:
        "Cập nhật dữ liệu nền tảng để hỗ trợ đặt lịch, kê đơn thuốc và vận hành phòng khám nhất quán hơn.",
      action: () => navigate("/admin/catalog"),
    },
    {
      title: "Điều hành slot khám, doanh thu và thông báo",
      description:
        "Theo dõi các cấu hình vận hành quan trọng của phòng khám trên một khu vực quản trị tập trung.",
      action: () => navigate("/admin/operations"),
    },
  ];

  const cards =
    role === "DOCTOR"
      ? doctorCards
      : role === "ADMIN"
        ? adminCards
        : patientCards;

  const roleLabel =
    role === "DOCTOR"
      ? "Bác sĩ"
      : role === "ADMIN"
        ? "Quản trị viên"
        : "Bệnh nhân";

  return (
    <div style={styles.page}>
      <section style={styles.dashboardHero}>
        <div>
          <div style={styles.kicker}>{roleLabel}</div>
          <h1 style={styles.dashboardTitle}>
            Xin chào, {user.fullName || user.username}
          </h1>
          <p style={styles.dashboardText}>
            {role === "DOCTOR"
              ? "Đây là khu vực làm việc dành cho bác sĩ: theo dõi lịch khám trong ngày, cập nhật hồ sơ bệnh án, kê đơn thuốc và xem lại toàn bộ lịch sử điều trị của bệnh nhân."
              : role === "ADMIN"
                ? "Đây là khu vực điều hành dành cho quản trị viên: quản lý dữ liệu nền, tài khoản bác sĩ và các hoạt động vận hành quan trọng của phòng khám."
                : "Đây là cổng thông tin dành cho bệnh nhân: đặt lịch khám trực tuyến, thanh toán đặt cọc, xem đơn thuốc, kết quả xét nghiệm và lịch sử khám bệnh."}
          </p>
        </div>

        <div style={styles.heroMetricPanel}>
          <div style={styles.heroMetricCard}>
            <span style={styles.heroMetricLabel}>Vai trò đang đăng nhập</span>
            <strong style={styles.heroMetricValue}>{roleLabel}</strong>
          </div>
          <div style={styles.heroMetricCard}>
            <span style={styles.heroMetricLabel}>Trạng thái hệ thống</span>
            <strong style={styles.heroMetricValue}>Đang sẵn sàng</strong>
          </div>
        </div>
      </section>

      <section style={styles.dashboardGrid}>
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={card.action}
            style={styles.featureCard}
          >
            <div style={styles.featureTop}>
              <span style={styles.featureChip}>Truy cập nhanh</span>
            </div>
            <h3 style={styles.featureTitle}>{card.title}</h3>
            <p style={styles.featureText}>{card.description}</p>
            <span style={styles.featureLink}>Bắt đầu sử dụng</span>
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
