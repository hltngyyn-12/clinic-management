import { useMemo, useState } from "react";
import { useEffect } from "react";
import api, { getErrorMessage } from "../services/api";

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

  useEffect(() => {
    api
      .get("/api/patient/doctors")
      .then((res) => {
        setDoctors(res.data?.data || []);
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
      const res = await api.get(`/api/doctors/${doctorId}/slots?date=${date}`);
      setSlotsByDoctor((prev) => ({ ...prev, [doctorId]: res.data?.data || [] }));
    } catch (error) {
      alert(getErrorMessage(error, "Không tải được slot khám."));
    } finally {
      setSlotLoadingByDoctor((prev) => ({ ...prev, [doctorId]: false }));
    }
  };

  const handleBook = async (doctorId, slot) => {
    try {
      const reason = bookingByDoctor[doctorId]?.reason?.trim() || "General consultation";
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
      const res = await api.get(`/api/doctors/${doctorId}/reviews`);
      setReviewsByDoctor((prev) => ({ ...prev, [doctorId]: res.data?.data || [] }));
    } catch (error) {
      alert(getErrorMessage(error, "Không tải được đánh giá bác sĩ."));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <h2 style={styles.title}>Book Appointment Online</h2>
          <p style={styles.subtitle}>
            Chọn bác sĩ, ngày khám và giờ khám trực tiếp trên hệ thống.
          </p>
        </div>

        <div style={styles.datePicker}>
          <label style={styles.label}>Appointment Date</label>
          <input
            type="date"
            min={today}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.input}
          />
        </div>
      </div>

      {loading && <div style={styles.stateCard}>Đang tải danh sách bác sĩ...</div>}
      {!loading && errorText && <div style={styles.errorCard}>{errorText}</div>}

      {!loading && !errorText && (
        <div style={styles.grid}>
          {doctors.map((doctor) => (
            <div key={doctor.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <div>
                  <h3 style={{ margin: 0 }}>{doctor.name}</h3>
                  <p style={styles.specialty}>{doctor.specialty || "General"}</p>
                </div>
                <div style={styles.ratingBadge}>
                  {doctor.averageRating ? `${doctor.averageRating}/5` : "No review"}
                </div>
              </div>

              <p style={styles.meta}>Experience: {doctor.experience ?? 0} years</p>

              <textarea
                placeholder="Reason for visit"
                value={bookingByDoctor[doctor.id]?.reason || ""}
                onChange={(e) =>
                  setBookingByDoctor((prev) => ({
                    ...prev,
                    [doctor.id]: {
                      ...prev[doctor.id],
                      reason: e.target.value,
                    },
                  }))
                }
                style={styles.textarea}
              />

              <div style={styles.actions}>
                <button onClick={() => handleLoadSlots(doctor.id)} style={styles.primaryButton}>
                  {slotLoadingByDoctor[doctor.id] ? "Loading..." : "Load Slots"}
                </button>
                <button onClick={() => toggleReviews(doctor.id)} style={styles.secondaryButton}>
                  {reviewOpenByDoctor[doctor.id] ? "Hide Reviews" : "View Reviews"}
                </button>
              </div>

              <div style={styles.slotWrap}>
                {(slotsByDoctor[doctor.id] || []).length === 0 ? (
                  <p style={styles.emptyText}>Chưa tải slot hoặc không còn slot trống.</p>
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
                    <p style={styles.emptyText}>Chưa có đánh giá nào.</p>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorListPage;

const styles = {
  page: {
    display: "grid",
    gap: "24px",
  },
  hero: {
    background: "linear-gradient(135deg, #082f49, #164e63)",
    color: "#fff",
    borderRadius: "24px",
    padding: "28px",
    display: "flex",
    justifyContent: "space-between",
    gap: "24px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "32px",
  },
  subtitle: {
    margin: "12px 0 0",
    color: "#dbeafe",
    maxWidth: "600px",
  },
  datePicker: {
    minWidth: "240px",
    background: "rgba(255,255,255,0.12)",
    borderRadius: "18px",
    padding: "18px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "#fff",
    color: "#0f172a",
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "20px",
    padding: "22px",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
  },
  specialty: {
    margin: "8px 0 0",
    color: "#0369a1",
    fontWeight: 600,
  },
  ratingBadge: {
    whiteSpace: "nowrap",
    alignSelf: "flex-start",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#ecfccb",
    color: "#3f6212",
    fontWeight: 700,
    fontSize: "13px",
  },
  meta: {
    color: "#64748b",
    margin: "14px 0 0",
  },
  textarea: {
    width: "100%",
    minHeight: "92px",
    marginTop: "16px",
    borderRadius: "14px",
    border: "1px solid #cbd5e1",
    padding: "12px",
    resize: "vertical",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
    flexWrap: "wrap",
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
  slotWrap: {
    marginTop: "18px",
  },
  emptyText: {
    color: "#64748b",
    margin: 0,
  },
  slotGrid: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  slotButton: {
    border: "none",
    borderRadius: "12px",
    background: "#e0f2fe",
    color: "#075985",
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  reviewBlock: {
    marginTop: "18px",
    display: "grid",
    gap: "10px",
  },
  reviewCard: {
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "14px",
  },
  reviewTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    fontSize: "13px",
    color: "#64748b",
  },
};
