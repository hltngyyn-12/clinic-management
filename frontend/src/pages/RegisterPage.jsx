import { useState } from "react";
import axios from "axios";

function RegisterPage() {

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    role: "PATIENT"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate đơn giản frontend
    if (!form.username || !form.email || !form.password || !form.fullName) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        "http://localhost:8080/api/auth/register",
        form
      );

      alert(res.data.message);

      // reset form
      setForm({
        username: "",
        email: "",
        password: "",
        fullName: "",
        role: "PATIENT"
      });

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Register</h3>

      <form style={{ maxWidth: "400px" }} onSubmit={handleSubmit}>

        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            name="username"
            className="form-control"
            value={form.username}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            className="form-control"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
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
          />
        </div>

        <button
          type="submit"
          className="btn btn-success"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

      </form>
    </div>
  );
}

export default RegisterPage;