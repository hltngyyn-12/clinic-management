import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/doctors")
      .then(res => setDoctors(res.data || []))
      .catch(() => alert("Load doctors failed"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading doctors...</p>;

  return (
    <div>
      <h2>Doctors</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px,1fr))",
        gap: "20px"
      }}>
        {doctors.map(doc => (
          <div key={doc.id} style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "14px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.08)"
          }}>
            <h4>{doc.user?.fullName}</h4>
            <p>{doc.specialty}</p>
            <p>{doc.experience} years exp</p>

            <button
              onClick={() => navigate(`/booking/${doc.id}`)}
              style={{ marginTop: "10px" }}
            >
              Book
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorListPage;