import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";
import usePageMeta from "../hooks/usePageMeta";
import { confirmAction } from "../utils/feedbackUx";
import {
  createAutoGrid,
  createHero,
  gradients,
  ui,
} from "../styles/designSystem";

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
  const [reportFilter, setReportFilter] = useState({
    startDate: "",
    endDate: "",
  });
  const [slotForm, setSlotForm] = useState(emptySlotForm);
  const [notificationForm, setNotificationForm] = useState(
    emptyNotificationForm,
  );
  const [editingSlotId, setEditingSlotId] = useState(null);
  const [editingNotificationId, setEditingNotificationId] = useState(null);

  usePageMeta(
    "Vận hành hệ thống",
    "Cấu hình slot khám, theo dõi báo cáo doanh thu và quản lý thông báo hệ thống trên trung tâm vận hành ClinicMS.",
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
      alert(getErrorMessage(error, "Không thể tải dữ liệu vận hành."));
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
        alert("Đã cập nhật cấu hình slot khám.");
      } else {
        await api.post("/api/admin/slot-configs", payload);
        alert("Đã tạo cấu hình slot khám.");
      }
      setSlotForm(emptySlotForm);
      setEditingSlotId(null);
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Không thể lưu cấu hình slot khám."));
    }
  };

  const submitNotification = async (event) => {
    event.preventDefault();
    try {
      if (editingNotificationId) {
        await api.put(
          `/api/admin/notifications/${editingNotificationId}`,
          notificationForm,
        );
        alert("Đã cập nhật thông báo.");
      } else {
        await api.post("/api/admin/notifications", notificationForm);
        alert("Đã tạo thông báo.");
      }
      setNotificationForm(emptyNotificationForm);
      setEditingNotificationId(null);
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Không thể lưu thông báo."));
    }
  };

  const loadReport = async () => {
    try {
      const params = new URLSearchParams();
      if (reportFilter.startDate)
        params.set("startDate", reportFilter.startDate);
      if (reportFilter.endDate) params.set("endDate", reportFilter.endDate);
      const suffix = params.toString() ? `?${params}` : "";
      const response = await api.get(`/api/admin/reports/revenue${suffix}`);
      setReport(response.data?.data || null);
    } catch (error) {
      alert(getErrorMessage(error, "Không thể tải báo cáo doanh thu."));
    }
  };

  const handleDeleteSlot = async (id) => {
    const confirmed = await confirmAction(
      "Bạn có chắc muốn xóa cấu hình slot khám này?",
      {
        title: "Xóa cấu hình slot khám",
        confirmLabel: "Xóa cấu hình",
      },
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/admin/slot-configs/${id}`);
      alert("Đã xóa cấu hình slot khám.");
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Không thể xóa cấu hình slot khám."));
    }
  };

  const handleDeleteNotification = async (id) => {
    const confirmed = await confirmAction(
      "Bạn có chắc muốn xóa thông báo này?",
      {
        title: "Xóa thông báo",
        confirmLabel: "Xóa thông báo",
      },
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/admin/notifications/${id}`);
      alert("Đã xóa thông báo.");
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Không thể xóa thông báo."));
    }
  };

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.admin)}>
        <div style={ui.eyebrow}>Trung tâm vận hành phòng khám</div>
        <h1 style={ui.title}>
          Theo dõi lịch khám, doanh thu và thông báo trên cùng một bảng điều
          hành
        </h1>
        <p style={ui.subtitle}>
          Khu vực này dành cho các nghiệp vụ vận hành quan trọng của phòng khám:
          thiết lập slot khám, theo dõi doanh thu theo thời gian và gửi thông
          báo đến từng nhóm người dùng trên hệ thống.
        </p>
      </section>

      <div style={styles.grid}>
        <section style={ui.panel}>
          <div style={styles.sectionHead}>
            <h2 style={ui.sectionTitle}>Cấu hình slot khám</h2>
            <p style={ui.sectionHint}>
              Thiết lập các mẫu khung giờ làm việc để chuẩn hóa thời lượng khám
              và thời gian tiếp nhận.
            </p>
          </div>

          <form onSubmit={submitSlotConfig} style={styles.form}>
            <div style={createAutoGrid(160)}>
              <input
                name="name"
                value={slotForm.name}
                onChange={(event) =>
                  setSlotForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Tên cấu hình, ví dụ: Ca sáng tiêu chuẩn"
                style={ui.input}
              />
              <input
                name="workingStart"
                value={slotForm.workingStart}
                onChange={(event) =>
                  setSlotForm((prev) => ({
                    ...prev,
                    workingStart: event.target.value,
                  }))
                }
                placeholder="Giờ bắt đầu"
                style={ui.input}
              />
              <input
                name="workingEnd"
                value={slotForm.workingEnd}
                onChange={(event) =>
                  setSlotForm((prev) => ({
                    ...prev,
                    workingEnd: event.target.value,
                  }))
                }
                placeholder="Giờ kết thúc"
                style={ui.input}
              />
              <input
                name="slotDurationMinutes"
                value={slotForm.slotDurationMinutes}
                onChange={(event) =>
                  setSlotForm((prev) => ({
                    ...prev,
                    slotDurationMinutes: event.target.value,
                  }))
                }
                placeholder="Thời lượng mỗi slot"
                style={ui.input}
              />
            </div>
            <textarea
              name="notes"
              value={slotForm.notes}
              onChange={(event) =>
                setSlotForm((prev) => ({ ...prev, notes: event.target.value }))
              }
              placeholder="Ghi chú vận hành, ví dụ: áp dụng cho cuối tuần hoặc cho nhóm bác sĩ cụ thể"
              style={ui.textarea}
            />
            <label style={ui.checkboxRow}>
              <input
                type="checkbox"
                checked={slotForm.active}
                onChange={(event) =>
                  setSlotForm((prev) => ({
                    ...prev,
                    active: event.target.checked,
                  }))
                }
              />
              Kích hoạt cấu hình slot khám này
            </label>
            <div style={ui.actionRow}>
              <button type="submit" style={ui.primaryButton}>
                {editingSlotId ? "Cập nhật cấu hình slot" : "Tạo cấu hình slot"}
              </button>
              {editingSlotId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSlotId(null);
                    setSlotForm(emptySlotForm);
                  }}
                  style={ui.secondaryButton}
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
            </div>
          </form>

          <div style={styles.cardStack}>
            {slotConfigs.map((item) => (
              <div key={item.id} style={ui.listCard}>
                <strong>{item.name}</strong>
                <p style={styles.listText}>
                  Khung giờ: {item.workingStart} - {item.workingEnd} | Thời
                  lượng mỗi lượt khám: {item.slotDurationMinutes} phút
                </p>
                <p style={styles.listText}>
                  {item.notes || "Cấu hình này chưa có ghi chú vận hành."}
                </p>
                <p style={styles.metaText}>
                  Trạng thái:{" "}
                  {item.active ? "Đang áp dụng" : "Tạm dừng sử dụng"}
                </p>
                <div style={ui.actionRow}>
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
                    style={ui.primaryButton}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteSlot(item.id)}
                    style={ui.dangerButton}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={ui.panel}>
          <div style={styles.sectionHead}>
            <h2 style={ui.sectionTitle}>Báo cáo doanh thu</h2>
            <p style={ui.sectionHint}>
              Theo dõi số lượng lịch đã thanh toán và doanh thu theo từng giai
              đoạn để hỗ trợ vận hành và đối soát.
            </p>
          </div>

          <div style={createAutoGrid(180)}>
            <input
              type="date"
              value={reportFilter.startDate}
              onChange={(event) =>
                setReportFilter((prev) => ({
                  ...prev,
                  startDate: event.target.value,
                }))
              }
              style={ui.input}
            />
            <input
              type="date"
              value={reportFilter.endDate}
              onChange={(event) =>
                setReportFilter((prev) => ({
                  ...prev,
                  endDate: event.target.value,
                }))
              }
              style={ui.input}
            />
          </div>
          <button type="button" onClick={loadReport} style={ui.primaryButton}>
            Tải báo cáo doanh thu
          </button>

          {report ? (
            <div style={styles.reportWrap}>
              <div style={createAutoGrid(160)}>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Khoảng thời gian</div>
                  <div style={styles.reportValue}>
                    {report.startDate} đến {report.endDate}
                  </div>
                </div>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Tổng lịch hẹn</div>
                  <div style={styles.reportValue}>
                    {report.totalAppointments}
                  </div>
                </div>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Lịch đã thanh toán</div>
                  <div style={styles.reportValue}>
                    {report.paidAppointments}
                  </div>
                </div>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Doanh thu</div>
                  <div style={styles.reportValue}>{report.totalRevenue}</div>
                </div>
              </div>
              <div style={styles.cardStack}>
                {(report.dailyItems || []).map((item) => (
                  <div key={item.date} style={ui.listCard}>
                    <strong>{item.date}</strong>
                    <p style={styles.listText}>
                      Lịch đã thanh toán: {item.paidAppointments}
                    </p>
                    <p style={styles.listText}>
                      Doanh thu ghi nhận: {item.revenue}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={ui.stateCard}>
              <strong style={styles.emptyTitle}>
                Chưa có báo cáo để hiển thị
              </strong>
              <p style={ui.muted}>
                Hãy chọn khoảng thời gian và tải lại báo cáo để xem số liệu
                doanh thu.
              </p>
            </div>
          )}
        </section>

        <section style={ui.panel}>
          <div style={styles.sectionHead}>
            <h2 style={ui.sectionTitle}>Thông báo hệ thống</h2>
            <p style={ui.sectionHint}>
              Soạn thông báo gửi đến bệnh nhân, bác sĩ hoặc toàn bộ người dùng
              để truyền đạt thay đổi vận hành và các lưu ý cần thiết.
            </p>
          </div>

          <form onSubmit={submitNotification} style={styles.form}>
            <input
              name="title"
              value={notificationForm.title}
              onChange={(event) =>
                setNotificationForm((prev) => ({
                  ...prev,
                  title: event.target.value,
                }))
              }
              placeholder="Tiêu đề thông báo"
              style={ui.input}
            />
            <select
              name="targetRole"
              value={notificationForm.targetRole}
              onChange={(event) =>
                setNotificationForm((prev) => ({
                  ...prev,
                  targetRole: event.target.value,
                }))
              }
              style={ui.input}
            >
              <option value="PATIENT">Bệnh nhân</option>
              <option value="DOCTOR">Bác sĩ</option>
              <option value="ADMIN">Quản trị viên</option>
              <option value="ALL">Tất cả vai trò</option>
            </select>
            <textarea
              name="message"
              value={notificationForm.message}
              onChange={(event) =>
                setNotificationForm((prev) => ({
                  ...prev,
                  message: event.target.value,
                }))
              }
              placeholder="Nhập nội dung thông báo ngắn gọn, rõ ràng và đúng đối tượng nhận"
              style={ui.textarea}
            />
            <label style={ui.checkboxRow}>
              <input
                type="checkbox"
                checked={notificationForm.active}
                onChange={(event) =>
                  setNotificationForm((prev) => ({
                    ...prev,
                    active: event.target.checked,
                  }))
                }
              />
              Kích hoạt thông báo sau khi lưu
            </label>
            <div style={ui.actionRow}>
              <button type="submit" style={ui.primaryButton}>
                {editingNotificationId
                  ? "Cập nhật thông báo"
                  : "Tạo thông báo mới"}
              </button>
              {editingNotificationId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingNotificationId(null);
                    setNotificationForm(emptyNotificationForm);
                  }}
                  style={ui.secondaryButton}
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
            </div>
          </form>

          <div style={styles.cardStack}>
            {notifications.map((item) => (
              <div key={item.id} style={ui.listCard}>
                <strong>{item.title}</strong>
                <p style={styles.listText}>
                  Đối tượng nhận: {item.targetRole} |{" "}
                  {item.createdAt || "Chưa rõ thời gian tạo"}
                </p>
                <p style={styles.listText}>{item.message}</p>
                <p style={styles.metaText}>
                  Trạng thái: {item.active ? "Đang hiển thị" : "Đã tạm ẩn"}
                </p>
                <div style={ui.actionRow}>
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
                    style={ui.primaryButton}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteNotification(item.id)}
                    style={ui.dangerButton}
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
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: "20px",
  },
  sectionHead: {
    display: "grid",
    gap: "6px",
  },
  form: {
    display: "grid",
    gap: "12px",
  },
  cardStack: {
    display: "grid",
    gap: "12px",
  },
  listText: {
    margin: 0,
    color: "#475569",
    lineHeight: 1.6,
  },
  metaText: {
    margin: "2px 0 0",
    color: "#6f879f",
    fontSize: "14px",
  },
  reportWrap: {
    display: "grid",
    gap: "16px",
  },
  reportValue: {
    marginTop: "8px",
    color: "#16324f",
    fontWeight: 700,
    lineHeight: 1.5,
  },
  emptyTitle: {
    display: "block",
    marginBottom: "8px",
    color: "#16324f",
  },
};
