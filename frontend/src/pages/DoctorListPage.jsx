import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/api/doctors")
      .then(res => {
        setDoctors(res.data.data || res.data);
      })
      .catch(err => {
        console.error(err);
        alert("Cannot load doctors ❌");
      });
  }, []);

  return (
    <div style={{ padding: "30px", background: "#f5f7fb", minHeight: "100vh" }}>
      <h2 style={{ marginBottom: "20px" }}>🧑‍⚕️ Our Doctors</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px"
        }}
      >
        {doctors.map((doc) => (
          <div
            key={doc.id}
            style={{
              background: "#fff",
              borderRadius: "15px",
              padding: "20px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              transition: "0.3s",
              cursor: "pointer"
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {/* avatar */}
            <div
              style={{
                width: "70px",
                height: "70px",
                borderRadius: "50%",
                background: "#667eea",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                marginBottom: "10px"
              }}
            >
              {doc.name?.charAt(0)}
            </div>

            <h5>{doc.name}</h5>

            <p style={{ margin: "5px 0", color: "#777" }}>
              {doc.specialty?.name || "General"}
            </p>

            <p style={{ fontSize: "14px", color: "#555" }}>
              ⭐ 4.8 • {doc.experienceYears || 5} yrs exp
            </p>

            <p style={{ fontWeight: "bold", marginTop: "10px" }}>
              💸 {doc.consultationFee || 200000} VND
            </p>

            <button
              className="btn btn-primary w-100 mt-2"
              onClick={() => navigate(`/booking/${doc.id}`)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorListPage;