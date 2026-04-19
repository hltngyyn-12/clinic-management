import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    return <h2>Please login</h2>;
  }

  const cards = [
    {
      title: "Find Doctors",
      desc: "Browse doctors and book appointments",
      action: () => navigate("/doctors"),
      icon: "🧑‍⚕️"
    },
    {
      title: "My Appointments",
      desc: "View your booking history",
      action: () => navigate("/appointments"),
      icon: "📅"
    },
    {
      title: "Medical Records",
      desc: "Track your health data",
      action: () => navigate("/medical-records"),
      icon: "📋"
    }
  ];

  return (
    <div>
      <h2>Welcome back, {user.username} 👋</h2>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px,1fr))",
        gap: "20px",
        marginTop: "30px"
      }}>
        {cards.map((c, i) => (
          <div
            key={i}
            onClick={c.action}
            style={{
              background: "#fff",
              padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              cursor: "pointer"
            }}
          >
            <h3>{c.icon} {c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;