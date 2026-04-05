import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function BookingPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // lấy user từ localStorage (login đã lưu)
  const user = JSON.parse(localStorage.getItem("user"));

  // load slot
  useEffect(() => {
    api.get(`/api/doctors/${doctorId}/slots`)
      .then(res => setSlots(res.data))
      .catch(err => console.error(err));
  }, [doctorId]);

  // xử lý đặt lịch
  const handleBook = async (time) => {
    if (!selectedDate) {
      alert("Please select a date first 📅");
      return;
    }

    try {
      await api.post("/api/appointments", {
        userId: user.userId,
        doctorId: doctorId,
        date: selectedDate,
        time: time,
        reason: "General check"
      });

      alert("Booked successfully 🎉");

      // 👉 chuyển sang lịch sử khám
      navigate("/appointments");

    } catch (err) {
      console.error(err);

      // 🔥 HIỂN THỊ LỖI BACKEND (mục 3 của bạn)
      alert(err.response?.data?.message || "Booking failed ❌");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>📅 Booking Doctor</h3>

      {/* chọn ngày */}
      <div className="mb-3">
        <label>Select Date</label>
        <input
          type="date"
          className="form-control"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <h5>Select Time Slot</h5>

      {slots.length === 0 && <p>No slots available</p>}

      <div>
        {slots.map((s, i) => (
          <button
            key={i}
            className="btn btn-outline-success m-2"
            onClick={() => handleBook(s)}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export default BookingPage;