import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";
import usePageMeta from "../hooks/usePageMeta";

const emptySlotForm = {
  name: "",
  workingStart: "09:00",
  workingEnd: "17:00",
  slotDurationMinutes: 30,
  notes: "",
  active: true,
};

const emptyNotificationForm = {
  title: "",
  message: "",
  targetRole: "PATIENT",
  active: true,
};

function AdminOperationsPage() {
  const [slotConfigs, setSlotConfigs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [report, setReport] = useState(null);
  const [reportFilter, setReportFilter] = useState({ startDate: "", endDate: "" });
  const [slotForm, setSlotForm] = useState(emptySlotForm);
  const [notificationForm, setNotificationForm] = useState(emptyNotificationForm);
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editingNotificationId, setEditingNotificationId] = useState(null);

  usePageMeta(
    "Vận hành phòng khám",
    "Cấu hình khung giờ khám, theo dõi doanh thu và quản lý thông báo hệ thống dành cho quản trị viên.",
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [slotRes, notificationRes, reportRes] = await Promise.all([
        api.get("/api/admin/slot-configs"),
        api.get("/api/admin/notifications"),
        api.get("/api/admin/reports/revenue"),
      ]);
      setSlotConfigs(slotRes.data?.data || []);
      setNotifications(notificationRes.data?.data || []);
      setReport(reportRes.data?.data || null);
    } catch (error) {
      alert(getErrorMessage(error, "Không tải được dữ liệu vận hành."));
    }
  };

  const submitSlotConfig = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...slotForm,
        slotDurationMinutes: Number(slotForm.slotDurationMinutes),
      };
      if (editingSlotId) {
        await api.put(`/api/admin/slot-configs/${editingSlotId}`, payload);
        alert("Cập nhật cấu hình slot thành công.");
      } else {
        await api.post("/api/admin/slot-configs", payload);
        alert("Tạo cấu hình slot thành công.");
      }
      setSlotForm(emptySlotForm);
      setEditingSlotId(null);
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Lưu cấu hình slot thất bại."));
    }
  };

  const submitNotification = async (event) => {
    event.preventDefault();
    try {
      if (editingNotificationId) {
        await api.put(`/api/admin/notifications/${editingNotificationId}`, notificationForm);
        alert("Cập nhật thông báo thành công.");
      } else {
        await api.post("/api/admin/notifications", notificationForm);
        alert("Tạo thông báo thành công.");
      }
      setNotificationForm(emptyNotificationForm);
      setEditingNotificationId(null);
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Lưu thông báo thất bại."));
    }
  };

  const loadReport = async () => {
    try {
      const params = new URLSearchParams();
      if (reportFilter.startDate) params.set("startDate", reportFilter.startDate);
      if (reportFilter.endDate) params.set("endDate", reportFilter.endDate);
      const suffix = params.toString() ? `?${params}` : "";
      const response = await api.get(`/api/admin/reports/revenue${suffix}`);
      setReport(response.data?.data || null);
    } catch (error) {
      alert(getErrorMessage(error, "Không tải được báo cáo doanh thu."));
    }
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>Vận hành phòng khám</div>
          <h1 style={styles.title}>Cấu hình khung giờ khám, theo dõi doanh thu và quản lý thông báo</h1>
          <p style={styles.subtitle}>
            Đây là trung tâm vận hành cho các nghiệp vụ hành chính quan trọng của hệ thống phòng khám.
          </p>
        </div>
      </section>

      <div style={styles.grid}>
        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Cấu hình slot khám</h2>
          <form onSubmit={submitSlotConfig} style={styles.form}>
            <div style={styles.formGrid}>
              <input name="name" value={slotForm.name} onChange={(event) => setSlotForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Tên cấu hình" style={styles.input} />
              <input name="workingStart" value={slotForm.workingStart} onChange={(event) => setSlotForm((prev) => ({ ...prev, workingStart: event.target.value }))} placeholder="Giờ bắt đầu" style={styles.input} />
              <input name="workingEnd" value={slotForm.workingEnd} onChange={(event) => setSlotForm((prev) => ({ ...prev, workingEnd: event.target.value }))} placeholder="Giờ kết thúc" style={styles.input} />
              <input name="slotDurationMinutes" value={slotForm.slotDurationMinutes} onChange={(event) => setSlotForm((prev) => ({ ...prev, slotDurationMinutes: event.target.value }))} placeholder="Thời lượng mỗi slot" style={styles.input} />
            </div>
            <textarea name="notes" value={slotForm.notes} onChange={(event) => setSlotForm((prev) => ({ ...prev, notes: event.target.value }))} placeholder="Ghi chú" style={styles.textarea} />
            <label style={styles.checkboxRow}>
              <input type="checkbox" checked={slotForm.active} onChange={(event) => setSlotForm((prev) => ({ ...prev, active: event.target.checked }))} />
              Kích hoạt cấu hình này
            </label>
            <div style={styles.actionRow}>
              <button type="submit" style={styles.primaryButton}>{editingSlotId ? "Cập nhật cấu hình" : "Tạo cấu hình"}</button>
              {editingSlotId ? <button type="button" onClick={() => { setEditingSlotId(null); setSlotForm(emptySlotForm); }} style={styles.secondaryButton}>Hủy</button> : null}
            </div>
          </form>

          <div style={styles.cardStack}>
            {slotConfigs.map((item) => (
              <div key={item.id} style={styles.listCard}>
                <strong>{item.name}</strong>
                <p style={styles.listText}>{item.workingStart} - {item.workingEnd} | {item.slotDurationMinutes} phút</p>
                <p style={styles.listText}>{item.notes || "Chưa có ghi chú."}</p>
                <div style={styles.actionRow}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSlotId(item.id);
                      setSlotForm({
                        name: item.name || "",
                        workingStart: item.workingStart || "09:00",
                        workingEnd: item.workingEnd || "17:00",
                        slotDurationMinutes: item.slotDurationMinutes ?? 30,
                        notes: item.notes || "",
                        active: item.active ?? true,
                      });
                    }}
                    style={styles.primaryButton}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm("Bạn có chắc muốn xóa cấu hình slot này?")) return;
                      try {
                        await api.delete(`/api/admin/slot-configs/${item.id}`);
                        await loadData();
                      } catch (error) {
                        alert(getErrorMessage(error, "Xóa cấu hình slot thất bại."));
                      }
                    }}
                    style={styles.dangerButton}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Báo cáo doanh thu</h2>
          <div style={styles.formGrid}>
            <input type="date" value={reportFilter.startDate} onChange={(event) => setReportFilter((prev) => ({ ...prev, startDate: event.target.value }))} style={styles.input} />
            <input type="date" value={reportFilter.endDate} onChange={(event) => setReportFilter((prev) => ({ ...prev, endDate: event.target.value }))} style={styles.input} />
          </div>
          <button type="button" onClick={loadReport} style={styles.primaryButton}>Tải báo cáo</button>

          {report ? (
            <div style={styles.reportWrap}>
              <div style={styles.reportGrid}>
                <div style={styles.reportCard}><span style={styles.smallMuted}>Khoảng thời gian</span><strong>{report.startDate} đến {report.endDate}</strong></div>
                <div style={styles.reportCard}><span style={styles.smallMuted}>Tổng lịch hẹn</span><strong>{report.totalAppointments}</strong></div>
                <div style={styles.reportCard}><span style={styles.smallMuted}>Lịch đã thanh toán</span><strong>{report.paidAppointments}</strong></div>
                <div style={styles.reportCard}><span style={styles.smallMuted}>Doanh thu</span><strong>{report.totalRevenue}</strong></div>
              </div>
              <div style={styles.cardStack}>
                {(report.dailyItems || []).map((item) => (
                  <div key={item.date} style={styles.listCard}>
                    <strong>{item.date}</strong>
                    <p style={styles.listText}>Lịch đã thanh toán: {item.paidAppointments}</p>
                    <p style={styles.listText}>Doanh thu: {item.revenue}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={styles.listText}>Chưa tải báo cáo nào.</p>
          )}
        </section>

        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Thông báo hệ thống</h2>
          <form onSubmit={submitNotification} style={styles.form}>
            <input name="title" value={notificationForm.title} onChange={(event) => setNotificationForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Tiêu đề" style={styles.input} />
            <select name="targetRole" value={notificationForm.targetRole} onChange={(event) => setNotificationForm((prev) => ({ ...prev, targetRole: event.target.value }))} style={styles.input}>
              <option value="PATIENT">Bệnh nhân</option>
              <option value="DOCTOR">Bác sĩ</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="ALL">Tất cả</option>
            </select>
            <textarea name="message" value={notificationForm.message} onChange={(event) => setNotificationForm((prev) => ({ ...prev, message: event.target.value }))} placeholder="Nội dung thông báo" style={styles.textarea} />
            <label style={styles.checkboxRow}>
              <input type="checkbox" checked={notificationForm.active} onChange={(event) => setNotificationForm((prev) => ({ ...prev, active: event.target.checked }))} />
              Kích hoạt thông báo
            </label>
            <div style={styles.actionRow}>
              <button type="submit" style={styles.primaryButton}>{editingNotificationId ? "Cập nhật thông báo" : "Tạo thông báo"}</button>
              {editingNotificationId ? <button type="button" onClick={() => { setEditingNotificationId(null); setNotificationForm(emptyNotificationForm); }} style={styles.secondaryButton}>Hủy</button> : null}
            </div>
          </form>

          <div style={styles.cardStack}>
            {notifications.map((item) => (
              <div key={item.id} style={styles.listCard}>
                <strong>{item.title}</strong>
                <p style={styles.listText}>Đối tượng: {item.targetRole} | {item.createdAt || "Chưa rõ thời gian"}</p>
                <p style={styles.listText}>{item.message}</p>
                <div style={styles.actionRow}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNotificationId(item.id);
                      setNotificationForm({
                        title: item.title || "",
                        message: item.message || "",
                        targetRole: item.targetRole || "PATIENT",
                        active: item.active ?? true,
                      });
                    }}
                    style={styles.primaryButton}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (!window.confirm("Bạn có chắc muốn xóa thông báo này?")) return;
                      try {
                        await api.delete(`/api/admin/notifications/${item.id}`);
                        await loadData();
                      } catch (error) {
                        alert(getErrorMessage(error, "Xóa thông báo thất bại."));
                      }
                    }}
                    style={styles.dangerButton}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default AdminOperationsPage;

const styles = {
  page: { display: "grid", gap: "24px" },
  hero: { background: "linear-gradient(135deg, #0f172a, #7c3aed)", color: "#fff", borderRadius: "32px", padding: "34px" },
  eyebrow: { display: "inline-flex", borderRadius: "999px", background: "rgba(255,255,255,0.15)", padding: "8px 12px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" },
  title: { margin: "16px 0 0", fontSize: "36px", lineHeight: 1.14, letterSpacing: "-0.03em" },
  subtitle: { margin: "14px 0 0", maxWidth: "760px", color: "#ede9fe", lineHeight: 1.7 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" },
  panel: { background: "rgba(255,255,255,0.92)", borderRadius: "24px", padding: "22px", boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)", display: "grid", gap: "18px", border: "1px solid rgba(148, 163, 184, 0.16)" },
  sectionTitle: { margin: 0, color: "#0f172a" },
  form: { display: "grid", gap: "12px" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" },
  input: { width: "100%", border: "1px solid #cbd5e1", borderRadius: "14px", padding: "12px 14px", fontSize: "14px", background: "#fff" },
  textarea: { width: "100%", minHeight: "100px", border: "1px solid #cbd5e1", borderRadius: "14px", padding: "12px 14px", fontSize: "14px", resize: "vertical", background: "#fff" },
  checkboxRow: { display: "flex", alignItems: "center", gap: "10px", color: "#0f172a", fontWeight: 600 },
  actionRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
  cardStack: { display: "grid", gap: "12px" },
  listCard: { border: "1px solid #dbeafe", borderRadius: "16px", padding: "14px", display: "grid", gap: "10px" },
  listText: { margin: 0, color: "#475569", lineHeight: 1.5 },
  reportWrap: { display: "grid", gap: "16px" },
  reportGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" },
  reportCard: { background: "#f8fafc", borderRadius: "16px", padding: "14px", display: "grid", gap: "6px" },
  smallMuted: { color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em" },
  primaryButton: { border: "none", borderRadius: "14px", background: "linear-gradient(135deg, #0f766e, #2563eb)", color: "#fff", padding: "12px 16px", fontWeight: 800, cursor: "pointer" },
  secondaryButton: { border: "1px solid #cbd5e1", borderRadius: "14px", background: "#fff", color: "#0f172a", padding: "12px 16px", fontWeight: 700, cursor: "pointer" },
  dangerButton: { border: "none", borderRadius: "14px", background: "#dc2626", color: "#fff", padding: "12px 16px", fontWeight: 800, cursor: "pointer" },
};
