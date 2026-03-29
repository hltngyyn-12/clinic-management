import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function BookingPage() {
  const { doctorId } = useParams();
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    api.get(`/api/doctors/${doctorId}/slots`)
      .then(res => setSlots(res.data))
      .catch(err => console.error(err));
  }, [doctorId]);

  const handleBook = async (slot) => {
    try {
      await api.post("/api/patient/appointments", {
        doctorId,
        slotTime: slot
      });

      alert("Booked successfully 🎉");
    } catch (err) {
      console.error(err);
      alert("Booking failed");
    }
  };

  return (
    <div>
      <h3>Select Time Slot</h3>

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
  );
}

export default BookingPage;