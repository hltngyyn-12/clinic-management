import { useMemo, useState } from "react";
import api, { getErrorMessage } from "../services/api";

function MedicalRecordPage() {
  const [recordId, setRecordId] = useState("");
  const [record, setRecord] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const rawUser = localStorage.getItem("user");
  let user = null;

  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    user = null;
  }

  const role = useMemo(() => {
    return (
      user?.role ||
      user?.roles?.[0] ||
      user?.authorities?.[0]?.replace("ROLE_", "") ||
      localStorage.getItem("role") ||
      "UNKNOWN"
    );
  }, [user]);

  const displayRole = useMemo(() => {
    switch (String(role).toUpperCase()) {
      case "DOCTOR":
        return "Doctor";
      case "PATIENT":
        return "Patient";
      case "ADMIN":
        return "Admin";
      default:
        return "Unknown";
    }
  }, [role]);

  const handleSearch = async () => {
    if (!recordId.trim()) {
      alert("Vui lòng nhập Record ID.");
      return;
    }

    try {
      setLoading(true);
      setErrorText("");
      setRecord(null);
      setPrescriptions([]);
      setTests([]);

      const recordRes = await api.get(`/api/medical-records/${recordId}`);
      const recordData = recordRes.data?.data || recordRes.data;
      setRecord(recordData);

      try {
        const prescriptionRes = await api.get("/api/prescriptions");
        const prescriptionData =
          prescriptionRes.data?.data || prescriptionRes.data || [];

        const filteredPrescriptions = Array.isArray(prescriptionData)
          ? prescriptionData.filter((item) => {
              const medicalRecordId =
                item?.medicalRecord?.id ?? item?.medicalRecordId ?? null;
              return Number(medicalRecordId) === Number(recordId);
            })
          : [];

        setPrescriptions(filteredPrescriptions);
      } catch (prescriptionError) {
        console.error("Prescription load error:", prescriptionError);
        setPrescriptions([]);
      }

      try {
        const testRes = await api.get("/api/tests");
        const testData = testRes.data?.data || testRes.data || [];

        const filteredTests = Array.isArray(testData)
          ? testData.filter((item) => {
              const medicalRecordId =
                item?.medicalRecord?.id ?? item?.medicalRecordId ?? null;
              return Number(medicalRecordId) === Number(recordId);
            })
          : [];

        setTests(filteredTests);
      } catch (testError) {
        console.error("Test load error:", testError);
        setTests([]);
      }
    } catch (err) {
      console.error(err);
      setErrorText(getErrorMessage(err, "Không tìm thấy hồ sơ khám."));
    } finally {
      setLoading(false);
    }
  };

  const patientName =
    record?.patient?.user?.fullName ||
    record?.patient?.fullName ||
    record?.patient?.user?.username ||
    "N/A";

  const doctorName =
    record?.doctor?.user?.fullName ||
    record?.doctor?.fullName ||
    record?.doctor?.user?.username ||
    "N/A";

  return (
    <div style={styles.container}>
      <div style={styles.topBar}>
        <div>
          <h2 style={styles.title}>Medical Record Detail</h2>
          <p style={styles.subtitle}>
            Tra cứu chi tiết hồ sơ khám, đơn thuốc và thông tin xét nghiệm.
          </p>
        </div>

        <div style={styles.roleBadge}>Current role: {displayRole}</div>
      </div>

      <div style={styles.searchCard}>
        <input
          type="number"
          placeholder="Nhập Record ID"
          value={recordId}
          onChange={(e) => setRecordId(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Search
        </button>
      </div>

      {loading && <div style={styles.stateBox}>Đang tải dữ liệu...</div>}

      {!loading && errorText && (
        <div style={{ ...styles.stateBox, ...styles.errorBox }}>
          {errorText}
        </div>
      )}

      {!loading && !errorText && !record && (
        <div style={styles.stateBox}>
          Chưa có dữ liệu. Hãy nhập Record ID để tra cứu.
        </div>
      )}

      {!loading && record && (
        <div style={styles.card}>
          <div style={styles.header}>
            <div>
              <h3 style={styles.recordTitle}>Record #{record.id}</h3>
              <div style={styles.metaLine}>
                Created at: {record.createdAt || "N/A"}
              </div>
            </div>
          </div>

          <div style={styles.grid}>
            <div style={styles.infoBox}>
              <div style={styles.infoLabel}>Patient</div>
              <div style={styles.infoValue}>{patientName}</div>
            </div>

            <div style={styles.infoBox}>
              <div style={styles.infoLabel}>Doctor</div>
              <div style={styles.infoValue}>{doctorName}</div>
            </div>
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Diagnosis</h4>
            <p style={styles.sectionText}>{record.diagnosis || "N/A"}</p>
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Notes</h4>
            <p style={styles.sectionText}>{record.notes || "N/A"}</p>
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Prescriptions</h4>

            {prescriptions.length === 0 ? (
              <div style={styles.emptySubCard}>
                Chưa có prescription cho medical record này.
              </div>
            ) : (
              prescriptions.map((item, index) => (
                <div key={item.id || index} style={styles.subCard}>
                  <p>
                    <strong>Medicine:</strong> {item.medicineName || "N/A"}
                  </p>
                  <p>
                    <strong>Dosage:</strong> {item.dosage || "N/A"}
                  </p>
                  <p>
                    <strong>Instructions:</strong> {item.instructions || "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Tests</h4>

            {tests.length === 0 ? (
              <div style={styles.emptySubCard}>
                Chưa có dữ liệu xét nghiệm cho medical record này.
              </div>
            ) : (
              tests.map((item, index) => (
                <div key={item.id || index} style={styles.subCard}>
                  <p>
                    <strong>Test:</strong> {item.testName || item.name || "N/A"}
                  </p>
                  <p>
                    <strong>Status:</strong> {item.status || "N/A"}
                  </p>
                  <p>
                    <strong>Result:</strong> {item.result || "Chưa có kết quả"}
                  </p>
                  <p>
                    <strong>Conclusion:</strong>{" "}
                    {item.conclusion || item.notes || "Chưa có kết luận"}
                  </p>
                </div>
              ))
            )}
          </div>

          {String(role).toUpperCase() === "DOCTOR" && (
            <div style={styles.actionPanel}>
              <div style={styles.actionHint}>
                Bạn đang đăng nhập với vai trò Doctor. Có thể tạo hồ sơ khám mới
                tại route doctor/create-record.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MedicalRecordPage;

const styles = {
  container: {
    padding: "40px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
  },
  subtitle: {
    marginTop: "8px",
    color: "#666",
  },
  roleBadge: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#e8ecff",
    color: "#2f3ab2",
    fontWeight: 600,
  },
  searchCard: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    background: "#fff",
    padding: "16px",
    borderRadius: "14px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cfd7e6",
    fontSize: "14px",
  },
  button: {
    padding: "12px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  stateBox: {
    background: "#fff",
    padding: "18px",
    borderRadius: "14px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  errorBox: {
    border: "1px solid #f0b4b4",
    color: "#9f1d1d",
    background: "#fff7f7",
  },
  card: {
    background: "#fff",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    borderBottom: "1px solid #edf1f7",
    paddingBottom: "16px",
  },
  recordTitle: {
    margin: 0,
  },
  metaLine: {
    color: "#777",
    marginTop: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "20px",
  },
  infoBox: {
    padding: "16px",
    background: "#f6f8ff",
    borderRadius: "12px",
  },
  infoLabel: {
    fontSize: "13px",
    color: "#667085",
    marginBottom: "8px",
  },
  infoValue: {
    fontWeight: 600,
    fontSize: "16px",
  },
  section: {
    marginTop: "24px",
  },
  sectionTitle: {
    marginBottom: "10px",
  },
  sectionText: {
    margin: 0,
    lineHeight: 1.6,
    color: "#333",
  },
  subCard: {
    marginTop: "10px",
    padding: "14px",
    background: "#fafafa",
    borderRadius: "12px",
    border: "1px solid #ececec",
  },
  emptySubCard: {
    marginTop: "10px",
    padding: "14px",
    background: "#fcfcfc",
    borderRadius: "12px",
    border: "1px dashed #d5dbe7",
    color: "#666",
  },
  actionPanel: {
    marginTop: "24px",
    padding: "14px",
    background: "#eef4ff",
    borderRadius: "12px",
  },
  actionHint: {
    color: "#274690",
    fontWeight: 500,
  },
};
