import { useEffect, useState } from "react";
import api from "../services/api";

function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    api.get(`/api/appointments/me?userId=${user.userId}`)
      .then(res => {
        setAppointments(res.data.data);
      })
      .catch(err => {
        alert(err.response?.data?.message || "Load failed ❌");
      });
  }, []);

  const handleCancel = (id) => {
    api.delete(`/api/appointments/${id}`)
      .then(() => {
        alert("Cancelled ✅");
        setAppointments(prev => prev.filter(a => a.id !== id));
      })
      .catch(err => {
        alert(err.response?.data?.message || "Cancel failed ❌");
      });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return { background: "#d4edda", color: "#155724" };
      case "CANCELLED":
        return { background: "#f8d7da", color: "#721c24" };
      default:
        return { background: "#fff3cd", color: "#856404" };
    }
  };

  return (
    <div style={{ padding: "30px", background: "#f5f7fb", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px" }}>📋 My Appointments</h2>

      {appointments.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h4>No appointments yet 😢</h4>
          <p>Book your first appointment now!</p>
        </div>
      )}

      <div style={{ display: "grid", gap: "15px" }}>
        {appointments.map(a => (
          <div
            key={a.id}
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>
              <h5 style={{ marginBottom: "5px" }}>
                🧑‍⚕️ {a.doctor?.name || "Doctor"}
              </h5>

              <p style={{ margin: 0 }}>
                📅 {a.date} | ⏰ {a.time}
              </p>

              <span
                style={{
                  padding: "5px 10px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  display: "inline-block",
                  marginTop: "8px",
                  ...getStatusStyle(a.status)
                }}
              >
                {a.status}
              </span>
            </div>

            {a.status !== "CANCELLED" && (
              <button
                className="btn btn-danger"
                onClick={() => handleCancel(a.id)}
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyAppointmentsPage;