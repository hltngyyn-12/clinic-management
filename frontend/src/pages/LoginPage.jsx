import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { getErrorMessage } from "../services/api";

function LoginPage() {
  const [form, setForm] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const normalizeRole = (user) => {
    if (!user) return null;

    if (typeof user.role === "string" && user.role.trim()) {
      return user.role.trim().toUpperCase();
    }

    if (Array.isArray(user.roles) && user.roles.length > 0) {
      return String(user.roles[0]).replace("ROLE_", "").toUpperCase();
    }

    if (Array.isArray(user.authorities) && user.authorities.length > 0) {
      return String(user.authorities[0]).replace("ROLE_", "").toUpperCase();
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.usernameOrEmail.trim() || !form.password.trim()) {
      alert("Vui lòng nhập đầy đủ tài khoản và mật khẩu.");
      return;
    }

    try {
      setLoading(true);

      const loginRes = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          usernameOrEmail: form.usernameOrEmail.trim(),
          password: form.password.trim(),
        },
      );

      const loginData = loginRes.data?.data || loginRes.data;
      const token = loginData?.token;

      if (!token) {
        alert("Không nhận được token từ hệ thống.");
        return;
      }

      localStorage.setItem("token", token);

      const meRes = await axios.get("http://localhost:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const meData = meRes.data?.data || meRes.data;
      const role = normalizeRole(meData);

      const normalizedUser = {
        ...meData,
        role,
      };

      localStorage.setItem("user", JSON.stringify(normalizedUser));
      if (role) {
        localStorage.setItem("role", role);
      }

      setUser(normalizedUser);

      alert("Đăng nhập thành công.");

      if (role === "DOCTOR") {
        navigate("/doctor/workspace");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("LOGIN ERROR:", err?.response?.data || err);
      alert(getErrorMessage(err, "Đăng nhập thất bại."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Clinic Login</h2>
        <p style={styles.subtitle}>Đăng nhập để tiếp tục sử dụng hệ thống.</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Username or Email</label>
            <input
              type="text"
              name="usernameOrEmail"
              value={form.usernameOrEmail}
              onChange={handleChange}
              placeholder="Nhập username hoặc email"
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Đang đăng nhập..." : "Login"}
          </button>
        </form>

        <p style={styles.footerText}>
          Chưa có tài khoản?{" "}
          <span style={styles.linkText} onClick={() => navigate("/register")}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(255,255,255,0.96)",
    padding: "30px",
    borderRadius: "18px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
  },
  title: {
    textAlign: "center",
    marginTop: 0,
    marginBottom: "8px",
  },
  subtitle: {
    textAlign: "center",
    color: "#666",
    marginTop: 0,
    marginBottom: "24px",
  },
  field: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "1px solid #d0d7e2",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#667eea",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "6px",
  },
  footerText: {
    textAlign: "center",
    marginTop: "18px",
    marginBottom: 0,
  },
  linkText: {
    color: "#667eea",
    cursor: "pointer",
    fontWeight: 700,
  },
};
