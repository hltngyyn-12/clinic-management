import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

function MyReviewsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    api
      .get("/api/patient/reviews")
      .then((res) => {
        setItems(res.data?.data || []);
      })
      .catch((error) => {
        setErrorText(getErrorMessage(error, "Không tải được đánh giá."));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Reviews</h2>
        <p style={styles.subtitle}>Các đánh giá bạn đã gửi cho bác sĩ sau khi khám.</p>
      </div>

      {loading && <div style={styles.stateCard}>Đang tải đánh giá...</div>}
      {!loading && errorText && <div style={styles.errorCard}>{errorText}</div>}
      {!loading && !errorText && items.length === 0 && (
        <div style={styles.stateCard}>Bạn chưa gửi đánh giá nào.</div>
      )}

      {!loading && !errorText && items.length > 0 && (
        <div style={styles.list}>
          {items.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.topRow}>
                <h3 style={{ margin: 0 }}>{item.doctorName}</h3>
                <div style={styles.rating}>{item.rating}/5</div>
              </div>
              <p style={styles.meta}>Appointment #{item.appointmentId}</p>
              <p style={styles.comment}>{item.comment}</p>
              <p style={styles.time}>{item.createdAt}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyReviewsPage;

const styles = {
  page: {
    display: "grid",
    gap: "20px",
  },
  header: {
    background: "#fff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
  },
  title: {
    margin: 0,
  },
  subtitle: {
    margin: "10px 0 0",
    color: "#64748b",
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
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
  },
  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
  },
  rating: {
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#fef3c7",
    color: "#92400e",
    fontWeight: 700,
  },
  meta: {
    margin: "10px 0 0",
    color: "#64748b",
  },
  comment: {
    margin: "14px 0 0",
    color: "#0f172a",
    lineHeight: 1.5,
  },
  time: {
    margin: "16px 0 0",
    color: "#94a3b8",
    fontSize: "13px",
  },
};
