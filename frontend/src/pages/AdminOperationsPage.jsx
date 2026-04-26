import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

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
      alert(getErrorMessage(error, "Failed to load admin operations"));
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
        alert("Slot config updated successfully");
      } else {
        await api.post("/api/admin/slot-configs", payload);
        alert("Slot config created successfully");
      }
      setSlotForm(emptySlotForm);
      setEditingSlotId(null);
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Failed to save slot config"));
    }
  };

  const submitNotification = async (event) => {
    event.preventDefault();
    try {
      if (editingNotificationId) {
        await api.put(`/api/admin/notifications/${editingNotificationId}`, notificationForm);
        alert("Notification updated successfully");
      } else {
        await api.post("/api/admin/notifications", notificationForm);
        alert("Notification created successfully");
      }
      setNotificationForm(emptyNotificationForm);
      setEditingNotificationId(null);
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Failed to save notification"));
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
      alert(getErrorMessage(error, "Failed to load revenue report"));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>ADMIN OPERATIONS</div>
          <h1 style={styles.title}>Slots, Revenue And Notifications</h1>
          <p style={styles.subtitle}>
            Admin features 4, 5 and 6: configure slot templates, view revenue report and manage notifications.
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Slot Configurations</h2>
          <form onSubmit={submitSlotConfig} style={styles.form}>
            <div style={styles.formGrid}>
              <input name="name" value={slotForm.name} onChange={(e) => setSlotForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Config name" style={styles.input} />
              <input name="workingStart" value={slotForm.workingStart} onChange={(e) => setSlotForm((prev) => ({ ...prev, workingStart: e.target.value }))} placeholder="Working start" style={styles.input} />
              <input name="workingEnd" value={slotForm.workingEnd} onChange={(e) => setSlotForm((prev) => ({ ...prev, workingEnd: e.target.value }))} placeholder="Working end" style={styles.input} />
              <input name="slotDurationMinutes" value={slotForm.slotDurationMinutes} onChange={(e) => setSlotForm((prev) => ({ ...prev, slotDurationMinutes: e.target.value }))} placeholder="Duration minutes" style={styles.input} />
            </div>
            <textarea name="notes" value={slotForm.notes} onChange={(e) => setSlotForm((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Notes" style={styles.textarea} />
            <label style={styles.checkboxRow}>
              <input type="checkbox" checked={slotForm.active} onChange={(e) => setSlotForm((prev) => ({ ...prev, active: e.target.checked }))} />
              Active slot config
            </label>
            <div style={styles.actionRow}>
              <button type="submit" style={styles.primaryButton}>{editingSlotId ? "Update Slot Config" : "Create Slot Config"}</button>
              {editingSlotId ? <button type="button" onClick={() => { setEditingSlotId(null); setSlotForm(emptySlotForm); }} style={styles.secondaryButton}>Cancel</button> : null}
            </div>
          </form>

          <div style={styles.cardStack}>
            {slotConfigs.map((item) => (
              <div key={item.id} style={styles.listCard}>
                <strong>{item.name}</strong>
                <p style={styles.listText}>{item.workingStart} - {item.workingEnd} | {item.slotDurationMinutes} min</p>
                <p style={styles.listText}>{item.notes || "No notes"}</p>
                <div style={styles.actionRow}>
                  <button type="button" onClick={() => { setEditingSlotId(item.id); setSlotForm({ name: item.name || "", workingStart: item.workingStart || "09:00", workingEnd: item.workingEnd || "17:00", slotDurationMinutes: item.slotDurationMinutes ?? 30, notes: item.notes || "", active: item.active ?? true }); }} style={styles.primaryButton}>Edit</button>
                  <button type="button" onClick={async () => { if (!window.confirm("Delete this slot config?")) return; try { await api.delete(`/api/admin/slot-configs/${item.id}`); await loadData(); } catch (error) { alert(getErrorMessage(error, "Failed to delete slot config")); } }} style={styles.dangerButton}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Revenue Report</h2>
          <div style={styles.formGrid}>
            <input type="date" value={reportFilter.startDate} onChange={(e) => setReportFilter((prev) => ({ ...prev, startDate: e.target.value }))} style={styles.input} />
            <input type="date" value={reportFilter.endDate} onChange={(e) => setReportFilter((prev) => ({ ...prev, endDate: e.target.value }))} style={styles.input} />
          </div>
          <button type="button" onClick={loadReport} style={styles.primaryButton}>Load Report</button>

          {report ? (
            <div style={styles.reportWrap}>
              <div style={styles.reportGrid}>
                <div style={styles.reportCard}><span style={styles.smallMuted}>Range</span><strong>{report.startDate} to {report.endDate}</strong></div>
                <div style={styles.reportCard}><span style={styles.smallMuted}>Total Appointments</span><strong>{report.totalAppointments}</strong></div>
                <div style={styles.reportCard}><span style={styles.smallMuted}>Paid Appointments</span><strong>{report.paidAppointments}</strong></div>
                <div style={styles.reportCard}><span style={styles.smallMuted}>Revenue</span><strong>{report.totalRevenue}</strong></div>
              </div>
              <div style={styles.cardStack}>
                {(report.dailyItems || []).map((item) => (
                  <div key={item.date} style={styles.listCard}>
                    <strong>{item.date}</strong>
                    <p style={styles.listText}>Paid appointments: {item.paidAppointments}</p>
                    <p style={styles.listText}>Revenue: {item.revenue}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p style={styles.listText}>No report loaded.</p>
          )}
        </section>

        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Notifications</h2>
          <form onSubmit={submitNotification} style={styles.form}>
            <input name="title" value={notificationForm.title} onChange={(e) => setNotificationForm((prev) => ({ ...prev, title: e.target.value }))} placeholder="Title" style={styles.input} />
            <select name="targetRole" value={notificationForm.targetRole} onChange={(e) => setNotificationForm((prev) => ({ ...prev, targetRole: e.target.value }))} style={styles.input}>
              <option value="PATIENT">PATIENT</option>
              <option value="DOCTOR">DOCTOR</option>
              <option value="ADMIN">ADMIN</option>
              <option value="ALL">ALL</option>
            </select>
            <textarea name="message" value={notificationForm.message} onChange={(e) => setNotificationForm((prev) => ({ ...prev, message: e.target.value }))} placeholder="Message" style={styles.textarea} />
            <label style={styles.checkboxRow}>
              <input type="checkbox" checked={notificationForm.active} onChange={(e) => setNotificationForm((prev) => ({ ...prev, active: e.target.checked }))} />
              Active notification
            </label>
            <div style={styles.actionRow}>
              <button type="submit" style={styles.primaryButton}>{editingNotificationId ? "Update Notification" : "Create Notification"}</button>
              {editingNotificationId ? <button type="button" onClick={() => { setEditingNotificationId(null); setNotificationForm(emptyNotificationForm); }} style={styles.secondaryButton}>Cancel</button> : null}
            </div>
          </form>

          <div style={styles.cardStack}>
            {notifications.map((item) => (
              <div key={item.id} style={styles.listCard}>
                <strong>{item.title}</strong>
                <p style={styles.listText}>Target: {item.targetRole} | {item.createdAt || "N/A"}</p>
                <p style={styles.listText}>{item.message}</p>
                <div style={styles.actionRow}>
                  <button type="button" onClick={() => { setEditingNotificationId(item.id); setNotificationForm({ title: item.title || "", message: item.message || "", targetRole: item.targetRole || "PATIENT", active: item.active ?? true }); }} style={styles.primaryButton}>Edit</button>
                  <button type="button" onClick={async () => { if (!window.confirm("Delete this notification?")) return; try { await api.delete(`/api/admin/notifications/${item.id}`); await loadData(); } catch (error) { alert(getErrorMessage(error, "Failed to delete notification")); } }} style={styles.dangerButton}>Delete</button>
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
  hero: { background: "linear-gradient(135deg, #0f172a, #7c3aed)", color: "#fff", borderRadius: "28px", padding: "34px" },
  eyebrow: { display: "inline-flex", borderRadius: "999px", background: "rgba(255,255,255,0.15)", padding: "8px 12px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em" },
  title: { margin: "16px 0 0", fontSize: "36px" },
  subtitle: { margin: "14px 0 0", maxWidth: "760px", color: "#ede9fe", lineHeight: 1.6 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" },
  panel: { background: "#fff", borderRadius: "24px", padding: "22px", boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)", display: "grid", gap: "18px" },
  sectionTitle: { margin: 0, color: "#0f172a" },
  form: { display: "grid", gap: "12px" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" },
  input: { width: "100%", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", background: "#fff" },
  textarea: { width: "100%", minHeight: "100px", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", resize: "vertical", background: "#fff" },
  checkboxRow: { display: "flex", alignItems: "center", gap: "10px", color: "#0f172a", fontWeight: 600 },
  actionRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
  cardStack: { display: "grid", gap: "12px" },
  listCard: { border: "1px solid #dbeafe", borderRadius: "16px", padding: "14px", display: "grid", gap: "10px" },
  listText: { margin: 0, color: "#475569", lineHeight: 1.5 },
  reportWrap: { display: "grid", gap: "16px" },
  reportGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" },
  reportCard: { background: "#f8fafc", borderRadius: "16px", padding: "14px", display: "grid", gap: "6px" },
  smallMuted: { color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em" },
  primaryButton: { border: "none", borderRadius: "12px", background: "#0f766e", color: "#fff", padding: "12px 16px", fontWeight: 800, cursor: "pointer" },
  secondaryButton: { border: "1px solid #cbd5e1", borderRadius: "12px", background: "#fff", color: "#0f172a", padding: "12px 16px", fontWeight: 700, cursor: "pointer" },
  dangerButton: { border: "none", borderRadius: "12px", background: "#dc2626", color: "#fff", padding: "12px 16px", fontWeight: 800, cursor: "pointer" },
};
