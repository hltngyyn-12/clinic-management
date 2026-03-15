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
        "http://localhost:8080/api/auth/register",
        form
      );

      alert(res.data.message);
      console.log(res.data);

    } catch (error) {
      console.error(error);
      alert("Register failed");
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
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Full Name</label>

          <input
            type="text"
            name="fullName"
            className="form-control"
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Email</label>

          <input
            type="email"
            name="email"
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

        <button type="submit" className="btn btn-success">
          Register
        </button>

      </form>
    </div>
  );
}

export default RegisterPage;