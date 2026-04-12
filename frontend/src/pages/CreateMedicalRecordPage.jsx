import { useState } from "react";
import api from "../services/api";

function CreateMedicalRecordPage() {
  const [form, setForm] = useState({
    appointmentId: "",
    diagnosis: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/api/medical-records", form);
      alert("Medical record created 🎉");

      setForm({
        appointmentId: "",
        diagnosis: "",
        notes: "",
      });

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error creating record");
    }
  };

  return (
    <div style={styles.container}>
      <h2>👨‍⚕️ Create Medical Record</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="number"
          name="appointmentId"
          placeholder="Appointment ID"
          value={form.appointmentId}
          onChange={handleChange}
          style={styles.input}
        />

        <textarea
          name="diagnosis"
          placeholder="Diagnosis"
          value={form.diagnosis}
          onChange={handleChange}
          style={styles.textarea}
        />

        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          style={styles.textarea}
        />

        <button style={styles.button}>Create</button>
      </form>
    </div>
  );
}

export default CreateMedicalRecordPage;

const styles = {
  container: {
    padding: "40px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxWidth: "500px",
  },
  input: {
    padding: "10px",
  },
  textarea: {
    padding: "10px",
    minHeight: "100px",
  },
  button: {
    padding: "12px",
    background: "#4f46e5",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
  },
};