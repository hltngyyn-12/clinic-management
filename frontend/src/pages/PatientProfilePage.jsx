import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import usePageMeta from "../hooks/usePageMeta";
import api, { getErrorMessage } from "../services/api";
import { createAutoGrid, createHero, gradients, ui } from "../styles/designSystem";

const emptyForm = {
  fullName: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  insuranceNumber: "",
};

function PatientProfilePage() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  usePageMeta(
    "Hồ sơ bệnh nhân",
    "Cập nhật thông tin cá nhân, ngày sinh, giới tính, địa chỉ và số bảo hiểm y tế để hồ sơ khám bệnh trên ClinicMS đầy đủ và chính xác hơn.",
  );

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/patient/profile");
      const data = response.data?.data;
      setProfile(data);
      setForm({
        fullName: data?.fullName || "",
        dateOfBirth: data?.dateOfBirth || "",
        gender: data?.gender || "",
        address: data?.address || "",
        insuranceNumber: data?.insuranceNumber || "",
      });
    } catch (error) {
      alert(getErrorMessage(error, "Không tải được hồ sơ bệnh nhân."));
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
        fullName: form.fullName,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        address: form.address,
        insuranceNumber: form.insuranceNumber,
      };

      const response = await api.put("/api/patient/profile", payload);
      const data = response.data?.data;
      setProfile(data);
      setForm({
        fullName: data?.fullName || "",
        dateOfBirth: data?.dateOfBirth || "",
        gender: data?.gender || "",
        address: data?.address || "",
        insuranceNumber: data?.insuranceNumber || "",
      });

      const updatedUser = {
        ...user,
        fullName: data?.fullName || user?.fullName || user?.username,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      alert("Đã cập nhật hồ sơ bệnh nhân.");
    } catch (error) {
      alert(getErrorMessage(error, "Không thể cập nhật hồ sơ bệnh nhân."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.patient)}>
        <div style={ui.eyebrow}>Hồ sơ bệnh nhân</div>
        <h1 style={ui.title}>Cập nhật thông tin cá nhân để hồ sơ khám bệnh đầy đủ và chính xác hơn</h1>
        <p style={ui.subtitle}>
          Thông tin trong hồ sơ sẽ được sử dụng khi bác sĩ xem lịch sử điều trị, đánh giá tình trạng
          sức khỏe và đưa ra chỉ định phù hợp hơn trong các lần thăm khám tiếp theo.
        </p>
      </section>

      <section style={ui.panel}>
        {loading ? (
          <p style={ui.muted}>Đang tải hồ sơ bệnh nhân...</p>
        ) : (
          <>
            <div style={createAutoGrid(220)}>
              <div style={ui.panelSoft}>
                <div style={ui.label}>Tài khoản</div>
                <div style={styles.infoValue}>{profile?.username || "Chưa cập nhật"}</div>
              </div>
              <div style={ui.panelSoft}>
                <div style={ui.label}>Email</div>
                <div style={styles.infoValue}>{profile?.email || "Chưa cập nhật"}</div>
              </div>
              <div style={ui.panelSoft}>
                <div style={ui.label}>Số điện thoại</div>
                <div style={styles.infoValue}>{profile?.phone || "Chưa cập nhật"}</div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.sectionHead}>
                <h2 style={ui.sectionTitle}>Thông tin cá nhân</h2>
                <p style={ui.sectionHint}>
                  Vui lòng cập nhật đúng ngày sinh, giới tính, địa chỉ và số bảo hiểm y tế để hỗ trợ
                  bác sĩ nắm đầy đủ thông tin trước khi thăm khám.
                </p>
              </div>

              <div style={createAutoGrid(220)}>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Họ và tên"
                  style={ui.input}
                />

                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  style={ui.input}
                />

                <select name="gender" value={form.gender} onChange={handleChange} style={ui.input}>
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>

                <input
                  name="insuranceNumber"
                  value={form.insuranceNumber}
                  onChange={handleChange}
                  placeholder="Số bảo hiểm y tế"
                  style={ui.input}
                />
              </div>

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Địa chỉ liên hệ"
                style={ui.textarea}
              />

              <div style={ui.actionRow}>
                <button type="submit" style={ui.primaryButton} disabled={saving}>
                  {saving ? "Đang lưu hồ sơ..." : "Lưu hồ sơ"}
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

const styles = {
  infoValue: {
    marginTop: "8px",
    color: "#16324f",
    fontWeight: 700,
  },
  form: {
    display: "grid",
    gap: "18px",
    marginTop: "20px",
  },
  sectionHead: {
    display: "grid",
    gap: "6px",
  },
};

export default PatientProfilePage;
