import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta";
import api, { getErrorMessage } from "../services/api";
import {
  createAutoGrid,
  createHero,
  createStatusPill,
  gradients,
  ui,
} from "../styles/designSystem";

function MyAppointmentsPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [reviewForms, setReviewForms] = useState({});

  usePageMeta(
    "Lịch hẹn",
    "Theo dõi lịch khám, thanh toán đặt cọc qua MoMo ATM test hoặc thanh toán nội bộ, đồng thời gửi đánh giá bác sĩ trong cổng bệnh nhân của ClinicMS.",
  );

  const loadAppointments = () => {
    setLoading(true);
    setErrorText("");
    api
      .get("/api/patient/appointments")
      .then((response) => {
        setAppointments(response.data?.data || []);
      })
      .catch((error) => {
        setErrorText(getErrorMessage(error, "Không tải được lịch hẹn."));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const unpaidCount = useMemo(
    () => appointments.filter((item) => item.paymentStatus !== "PAID").length,
    [appointments],
  );

  const reviewedCount = useMemo(
    () => appointments.filter((item) => item.reviewSubmitted).length,
    [appointments],
  );

  const handleMockPayment = async (appointment) => {
    try {
      await api.post(
        `/api/patient/appointments/${appointment.id}/deposit/mock`,
      );
      alert("Đã thanh toán thành công.");
      loadAppointments();
      navigate(`/invoices/${appointment.id}`);
    } catch (error) {
      alert(getErrorMessage(error, "Không thể hoàn tất thanh toán."));
    }
  };

  const handlePayDeposit = async (appointment) => {
    try {
      const response = await api.post(
        `/api/patient/appointments/${appointment.id}/deposit/momo`,
      );
      const paymentUrl = response.data?.data?.paymentUrl;

      if (!paymentUrl) {
        throw new Error("Không nhận được liên kết thanh toán MoMo ATM.");
      }

      window.location.href = paymentUrl;
    } catch (error) {
      alert(getErrorMessage(error, "Khởi tạo thanh toán MoMo ATM thất bại."));
    }
  };

  const handleSubmitReview = async (appointmentId) => {
    const form = reviewForms[appointmentId] || { rating: 5, comment: "" };

    try {
      await api.post("/api/patient/reviews", {
        appointmentId,
        rating: Number(form.rating),
        comment: form.comment,
      });

      alert("Đã gửi đánh giá thành công.");
      setReviewForms((prev) => ({
        ...prev,
        [appointmentId]: {
          ...prev[appointmentId],
          open: false,
          comment: "",
          rating: 5,
        },
      }));
      loadAppointments();
    } catch (error) {
      alert(getErrorMessage(error, "Không thể gửi đánh giá."));
    }
  };

  const handleViewInvoice = (appointmentId) => {
    navigate(`/invoices/${appointmentId}`);
  };

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.patient)}>
        <div style={styles.heroContent}>
          <div>
            <div style={ui.eyebrow}>Lịch hẹn bệnh nhân</div>
            <h1 style={ui.title}>
              Theo dõi lịch khám, trạng thái đặt cọc và phản hồi sau điều trị
              trên cùng một màn hình
            </h1>
            <p style={ui.subtitle}>
              Mọi lịch hẹn của bạn được sắp xếp tập trung cùng trạng thái thanh
              toán, thông tin khám và phần đánh giá bác sĩ để việc theo dõi trở
              nên rõ ràng, thuận tiện hơn.
            </p>
          </div>

          <div style={styles.metricGrid}>
            <div style={styles.metricCard}>
              <span style={styles.metricLabel}>Tổng lịch hẹn</span>
              <strong style={styles.metricValue}>{appointments.length}</strong>
            </div>
            <div style={styles.metricCard}>
              <span style={styles.metricLabel}>Chưa đặt cọc</span>
              <strong style={styles.metricValue}>{unpaidCount}</strong>
            </div>
            <div style={styles.metricCard}>
              <span style={styles.metricLabel}>Đã đánh giá</span>
              <strong style={styles.metricValue}>{reviewedCount}</strong>
            </div>
          </div>
        </div>
      </section>

      {loading && <div style={ui.stateCard}>Đang tải lịch hẹn...</div>}
      {!loading && errorText && <div style={ui.errorCard}>{errorText}</div>}
      {!loading && !errorText && appointments.length === 0 && (
        <div style={ui.stateCard}>Bạn chưa có lịch hẹn nào.</div>
      )}

      {!loading && !errorText && appointments.length > 0 && (
        <div style={{ display: "grid", gap: "18px" }}>
          {appointments.map((appointment) => {
            const form = reviewForms[appointment.id] || {
              open: false,
              rating: 5,
              comment: "",
            };

            return (
              <article key={appointment.id} style={ui.card}>
                <div style={styles.cardTop}>
                  <div>
                    <h3 style={styles.cardTitle}>{appointment.doctorName}</h3>
                    <p style={styles.cardSubtitle}>
                      {appointment.specialty || "Chưa cập nhật chuyên khoa"}
                    </p>
                  </div>
                  <div
                    style={createStatusPill(
                      appointment.paymentStatus === "PAID"
                        ? "success"
                        : "warning",
                    )}
                  >
                    {appointment.paymentStatus === "PAID"
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"}
                  </div>
                </div>

                <div style={createAutoGrid(150)}>
                  <div style={ui.panelSoft}>
                    <div style={ui.label}>Ngày khám</div>
                    <div style={styles.dataValue}>
                      {appointment.appointmentDate}
                    </div>
                  </div>
                  <div style={ui.panelSoft}>
                    <div style={ui.label}>Giờ khám</div>
                    <div style={styles.dataValue}>{appointment.slotTime}</div>
                  </div>
                  <div style={ui.panelSoft}>
                    <div style={ui.label}>Tiền đặt cọc</div>
                    <div style={styles.dataValue}>
                      {Number(appointment.depositAmount || 0).toLocaleString(
                        "vi-VN",
                      )}{" "}
                      đ
                    </div>
                  </div>
                  <div style={ui.panelSoft}>
                    <div style={ui.label}>Trạng thái lịch hẹn</div>
                    <div style={styles.dataValue}>
                      {appointment.status || "PENDING"}
                    </div>
                  </div>
                </div>

                <div style={styles.noteBox}>
                  <div style={ui.label}>Lý do thăm khám</div>
                  <p style={styles.noteText}>
                    {appointment.reason || "Chưa có mô tả cho lịch hẹn này."}
                  </p>
                </div>

                <div style={ui.actionRow}>
                  {appointment.paymentStatus !== "PAID" && (
                    <button
                      onClick={() => handleMockPayment(appointment)}
                      style={ui.primaryButton}
                    >
                      Thanh toán
                    </button>
                  )}

                  {appointment.paymentStatus !== "PAID" && (
                    <button
                      onClick={() => handlePayDeposit(appointment)}
                      style={ui.secondaryButton}
                    >
                      Thanh toán qua MoMo
                    </button>
                  )}

                  {appointment.paymentStatus === "PAID" && (
                    <button
                      onClick={() => handleViewInvoice(appointment.id)}
                      style={ui.secondaryButton}
                    >
                      Xem hóa đơn
                    </button>
                  )}

                  {appointment.paymentStatus === "PAID" &&
                    !appointment.reviewSubmitted && (
                      <button
                        onClick={() =>
                          setReviewForms((prev) => ({
                            ...prev,
                            [appointment.id]: {
                              ...form,
                              open: !form.open,
                            },
                          }))
                        }
                        style={ui.secondaryButton}
                      >
                        {form.open ? "Ẩn biểu mẫu đánh giá" : "Đánh giá bác sĩ"}
                      </button>
                    )}

                  {appointment.reviewSubmitted && (
                    <div style={createStatusPill("info")}>Đã gửi đánh giá</div>
                  )}
                </div>

                {form.open && (
                  <div style={styles.reviewPanel}>
                    <div style={styles.formRow}>
                      <label style={ui.label}>Mức đánh giá</label>
                      <select
                        value={form.rating}
                        onChange={(event) =>
                          setReviewForms((prev) => ({
                            ...prev,
                            [appointment.id]: {
                              ...form,
                              rating: event.target.value,
                            },
                          }))
                        }
                        style={ui.input}
                      >
                        {[5, 4, 3, 2, 1].map((value) => (
                          <option key={value} value={value}>
                            {value} sao
                          </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      value={form.comment}
                      onChange={(event) =>
                        setReviewForms((prev) => ({
                          ...prev,
                          [appointment.id]: {
                            ...form,
                            comment: event.target.value,
                          },
                        }))
                      }
                      placeholder="Chia sẻ trải nghiệm thăm khám của bạn"
                      style={ui.textarea}
                    />

                    <button
                      onClick={() => handleSubmitReview(appointment.id)}
                      style={ui.primaryButton}
                    >
                      Gửi đánh giá
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

const styles = {
  heroContent: {
    display: "grid",
    gap: "20px",
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "14px",
  },
  metricCard: {
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.16)",
    borderRadius: "18px",
    padding: "18px",
    display: "grid",
    gap: "8px",
  },
  metricLabel: {
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "rgba(255,255,255,0.78)",
  },
  metricValue: {
    fontSize: "30px",
    lineHeight: 1,
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    marginBottom: "18px",
  },
  cardTitle: {
    margin: 0,
    color: "#16324f",
    fontSize: "24px",
  },
  cardSubtitle: {
    margin: "8px 0 0",
    color: "#4c6e8f",
    fontWeight: 600,
  },
  dataValue: {
    marginTop: "8px",
    color: "#16324f",
    fontWeight: 700,
  },
  noteBox: {
    ...ui.panelSoft,
    marginTop: "18px",
  },
  noteText: {
    margin: "10px 0 0",
    color: "#34506e",
    lineHeight: 1.7,
  },
  reviewPanel: {
    marginTop: "18px",
    paddingTop: "18px",
    borderTop: "1px solid rgba(147, 170, 193, 0.18)",
    display: "grid",
    gap: "12px",
  },
  formRow: {
    display: "grid",
    gap: "8px",
    maxWidth: "220px",
  },
};

export default MyAppointmentsPage;
