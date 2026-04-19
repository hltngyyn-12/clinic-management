import { useEffect, useState } from "react";
import api from "../services/api";

function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    api.get(`/api/appointments/me?userId=${user.userId}`)
      .then(res => setAppointments(res.data || []))
      .catch(() => alert("Load failed"));
  }, []);

  return (
    <div>
      <h2>My Appointments</h2>

      {appointments.length === 0 && <p>No appointments</p>}

      {appointments.map(a => (
        <div key={a.id} style={{
          background: "#fff",
          padding: "15px",
          marginBottom: "10px",
          borderRadius: "10px"
        }}>
          <p><b>{a.doctor?.user?.fullName}</b></p>
          <p>{a.appointmentDate} - {a.slotTime}</p>
          <p>Status: {a.status}</p>
        </div>
      ))}
    </div>
  );
}

export default MyAppointmentsPage;