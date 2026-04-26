import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

function PrescriptionsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    api
      .get("/api/patient/prescriptions")
      .then((res) => {
        setItems(res.data?.data || []);
      })
      .catch((error) => {
        setErrorText(getErrorMessage(error, "Không tải được đơn thuốc."));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Prescriptions</h2>
        <p style={styles.subtitle}>Xem đơn thuốc điện tử theo từng hồ sơ khám.</p>
      </div>

      {loading && <div style={styles.stateCard}>Đang tải đơn thuốc...</div>}
      {!loading && errorText && <div style={styles.errorCard}>{errorText}</div>}
      {!loading && !errorText && items.length === 0 && (
        <div style={styles.stateCard}>Chưa có đơn thuốc nào.</div>
      )}

      {!loading && !errorText && items.length > 0 && (
        <div style={styles.list}>
          {items.map((item) => (
            <div key={item.id} style={styles.card}>
              <div style={styles.row}>
                <strong>Medicine:</strong>
                <span>{item.medicineName}</span>
              </div>
              <div style={styles.row}>
                <strong>Dosage:</strong>
                <span>{item.dosage}</span>
              </div>
              <div style={styles.row}>
                <strong>Doctor:</strong>
                <span>{item.doctorName}</span>
              </div>
              <div style={styles.row}>
                <strong>Medical Record ID:</strong>
                <span>#{item.medicalRecordId}</span>
              </div>
              <div style={styles.instructions}>
                <strong>Instructions:</strong>
                <p style={{ margin: "8px 0 0" }}>{item.instructions}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PrescriptionsPage;

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
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "18px",
  },
  card: {
    background: "#fff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "10px",
  },
  instructions: {
    marginTop: "16px",
    borderTop: "1px solid #e2e8f0",
    paddingTop: "14px",
  },
};
