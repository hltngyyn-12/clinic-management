import { useEffect, useMemo, useState } from "react";
import api, { getErrorMessage } from "../services/api";
import usePageMeta from "../hooks/usePageMeta";
import {
  createAutoGrid,
  createHero,
  gradients,
  ui,
} from "../styles/designSystem";

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
  const [prescriptionForm, setPrescriptionForm] = useState(
    emptyPrescriptionForm,
  );
  const [testForm, setTestForm] = useState(emptyTestForm);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [submittingRecord, setSubmittingRecord] = useState(false);
  const [submittingPrescription, setSubmittingPrescription] = useState(false);
  const [submittingTest, setSubmittingTest] = useState(false);

  usePageMeta(
    "Workspace",
    "Quản lý lịch khám trong ngày, cập nhật hồ sơ bệnh án, kê đơn thuốc và chỉ định xét nghiệm trên giao diện làm việc dành cho bác sĩ.",
  );

  const activeRecord = useMemo(() => {
    if (!patientHistory || !activeRecordId) return null;
    return (
      patientHistory.records.find(
        (record) => String(record.id) === String(activeRecordId),
      ) || null
    );
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
      alert(
        getErrorMessage(
          error,
          "Không tải được không gian làm việc của bác sĩ.",
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  const loadPatientHistory = async (patientId, appointmentId) => {
    setHistoryLoading(true);
    try {
      const response = await api.get(
        `/api/doctor/patients/${patientId}/history`,
      );
      const history = response.data?.data;
      setPatientHistory(history);

      const matchedRecord =
        history?.records?.find(
          (item) => item.appointmentId === appointmentId,
        ) ||
        history?.records?.[0] ||
        null;

      setActiveRecordId(matchedRecord ? String(matchedRecord.id) : "");
    } catch (error) {
      setPatientHistory(null);
      setActiveRecordId("");
      alert(
        getErrorMessage(
          error,
          "Không tải được lịch sử điều trị của bệnh nhân.",
        ),
      );
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

      alert("Đã tạo hồ sơ bệnh án.");
      setRecordForm(emptyRecordForm);
      await loadPatientHistory(
        selectedAppointment.patientId,
        selectedAppointment.appointmentId,
      );
      if (response.data?.data?.id) {
        setActiveRecordId(String(response.data.data.id));
      }
    } catch (error) {
      alert(getErrorMessage(error, "Không thể tạo hồ sơ bệnh án."));
    } finally {
      setSubmittingRecord(false);
    }
  };

  const handleCreatePrescription = async (event) => {
    event.preventDefault();
    if (!activeRecordId) {
      alert("Vui lòng chọn hồ sơ bệnh án trước.");
      return;
    }

    setSubmittingPrescription(true);
    try {
      const selectedMedicine = medicines.find(
        (item) => String(item.id) === String(prescriptionForm.medicineId),
      );
      await api.post("/api/doctor/prescriptions", {
        medicalRecordId: Number(activeRecordId),
        medicineId: Number(prescriptionForm.medicineId),
        medicineName: selectedMedicine?.name || "",
        dosage: prescriptionForm.dosage,
        frequency: prescriptionForm.frequency,
        duration: prescriptionForm.duration,
        instructions: prescriptionForm.instructions,
      });

      alert("Đã lưu đơn thuốc.");
      setPrescriptionForm(emptyPrescriptionForm);
      if (selectedAppointment) {
        await loadPatientHistory(
          selectedAppointment.patientId,
          selectedAppointment.appointmentId,
        );
      }
    } catch (error) {
      alert(getErrorMessage(error, "Không thể lưu đơn thuốc."));
    } finally {
      setSubmittingPrescription(false);
    }
  };

  const handleCreateTestRequest = async (event) => {
    event.preventDefault();
    if (!activeRecordId) {
      alert("Vui lòng chọn hồ sơ bệnh án trước.");
      return;
    }

    setSubmittingTest(true);
    try {
      await api.post("/api/doctor/test-requests", {
        medicalRecordId: Number(activeRecordId),
        testName: testForm.testName,
      });

      alert("Đã tạo yêu cầu xét nghiệm.");
      setTestForm(emptyTestForm);
      if (selectedAppointment) {
        await loadPatientHistory(
          selectedAppointment.patientId,
          selectedAppointment.appointmentId,
        );
      }
    } catch (error) {
      alert(getErrorMessage(error, "Không thể tạo yêu cầu xét nghiệm."));
    } finally {
      setSubmittingTest(false);
    }
  };

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.doctor)}>
        <div style={ui.eyebrow}>Không gian làm việc của bác sĩ</div>
        <h1 style={ui.title}>
          Theo dõi lịch khám trong ngày và xử lý toàn bộ thông tin điều trị trên
          một màn hình
        </h1>
        <p style={ui.subtitle}>
          Tại đây, bác sĩ có thể tiếp nhận lịch hẹn, ghi nhận chẩn đoán, tạo hồ
          sơ bệnh án điện tử, kê đơn thuốc và chỉ định xét nghiệm cho từng bệnh
          nhân mà không cần chuyển qua nhiều khu vực làm việc khác nhau.
        </p>
      </section>

      <div style={styles.layout}>
        <section style={ui.panel}>
          <div style={ui.sectionHeader}>
            <div>
              <h2 style={ui.sectionTitle}>Lịch khám trong ngày</h2>
              <p style={ui.sectionHint}>
                Chọn từng lịch hẹn để bắt đầu thăm khám, xem lý do đến khám và
                mở hồ sơ điều trị tương ứng.
              </p>
            </div>
            <button
              type="button"
              onClick={loadWorkspace}
              style={ui.secondaryButton}
            >
              Tải lại dữ liệu
            </button>
          </div>

          {loading ? (
            <p style={ui.muted}>Đang tải lịch khám của bác sĩ...</p>
          ) : appointments.length === 0 ? (
            <div style={ui.stateCard}>
              <strong style={styles.emptyTitle}>
                Chưa có lịch khám trong ngày
              </strong>
              <p style={ui.muted}>
                Hệ thống chưa ghi nhận lịch hẹn nào cho hôm nay.
              </p>
            </div>
          ) : (
            <div style={styles.cardStack}>
              {appointments.map((appointment) => {
                const isActive =
                  selectedAppointment?.appointmentId ===
                  appointment.appointmentId;

                return (
                  <button
                    key={appointment.appointmentId}
                    type="button"
                    onClick={() => handleSelectAppointment(appointment)}
                    style={{
                      ...styles.appointmentCard,
                      borderColor: isActive
                        ? "#0f4c81"
                        : "rgba(147, 170, 193, 0.2)",
                      background: isActive ? "#eef6fd" : "#fff",
                    }}
                  >
                    <div style={styles.cardTop}>
                      <strong style={styles.patientName}>
                        {appointment.patientName}
                      </strong>
                      <span style={styles.timePill}>
                        {appointment.slotTime}
                      </span>
                    </div>
                    <div style={styles.metaLine}>
                      <span>
                        Trạng thái lịch hẹn: {appointment.status || "PENDING"}
                      </span>
                      <span>
                        Đặt cọc: {appointment.paymentStatus || "UNPAID"}
                      </span>
                    </div>
                    <p style={styles.reasonText}>
                      {appointment.reason ||
                        "Bệnh nhân chưa bổ sung lý do thăm khám."}
                    </p>
                    {appointment.reviewed ? (
                      <div style={styles.reviewBox}>
                        <strong>Đánh giá sau khám:</strong>{" "}
                        {appointment.reviewRating || 0}/5
                        {appointment.reviewComment
                          ? ` - ${appointment.reviewComment}`
                          : ""}
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section style={ui.panel}>
          <div style={ui.sectionHeader}>
            <div>
              <h2 style={ui.sectionTitle}>Chi tiết ca khám</h2>
              <p style={ui.sectionHint}>
                Từ lịch hẹn đã chọn, bác sĩ có thể tiếp tục toàn bộ các bước
                chuyên môn và tra cứu lịch sử điều trị liên quan.
              </p>
            </div>
          </div>

          {!selectedAppointment ? (
            <div style={ui.stateCard}>
              <strong style={styles.emptyTitle}>Chưa chọn lịch khám</strong>
              <p style={ui.muted}>
                Hãy chọn một lịch hẹn ở cột bên trái để bắt đầu làm việc.
              </p>
            </div>
          ) : (
            <>
              <div style={styles.selectedSummary}>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Bệnh nhân</div>
                  <div style={styles.summaryValue}>
                    {selectedAppointment.patientName}
                  </div>
                </div>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Khung giờ khám</div>
                  <div style={styles.summaryValue}>
                    {selectedAppointment.appointmentDate} lúc{" "}
                    {selectedAppointment.slotTime}
                  </div>
                </div>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Lý do thăm khám</div>
                  <div style={styles.summaryValue}>
                    {selectedAppointment.reason || "Chưa có mô tả từ bệnh nhân"}
                  </div>
                </div>
              </div>

              <div style={styles.recordSelectBox}>
                <label style={ui.label}>Hồ sơ bệnh án đang thao tác</label>
                <select
                  value={activeRecordId}
                  onChange={(event) => setActiveRecordId(event.target.value)}
                  style={ui.input}
                >
                  <option value="">Chọn hồ sơ bệnh án</option>
                  {(patientHistory?.records || []).map((record) => (
                    <option key={record.id} value={record.id}>
                      #{record.id} - {record.diagnosis || "Chưa có chẩn đoán"} -{" "}
                      {record.createdAt || "Chưa rõ ngày tạo"}
                    </option>
                  ))}
                </select>
                <p style={styles.microHint}>
                  Nếu chưa có hồ sơ phù hợp với lịch hẹn hiện tại, bạn có thể
                  tạo mới ngay bên dưới.
                </p>
              </div>

              <div style={createAutoGrid(260)}>
                <form onSubmit={handleCreateRecord} style={styles.formCard}>
                  <h3 style={styles.formTitle}>Khám bệnh và ghi chẩn đoán</h3>
                  <p style={styles.formHint}>
                    Lưu chẩn đoán, triệu chứng, ghi chú lâm sàng và lịch tái
                    khám để làm cơ sở cho các lần theo dõi tiếp theo.
                  </p>
                  <textarea
                    name="diagnosis"
                    value={recordForm.diagnosis}
                    onChange={handleRecordChange}
                    placeholder="Nhập chẩn đoán chính sau khi thăm khám"
                    style={ui.textarea}
                    required
                  />
                  <textarea
                    name="symptoms"
                    value={recordForm.symptoms}
                    onChange={handleRecordChange}
                    placeholder="Mô tả triệu chứng, diễn tiến hoặc dấu hiệu lâm sàng"
                    style={ui.textarea}
                  />
                  <textarea
                    name="notes"
                    value={recordForm.notes}
                    onChange={handleRecordChange}
                    placeholder="Ghi chú điều trị, chỉ định theo dõi hoặc lưu ý chuyên môn"
                    style={ui.textarea}
                  />
                  <input
                    type="date"
                    name="followUpDate"
                    value={recordForm.followUpDate}
                    onChange={handleRecordChange}
                    style={ui.input}
                  />
                  <button
                    type="submit"
                    style={ui.primaryButton}
                    disabled={submittingRecord}
                  >
                    {submittingRecord
                      ? "Đang lưu hồ sơ..."
                      : "Tạo hồ sơ bệnh án"}
                  </button>
                </form>

                <form
                  onSubmit={handleCreatePrescription}
                  style={styles.formCard}
                >
                  <h3 style={styles.formTitle}>Kê đơn thuốc điện tử</h3>
                  <p style={styles.formHint}>
                    Chọn thuốc từ danh mục và ghi rõ liều dùng, tần suất, thời
                    gian sử dụng cùng hướng dẫn đi kèm.
                  </p>
                  <select
                    name="medicineId"
                    value={prescriptionForm.medicineId}
                    onChange={handlePrescriptionChange}
                    style={ui.input}
                    required
                  >
                    <option value="">Chọn thuốc từ danh mục</option>
                    {medicines.map((medicine) => (
                      <option key={medicine.id} value={medicine.id}>
                        {medicine.name} ({medicine.unit}) - tồn kho{" "}
                        {medicine.stockQuantity}
                      </option>
                    ))}
                  </select>
                  <input
                    name="dosage"
                    value={prescriptionForm.dosage}
                    onChange={handlePrescriptionChange}
                    placeholder="Liều dùng, ví dụ: 1 viên/lần"
                    style={ui.input}
                    required
                  />
                  <input
                    name="frequency"
                    value={prescriptionForm.frequency}
                    onChange={handlePrescriptionChange}
                    placeholder="Tần suất sử dụng, ví dụ: 2 lần/ngày"
                    style={ui.input}
                  />
                  <input
                    name="duration"
                    value={prescriptionForm.duration}
                    onChange={handlePrescriptionChange}
                    placeholder="Thời gian sử dụng, ví dụ: 5 ngày"
                    style={ui.input}
                  />
                  <textarea
                    name="instructions"
                    value={prescriptionForm.instructions}
                    onChange={handlePrescriptionChange}
                    placeholder="Hướng dẫn chi tiết khi dùng thuốc hoặc lưu ý đặc biệt"
                    style={ui.textarea}
                  />
                  <button
                    type="submit"
                    style={ui.primaryButton}
                    disabled={submittingPrescription}
                  >
                    {submittingPrescription
                      ? "Đang lưu đơn thuốc..."
                      : "Thêm đơn thuốc"}
                  </button>
                </form>

                <form
                  onSubmit={handleCreateTestRequest}
                  style={styles.formCard}
                >
                  <h3 style={styles.formTitle}>Yêu cầu xét nghiệm</h3>
                  <p style={styles.formHint}>
                    Tạo chỉ định xét nghiệm hoặc cận lâm sàng để hỗ trợ chẩn
                    đoán và theo dõi sau điều trị.
                  </p>
                  <input
                    name="testName"
                    value={testForm.testName}
                    onChange={handleTestChange}
                    placeholder="Ví dụ: Công thức máu, X-quang ngực, ECG..."
                    style={ui.input}
                    required
                  />
                  <button
                    type="submit"
                    style={ui.primaryButton}
                    disabled={submittingTest}
                  >
                    {submittingTest
                      ? "Đang tạo yêu cầu..."
                      : "Tạo yêu cầu xét nghiệm"}
                  </button>
                </form>
              </div>

              <div style={styles.historyPanel}>
                <div style={ui.sectionHeader}>
                  <div>
                    <h3 style={ui.sectionTitle}>
                      Lịch sử điều trị của bệnh nhân
                    </h3>
                    <p style={ui.sectionHint}>
                      Xem lại hồ sơ cũ, đơn thuốc và kết quả xét nghiệm để có
                      đầy đủ bối cảnh trước khi đưa ra quyết định điều trị tiếp
                      theo.
                    </p>
                  </div>
                </div>

                {historyLoading ? (
                  <p style={ui.muted}>Đang tải dữ liệu lịch sử điều trị...</p>
                ) : !patientHistory ? (
                  <div style={ui.stateCard}>
                    <strong style={styles.emptyTitle}>
                      Chưa có dữ liệu lịch sử
                    </strong>
                    <p style={ui.muted}>
                      Hệ thống chưa tìm thấy thông tin điều trị trước đây cho
                      bệnh nhân này.
                    </p>
                  </div>
                ) : (
                  <>
                    <div style={createAutoGrid(180)}>
                      <div style={ui.panelSoft}>
                        <div style={ui.label}>Họ và tên</div>
                        <div style={styles.summaryValue}>
                          {patientHistory.patientName}
                        </div>
                      </div>
                      <div style={ui.panelSoft}>
                        <div style={ui.label}>Giới tính</div>
                        <div style={styles.summaryValue}>
                          {patientHistory.gender || "Chưa cập nhật"}
                        </div>
                      </div>
                      <div style={ui.panelSoft}>
                        <div style={ui.label}>Ngày sinh</div>
                        <div style={styles.summaryValue}>
                          {patientHistory.dateOfBirth || "Chưa cập nhật"}
                        </div>
                      </div>
                      <div style={ui.panelSoft}>
                        <div style={ui.label}>Số bảo hiểm</div>
                        <div style={styles.summaryValue}>
                          {patientHistory.insuranceNumber || "Chưa cập nhật"}
                        </div>
                      </div>
                    </div>

                    <div style={createAutoGrid(220)}>
                      <div style={styles.historyCard}>
                        <h4 style={styles.historyTitle}>Hồ sơ bệnh án</h4>
                        {(patientHistory.records || []).length === 0 ? (
                          <p style={ui.muted}>
                            Bệnh nhân chưa có hồ sơ bệnh án nào trên hệ thống.
                          </p>
                        ) : (
                          patientHistory.records.map((record) => (
                            <div key={record.id} style={styles.historyItem}>
                              <strong>
                                #{record.id} -{" "}
                                {record.diagnosis || "Chưa có chẩn đoán"}
                              </strong>
                              <p>
                                Triệu chứng:{" "}
                                {record.symptoms || "Chưa cập nhật"}
                              </p>
                              <p>Ghi chú: {record.notes || "Chưa cập nhật"}</p>
                              <p>
                                Tái khám:{" "}
                                {record.followUpDate || "Chưa hẹn lịch"}
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                      <div style={styles.historyCard}>
                        <h4 style={styles.historyTitle}>Đơn thuốc đã kê</h4>
                        {(patientHistory.prescriptions || []).length === 0 ? (
                          <p style={ui.muted}>
                            Chưa có đơn thuốc nào được ghi nhận.
                          </p>
                        ) : (
                          patientHistory.prescriptions.map((item) => (
                            <div key={item.id} style={styles.historyItem}>
                              <strong>{item.medicineName}</strong>
                              <p>Liều dùng: {item.dosage || "Chưa cập nhật"}</p>
                              <p>
                                Tần suất: {item.frequency || "Chưa cập nhật"}
                              </p>
                              <p>
                                Thời gian dùng:{" "}
                                {item.duration || "Chưa cập nhật"}
                              </p>
                              <p>
                                Hướng dẫn:{" "}
                                {item.instructions || "Chưa cập nhật"}
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                      <div style={styles.historyCard}>
                        <h4 style={styles.historyTitle}>
                          Xét nghiệm và cận lâm sàng
                        </h4>
                        {(patientHistory.tests || []).length === 0 ? (
                          <p style={ui.muted}>
                            Chưa có yêu cầu xét nghiệm nào được lưu trên hệ
                            thống.
                          </p>
                        ) : (
                          patientHistory.tests.map((item) => (
                            <div
                              key={item.testRequestId}
                              style={styles.historyItem}
                            >
                              <strong>{item.testName}</strong>
                              <p>
                                Trạng thái: {item.status || "Chưa cập nhật"}
                              </p>
                              <p>
                                Kết quả: {item.result || "Đang chờ kết quả"}
                              </p>
                              <p>
                                Kết luận:{" "}
                                {item.conclusion || "Đang chờ kết luận"}
                              </p>
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
                  Hồ sơ đang thao tác: #{activeRecord.id} -{" "}
                  {activeRecord.diagnosis || "Chưa có chẩn đoán"}
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
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(320px, 0.92fr) minmax(420px, 1.4fr)",
    gap: "20px",
    alignItems: "start",
  },
  cardStack: {
    display: "grid",
    gap: "14px",
  },
  appointmentCard: {
    border: "2px solid rgba(147, 170, 193, 0.2)",
    borderRadius: "18px",
    padding: "18px",
    textAlign: "left",
    cursor: "pointer",
  },
  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  patientName: {
    fontSize: "18px",
    color: "#16324f",
  },
  timePill: {
    borderRadius: "999px",
    padding: "8px 12px",
    background: "#0f4c81",
    color: "#fff",
    fontWeight: 800,
  },
  metaLine: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    color: "#5f758d",
    fontSize: "14px",
    marginTop: "10px",
  },
  reasonText: {
    margin: "12px 0 0",
    color: "#16324f",
    lineHeight: 1.6,
  },
  reviewBox: {
    marginTop: "12px",
    background: "#f7fbff",
    borderRadius: "14px",
    padding: "12px",
    color: "#35516f",
    lineHeight: 1.6,
  },
  emptyTitle: {
    display: "block",
    marginBottom: "8px",
    color: "#16324f",
  },
  selectedSummary: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
  },
  summaryValue: {
    marginTop: "8px",
    color: "#16324f",
    fontWeight: 700,
    lineHeight: 1.5,
  },
  recordSelectBox: {
    display: "grid",
    gap: "8px",
  },
  microHint: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
    lineHeight: 1.5,
  },
  formCard: {
    borderRadius: "20px",
    border: "1px solid rgba(147, 170, 193, 0.16)",
    padding: "18px",
    display: "grid",
    gap: "12px",
    alignContent: "start",
    background: "#fcfffe",
  },
  formTitle: {
    margin: 0,
    color: "#16324f",
  },
  formHint: {
    margin: 0,
    color: "#5f758d",
    lineHeight: 1.6,
  },
  historyPanel: {
    display: "grid",
    gap: "16px",
  },
  historyCard: {
    borderRadius: "18px",
    border: "1px solid rgba(147, 170, 193, 0.16)",
    padding: "16px",
    display: "grid",
    gap: "12px",
  },
  historyTitle: {
    margin: 0,
    color: "#16324f",
  },
  historyItem: {
    borderRadius: "14px",
    background: "#f7fbff",
    padding: "12px",
    color: "#35516f",
    lineHeight: 1.6,
  },
  activeRecordBadge: {
    borderRadius: "14px",
    background: "#dcfce7",
    color: "#166534",
    padding: "12px 14px",
    fontWeight: 700,
  },
};
