import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function HomePage() {
  const { user, role } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={styles.hero}>
        <div>
          <h1 style={styles.title}>Clinic Management</h1>
          <p style={styles.subtitle}>
            Sign in to book appointments, pay deposits, review medical history and manage online
            clinic workflows.
          </p>
          <button style={styles.primaryButton} onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </div>
    );
  }

  const patientCards = [
    {
      title: "Book Appointment",
      description: "Choose doctor, date and time for an online appointment.",
      action: () => navigate("/doctors"),
    },
    {
      title: "Appointments",
      description: "Track bookings, pay deposits and send doctor reviews.",
      action: () => navigate("/appointments"),
    },
    {
      title: "Medical History",
      description: "Review diagnoses and past visit information.",
      action: () => navigate("/medical-records"),
    },
    {
      title: "Prescriptions",
      description: "See electronic prescriptions and medication instructions.",
      action: () => navigate("/prescriptions"),
    },
    {
      title: "Test Results",
      description: "Follow lab and diagnostic results online.",
      action: () => navigate("/test-results"),
    },
    {
      title: "My Reviews",
      description: "Check reviews you already submitted after visits.",
      action: () => navigate("/reviews"),
    },
  ];

  const doctorCards = [
    {
      title: "Today Schedule",
      description: "See today's appointments, examine patients, prescribe and request tests.",
      action: () => navigate("/doctor/workspace"),
    },
    {
      title: "Doctor Profile",
      description: "Manage doctor profile, room, working time and consultation fee.",
      action: () => navigate("/doctor/profile"),
    },
  ];

  const cards = role === "DOCTOR" ? doctorCards : patientCards;

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <div style={styles.badge}>{role || "USER"}</div>
          <h1 style={styles.title}>Welcome, {user.username}</h1>
          <p style={styles.subtitle}>
            {role === "DOCTOR"
              ? "Open the doctor workspace to manage today's care flow and patient history."
              : "Use the patient portal to book appointments, pay deposits, read prescriptions, test results and reviews."}
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        {cards.map((card) => (
          <button key={card.title} onClick={card.action} style={styles.card}>
            <h3 style={styles.cardTitle}>{card.title}</h3>
            <p style={styles.cardDescription}>{card.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default HomePage;

const styles = {
  page: {
    display: "grid",
    gap: "24px",
  },
  hero: {
    background: "linear-gradient(145deg, #0f172a, #155e75)",
    color: "#fff",
    borderRadius: "28px",
    padding: "34px",
    minHeight: "220px",
    display: "flex",
    alignItems: "center",
  },
  badge: {
    display: "inline-flex",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.15)",
    fontWeight: 700,
    fontSize: "12px",
    letterSpacing: "0.08em",
  },
  title: {
    margin: "14px 0 0",
    fontSize: "38px",
  },
  subtitle: {
    margin: "14px 0 0",
    maxWidth: "760px",
    color: "#dbeafe",
    lineHeight: 1.6,
  },
  primaryButton: {
    marginTop: "20px",
    border: "none",
    borderRadius: "14px",
    background: "#facc15",
    color: "#1f2937",
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  card: {
    textAlign: "left",
    border: "none",
    borderRadius: "20px",
    background: "#fff",
    padding: "22px",
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.08)",
  },
  cardTitle: {
    margin: 0,
    color: "#0f172a",
  },
  cardDescription: {
    margin: "10px 0 0",
    color: "#64748b",
    lineHeight: 1.5,
  },
};
