import { useEffect, useMemo, useState } from "react";
import api, { getErrorMessage } from "../services/api";
import usePageMeta from "../hooks/usePageMeta";

const emptyRecordForm = {
  diagnosis: "",
  symptoms: "",
  notes: "",
  followUpDate: "",
};

const emptyPrescriptionForm = {
  medicineId: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
};

const emptyTestForm = {
  testName: "",
};

function DoctorWorkspacePage() {
  const [appointments, setAppointments] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patientHistory, setPatientHistory] = useState(null);
  const [activeRecordId, setActiveRecordId] = useState("");
  const [recordForm, setRecordForm] = useState(emptyRecordForm);
  const [prescriptionForm, setPrescriptionForm] = useState(emptyPrescriptionForm);
  const [testForm, setTestForm] = useState(emptyTestForm);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [submittingRecord, setSubmittingRecord] = useState(false);
  const [submittingPrescription, setSubmittingPrescription] = useState(false);
  const [submittingTest, setSubmittingTest] = useState(false);

  usePageMeta(
    "Không gian làm việc bác sĩ",
    "Quản lý lịch khám trong ngày, hồ sơ bệnh án, đơn thuốc và yêu cầu xét nghiệm trên giao diện dành cho bác sĩ.",
  );

  const activeRecord = useMemo(() => {
    if (!patientHistory || !activeRecordId) return null;
    return patientHistory.records.find((record) => String(record.id) === String(activeRecordId)) || null;
  }, [patientHistory, activeRecordId]);

  useEffect(() => {
    loadWorkspace();
  }, []);

  const loadWorkspace = async () => {
    setLoading(true);
    try {
      const [appointmentsRes, medicinesRes] = await Promise.all([
        api.get("/api/doctor/appointments/today"),
        api.get("/api/doctor/medicines"),
      ]);

      setAppointments(appointmentsRes.data?.data || []);
      setMedicines(medicinesRes.data?.data || []);
    } catch (error) {
      alert(getErrorMessage(error, "Không tải được màn hình làm việc của bác sĩ."));
    } finally {
      setLoading(false);
    }
  };

  const loadPatientHistory = async (patientId, appointmentId) => {
    setHistoryLoading(true);
    try {
      const response = await api.get(`/api/doctor/patients/${patientId}/history`);
      const history = response.data?.data;
      setPatientHistory(history);

      const matchedRecord =
        history?.records?.find((item) => item.appointmentId === appointmentId) ||
        history?.records?.[0] ||
        null;

      setActiveRecordId(matchedRecord ? String(matchedRecord.id) : "");
    } catch (error) {
      setPatientHistory(null);
      setActiveRecordId("");
      alert(getErrorMessage(error, "Không tải được lịch sử bệnh nhân."));
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSelectAppointment = async (appointment) => {
    setSelectedAppointment(appointment);
    setRecordForm(emptyRecordForm);
    setPrescriptionForm(emptyPrescriptionForm);
    setTestForm(emptyTestForm);
    await loadPatientHistory(appointment.patientId, appointment.appointmentId);
  };

  const handleRecordChange = (event) => {
    const { name, value } = event.target;
    setRecordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrescriptionChange = (event) => {
    const { name, value } = event.target;
    setPrescriptionForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTestChange = (event) => {
    const { name, value } = event.target;
    setTestForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateRecord = async (event) => {
    event.preventDefault();
    if (!selectedAppointment) {
      alert("Vui lòng chọn một lịch khám trước.");
      return;
    }

    setSubmittingRecord(true);
    try {
      const response = await api.post("/api/doctor/medical-records", {
        appointmentId: selectedAppointment.appointmentId,
        diagnosis: recordForm.diagnosis,
        symptoms: recordForm.symptoms,
        notes: recordForm.notes,
        followUpDate: recordForm.followUpDate || null,
      });

      alert("Tạo hồ sơ khám bệnh thành công.");
      setRecordForm(emptyRecordForm);
      await loadPatientHistory(selectedAppointment.patientId, selectedAppointment.appointmentId);
      if (response.data?.data?.id) {
        setActiveRecordId(String(response.data.data.id));
      }
    } catch (error) {
      alert(getErrorMessage(error, "Tạo hồ sơ khám bệnh thất bại."));
    } finally {
      setSubmittingRecord(false);
    }
  };

  const handleCreatePrescription = async (event) => {
    event.preventDefault();
    if (!activeRecordId) {
      alert("Vui lòng chọn hồ sơ khám trước.");
      return;
    }

    setSubmittingPrescription(true);
    try {
      await api.post("/api/doctor/prescriptions", {
        medicalRecordId: Number(activeRecordId),
        medicineId: Number(prescriptionForm.medicineId),
        dosage: prescriptionForm.dosage,
        frequency: prescriptionForm.frequency,
        duration: prescriptionForm.duration,
        instructions: prescriptionForm.instructions,
      });

      alert("Kê đơn thuốc thành công.");
      setPrescriptionForm(emptyPrescriptionForm);
      if (selectedAppointment) {
        await loadPatientHistory(selectedAppointment.patientId, selectedAppointment.appointmentId);
      }
    } catch (error) {
      alert(getErrorMessage(error, "Kê đơn thuốc thất bại."));
    } finally {
      setSubmittingPrescription(false);
    }
  };

  const handleCreateTestRequest = async (event) => {
    event.preventDefault();
    if (!activeRecordId) {
      alert("Vui lòng chọn hồ sơ khám trước.");
      return;
    }

    setSubmittingTest(true);
    try {
      await api.post("/api/doctor/test-requests", {
        medicalRecordId: Number(activeRecordId),
        testName: testForm.testName,
      });

      alert("Tạo yêu cầu xét nghiệm thành công.");
      setTestForm(emptyTestForm);
      if (selectedAppointment) {
        await loadPatientHistory(selectedAppointment.patientId, selectedAppointment.appointmentId);
      }
    } catch (error) {
      alert(getErrorMessage(error, "Tạo yêu cầu xét nghiệm thất bại."));
    } finally {
      setSubmittingTest(false);
    }
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>Không gian làm việc của bác sĩ</div>
          <h1 style={styles.title}>Xử lý lịch khám trong ngày trên một giao diện tập trung</h1>
          <p style={styles.subtitle}>
            Xem lịch hôm nay, chọn bệnh nhân, lập hồ sơ khám bệnh, kê đơn thuốc, yêu cầu xét nghiệm và xem lại toàn bộ lịch sử điều trị.
          </p>
        </div>
      </section>

      <div style={styles.layout}>
        <section style={styles.panel}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Lịch khám hôm nay</h2>
              <p style={styles.sectionHint}>Chọn một lịch khám để bắt đầu quy trình xử lý.</p>
            </div>
            <button type="button" onClick={loadWorkspace} style={styles.secondaryButton}>
              Tải lại
            </button>
          </div>

          {loading ? (
            <p style={styles.muted}>Đang tải lịch khám...</p>
          ) : appointments.length === 0 ? (
            <p style={styles.muted}>Hôm nay chưa có lịch khám nào.</p>
          ) : (
            <div style={styles.cardStack}>
              {appointments.map((appointment) => {
                const isActive = selectedAppointment?.appointmentId === appointment.appointmentId;

                return (
                  <button
                    key={appointment.appointmentId}
                    type="button"
                    onClick={() => handleSelectAppointment(appointment)}
                    style={{
                      ...styles.appointmentCard,
                      borderColor: isActive ? "#0f766e" : "#dbeafe",
                      background: isActive ? "#ecfeff" : "#fff",
                    }}
                  >
                    <div style={styles.cardTop}>
                      <strong style={styles.patientName}>{appointment.patientName}</strong>
                      <span style={styles.timePill}>{appointment.slotTime}</span>
                    </div>
                    <div style={styles.metaLine}>
                      <span>Trạng thái: {appointment.status || "PENDING"}</span>
                      <span>Đặt cọc: {appointment.paymentStatus || "UNPAID"}</span>
                    </div>
                    <p style={styles.reasonText}>{appointment.reason || "Bệnh nhân chưa ghi lý do."}</p>
                    {appointment.reviewed ? (
                      <div style={styles.reviewBox}>
                        <strong>Đánh giá của bệnh nhân:</strong> {appointment.reviewRating || 0}/5
                        {appointment.reviewComment ? ` - ${appointment.reviewComment}` : ""}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section style={styles.panel}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Chi tiết ca khám đã chọn</h2>
              <p style={styles.sectionHint}>Tạo hồ sơ, kê đơn và yêu cầu xét nghiệm cho bệnh nhân này.</p>
            </div>
          </div>

          {!selectedAppointment ? (
            <p style={styles.muted}>Hãy chọn một lịch khám ở cột bên trái để bắt đầu.</p>
          ) : (
            <>
              <div style={styles.selectedSummary}>
                <div>
                  <div style={styles.summaryLabel}>Bệnh nhân</div>
                  <div style={styles.summaryValue}>{selectedAppointment.patientName}</div>
                </div>
                <div>
                  <div style={styles.summaryLabel}>Lịch hẹn</div>
                  <div style={styles.summaryValue}>
                    {selectedAppointment.appointmentDate} lúc {selectedAppointment.slotTime}
                  </div>
                </div>
                <div>
                  <div style={styles.summaryLabel}>Lý do khám</div>
                  <div style={styles.summaryValue}>{selectedAppointment.reason || "Chưa có mô tả"}</div>
                </div>
              </div>

              <div style={styles.recordSelectBox}>
                <label style={styles.label}>Hồ sơ khám đang thao tác</label>
                <select
                  value={activeRecordId}
                  onChange={(event) => setActiveRecordId(event.target.value)}
                  style={styles.input}
                >
                  <option value="">Chọn hồ sơ khám</option>
                  {(patientHistory?.records || []).map((record) => (
                    <option key={record.id} value={record.id}>
                      #{record.id} - {record.diagnosis || "Chưa có chẩn đoán"} - {record.createdAt || "Chưa rõ ngày"}
                    </option>
                  ))}
                </select>
                <p style={styles.microHint}>
                  Nếu lịch khám hiện tại chưa có hồ sơ, hãy tạo hồ sơ mới ở biểu mẫu đầu tiên.
                </p>
              </div>

              <div style={styles.formsGrid}>
                <form onSubmit={handleCreateRecord} style={styles.formCard}>
                  <h3 style={styles.formTitle}>Khám bệnh và ghi chẩn đoán</h3>
                  <p style={styles.formHint}>Lập hồ sơ khám bệnh cho lịch hẹn đang chọn.</p>
                  <textarea
                    name="diagnosis"
                    value={recordForm.diagnosis}
                    onChange={handleRecordChange}
                    placeholder="Chẩn đoán"
                    style={styles.textarea}
                    required
                  />
                  <textarea
                    name="symptoms"
                    value={recordForm.symptoms}
                    onChange={handleRecordChange}
                    placeholder="Triệu chứng"
                    style={styles.textarea}
                  />
                  <textarea
                    name="notes"
                    value={recordForm.notes}
                    onChange={handleRecordChange}
                    placeholder="Ghi chú lâm sàng"
                    style={styles.textarea}
                  />
                  <input
                    type="date"
                    name="followUpDate"
                    value={recordForm.followUpDate}
                    onChange={handleRecordChange}
                    style={styles.input}
                  />
                  <button type="submit" style={styles.primaryButton} disabled={submittingRecord}>
                    {submittingRecord ? "Đang lưu..." : "Tạo hồ sơ khám"}
                  </button>
                </form>

                <form onSubmit={handleCreatePrescription} style={styles.formCard}>
                  <h3 style={styles.formTitle}>Kê đơn thuốc</h3>
                  <p style={styles.formHint}>Chọn thuốc, liều dùng và hướng dẫn sử dụng cho bệnh nhân.</p>
                  <select
                    name="medicineId"
                    value={prescriptionForm.medicineId}
                    onChange={handlePrescriptionChange}
                    style={styles.input}
                    required
                  >
                    <option value="">Chọn thuốc</option>
                    {medicines.map((medicine) => (
                      <option key={medicine.id} value={medicine.id}>
                        {medicine.name} ({medicine.unit}) - tồn kho {medicine.stockQuantity}
                      </option>
                    ))}
                  </select>
                  <input name="dosage" value={prescriptionForm.dosage} onChange={handlePrescriptionChange} placeholder="Liều dùng" style={styles.input} required />
                  <input name="frequency" value={prescriptionForm.frequency} onChange={handlePrescriptionChange} placeholder="Tần suất uống / sử dụng" style={styles.input} />
                  <input name="duration" value={prescriptionForm.duration} onChange={handlePrescriptionChange} placeholder="Thời gian sử dụng" style={styles.input} />
                  <textarea
                    name="instructions"
                    value={prescriptionForm.instructions}
                    onChange={handlePrescriptionChange}
                    placeholder="Hướng dẫn sử dụng"
                    style={styles.textarea}
                  />
                  <button type="submit" style={styles.primaryButton} disabled={submittingPrescription}>
                    {submittingPrescription ? "Đang lưu..." : "Thêm đơn thuốc"}
                  </button>
                </form>

                <form onSubmit={handleCreateTestRequest} style={styles.formCard}>
                  <h3 style={styles.formTitle}>Yêu cầu xét nghiệm</h3>
                  <p style={styles.formHint}>Tạo yêu cầu xét nghiệm cận lâm sàng hoặc chẩn đoán hình ảnh.</p>
                  <input name="testName" value={testForm.testName} onChange={handleTestChange} placeholder="Tên xét nghiệm" style={styles.input} required />
                  <button type="submit" style={styles.primaryButton} disabled={submittingTest}>
                    {submittingTest ? "Đang lưu..." : "Tạo yêu cầu xét nghiệm"}
                  </button>
                </form>
              </div>

              <div style={styles.historyPanel}>
                <div style={styles.sectionHeader}>
                  <div>
                    <h3 style={styles.sectionTitle}>Lịch sử bệnh nhân</h3>
                    <p style={styles.sectionHint}>Tra cứu thông tin điều trị và xét nghiệm trước đây.</p>
                  </div>
                </div>

                {historyLoading ? (
                  <p style={styles.muted}>Đang tải lịch sử bệnh nhân...</p>
                ) : !patientHistory ? (
                  <p style={styles.muted}>Chưa có dữ liệu lịch sử cho bệnh nhân này.</p>
                ) : (
                  <>
                    <div style={styles.patientProfileBox}>
                      <div style={styles.patientProfileItem}>
                        <span style={styles.summaryLabel}>Họ tên</span>
                        <strong>{patientHistory.patientName}</strong>
                      </div>
                      <div style={styles.patientProfileItem}>
                        <span style={styles.summaryLabel}>Giới tính</span>
                        <strong>{patientHistory.gender || "Chưa cập nhật"}</strong>
                      </div>
                      <div style={styles.patientProfileItem}>
                        <span style={styles.summaryLabel}>Ngày sinh</span>
                        <strong>{patientHistory.dateOfBirth || "Chưa cập nhật"}</strong>
                      </div>
                      <div style={styles.patientProfileItem}>
                        <span style={styles.summaryLabel}>Bảo hiểm</span>
                        <strong>{patientHistory.insuranceNumber || "Chưa cập nhật"}</strong>
                      </div>
                    </div>

                    <div style={styles.historyGrid}>
                      <div style={styles.historyCard}>
                        <h4 style={styles.historyTitle}>Hồ sơ khám</h4>
                        {(patientHistory.records || []).length === 0 ? (
                          <p style={styles.muted}>Chưa có hồ sơ khám nào.</p>
                        ) : (
                          patientHistory.records.map((record) => (
                            <div key={record.id} style={styles.historyItem}>
                              <strong>#{record.id} - {record.diagnosis || "Chưa có chẩn đoán"}</strong>
                              <p>Triệu chứng: {record.symptoms || "Chưa cập nhật"}</p>
                              <p>Ghi chú: {record.notes || "Chưa cập nhật"}</p>
                              <p>Tái khám: {record.followUpDate || "Chưa hẹn"}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <div style={styles.historyCard}>
                        <h4 style={styles.historyTitle}>Đơn thuốc</h4>
                        {(patientHistory.prescriptions || []).length === 0 ? (
                          <p style={styles.muted}>Chưa có đơn thuốc nào.</p>
                        ) : (
                          patientHistory.prescriptions.map((item) => (
                            <div key={item.id} style={styles.historyItem}>
                              <strong>{item.medicineName}</strong>
                              <p>Liều dùng: {item.dosage || "Chưa cập nhật"}</p>
                              <p>Tần suất: {item.frequency || "Chưa cập nhật"}</p>
                              <p>Thời gian dùng: {item.duration || "Chưa cập nhật"}</p>
                              <p>Hướng dẫn: {item.instructions || "Chưa cập nhật"}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <div style={styles.historyCard}>
                        <h4 style={styles.historyTitle}>Xét nghiệm</h4>
                        {(patientHistory.tests || []).length === 0 ? (
                          <p style={styles.muted}>Chưa có yêu cầu xét nghiệm nào.</p>
                        ) : (
                          patientHistory.tests.map((item) => (
                            <div key={item.testRequestId} style={styles.historyItem}>
                              <strong>{item.testName}</strong>
                              <p>Trạng thái: {item.status || "Chưa cập nhật"}</p>
                              <p>Kết quả: {item.result || "Đang chờ"}</p>
                              <p>Kết luận: {item.conclusion || "Đang chờ"}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {activeRecord ? (
                <div style={styles.activeRecordBadge}>
                  Hồ sơ đang thao tác: #{activeRecord.id} - {activeRecord.diagnosis || "Chưa có chẩn đoán"}
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default DoctorWorkspacePage;

const styles = {
  page: { display: "grid", gap: "24px" },
  hero: {
    background:
      "linear-gradient(135deg, rgba(15, 23, 42, 0.98), rgba(15, 118, 110, 0.92) 58%, rgba(37, 99, 235, 0.88))",
    color: "#fff",
    borderRadius: "32px",
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
    textTransform: "uppercase",
  },
  title: { margin: "16px 0 0", fontSize: "36px", lineHeight: 1.14, letterSpacing: "-0.03em" },
  subtitle: { margin: "14px 0 0", maxWidth: "760px", color: "#d1fae5", lineHeight: 1.7 },
  layout: { display: "grid", gridTemplateColumns: "minmax(320px, 0.92fr) minmax(420px, 1.4fr)", gap: "20px", alignItems: "start" },
  panel: { background: "rgba(255,255,255,0.92)", borderRadius: "24px", padding: "22px", boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)", display: "grid", gap: "18px", border: "1px solid rgba(148, 163, 184, 0.16)" },
  sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" },
  sectionTitle: { margin: 0, color: "#0f172a" },
  sectionHint: { margin: "6px 0 0", color: "#64748b", lineHeight: 1.5 },
  secondaryButton: { border: "1px solid #cbd5e1", background: "#fff", color: "#0f172a", borderRadius: "14px", padding: "10px 14px", fontWeight: 700, cursor: "pointer" },
  cardStack: { display: "grid", gap: "14px" },
  appointmentCard: { border: "2px solid #dbeafe", borderRadius: "18px", padding: "18px", textAlign: "left", cursor: "pointer" },
  cardTop: { display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "center", flexWrap: "wrap" },
  patientName: { fontSize: "18px", color: "#0f172a" },
  timePill: { borderRadius: "999px", padding: "8px 12px", background: "#0f766e", color: "#fff", fontWeight: 800 },
  metaLine: { display: "flex", gap: "12px", flexWrap: "wrap", color: "#475569", fontSize: "14px", marginTop: "10px" },
  reasonText: { margin: "12px 0 0", color: "#0f172a", lineHeight: 1.5 },
  reviewBox: { marginTop: "12px", background: "#f8fafc", borderRadius: "14px", padding: "12px", color: "#334155", lineHeight: 1.5 },
  muted: { margin: 0, color: "#64748b", lineHeight: 1.6 },
  selectedSummary: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", padding: "16px", borderRadius: "18px", background: "#f8fafc" },
  summaryLabel: { display: "block", color: "#64748b", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.06em" },
  summaryValue: { marginTop: "6px", color: "#0f172a", fontWeight: 700, lineHeight: 1.5 },
  recordSelectBox: { display: "grid", gap: "8px" },
  label: { fontWeight: 700, color: "#0f172a" },
  microHint: { margin: 0, color: "#64748b", fontSize: "13px" },
  formsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" },
  formCard: { borderRadius: "20px", border: "1px solid #dbeafe", padding: "18px", display: "grid", gap: "12px", alignContent: "start", background: "#fcfffe" },
  formTitle: { margin: 0, color: "#0f172a" },
  formHint: { margin: 0, color: "#64748b", lineHeight: 1.5 },
  input: { width: "100%", border: "1px solid #cbd5e1", borderRadius: "14px", padding: "12px 14px", fontSize: "14px", background: "#fff" },
  textarea: { width: "100%", minHeight: "94px", border: "1px solid #cbd5e1", borderRadius: "14px", padding: "12px 14px", fontSize: "14px", resize: "vertical", background: "#fff" },
  primaryButton: { border: "none", borderRadius: "14px", background: "linear-gradient(135deg, #0f766e, #2563eb)", color: "#fff", padding: "12px 16px", fontWeight: 800, cursor: "pointer" },
  historyPanel: { display: "grid", gap: "16px" },
  patientProfileBox: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" },
  patientProfileItem: { background: "#f8fafc", borderRadius: "16px", padding: "14px", display: "grid", gap: "6px" },
  historyGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" },
  historyCard: { borderRadius: "18px", border: "1px solid #dbeafe", padding: "16px", display: "grid", gap: "12px" },
  historyTitle: { margin: 0, color: "#0f172a" },
  historyItem: { borderRadius: "14px", background: "#f8fafc", padding: "12px", color: "#334155", lineHeight: 1.5 },
  activeRecordBadge: { borderRadius: "14px", background: "#dcfce7", color: "#166534", padding: "12px 14px", fontWeight: 700 },
};
