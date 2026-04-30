import { Link, useSearchParams } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta";
import {
  createHero,
  createStatusPill,
  gradients,
  ui,
} from "../styles/designSystem";

function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") || "failed";
  const appointmentId = searchParams.get("appointmentId");
  const success = status === "success";
  const code = searchParams.get("code") || "";
  const message = getMessageByCode(code, success);

  usePageMeta(
    success ? "Thanh toán thành công" : "Thanh toán chưa hoàn tất",
    "Thông báo kết quả thanh toán đặt cọc lịch khám tại ClinicMS, bao gồm thanh toán MoMo ATM test và thanh toán nội bộ.",
  );

  return (
    <div style={ui.page}>
      <section style={createHero(success ? gradients.patient : gradients.admin)}>
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={ui.eyebrow}>Kết quả thanh toán</div>
          <h1 style={ui.title}>
            {success ? "Thanh toán đặt cọc thành công" : "Thanh toán chưa hoàn tất"}
          </h1>
          <p style={ui.subtitle}>
            {success
              ? "Hệ thống đã ghi nhận giao dịch đặt cọc và cập nhật trạng thái lịch hẹn của bạn."
              : "Cổng thanh toán chưa xác nhận giao dịch. Bạn có thể quay lại danh sách lịch hẹn để thử lại hoặc chọn phương thức khác."}
          </p>
        </div>
      </section>

      <section style={ui.card}>
        <div style={ui.sectionHeader}>
          <div>
            <h2 style={ui.sectionTitle}>Chi tiết giao dịch</h2>
            <p style={ui.sectionHint}>
              Kiểm tra nhanh trạng thái xử lý, thông điệp phản hồi và bước tiếp theo.
            </p>
          </div>
          <div style={createStatusPill(success ? "success" : "warning")}>
            {success ? "Đã thanh toán" : "Thất bại"}
          </div>
        </div>

        <div style={{ ...ui.panelSoft, marginTop: "18px", display: "grid", gap: "12px" }}>
          <div>
            <div style={ui.label}>Thông điệp</div>
            <div style={styles.value}>{message}</div>
          </div>
          <div>
            <div style={ui.label}>Mã lịch hẹn</div>
            <div style={styles.value}>{appointmentId || "Không xác định"}</div>
          </div>
        </div>

        <div style={{ ...ui.actionRow, marginTop: "20px" }}>
          <Link to="/appointments" style={styles.linkButtonPrimary}>
            Quay lại lịch hẹn
          </Link>

          {success && appointmentId && (
            <Link to={`/invoices/${appointmentId}`} style={styles.linkButtonSecondary}>
              Xem hóa đơn
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}

function getMessageByCode(code, success) {
  const messages = {
    SUCCESS: "Thanh toán đặt cọc thành công.",
    CALLBACK_ERROR: "Không thể xác nhận giao dịch MoMo.",
    INVALID_SIGNATURE: "Chữ ký xác thực MoMo không hợp lệ.",
    "0": "Thanh toán đặt cọc thành công.",
    "1000": "Giao dịch đang được khởi tạo.",
    "1001": "Giao dịch thanh toán thất bại.",
    "1002": "Giao dịch bị từ chối do nhà phát hành tài khoản thanh toán.",
    "1003": "Giao dịch bị hủy bởi người dùng.",
    "1005": "Tài khoản hoặc thẻ không đủ điều kiện thanh toán.",
    "1006": "Người dùng đã từ chối giao dịch.",
    "1007": "Giao dịch bị từ chối do nghi ngờ gian lận.",
  };

  if (code && messages[code]) {
    return messages[code];
  }

  return success
    ? "Thanh toán đặt cọc thành công."
    : "Thanh toán đặt cọc chưa thành công.";
}

const styles = {
  value: {
    marginTop: "8px",
    color: "#16324f",
    fontWeight: 700,
    lineHeight: 1.6,
  },
  linkButtonPrimary: {
    ...ui.primaryButton,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  linkButtonSecondary: {
    ...ui.secondaryButton,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default PaymentResultPage;
