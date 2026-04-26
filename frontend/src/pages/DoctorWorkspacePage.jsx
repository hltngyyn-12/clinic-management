import { useEffect, useMemo, useState } from "react";
import api, { getErrorMessage } from "../services/api";

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
      alert(getErrorMessage(error, "Failed to load doctor workspace"));
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
      alert(getErrorMessage(error, "Failed to load patient history"));
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
      alert("Select an appointment first");
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

      alert("Medical record created successfully");
      setRecordForm(emptyRecordForm);
      await loadPatientHistory(selectedAppointment.patientId, selectedAppointment.appointmentId);
      if (response.data?.data?.id) {
        setActiveRecordId(String(response.data.data.id));
      }
    } catch (error) {
      alert(getErrorMessage(error, "Failed to create medical record"));
    } finally {
      setSubmittingRecord(false);
    }
  };

  const handleCreatePrescription = async (event) => {
    event.preventDefault();
    if (!activeRecordId) {
      alert("Select a medical record first");
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

      alert("Prescription created successfully");
      setPrescriptionForm(emptyPrescriptionForm);
      if (selectedAppointment) {
        await loadPatientHistory(selectedAppointment.patientId, selectedAppointment.appointmentId);
      }
    } catch (error) {
      alert(getErrorMessage(error, "Failed to create prescription"));
    } finally {
      setSubmittingPrescription(false);
    }
  };

  const handleCreateTestRequest = async (event) => {
    event.preventDefault();
    if (!activeRecordId) {
      alert("Select a medical record first");
      return;
    }

    setSubmittingTest(true);
    try {
      await api.post("/api/doctor/test-requests", {
        medicalRecordId: Number(activeRecordId),
        testName: testForm.testName,
      });

      alert("Test request created successfully");
      setTestForm(emptyTestForm);
      if (selectedAppointment) {
        await loadPatientHistory(selectedAppointment.patientId, selectedAppointment.appointmentId);
      }
    } catch (error) {
      alert(getErrorMessage(error, "Failed to create test request"));
    } finally {
      setSubmittingTest(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>DOCTOR WORKSPACE</div>
          <h1 style={styles.title}>Today&apos;s Schedule And Care Flow</h1>
          <p style={styles.subtitle}>
            View today&apos;s appointments, examine patients, create medical records, prescribe
            medication, request tests, and review patient history from one screen.
          </p>
        </div>
      </div>

      <div style={styles.layout}>
        <section style={styles.panel}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>Today&apos;s Appointments</h2>
              <p style={styles.sectionHint}>Doctor feature 1: view today&apos;s schedule.</p>
            </div>
            <button type="button" onClick={loadWorkspace} style={styles.secondaryButton}>
              Reload
            </button>
          </div>

          {loading ? (
            <p style={styles.muted}>Loading appointments...</p>
          ) : appointments.length === 0 ? (
            <p style={styles.muted}>No appointments scheduled for today.</p>
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
                      <span>Status: {appointment.status || "PENDING"}</span>
                      <span>Deposit: {appointment.paymentStatus || "UNPAID"}</span>
                    </div>
                    <p style={styles.reasonText}>{appointment.reason || "No reason provided"}</p>
                    {appointment.reviewed ? (
                      <div style={styles.reviewBox}>
                        <strong>Patient review:</strong> {appointment.reviewRating || 0}/5
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
              <h2 style={styles.sectionTitle}>Selected Patient</h2>
              <p style={styles.sectionHint}>
                Doctor features 2, 3, 4 and 5 operate on the selected appointment.
              </p>
            </div>
          </div>

          {!selectedAppointment ? (
            <p style={styles.muted}>Choose an appointment from the left to start examining.</p>
          ) : (
            <>
              <div style={styles.selectedSummary}>
                <div>
                  <div style={styles.summaryLabel}>Patient</div>
                  <div style={styles.summaryValue}>{selectedAppointment.patientName}</div>
                </div>
                <div>
                  <div style={styles.summaryLabel}>Appointment</div>
                  <div style={styles.summaryValue}>
                    {selectedAppointment.appointmentDate} at {selectedAppointment.slotTime}
                  </div>
                </div>
                <div>
                  <div style={styles.summaryLabel}>Reason</div>
                  <div style={styles.summaryValue}>{selectedAppointment.reason || "N/A"}</div>
                </div>
              </div>

              <div style={styles.recordSelectBox}>
                <label style={styles.label}>Active Medical Record</label>
                <select
                  value={activeRecordId}
                  onChange={(event) => setActiveRecordId(event.target.value)}
                  style={styles.input}
                >
                  <option value="">Select record</option>
                  {(patientHistory?.records || []).map((record) => (
                    <option key={record.id} value={record.id}>
                      #{record.id} - {record.diagnosis || "No diagnosis"} -{" "}
                      {record.createdAt || "Unknown date"}
                    </option>
                  ))}
                </select>
                <p style={styles.microHint}>
                  If today&apos;s appointment has no record yet, create one below first.
                </p>
              </div>

              <div style={styles.formsGrid}>
                <form onSubmit={handleCreateRecord} style={styles.formCard}>
                  <h3 style={styles.formTitle}>Examine And Create Medical Record</h3>
                  <p style={styles.formHint}>Doctor feature 2: record diagnosis and notes.</p>
                  <textarea
                    name="diagnosis"
                    value={recordForm.diagnosis}
                    onChange={handleRecordChange}
                    placeholder="Diagnosis"
                    style={styles.textarea}
                    required
                  />
                  <textarea
                    name="symptoms"
                    value={recordForm.symptoms}
                    onChange={handleRecordChange}
                    placeholder="Symptoms"
                    style={styles.textarea}
                  />
                  <textarea
                    name="notes"
                    value={recordForm.notes}
                    onChange={handleRecordChange}
                    placeholder="Clinical notes"
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
                    {submittingRecord ? "Saving..." : "Create Record"}
                  </button>
                </form>

                <form onSubmit={handleCreatePrescription} style={styles.formCard}>
                  <h3 style={styles.formTitle}>Create Prescription</h3>
                  <p style={styles.formHint}>Doctor feature 3: prescribe medication.</p>
                  <select
                    name="medicineId"
                    value={prescriptionForm.medicineId}
                    onChange={handlePrescriptionChange}
                    style={styles.input}
                    required
                  >
                    <option value="">Select medicine</option>
                    {medicines.map((medicine) => (
                      <option key={medicine.id} value={medicine.id}>
                        {medicine.name} ({medicine.unit}) - stock {medicine.stockQuantity}
                      </option>
                    ))}
                  </select>
                  <input
                    name="dosage"
                    value={prescriptionForm.dosage}
                    onChange={handlePrescriptionChange}
                    placeholder="Dosage"
                    style={styles.input}
                    required
                  />
                  <input
                    name="frequency"
                    value={prescriptionForm.frequency}
                    onChange={handlePrescriptionChange}
                    placeholder="Frequency"
                    style={styles.input}
                  />
                  <input
                    name="duration"
                    value={prescriptionForm.duration}
                    onChange={handlePrescriptionChange}
                    placeholder="Duration"
                    style={styles.input}
                  />
                  <textarea
                    name="instructions"
                    value={prescriptionForm.instructions}
                    onChange={handlePrescriptionChange}
                    placeholder="Instructions"
                    style={styles.textarea}
                  />
                  <button
                    type="submit"
                    style={styles.primaryButton}
                    disabled={submittingPrescription}
                  >
                    {submittingPrescription ? "Saving..." : "Add Prescription"}
                  </button>
                </form>

                <form onSubmit={handleCreateTestRequest} style={styles.formCard}>
                  <h3 style={styles.formTitle}>Request Test</h3>
                  <p style={styles.formHint}>Doctor feature 4: request lab or diagnostic test.</p>
                  <input
                    name="testName"
                    value={testForm.testName}
                    onChange={handleTestChange}
                    placeholder="Test name"
                    style={styles.input}
                    required
                  />
                  <button type="submit" style={styles.primaryButton} disabled={submittingTest}>
                    {submittingTest ? "Saving..." : "Request Test"}
                  </button>
                </form>
              </div>

              <div style={styles.historyPanel}>
                <div style={styles.sectionHeader}>
                  <div>
                    <h3 style={styles.sectionTitle}>Patient History</h3>
                    <p style={styles.sectionHint}>Doctor feature 5: review past records.</p>
                  </div>
                </div>

                {historyLoading ? (
                  <p style={styles.muted}>Loading patient history...</p>
                ) : !patientHistory ? (
                  <p style={styles.muted}>Patient history unavailable.</p>
                ) : (
                  <>
                    <div style={styles.patientProfileBox}>
                      <div style={styles.patientProfileItem}>
                        <span style={styles.summaryLabel}>Name</span>
                        <strong>{patientHistory.patientName}</strong>
                      </div>
                      <div style={styles.patientProfileItem}>
                        <span style={styles.summaryLabel}>Gender</span>
                        <strong>{patientHistory.gender || "N/A"}</strong>
                      </div>
                      <div style={styles.patientProfileItem}>
                        <span style={styles.summaryLabel}>Date of birth</span>
                        <strong>{patientHistory.dateOfBirth || "N/A"}</strong>
                      </div>
                      <div style={styles.patientProfileItem}>
                        <span style={styles.summaryLabel}>Insurance</span>
                        <strong>{patientHistory.insuranceNumber || "N/A"}</strong>
                      </div>
                    </div>

                    <div style={styles.historyGrid}>
                      <div style={styles.historyCard}>
                        <h4 style={styles.historyTitle}>Medical Records</h4>
                        {(patientHistory.records || []).length === 0 ? (
                          <p style={styles.muted}>No medical records yet.</p>
                        ) : (
                          patientHistory.records.map((record) => (
                            <div key={record.id} style={styles.historyItem}>
                              <strong>
                                #{record.id} {record.diagnosis || "No diagnosis"}
                              </strong>
                              <p>Symptoms: {record.symptoms || "N/A"}</p>
                              <p>Notes: {record.notes || "N/A"}</p>
                              <p>Follow-up: {record.followUpDate || "N/A"}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <div style={styles.historyCard}>
                        <h4 style={styles.historyTitle}>Prescriptions</h4>
                        {(patientHistory.prescriptions || []).length === 0 ? (
                          <p style={styles.muted}>No prescriptions yet.</p>
                        ) : (
                          patientHistory.prescriptions.map((item) => (
                            <div key={item.id} style={styles.historyItem}>
                              <strong>{item.medicineName}</strong>
                              <p>Dosage: {item.dosage || "N/A"}</p>
                              <p>Frequency: {item.frequency || "N/A"}</p>
                              <p>Duration: {item.duration || "N/A"}</p>
                              <p>Instructions: {item.instructions || "N/A"}</p>
                            </div>
                          ))
                        )}
                      </div>

                      <div style={styles.historyCard}>
                        <h4 style={styles.historyTitle}>Tests</h4>
                        {(patientHistory.tests || []).length === 0 ? (
                          <p style={styles.muted}>No test requests yet.</p>
                        ) : (
                          patientHistory.tests.map((item) => (
                            <div key={item.testRequestId} style={styles.historyItem}>
                              <strong>{item.testName}</strong>
                              <p>Status: {item.status || "N/A"}</p>
                              <p>Result: {item.result || "Pending"}</p>
                              <p>Conclusion: {item.conclusion || "Pending"}</p>
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
                  Active record: #{activeRecord.id} - {activeRecord.diagnosis || "No diagnosis"}
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
  page: {
    display: "grid",
    gap: "24px",
  },
  hero: {
    background: "linear-gradient(135deg, #111827, #0f766e)",
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
    color: "#d1fae5",
    lineHeight: 1.6,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "minmax(320px, 0.9fr) minmax(420px, 1.4fr)",
    gap: "20px",
    alignItems: "start",
  },
  panel: {
    background: "#fff",
    borderRadius: "24px",
    padding: "22px",
    boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)",
    display: "grid",
    gap: "18px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    flexWrap: "wrap",
  },
  sectionTitle: {
    margin: 0,
    color: "#0f172a",
  },
  sectionHint: {
    margin: "6px 0 0",
    color: "#64748b",
    lineHeight: 1.5,
  },
  secondaryButton: {
    border: "1px solid #cbd5e1",
    background: "#fff",
    color: "#0f172a",
    borderRadius: "12px",
    padding: "10px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  cardStack: {
    display: "grid",
    gap: "14px",
  },
  appointmentCard: {
    border: "2px solid #dbeafe",
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
    color: "#0f172a",
  },
  timePill: {
    borderRadius: "999px",
    padding: "8px 12px",
    background: "#0f766e",
    color: "#fff",
    fontWeight: 800,
  },
  metaLine: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    color: "#475569",
    fontSize: "14px",
    marginTop: "10px",
  },
  reasonText: {
    margin: "12px 0 0",
    color: "#0f172a",
    lineHeight: 1.5,
  },
  reviewBox: {
    marginTop: "12px",
    background: "#f8fafc",
    borderRadius: "14px",
    padding: "12px",
    color: "#334155",
    lineHeight: 1.5,
  },
  muted: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
  },
  selectedSummary: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    padding: "16px",
    borderRadius: "18px",
    background: "#f8fafc",
  },
  summaryLabel: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  summaryValue: {
    marginTop: "6px",
    color: "#0f172a",
    fontWeight: 700,
    lineHeight: 1.5,
  },
  recordSelectBox: {
    display: "grid",
    gap: "8px",
  },
  label: {
    fontWeight: 700,
    color: "#0f172a",
  },
  microHint: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },
  formsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
  formCard: {
    borderRadius: "20px",
    border: "1px solid #dbeafe",
    padding: "18px",
    display: "grid",
    gap: "12px",
    alignContent: "start",
    background: "#fcfffe",
  },
  formTitle: {
    margin: 0,
    color: "#0f172a",
  },
  formHint: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.5,
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
    minHeight: "94px",
    border: "1px solid #cbd5e1",
    borderRadius: "12px",
    padding: "12px 14px",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
    background: "#fff",
  },
  primaryButton: {
    border: "none",
    borderRadius: "12px",
    background: "#0f766e",
    color: "#fff",
    padding: "12px 16px",
    fontWeight: 800,
    cursor: "pointer",
  },
  historyPanel: {
    display: "grid",
    gap: "16px",
  },
  patientProfileBox: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
  },
  patientProfileItem: {
    background: "#f8fafc",
    borderRadius: "16px",
    padding: "14px",
    display: "grid",
    gap: "6px",
  },
  historyGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "14px",
  },
  historyCard: {
    borderRadius: "18px",
    border: "1px solid #dbeafe",
    padding: "16px",
    display: "grid",
    gap: "12px",
  },
  historyTitle: {
    margin: 0,
    color: "#0f172a",
  },
  historyItem: {
    borderRadius: "14px",
    background: "#f8fafc",
    padding: "12px",
    color: "#334155",
    lineHeight: 1.5,
  },
  activeRecordBadge: {
    borderRadius: "14px",
    background: "#dcfce7",
    color: "#166534",
    padding: "12px 14px",
    fontWeight: 700,
  },
};
