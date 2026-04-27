import { useEffect, useState } from "react";
import usePageMeta from "../hooks/usePageMeta";
import api, { getErrorMessage } from "../services/api";
import {
  createAutoGrid,
  createHero,
  createStatusPill,
  gradients,
  ui,
} from "../styles/designSystem";

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

  usePageMeta(
    "Quản lý bác sĩ",
    "Tạo mới, cập nhật và theo dõi tài khoản bác sĩ trong cổng quản trị ClinicMS.",
  );

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
      alert(getErrorMessage(error, "Không tải được dữ liệu bác sĩ."));
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
        alert("Cập nhật bác sĩ thành công.");
      } else {
        await api.post("/api/admin/doctors", payload);
        alert("Tạo bác sĩ mới thành công.");
      }

      resetForm();
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Lưu bác sĩ thất bại."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (doctorId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bác sĩ này?")) return;
    try {
      await api.delete(`/api/admin/doctors/${doctorId}`);
      alert("Xóa bác sĩ thành công.");
      if (editingId === doctorId) {
        resetForm();
      }
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Xóa bác sĩ thất bại."));
    }
  };

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.admin)}>
        <div style={ui.eyebrow}>Quản trị đội ngũ y khoa</div>
        <h1 style={ui.title}>Quản lý tài khoản, thông tin hành nghề và lịch làm việc của bác sĩ</h1>
        <p style={ui.subtitle}>
          Quản trị viên có thể tạo mới, chỉnh sửa, khóa hoặc xóa tài khoản bác sĩ trong
          một không gian quản trị thống nhất và rõ ràng.
        </p>
      </section>

      <div style={styles.layout}>
        <section style={ui.panel}>
          <div style={ui.sectionHeader}>
            <div>
              <h2 style={ui.sectionTitle}>Danh sách bác sĩ</h2>
              <p style={ui.sectionHint}>
                Theo dõi toàn bộ bác sĩ đang hoạt động trong hệ thống.
              </p>
            </div>
            <button type="button" onClick={loadData} style={ui.secondaryButton}>
              Tải lại
            </button>
          </div>

          {loading ? (
            <p style={ui.muted}>Đang tải danh sách bác sĩ...</p>
          ) : doctors.length === 0 ? (
            <p style={ui.muted}>Chưa có bác sĩ nào trong hệ thống.</p>
          ) : (
            <div style={{ display: "grid", gap: "14px" }}>
              {doctors.map((doctor) => (
                <div key={doctor.id} style={ui.listCard}>
                  <div style={styles.cardTop}>
                    <div>
                      <strong style={styles.cardName}>{doctor.fullName}</strong>
                      <div style={styles.accountText}>@{doctor.username}</div>
                    </div>
                    <div style={createStatusPill(doctor.active ? "success" : "danger")}>
                      {doctor.active ? "Đang hoạt động" : "Tạm khóa"}
                    </div>
                  </div>

                  <div style={createAutoGrid(150)}>
                    <div style={styles.inlineInfo}>
                      <span style={ui.label}>Chuyên khoa</span>
                      <span>{doctor.specialtyName || "Chưa cập nhật"}</span>
                    </div>
                    <div style={styles.inlineInfo}>
                      <span style={ui.label}>Điện thoại</span>
                      <span>{doctor.phone || "Chưa cập nhật"}</span>
                    </div>
                    <div style={styles.inlineInfo}>
                      <span style={ui.label}>Phòng khám</span>
                      <span>{doctor.roomNumber || "Chưa cập nhật"}</span>
                    </div>
                    <div style={styles.inlineInfo}>
                      <span style={ui.label}>Slot</span>
                      <span>{doctor.slotDurationMinutes || 0} phút</span>
                    </div>
                  </div>

                  <div style={ui.actionRow}>
                    <button type="button" onClick={() => handleEdit(doctor)} style={ui.primaryButton}>
                      Chỉnh sửa
                    </button>
                    <button type="button" onClick={() => handleDelete(doctor.id)} style={ui.dangerButton}>
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section style={ui.panel}>
          <div style={ui.sectionHeader}>
            <div>
              <h2 style={ui.sectionTitle}>{editingId ? "Cập nhật bác sĩ" : "Tạo bác sĩ mới"}</h2>
              <p style={ui.sectionHint}>
                Điền thông tin tài khoản, chuyên khoa và thời gian tiếp nhận khám.
              </p>
            </div>
            {editingId ? (
              <button type="button" onClick={resetForm} style={ui.secondaryButton}>
                Hủy chỉnh sửa
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={createAutoGrid(220)}>
              <input name="username" value={form.username} onChange={handleChange} placeholder="Tên đăng nhập" style={ui.input} />
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={ui.input} />
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder={editingId ? "Mật khẩu mới nếu cần đổi" : "Mật khẩu"} style={ui.input} />
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Họ và tên" style={ui.input} />
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" style={ui.input} />
              <select name="specialtyId" value={form.specialtyId} onChange={handleChange} style={ui.input}>
                <option value="">Chọn chuyên khoa</option>
                {specialties.map((specialty) => (
                  <option key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
              <input type="number" name="experience" value={form.experience} onChange={handleChange} placeholder="Số năm kinh nghiệm" style={ui.input} />
              <input name="degree" value={form.degree} onChange={handleChange} placeholder="Học vị / bằng cấp" style={ui.input} />
              <input name="roomNumber" value={form.roomNumber} onChange={handleChange} placeholder="Số phòng khám" style={ui.input} />
              <input name="workingStart" value={form.workingStart} onChange={handleChange} placeholder="Giờ bắt đầu" style={ui.input} />
              <input name="workingEnd" value={form.workingEnd} onChange={handleChange} placeholder="Giờ kết thúc" style={ui.input} />
              <input type="number" name="slotDurationMinutes" value={form.slotDurationMinutes} onChange={handleChange} placeholder="Thời lượng slot" style={ui.input} />
              <input name="consultationFee" value={form.consultationFee} onChange={handleChange} placeholder="Phí tư vấn" style={ui.input} />
            </div>

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              placeholder="Giới thiệu chuyên môn và thế mạnh của bác sĩ"
              style={ui.textarea}
            />

            <label style={ui.checkboxRow}>
              <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
              Kích hoạt tài khoản bác sĩ
            </label>

            <div style={ui.actionRow}>
              <button type="submit" style={ui.primaryButton} disabled={saving}>
                {saving ? "Đang lưu..." : editingId ? "Cập nhật bác sĩ" : "Tạo bác sĩ"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(340px, 1fr) minmax(380px, 1.08fr)",
    gap: "20px",
    alignItems: "start",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },
  cardName: {
    color: "#16324f",
    fontSize: "20px",
  },
  accountText: {
    marginTop: "6px",
    color: "#6e849b",
    fontSize: "13px",
  },
  inlineInfo: {
    display: "grid",
    gap: "6px",
    color: "#34506e",
    fontSize: "14px",
  },
  form: {
    display: "grid",
    gap: "16px",
  },
};

export default AdminDoctorsPage;
