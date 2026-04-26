import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

const emptyDoctorForm = {
  username: "",
  email: "",
  password: "",
  fullName: "",
  phone: "",
  specialtyId: "",
  experience: "",
  degree: "",
  bio: "",
  roomNumber: "",
  workingStart: "09:00",
  workingEnd: "17:00",
  slotDurationMinutes: 60,
  consultationFee: "",
  active: true,
};

function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [form, setForm] = useState(emptyDoctorForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [doctorRes, specialtyRes] = await Promise.all([
        api.get("/api/admin/doctors"),
        api.get("/api/admin/specialties"),
      ]);
      setDoctors(doctorRes.data?.data || []);
      setSpecialties(specialtyRes.data?.data || []);
    } catch (error) {
      alert(getErrorMessage(error, "Failed to load admin doctors"));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm(emptyDoctorForm);
    setEditingId(null);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (doctor) => {
    setEditingId(doctor.id);
    setForm({
      username: doctor.username || "",
      email: doctor.email || "",
      password: "",
      fullName: doctor.fullName || "",
      phone: doctor.phone || "",
      specialtyId: doctor.specialtyId ? String(doctor.specialtyId) : "",
      experience: doctor.experience ?? "",
      degree: doctor.degree || "",
      bio: doctor.bio || "",
      roomNumber: doctor.roomNumber || "",
      workingStart: doctor.workingStart || "09:00",
      workingEnd: doctor.workingEnd || "17:00",
      slotDurationMinutes: doctor.slotDurationMinutes ?? 60,
      consultationFee: doctor.consultationFee || "",
      active: doctor.active ?? true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        specialtyId: form.specialtyId ? Number(form.specialtyId) : null,
        experience: form.experience === "" ? null : Number(form.experience),
        slotDurationMinutes:
          form.slotDurationMinutes === "" ? null : Number(form.slotDurationMinutes),
      };

      if (editingId) {
        await api.put(`/api/admin/doctors/${editingId}`, payload);
        alert("Doctor updated successfully");
      } else {
        await api.post("/api/admin/doctors", payload);
        alert("Doctor created successfully");
      }

      resetForm();
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Failed to save doctor"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (doctorId) => {
    if (!window.confirm("Delete this doctor?")) return;
    try {
      await api.delete(`/api/admin/doctors/${doctorId}`);
      alert("Doctor deleted successfully");
      if (editingId === doctorId) {
        resetForm();
      }
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Failed to delete doctor"));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>ADMIN DOCTORS</div>
          <h1 style={styles.title}>Manage Doctor Accounts</h1>
          <p style={styles.subtitle}>
            Admin feature 1: create, view, update and delete doctor accounts and practice details.
          </p>
        </div>
      </div>

      <div style={styles.layout}>
        <section style={styles.panel}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Doctor List</h2>
              <p style={styles.sectionHint}>All registered doctors in the system.</p>
            </div>
            <button type="button" onClick={loadData} style={styles.secondaryButton}>
              Reload
            </button>
          </div>

          {loading ? (
            <p style={styles.muted}>Loading doctors...</p>
          ) : doctors.length === 0 ? (
            <p style={styles.muted}>No doctors found.</p>
          ) : (
            <div style={styles.cardStack}>
              {doctors.map((doctor) => (
                <div key={doctor.id} style={styles.listCard}>
                  <div style={styles.cardTop}>
                    <div>
                      <strong style={styles.cardName}>{doctor.fullName}</strong>
                      <div style={styles.smallMuted}>@{doctor.username}</div>
                    </div>
                    <span
                      style={{
                        ...styles.statusPill,
                        background: doctor.active ? "#dcfce7" : "#fee2e2",
                        color: doctor.active ? "#166534" : "#991b1b",
                      }}
                    >
                      {doctor.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div style={styles.infoGrid}>
                    <span>Specialty: {doctor.specialtyName || "N/A"}</span>
                    <span>Phone: {doctor.phone || "N/A"}</span>
                    <span>Room: {doctor.roomNumber || "N/A"}</span>
                    <span>Slot: {doctor.slotDurationMinutes || 0} min</span>
                  </div>
                  <div style={styles.actionRow}>
                    <button type="button" onClick={() => handleEdit(doctor)} style={styles.primaryButton}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDelete(doctor.id)} style={styles.dangerButton}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={styles.panel}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>{editingId ? "Update Doctor" : "Create Doctor"}</h2>
              <p style={styles.sectionHint}>Fill doctor account and profile information.</p>
            </div>
            {editingId ? (
              <button type="button" onClick={resetForm} style={styles.secondaryButton}>
                Cancel Edit
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGrid}>
              <input name="username" value={form.username} onChange={handleChange} placeholder="Username" style={styles.input} />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={styles.input} />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder={editingId ? "New password (optional)" : "Password"}
                style={styles.input}
              />
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full name" style={styles.input} />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" style={styles.input} />
              <select name="specialtyId" value={form.specialtyId} onChange={handleChange} style={styles.input}>
                <option value="">Select specialty</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
              <input type="number" name="experience" value={form.experience} onChange={handleChange} placeholder="Experience years" style={styles.input} />
              <input name="degree" value={form.degree} onChange={handleChange} placeholder="Degree" style={styles.input} />
              <input name="roomNumber" value={form.roomNumber} onChange={handleChange} placeholder="Room number" style={styles.input} />
              <input name="workingStart" value={form.workingStart} onChange={handleChange} placeholder="Working start" style={styles.input} />
              <input name="workingEnd" value={form.workingEnd} onChange={handleChange} placeholder="Working end" style={styles.input} />
              <input
                type="number"
                name="slotDurationMinutes"
                value={form.slotDurationMinutes}
                onChange={handleChange}
                placeholder="Slot duration minutes"
                style={styles.input}
              />
              <input
                name="consultationFee"
                value={form.consultationFee}
                onChange={handleChange}
                placeholder="Consultation fee"
                style={styles.input}
              />
            </div>

            <textarea name="bio" value={form.bio} onChange={handleChange} placeholder="Doctor bio" style={styles.textarea} />

            <label style={styles.checkboxRow}>
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
              Active doctor account
            </label>

            <button type="submit" style={styles.primaryButton} disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update Doctor" : "Create Doctor"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default AdminDoctorsPage;

const styles = {
  page: { display: "grid", gap: "24px" },
  hero: { background: "linear-gradient(135deg, #111827, #1d4ed8)", color: "#fff", borderRadius: "28px", padding: "34px" },
  eyebrow: { display: "inline-flex", borderRadius: "999px", background: "rgba(255,255,255,0.15)", padding: "8px 12px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em" },
  title: { margin: "16px 0 0", fontSize: "36px" },
  subtitle: { margin: "14px 0 0", maxWidth: "760px", color: "#dbeafe", lineHeight: 1.6 },
  layout: { display: "grid", gridTemplateColumns: "minmax(320px, 1fr) minmax(360px, 1fr)", gap: "20px", alignItems: "start" },
  panel: { background: "#fff", borderRadius: "24px", padding: "22px", boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)", display: "grid", gap: "18px" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" },
  sectionTitle: { margin: 0, color: "#0f172a" },
  sectionHint: { margin: "6px 0 0", color: "#64748b" },
  secondaryButton: { border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", borderRadius: "12px", padding: "10px 14px", fontWeight: 700, cursor: "pointer" },
  muted: { margin: 0, color: "#64748b" },
  cardStack: { display: "grid", gap: "14px" },
  listCard: { border: "1px solid #dbeafe", borderRadius: "18px", padding: "16px", display: "grid", gap: "12px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" },
  cardName: { color: "#0f172a", fontSize: "18px" },
  smallMuted: { color: "#64748b", fontSize: "13px", marginTop: "4px" },
  statusPill: { borderRadius: "999px", padding: "8px 12px", fontWeight: 800, fontSize: "12px" },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px", color: "#334155", fontSize: "14px" },
  actionRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
  form: { display: "grid", gap: "14px" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" },
  input: { width: "100%", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", background: "#fff" },
  textarea: { width: "100%", minHeight: "120px", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", resize: "vertical", background: "#fff" },
  checkboxRow: { display: "flex", alignItems: "center", gap: "10px", color: "#0f172a", fontWeight: 600 },
  primaryButton: { border: "none", borderRadius: "12px", background: "#0f766e", color: "#fff", padding: "12px 16px", fontWeight: 800, cursor: "pointer" },
  dangerButton: { border: "none", borderRadius: "12px", background: "#dc2626", color: "#fff", padding: "12px 16px", fontWeight: 800, cursor: "pointer" },
};
