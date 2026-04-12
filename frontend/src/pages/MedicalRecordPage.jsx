import { useState } from "react";
import api from "../services/api";

function MedicalRecordPage() {
  const [recordId, setRecordId] = useState("");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!recordId) {
      alert("Enter record ID");
      return;
    }

    try {
      setLoading(true);

      const res = await api.get(`/api/medical-records/${recordId}`);
      setRecord(res.data);

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Record not found ❌");
      setRecord(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Medical Record Dashboard</h2>

      {/* SEARCH BAR */}
      <div style={styles.searchBox}>
        <input
          type="number"
          placeholder="Enter Record ID..."
          value={recordId}
          onChange={(e) => setRecordId(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleSearch} style={styles.button}>
          🔍 Search
        </button>
      </div>

      {/* LOADING */}
      {loading && <p style={styles.loading}>Loading...</p>}

      {/* EMPTY */}
      {!loading && !record && (
        <div style={styles.empty}>
          No data loaded. Try searching a record ID 👀
        </div>
      )}

      {/* RESULT */}
      {record && (
        <div style={styles.card}>
          {/* HEADER */}
          <div style={styles.header}>
            <h3>🧾 Record #{record.id}</h3>
            <span style={styles.date}>
              {record.createdAt || "No date"}
            </span>
          </div>

          {/* INFO GRID */}
          <div style={styles.grid}>
            <div style={styles.infoBox}>
              <h4>👤 Patient</h4>
              <p>{record.patient?.user?.fullName || "N/A"}</p>
            </div>

            <div style={styles.infoBox}>
              <h4>🧑‍⚕️ Doctor</h4>
              <p>{record.doctor?.user?.fullName || "N/A"}</p>
            </div>
          </div>

          {/* DIAGNOSIS */}
          <div style={styles.section}>
            <h4>🩺 Diagnosis</h4>
            <p>{record.diagnosis || "N/A"}</p>
          </div>

          {/* NOTES */}
          <div style={styles.section}>
            <h4>📝 Notes</h4>
            <p>{record.notes || "N/A"}</p>
          </div>

          {/* PRESCRIPTIONS MOCK */}
          <div style={styles.section}>
            <h4>💊 Prescriptions</h4>

            <div style={styles.fakeCard}>
              <p><b>Medicine:</b> Paracetamol</p>
              <p><b>Dosage:</b> 2 times/day</p>
              <p><b>Instructions:</b> After meal</p>
            </div>
          </div>

          {/* TEST RESULTS MOCK */}
          <div style={styles.section}>
            <h4>🧪 Test Results</h4>

            <div style={styles.fakeCard}>
              <p><b>Test:</b> Blood Test</p>
              <p><b>Result:</b> Normal</p>
              <p><b>Conclusion:</b> Healthy</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalRecordPage;

/* ================= STYLE ================= */

const styles = {
  container: {
    padding: "40px",
    background: "#f5f7fb",
    minHeight: "100vh"
  },

  title: {
    marginBottom: "20px"
  },

  searchBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px"
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc"
  },

  button: {
    padding: "12px 20px",
    borderRadius: "8px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer"
  },

  loading: {
    color: "#555"
  },

  empty: {
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    textAlign: "center"
  },

  card: {
    background: "#fff",
    padding: "25px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },

  date: {
    color: "#888"
  },

  grid: {
    display: "flex",
    gap: "20px",
    marginBottom: "20px"
  },

  infoBox: {
    flex: 1,
    padding: "15px",
    background: "#f0f4ff",
    borderRadius: "10px"
  },

  section: {
    marginTop: "20px"
  },

  fakeCard: {
    marginTop: "10px",
    padding: "15px",
    background: "#fafafa",
    borderRadius: "10px",
    border: "1px solid #eee"
  }
};