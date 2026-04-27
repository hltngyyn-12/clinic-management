import { useEffect, useMemo, useState } from "react";
import api, { getErrorMessage } from "../services/api";
import usePageMeta from "../hooks/usePageMeta";

function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [slotsByDoctor, setSlotsByDoctor] = useState({});
  const [slotLoadingByDoctor, setSlotLoadingByDoctor] = useState({});
  const [bookingByDoctor, setBookingByDoctor] = useState({});
  const [reviewsByDoctor, setReviewsByDoctor] = useState({});
  const [reviewOpenByDoctor, setReviewOpenByDoctor] = useState({});

  usePageMeta(
    "Đặt lịch khám",
    "Xem danh sách bác sĩ, khung giờ còn trống và đặt lịch khám trực tuyến theo ngày giờ mong muốn.",
  );

  useEffect(() => {
    api
      .get("/api/patient/doctors")
      .then((response) => {
        setDoctors(response.data?.data || []);
      })
      .catch((error) => {
        setErrorText(getErrorMessage(error, "Không tải được danh sách bác sĩ."));
      })
      .finally(() => setLoading(false));
  }, []);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const handleLoadSlots = async (doctorId) => {
    const date = selectedDate || today;
    try {
      setSlotLoadingByDoctor((prev) => ({ ...prev, [doctorId]: true }));
      const response = await api.get(`/api/doctors/${doctorId}/slots?date=${date}`);
      setSlotsByDoctor((prev) => ({ ...prev, [doctorId]: response.data?.data || [] }));
    } catch (error) {
      alert(getErrorMessage(error, "Không tải được khung giờ khám."));
    } finally {
      setSlotLoadingByDoctor((prev) => ({ ...prev, [doctorId]: false }));
    }
  };

  const handleBook = async (doctorId, slot) => {
    try {
      const reason = bookingByDoctor[doctorId]?.reason?.trim() || "Khám tổng quát";
      await api.post("/api/patient/appointments", {
        doctorId,
        date: selectedDate || today,
        time: slot,
        reason,
      });

      alert("Đặt lịch thành công.");
      handleLoadSlots(doctorId);
    } catch (error) {
      alert(getErrorMessage(error, "Đặt lịch thất bại."));
    }
  };

  const toggleReviews = async (doctorId) => {
    const nextValue = !reviewOpenByDoctor[doctorId];
    setReviewOpenByDoctor((prev) => ({ ...prev, [doctorId]: nextValue }));

    if (!nextValue || reviewsByDoctor[doctorId]) {
      return;
    }

    try {
      const response = await api.get(`/api/doctors/${doctorId}/reviews`);
      setReviewsByDoctor((prev) => ({ ...prev, [doctorId]: response.data?.data || [] }));
    } catch (error) {
      alert(getErrorMessage(error, "Không tải được đánh giá bác sĩ."));
    }
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>Đặt lịch khám trực tuyến</div>
          <h1 style={styles.title}>Chọn bác sĩ phù hợp và giữ chỗ chỉ trong vài bước</h1>
          <p style={styles.subtitle}>
            Xem bác sĩ còn lịch trống, chọn ngày khám, khung giờ mong muốn và gửi lý do thăm khám ngay trên hệ thống.
          </p>
        </div>

        <div style={styles.datePicker}>
          <label style={styles.label}>Ngày khám</label>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            style={styles.input}
          />
        </div>
      </section>

      {loading && <div style={styles.stateCard}>Đang tải danh sách bác sĩ...</div>}
      {!loading && errorText && <div style={styles.errorCard}>{errorText}</div>}

      {!loading && !errorText && (
        <div style={styles.grid}>
          {doctors.map((doctor) => (
            <article key={doctor.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={{ margin: 0 }}>{doctor.name}</h3>
                  <p style={styles.specialty}>{doctor.specialty || "Đa khoa"}</p>
                </div>
                <div style={styles.ratingBadge}>
                  {doctor.averageRating ? `${doctor.averageRating}/5` : "Chưa có đánh giá"}
                </div>
              </div>

              <div style={styles.infoLine}>Kinh nghiệm: {doctor.experience ?? 0} năm</div>

              <textarea
                placeholder="Lý do thăm khám"
                value={bookingByDoctor[doctor.id]?.reason || ""}
                onChange={(event) =>
                  setBookingByDoctor((prev) => ({
                    ...prev,
                    [doctor.id]: {
                      ...prev[doctor.id],
                      reason: event.target.value,
                    },
                  }))
                }
                style={styles.textarea}
              />

              <div style={styles.actions}>
                <button onClick={() => handleLoadSlots(doctor.id)} style={styles.primaryButton}>
                  {slotLoadingByDoctor[doctor.id] ? "Đang tải..." : "Tải khung giờ"}
                </button>
                <button onClick={() => toggleReviews(doctor.id)} style={styles.secondaryButton}>
                  {reviewOpenByDoctor[doctor.id] ? "Ẩn đánh giá" : "Xem đánh giá"}
                </button>
              </div>

              <div style={styles.slotWrap}>
                {(slotsByDoctor[doctor.id] || []).length === 0 ? (
                  <p style={styles.emptyText}>Chưa tải khung giờ hoặc hiện không còn giờ trống.</p>
                ) : (
                  <div style={styles.slotGrid}>
                    {slotsByDoctor[doctor.id].map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleBook(doctor.id, slot)}
                        style={styles.slotButton}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {reviewOpenByDoctor[doctor.id] && (
                <div style={styles.reviewBlock}>
                  {(reviewsByDoctor[doctor.id] || []).length === 0 ? (
                    <p style={styles.emptyText}>Bác sĩ này chưa có đánh giá nào.</p>
                  ) : (
                    reviewsByDoctor[doctor.id].map((review) => (
                      <div key={review.id} style={styles.reviewCard}>
                        <div style={styles.reviewTop}>
                          <strong>{review.rating}/5</strong>
                          <span>{review.createdAt}</span>
                        </div>
                        <p style={{ margin: "8px 0 0" }}>{review.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorListPage;

const styles = {
  page: { display: "grid", gap: "24px" },
  hero: {
    background:
      "linear-gradient(135deg, rgba(8, 47, 73, 0.96), rgba(14, 116, 144, 0.92) 54%, rgba(20, 184, 166, 0.88))",
    color: "#fff",
    borderRadius: "32px",
    padding: "32px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.4fr) minmax(240px, 0.65fr)",
    gap: "24px",
    alignItems: "center",
  },
  eyebrow: {
    display: "inline-flex",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.14)",
    fontWeight: 800,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  title: { margin: "18px 0 0", fontSize: "38px", lineHeight: 1.12, letterSpacing: "-0.03em" },
  subtitle: { margin: "14px 0 0", color: "#d7f4ff", maxWidth: "680px", lineHeight: 1.7 },
  datePicker: {
    minWidth: "240px",
    background: "rgba(255,255,255,0.14)",
    borderRadius: "22px",
    padding: "18px",
    border: "1px solid rgba(255,255,255,0.16)",
  },
  label: { display: "block", marginBottom: "8px", fontWeight: 700 },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.28)",
    background: "#fff",
    color: "#0f172a",
  },
  stateCard: { background: "rgba(255,255,255,0.9)", borderRadius: "20px", padding: "18px" },
  errorCard: {
    background: "#fff1f2",
    color: "#9f1239",
    borderRadius: "20px",
    padding: "18px",
    border: "1px solid #fecdd3",
  },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" },
  card: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 18px 36px rgba(15, 23, 42, 0.07)",
    border: "1px solid rgba(148, 163, 184, 0.16)",
  },
  cardHeader: { display: "flex", justifyContent: "space-between", gap: "16px" },
  specialty: { margin: "8px 0 0", color: "#0f766e", fontWeight: 700 },
  ratingBadge: {
    whiteSpace: "nowrap",
    alignSelf: "flex-start",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#ecfccb",
    color: "#3f6212",
    fontWeight: 800,
    fontSize: "13px",
  },
  infoLine: { color: "#5d7088", marginTop: "16px" },
  textarea: {
    width: "100%",
    minHeight: "96px",
    marginTop: "16px",
    borderRadius: "16px",
    border: "1px solid rgba(148, 163, 184, 0.24)",
    padding: "14px",
    resize: "vertical",
    background: "#fff",
  },
  actions: { display: "flex", gap: "10px", marginTop: "16px", flexWrap: "wrap" },
  primaryButton: {
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #0f766e, #2563eb)",
    color: "#fff",
    padding: "12px 16px",
    fontWeight: 800,
    cursor: "pointer",
  },
  secondaryButton: {
    border: "1px solid rgba(148, 163, 184, 0.24)",
    borderRadius: "14px",
    background: "#fff",
    color: "#10233c",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  slotWrap: { marginTop: "18px" },
  emptyText: { color: "#5d7088", margin: 0, lineHeight: 1.6 },
  slotGrid: { display: "flex", gap: "10px", flexWrap: "wrap" },
  slotButton: {
    border: "none",
    borderRadius: "14px",
    background: "#e0f2fe",
    color: "#075985",
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer",
  },
  reviewBlock: { marginTop: "18px", display: "grid", gap: "10px" },
  reviewCard: { background: "#f8fafc", borderRadius: "16px", padding: "14px" },
  reviewTop: { display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "13px", color: "#64748b" },
};
