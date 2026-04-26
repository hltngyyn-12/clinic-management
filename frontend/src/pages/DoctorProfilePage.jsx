import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

const emptyProfile = {
  fullName: "",
  phone: "",
  specialty: "",
  experience: "",
  degree: "",
  bio: "",
  roomNumber: "",
  workingStart: "",
  workingEnd: "",
  slotDurationMinutes: "",
  consultationFee: "",
};

function DoctorProfilePage() {
  const [form, setForm] = useState(emptyProfile);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/doctor/profile");
      const data = response.data?.data;
      setProfile(data);
      setForm({
        fullName: data?.fullName || "",
        phone: data?.phone || "",
        specialty: data?.specialty || "",
        experience: data?.experience ?? "",
        degree: data?.degree || "",
        bio: data?.bio || "",
        roomNumber: data?.roomNumber || "",
        workingStart: data?.workingStart || "",
        workingEnd: data?.workingEnd || "",
        slotDurationMinutes: data?.slotDurationMinutes ?? "",
        consultationFee: data?.consultationFee || "",
      });
    } catch (error) {
      alert(getErrorMessage(error, "Failed to load doctor profile"));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        experience: form.experience === "" ? null : Number(form.experience),
        slotDurationMinutes:
          form.slotDurationMinutes === "" ? null : Number(form.slotDurationMinutes),
      };

      const response = await api.put("/api/doctor/profile", payload);
      const data = response.data?.data;
      setProfile(data);
      setForm({
        fullName: data?.fullName || "",
        phone: data?.phone || "",
        specialty: data?.specialty || "",
        experience: data?.experience ?? "",
        degree: data?.degree || "",
        bio: data?.bio || "",
        roomNumber: data?.roomNumber || "",
        workingStart: data?.workingStart || "",
        workingEnd: data?.workingEnd || "",
        slotDurationMinutes: data?.slotDurationMinutes ?? "",
        consultationFee: data?.consultationFee || "",
      });
      alert("Doctor profile updated successfully");
    } catch (error) {
      alert(getErrorMessage(error, "Failed to update doctor profile"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>DOCTOR PROFILE</div>
          <h1 style={styles.title}>Manage Personal Practice Information</h1>
          <p style={styles.subtitle}>
            Doctor feature 6: update public profile, room, consultation fee and working schedule.
          </p>
        </div>
      </div>

      <div style={styles.panel}>
        {loading ? (
          <p style={styles.muted}>Loading profile...</p>
        ) : (
          <>
            <div style={styles.infoGrid}>
              <div style={styles.infoCard}>
                <span style={styles.infoLabel}>Username</span>
                <strong>{profile?.username || "N/A"}</strong>
              </div>
              <div style={styles.infoCard}>
                <span style={styles.infoLabel}>Email</span>
                <strong>{profile?.email || "N/A"}</strong>
              </div>
              <div style={styles.infoCard}>
                <span style={styles.infoLabel}>Status</span>
                <strong>{profile?.active ? "Active" : "Inactive"}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.formGrid}>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Full name"
                  style={styles.input}
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  style={styles.input}
                />
                <input
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  placeholder="Specialty"
                  style={styles.input}
                />
                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Experience in years"
                  style={styles.input}
                />
                <input
                  name="degree"
                  value={form.degree}
                  onChange={handleChange}
                  placeholder="Degree"
                  style={styles.input}
                />
                <input
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleChange}
                  placeholder="Room number"
                  style={styles.input}
                />
                <input
                  name="workingStart"
                  value={form.workingStart}
                  onChange={handleChange}
                  placeholder="Working start, ex: 09:00"
                  style={styles.input}
                />
                <input
                  name="workingEnd"
                  value={form.workingEnd}
                  onChange={handleChange}
                  placeholder="Working end, ex: 17:00"
                  style={styles.input}
                />
                <input
                  type="number"
                  name="slotDurationMinutes"
                  value={form.slotDurationMinutes}
                  onChange={handleChange}
                  placeholder="Slot duration in minutes"
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

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Professional bio"
                style={styles.textarea}
              />

              <button type="submit" style={styles.primaryButton} disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default DoctorProfilePage;

const styles = {
  page: {
    display: "grid",
    gap: "24px",
  },
  hero: {
    background: "linear-gradient(135deg, #1e293b, #0369a1)",
    color: "#fff",
    borderRadius: "28px",
    padding: "34px",
  },
  eyebrow: {
    display: "inline-flex",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.15)",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.08em",
  },
  title: {
    margin: "16px 0 0",
    fontSize: "36px",
  },
  subtitle: {
    margin: "14px 0 0",
    maxWidth: "760px",
    color: "#dbeafe",
    lineHeight: 1.6,
  },
  panel: {
    background: "#fff",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)",
    display: "grid",
    gap: "20px",
  },
  muted: {
    margin: 0,
    color: "#64748b",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  infoCard: {
    borderRadius: "18px",
    background: "#f8fafc",
    padding: "16px",
    display: "grid",
    gap: "6px",
  },
  infoLabel: {
    color: "#64748b",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  form: {
    display: "grid",
    gap: "16px",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  input: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
  },
  textarea: {
    width: "100%",
    minHeight: "150px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    background: "#fff",
  },
  primaryButton: {
    justifySelf: "start",
    border: "none",
    borderRadius: "12px",
    background: "#0f766e",
    color: "#fff",
    padding: "12px 18px",
    fontWeight: 800,
    cursor: "pointer",
  },
};
