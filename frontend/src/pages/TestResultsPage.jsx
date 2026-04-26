import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

function TestResultsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    api
      .get("/api/patient/test-results")
      .then((res) => {
        setItems(res.data?.data || []);
      })
      .catch((error) => {
        setErrorText(getErrorMessage(error, "Không tải được kết quả xét nghiệm."));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Test Results</h2>
        <p style={styles.subtitle}>Theo dõi yêu cầu xét nghiệm và kết quả online.</p>
      </div>

      {loading && <div style={styles.stateCard}>Đang tải dữ liệu xét nghiệm...</div>}
      {!loading && errorText && <div style={styles.errorCard}>{errorText}</div>}
      {!loading && !errorText && items.length === 0 && (
        <div style={styles.stateCard}>Chưa có dữ liệu xét nghiệm.</div>
      )}

      {!loading && !errorText && items.length > 0 && (
        <div style={styles.list}>
          {items.map((item) => (
            <div key={item.testRequestId} style={styles.card}>
              <div style={styles.badge(item.status)}>{item.status}</div>
              <h3 style={styles.cardTitle}>{item.testName}</h3>
              <p style={styles.meta}>Doctor: {item.doctorName}</p>
              <p style={styles.meta}>Medical Record: #{item.medicalRecordId}</p>

              <div style={styles.section}>
                <strong>Result</strong>
                <p style={styles.paragraph}>{item.result}</p>
              </div>

              <div style={styles.section}>
                <strong>Conclusion</strong>
                <p style={styles.paragraph}>{item.conclusion}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TestResultsPage;

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
  badge: (status) => ({
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: "999px",
    background: status === "COMPLETED" ? "#dcfce7" : "#fef3c7",
    color: status === "COMPLETED" ? "#166534" : "#92400e",
    fontWeight: 700,
    fontSize: "12px",
    marginBottom: "14px",
  }),
  cardTitle: {
    margin: 0,
  },
  meta: {
    color: "#64748b",
    margin: "8px 0 0",
  },
  section: {
    marginTop: "16px",
    paddingTop: "14px",
    borderTop: "1px solid #e2e8f0",
  },
  paragraph: {
    margin: "8px 0 0",
    color: "#0f172a",
    lineHeight: 1.5,
  },
};
