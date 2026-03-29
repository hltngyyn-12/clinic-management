import { useEffect, useState } from "react";
import api from "../services/api";

function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    api.get("/api/patient/appointments")
      .then(res => setAppointments(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h3>My Appointments</h3>

      {appointments.map(a => (
        <div key={a.id} className="card p-3 mb-2">
          <p>Doctor: {a.doctorName}</p>
          <p>Date: {a.date}</p>
          <p>Status: {a.status}</p>
        </div>
      ))}
    </div>
  );
}

export default MyAppointmentsPage;