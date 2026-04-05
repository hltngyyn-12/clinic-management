import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "20px"
      }}
    >
      <h1 style={{ fontSize: "40px", fontWeight: "bold" }}>
        🏥 Clinic Management System
      </h1>

      <p style={{ marginTop: "15px", maxWidth: "500px" }}>
        Book appointments, manage your health records, and connect with doctors
        easily — all in one place.
      </p>

      <div style={{ marginTop: "30px" }}>
        <button
          className="btn btn-light m-2"
          onClick={() => navigate("/login")}
        >
          Login
        </button>

        <button
          className="btn btn-outline-light m-2"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>

      {/* feature section */}
      <div
        style={{
          marginTop: "60px",
          display: "flex",
          gap: "20px",
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            padding: "20px",
            borderRadius: "12px",
            width: "250px"
          }}
        >
          <h4>📅 Easy Booking</h4>
          <p>Schedule appointments in seconds</p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            padding: "20px",
            borderRadius: "12px",
            width: "250px"
          }}
        >
          <h4>🧑‍⚕️ Qualified Doctors</h4>
          <p>Find the best specialists easily</p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            padding: "20px",
            borderRadius: "12px",
            width: "250px"
          }}
        >
          <h4>📋 Medical Records</h4>
          <p>Track your treatment history</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;