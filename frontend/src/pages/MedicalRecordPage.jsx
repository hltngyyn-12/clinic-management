import { useEffect, useState } from "react";
import api from "../services/api";

function MedicalRecordPage() {
  const [records, setRecords] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    api.get("/api/patient/medical-records")
      .then(res => {
        setRecords(res.data.data || res.data);
      })
      .catch(err => {
        console.error(err);
        alert("Cannot load medical records ❌");
      });
  }, []);

  return (
    <div style={{ padding: "30px", background: "#f5f7fb", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px" }}>📋 Medical Records</h2>

      {records.length === 0 && (
        <p>No medical records yet 😢</p>
      )}

      <div style={{ display: "grid", gap: "20px" }}>
        {records.map((r) => (
          <div
            key={r.id}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "15px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: "10px" }}>
              <h5>🧑‍⚕️ {r.doctor?.name || "Doctor"}</h5>
              <p style={{ margin: 0, color: "#666" }}>
                📅 {r.createdAt || "N/A"}
              </p>
            </div>

            {/* Symptoms */}
            <div style={{ marginBottom: "10px" }}>
              <strong>🩺 Symptoms:</strong>
              <p>{r.symptoms || "N/A"}</p>
            </div>

            {/* Diagnosis */}
            <div style={{ marginBottom: "10px" }}>
              <strong>📌 Diagnosis:</strong>
              <p>{r.diagnosis || "N/A"}</p>
            </div>

            {/* Prescription */}
            <div style={{ marginBottom: "10px" }}>
              <strong>💊 Prescriptions:</strong>
              {r.prescriptions?.length > 0 ? (
                <ul>
                  {r.prescriptions.map((p, i) => (
                    <li key={i}>
                      {p.medicine?.name} - {p.dosage} - {p.frequency}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No prescriptions</p>
              )}
            </div>

            {/* Test Results */}
            <div>
              <strong>🧪 Test Results:</strong>
              {r.testResults?.length > 0 ? (
                <ul>
                  {r.testResults.map((t, i) => (
                    <li key={i}>
                      {t.testName}: {t.resultText}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No test results</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicalRecordPage;