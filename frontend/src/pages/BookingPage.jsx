import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function BookingPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");

  const handleBook = async () => {
    try {
      await api.post("/api/appointments", {
        userId: user.userId,
        doctorId,
        appointmentDate: date,
        slotTime: time,
        reason: "Khám tổng quát",
      });

      alert("Đặt lịch thành công.");
      navigate("/appointments");
    } catch {
      alert("Đặt lịch thất bại.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Đặt lịch nhanh</h2>
        <p style={styles.subtitle}>Màn hình tối giản để thử nhanh thao tác đặt lịch thủ công.</p>
        <input type="date" onChange={(event) => setDate(event.target.value)} style={styles.input} />
        <select onChange={(event) => setTime(event.target.value)} style={styles.input}>
          <option>09:00</option>
          <option>10:00</option>
          <option>11:00</option>
        </select>
        <button onClick={handleBook} style={styles.button}>
          Xác nhận đặt lịch
        </button>
      </div>
    </div>
  );
}

export default BookingPage;

const styles = {
  page: { display: "grid", placeItems: "center", minHeight: "60vh" },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.92)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)",
  },
  title: { margin: 0 },
  subtitle: { margin: "10px 0 0", color: "#64748b", lineHeight: 1.6 },
  input: { width: "100%", marginTop: "14px", padding: "12px 14px", borderRadius: "14px", border: "1px solid #cbd5e1", background: "#fff" },
  button: { marginTop: "16px", border: "none", borderRadius: "14px", background: "linear-gradient(135deg, #0f766e, #2563eb)", color: "#fff", padding: "12px 16px", fontWeight: 800, cursor: "pointer" },
};
