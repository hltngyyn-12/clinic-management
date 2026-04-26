import { useEffect, useMemo, useState } from "react";
import api, { getErrorMessage } from "../services/api";

function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [reviewForms, setReviewForms] = useState({});

  const loadAppointments = () => {
    setLoading(true);
    api
      .get("/api/patient/appointments")
      .then((res) => {
        setAppointments(res.data?.data || []);
      })
      .catch((error) => {
        setErrorText(getErrorMessage(error, "Không tải được lịch khám."));
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

  const handlePayDeposit = async (appointment) => {
    try {
      await api.put(`/api/patient/appointments/${appointment.id}/deposit`, {
        amount: appointment.depositAmount || 100000,
      });
      alert("Thanh toán đặt cọc thành công.");
      loadAppointments();
    } catch (error) {
      alert(getErrorMessage(error, "Thanh toán thất bại."));
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

      alert("Đánh giá bác sĩ thành công.");
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
      alert(getErrorMessage(error, "Gửi đánh giá thất bại."));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>My Appointments</h2>
          <p style={styles.subtitle}>Quản lý lịch hẹn, thanh toán đặt cọc và đánh giá bác sĩ.</p>
        </div>
        <div style={styles.summaryCard}>
          <div style={styles.summaryNumber}>{appointments.length}</div>
          <div style={styles.summaryText}>appointments</div>
          <div style={styles.summarySub}>{unpaidCount} chưa thanh toán</div>
        </div>
      </div>

      {loading && <div style={styles.stateCard}>Đang tải lịch khám...</div>}
      {!loading && errorText && <div style={styles.errorCard}>{errorText}</div>}
      {!loading && !errorText && appointments.length === 0 && (
        <div style={styles.stateCard}>Bạn chưa có lịch khám nào.</div>
      )}

      {!loading && !errorText && appointments.length > 0 && (
        <div style={styles.list}>
          {appointments.map((appointment) => {
            const form = reviewForms[appointment.id] || {
              open: false,
              rating: 5,
              comment: "",
            };

            return (
              <div key={appointment.id} style={styles.card}>
                <div style={styles.topRow}>
                  <div>
                    <h3 style={{ margin: 0 }}>{appointment.doctorName}</h3>
                    <p style={styles.meta}>{appointment.specialty}</p>
                  </div>
                  <div style={styles.status(appointment.paymentStatus)}>
                    {appointment.paymentStatus}
                  </div>
                </div>

                <div style={styles.infoGrid}>
                  <div>
                    <div style={styles.label}>Date</div>
                    <div>{appointment.appointmentDate}</div>
                  </div>
                  <div>
                    <div style={styles.label}>Time</div>
                    <div>{appointment.slotTime}</div>
                  </div>
                  <div>
                    <div style={styles.label}>Deposit</div>
                    <div>{Number(appointment.depositAmount || 0).toLocaleString()} VND</div>
                  </div>
                  <div>
                    <div style={styles.label}>Status</div>
                    <div>{appointment.status}</div>
                  </div>
                </div>

                <div style={styles.reasonBox}>
                  <strong>Reason</strong>
                  <p style={{ margin: "8px 0 0" }}>{appointment.reason || "No reason"}</p>
                </div>

                <div style={styles.actionRow}>
                  {appointment.paymentStatus !== "PAID" && (
                    <button
                      onClick={() => handlePayDeposit(appointment)}
                      style={styles.primaryButton}
                    >
                      Pay Deposit
                    </button>
                  )}

                  {appointment.paymentStatus === "PAID" && !appointment.reviewSubmitted && (
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
                      style={styles.secondaryButton}
                    >
                      {form.open ? "Hide Review Form" : "Review Doctor"}
                    </button>
                  )}

                  {appointment.reviewSubmitted && (
                    <div style={styles.reviewedBadge}>Reviewed</div>
                  )}
                </div>

                {form.open && (
                  <div style={styles.reviewPanel}>
                    <div style={styles.fieldRow}>
                      <label style={styles.label}>Rating</label>
                      <select
                        value={form.rating}
                        onChange={(e) =>
                          setReviewForms((prev) => ({
                            ...prev,
                            [appointment.id]: {
                              ...form,
                              rating: e.target.value,
                            },
                          }))
                        }
                        style={styles.select}
                      >
                        {[5, 4, 3, 2, 1].map((value) => (
                          <option key={value} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>

                    <textarea
                      value={form.comment}
                      onChange={(e) =>
                        setReviewForms((prev) => ({
                          ...prev,
                          [appointment.id]: {
                            ...form,
                            comment: e.target.value,
                          },
                        }))
                      }
                      placeholder="Chia sẻ trải nghiệm khám bệnh"
                      style={styles.textarea}
                    />

                    <button
                      onClick={() => handleSubmitReview(appointment.id)}
                      style={styles.primaryButton}
                    >
                      Submit Review
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyAppointmentsPage;

const styles = {
  page: {
    display: "grid",
    gap: "20px",
  },
  header: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: "20px",
    alignItems: "stretch",
  },
  title: {
    margin: 0,
  },
  subtitle: {
    margin: "10px 0 0",
    color: "#64748b",
  },
  summaryCard: {
    background: "#0f766e",
    color: "#fff",
    borderRadius: "20px",
    padding: "20px 22px",
    minWidth: "180px",
  },
  summaryNumber: {
    fontSize: "34px",
    fontWeight: 800,
  },
  summaryText: {
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontSize: "12px",
    marginTop: "4px",
  },
  summarySub: {
    marginTop: "10px",
    color: "#ccfbf1",
  },
  stateCard: {
    background: "#fff",
    borderRadius: "18px",
    padding: "18px",
  },
  errorCard: {
    background: "#fff1f2",
    color: "#9f1239",
    borderRadius: "18px",
    padding: "18px",
    border: "1px solid #fecdd3",
  },
  list: {
    display: "grid",
    gap: "18px",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "22px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
  },
  meta: {
    margin: "8px 0 0",
    color: "#0f766e",
    fontWeight: 600,
  },
  status: (paymentStatus) => ({
    padding: "8px 12px",
    borderRadius: "999px",
    background: paymentStatus === "PAID" ? "#dcfce7" : "#fef3c7",
    color: paymentStatus === "PAID" ? "#166534" : "#92400e",
    fontWeight: 700,
    fontSize: "12px",
  }),
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
    gap: "14px",
    marginTop: "18px",
  },
  label: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  reasonBox: {
    marginTop: "18px",
    padding: "16px",
    borderRadius: "16px",
    background: "#f8fafc",
  },
  actionRow: {
    display: "flex",
    gap: "12px",
    marginTop: "18px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  primaryButton: {
    border: "none",
    borderRadius: "12px",
    background: "#0f766e",
    color: "#fff",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    background: "#fff",
    color: "#0f172a",
    padding: "12px 16px",
    fontWeight: 600,
    cursor: "pointer",
  },
  reviewedBadge: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#e0f2fe",
    color: "#075985",
    fontWeight: 700,
  },
  reviewPanel: {
    marginTop: "18px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "18px",
    display: "grid",
    gap: "12px",
  },
  fieldRow: {
    display: "grid",
    gap: "8px",
  },
  select: {
    width: "100%",
    maxWidth: "120px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
  },
  textarea: {
    width: "100%",
    minHeight: "90px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    padding: "12px",
    resize: "vertical",
  },
};
