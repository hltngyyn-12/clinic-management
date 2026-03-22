import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {

  const [form, setForm] = useState({
    usernameOrEmail: "",
    password: ""
  });

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

    try {
      const res = await axios.post(
        "http://localhost:8080/api/auth/login",
        form,
        { withCredentials: true }
      );

      alert(res.data.message);

      // gọi /me để lấy user chuẩn
      const me = await axios.get(
        "http://localhost:8080/api/auth/me",
        { withCredentials: true }
      );

      setUser(me.data);

      // redirect theo role
      if (me.data.role === "ADMIN") {
        navigate("/admin");
      } else if (me.data.role === "DOCTOR") {
        navigate("/doctor");
      } else {
        navigate("/patient");
      }

    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  return (
    <div>
      <h3>Login Page</h3>

      <form style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>

        <div className="mb-3">
          <label>Username or Email</label>
          <input
            type="text"
            name="usernameOrEmail"
            className="form-control"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary">Login</button>

      </form>
    </div>
  );
}

export default LoginPage;