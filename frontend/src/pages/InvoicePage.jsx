import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta";
import api, { getErrorMessage } from "../services/api";
import { createAutoGrid, createHero, gradients, ui } from "../styles/designSystem";

function InvoicePage() {
  const { appointmentId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  usePageMeta(
    "Hóa đơn lịch khám",
    "Xem và in hóa đơn đặt cọc lịch khám sau khi thanh toán tại ClinicMS, bao gồm MoMo ATM test và thanh toán nội bộ.",
  );

  useEffect(() => {
    if (!appointmentId) {
      setErrorText("Không xác định được lịch hẹn.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorText("");

    api
      .get(`/api/patient/invoices/${appointmentId}`)
      .then((response) => {
        setInvoice(response.data?.data || null);
      })
      .catch((error) => {
        setErrorText(getErrorMessage(error, "Không tải được hóa đơn."));
      })
      .finally(() => setLoading(false));
  }, [appointmentId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.patient)}>
        <div style={{ display: "grid", gap: "16px" }}>
          <div style={ui.eyebrow}>Hóa đơn thanh toán</div>
          <h1 style={ui.title}>Hóa đơn đặt cọc lịch khám</h1>
          <p style={ui.subtitle}>
            Lưu trữ đầy đủ thông tin giao dịch để bạn đối chiếu nhanh khi cần làm thủ tục tại
            phòng khám.
          </p>
        </div>
      </section>

      {loading && <div style={ui.stateCard}>Đang tải hóa đơn...</div>}
      {!loading && errorText && <div style={ui.errorCard}>{errorText}</div>}

      {!loading && !errorText && invoice && (
        <section style={ui.card}>
          <div style={ui.sectionHeader}>
            <div>
              <h2 style={ui.sectionTitle}>Chi tiết hóa đơn</h2>
              <p style={ui.sectionHint}>
                Hóa đơn được tạo sau khi hệ thống xác nhận giao dịch đặt cọc thành công.
              </p>
            </div>
            <div style={styles.invoiceBadge}>{invoice.invoiceNumber}</div>
          </div>

          <div style={{ ...createAutoGrid(220), marginTop: "18px" }}>
            <div style={ui.panelSoft}>
              <div style={ui.label}>Bệnh nhân</div>
              <div style={styles.value}>{invoice.patientName}</div>
            </div>
            <div style={ui.panelSoft}>
              <div style={ui.label}>Bác sĩ</div>
              <div style={styles.value}>{invoice.doctorName}</div>
            </div>
            <div style={ui.panelSoft}>
              <div style={ui.label}>Chuyên khoa</div>
              <div style={styles.value}>{invoice.specialty || "Đang cập nhật"}</div>
            </div>
            <div style={ui.panelSoft}>
              <div style={ui.label}>Ngày khám</div>
              <div style={styles.value}>{invoice.appointmentDate}</div>
            </div>
            <div style={ui.panelSoft}>
              <div style={ui.label}>Giờ khám</div>
              <div style={styles.value}>{invoice.slotTime}</div>
            </div>
            <div style={ui.panelSoft}>
              <div style={ui.label}>Số tiền</div>
              <div style={styles.value}>
                {Number(invoice.amount || 0).toLocaleString("vi-VN")} đ
              </div>
            </div>
            <div style={ui.panelSoft}>
              <div style={ui.label}>Phương thức</div>
              <div style={styles.value}>{invoice.paymentMethod}</div>
            </div>
            <div style={ui.panelSoft}>
              <div style={ui.label}>Trạng thái</div>
              <div style={styles.value}>{invoice.paymentStatus}</div>
            </div>
            <div style={ui.panelSoft}>
              <div style={ui.label}>Mã giao dịch nội bộ</div>
              <div style={styles.value}>{invoice.transactionRef || "Không có"}</div>
            </div>
            <div style={ui.panelSoft}>
              <div style={ui.label}>Mã giao dịch nhà cung cấp</div>
              <div style={styles.value}>
                {invoice.providerTransactionNo || "Đang cập nhật"}
              </div>
            </div>
            <div style={ui.panelSoft}>
              <div style={ui.label}>Thời gian phát hành</div>
              <div style={styles.value}>{invoice.issuedAt || "Đang cập nhật"}</div>
            </div>
          </div>

          <div style={{ ...ui.actionRow, marginTop: "20px" }}>
            <button onClick={handlePrint} style={ui.primaryButton}>
              In hóa đơn
            </button>
            <Link to="/appointments" style={styles.linkButtonSecondary}>
              Quay lại lịch hẹn
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

const styles = {
  invoiceBadge: {
    background: "#e0f2fe",
    color: "#075985",
    padding: "10px 14px",
    borderRadius: "999px",
    fontWeight: 800,
    fontSize: "13px",
  },
  value: {
    marginTop: "8px",
    color: "#16324f",
    fontWeight: 700,
    lineHeight: 1.6,
    wordBreak: "break-word",
  },
  linkButtonSecondary: {
    ...ui.secondaryButton,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default InvoicePage;
