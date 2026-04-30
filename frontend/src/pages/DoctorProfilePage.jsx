import { useEffect, useState } from "react";
import usePageMeta from "../hooks/usePageMeta";
import api, { getErrorMessage } from "../services/api";
import {
  createAutoGrid,
  createHero,
  gradients,
  ui,
} from "../styles/designSystem";

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

  usePageMeta(
    "Hồ sơ",
    "Cập nhật thông tin chuyên môn, thời gian làm việc, số phòng khám và nội dung hiển thị dành cho bệnh nhân trên ClinicMS.",
  );

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
      alert(getErrorMessage(error, "Không tải được hồ sơ bác sĩ."));
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
          form.slotDurationMinutes === ""
            ? null
            : Number(form.slotDurationMinutes),
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
      alert("Đã cập nhật hồ sơ bác sĩ.");
    } catch (error) {
      alert(getErrorMessage(error, "Không thể cập nhật hồ sơ bác sĩ."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.doctor)}>
        <div style={ui.eyebrow}>Hồ sơ bác sĩ</div>
        <h1 style={ui.title}>
          Cập nhật thông tin chuyên môn và lịch làm việc hiển thị cho bệnh nhân
        </h1>
        <p style={ui.subtitle}>
          Đây là khu vực để bác sĩ quản lý hồ sơ công khai trên hệ thống, bao
          gồm chuyên khoa, thời gian làm việc, số phòng khám và phần giới thiệu
          chuyên môn.
        </p>
      </section>

      <section style={ui.panel}>
        {loading ? (
          <p style={ui.muted}>Đang tải hồ sơ bác sĩ...</p>
        ) : (
          <>
            <div style={createAutoGrid(200)}>
              <div style={ui.panelSoft}>
                <div style={ui.label}>Tài khoản đăng nhập</div>
                <div style={styles.infoValue}>
                  {profile?.username || "Chưa cập nhật"}
                </div>
              </div>
              <div style={ui.panelSoft}>
                <div style={ui.label}>Email liên hệ</div>
                <div style={styles.infoValue}>
                  {profile?.email || "Chưa cập nhật"}
                </div>
              </div>
              <div style={ui.panelSoft}>
                <div style={ui.label}>Trạng thái hoạt động</div>
                <div style={styles.infoValue}>
                  {profile?.active ? "Đang hoạt động" : "Tạm khóa"}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.sectionHead}>
                <h2 style={ui.sectionTitle}>
                  Thông tin hiển thị trên hệ thống
                </h2>
                <p style={ui.sectionHint}>
                  Các nội dung dưới đây sẽ được dùng khi bệnh nhân xem hồ sơ bác
                  sĩ và lựa chọn lịch khám trực tuyến.
                </p>
              </div>

              <div style={createAutoGrid(220)}>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Họ và tên bác sĩ"
                  style={ui.input}
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Số điện thoại liên hệ"
                  style={ui.input}
                />
                <input
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  placeholder="Chuyên khoa phụ trách"
                  style={ui.input}
                />
                <input
                  type="number"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Số năm kinh nghiệm"
                  style={ui.input}
                />
                <input
                  name="degree"
                  value={form.degree}
                  onChange={handleChange}
                  placeholder="Học vị / bằng cấp"
                  style={ui.input}
                />
                <input
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleChange}
                  placeholder="Số phòng khám"
                  style={ui.input}
                />
                <input
                  name="workingStart"
                  value={form.workingStart}
                  onChange={handleChange}
                  placeholder="Giờ bắt đầu, ví dụ 08:00"
                  style={ui.input}
                />
                <input
                  name="workingEnd"
                  value={form.workingEnd}
                  onChange={handleChange}
                  placeholder="Giờ kết thúc, ví dụ 17:00"
                  style={ui.input}
                />
                <input
                  type="number"
                  name="slotDurationMinutes"
                  value={form.slotDurationMinutes}
                  onChange={handleChange}
                  placeholder="Thời lượng mỗi slot khám"
                  style={ui.input}
                />
                <input
                  name="consultationFee"
                  value={form.consultationFee}
                  onChange={handleChange}
                  placeholder="Phí tư vấn"
                  style={ui.input}
                />
              </div>

              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Giới thiệu chuyên môn, thế mạnh điều trị và định hướng chăm sóc bệnh nhân"
                style={ui.textarea}
              />

              <div style={ui.actionRow}>
                <button
                  type="submit"
                  style={ui.primaryButton}
                  disabled={saving}
                >
                  {saving ? "Đang lưu hồ sơ..." : "Lưu hồ sơ bác sĩ"}
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

export default DoctorProfilePage;
