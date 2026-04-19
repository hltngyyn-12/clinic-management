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
        reason: "General check"
      });

      alert("Booked successfully");
      navigate("/appointments");
    } catch {
      alert("Booking failed");
    }
  };

  return (
    <div>
      <h2>Book Appointment</h2>

      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <br />
      <select onChange={(e) => setTime(e.target.value)}>
        <option>09:00</option>
        <option>10:00</option>
        <option>11:00</option>
      </select>

      <br /><br />

      <button onClick={handleBook}>Confirm Booking</button>
    </div>
  );
}

export default BookingPage;