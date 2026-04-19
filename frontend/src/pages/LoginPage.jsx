import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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

      // 🔥 DEBUG xem dữ liệu gửi đi
      console.log("FORM:", form);

      // 🔐 LOGIN (trim sạch data)
      const loginRes = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          usernameOrEmail: form.usernameOrEmail.trim(),
          password: form.password.trim()
        }
      );

      const token = loginRes.data.token;

      if (!token) {
        alert("No token received ❌");
        return;
      }

      // 💾 lưu token
      localStorage.setItem("token", token);

      // 👤 CALL /me (gắn header trực tiếp → tránh 403)
      const meRes = await axios.get(
        "http://localhost:8080/api/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const user = meRes.data;

      // 💾 lưu role
      localStorage.setItem("role", user.role);

      // 💾 lưu user vào context
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("USER:", user);

      alert("Login success 🎉");

      // 🚀 redirect theo role
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "DOCTOR") {
        navigate("/doctor");
      } else {
        navigate("/"); // 👈 về HomePage
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err);

      alert(
        err.response?.data?.message ||
        "Login failed ❌"
      );
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