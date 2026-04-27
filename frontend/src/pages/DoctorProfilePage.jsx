import { useEffect, useState } from "react";
import usePageMeta from "../hooks/usePageMeta";
import api, { getErrorMessage } from "../services/api";
import { createAutoGrid, createHero, gradients, ui } from "../styles/designSystem";

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
    "Hồ sơ bác sĩ",
    "Cập nhật thông tin chuyên môn, thời gian làm việc và hồ sơ hiển thị cho bệnh nhân.",
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
      alert("Cập nhật hồ sơ bác sĩ thành công.");
    } catch (error) {
      alert(getErrorMessage(error, "Cập nhật hồ sơ bác sĩ thất bại."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.doctor)}>
        <div style={ui.eyebrow}>Hồ sơ bác sĩ</div>
        <h1 style={ui.title}>Quản lý thông tin hành nghề và lịch làm việc hiển thị công khai</h1>
        <p style={ui.subtitle}>
          Cập nhật hồ sơ chuyên môn, khung giờ tiếp nhận, số phòng và nội dung giới thiệu
          để bệnh nhân có đủ thông tin trước khi đặt lịch khám.
        </p>
      </section>

      <section style={ui.panel}>
        {loading ? (
          <p style={ui.muted}>Đang tải hồ sơ bác sĩ...</p>
        ) : (
          <>
            <div style={createAutoGrid(200)}>
              <div style={ui.panelSoft}>
                <div style={ui.label}>Tài khoản</div>
                <div style={styles.infoValue}>{profile?.username || "Chưa cập nhật"}</div>
              </div>
              <div style={ui.panelSoft}>
                <div style={ui.label}>Email</div>
                <div style={styles.infoValue}>{profile?.email || "Chưa cập nhật"}</div>
              </div>
              <div style={ui.panelSoft}>
                <div style={ui.label}>Trạng thái</div>
                <div style={styles.infoValue}>
                  {profile?.active ? "Đang hoạt động" : "Tạm khóa"}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.sectionHead}>
                <h2 style={ui.sectionTitle}>Thông tin hiển thị trên hệ thống</h2>
                <p style={ui.sectionHint}>
                  Dữ liệu dưới đây được dùng để hiển thị trên trang đặt lịch và hồ sơ bác sĩ.
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
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Số điện thoại"
                  style={ui.input}
                />
                <input
                  name="specialty"
                  value={form.specialty}
                  onChange={handleChange}
                  placeholder="Chuyên khoa"
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
                  placeholder="Thời lượng mỗi slot"
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
                placeholder="Giới thiệu chuyên môn, định hướng điều trị và thế mạnh khám chữa bệnh"
                style={ui.textarea}
              />

              <div style={ui.actionRow}>
                <button type="submit" style={ui.primaryButton} disabled={saving}>
                  {saving ? "Đang lưu..." : "Lưu hồ sơ"}
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
