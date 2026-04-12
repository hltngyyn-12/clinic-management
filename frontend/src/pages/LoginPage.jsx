import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function LoginPage() {

  const [form, setForm] = useState({
    usernameOrEmail: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.usernameOrEmail || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // 🔐 login lấy token
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        form
      );

      const token = res.data.token;

      if (!token) {
        alert("No token received ❌");
        return;
      }

      // 💾 lưu token
      localStorage.setItem("token", token);
      localStorage.setItem("token", res.data.token);

      // 👤 lấy user info
      const me = await api.get("/api/auth/me");

      setUser(me.data);

      // 🎉 success
      alert("Login success 🎉");

      // 🚀 redirect
      if (me.data.role === "ADMIN") {
        navigate("/admin");
      } else if (me.data.role === "DOCTOR") {
        navigate("/doctor");
      } else {
        navigate("/doctors"); // booking flow
      }

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          width: "400px",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          padding: "30px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          🏥 Clinic Login
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <label>Username or Email</label>
            <input
              type="text"
              name="usernameOrEmail"
              className="form-control"
              value={form.usernameOrEmail}
              onChange={handleChange}
              placeholder="Enter your username..."
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              background: "#667eea",
              color: "#fff",
              fontWeight: "bold",
              transition: "0.3s",
              cursor: "pointer"
            }}
            onMouseOver={(e) => (e.target.style.background = "#5a67d8")}
            onMouseOut={(e) => (e.target.style.background = "#667eea")}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Don't have an account?{" "}
          <span
            style={{
              color: "#667eea",
              cursor: "pointer",
              fontWeight: "bold"
            }}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;