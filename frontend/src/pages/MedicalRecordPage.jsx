import { useEffect, useState } from "react";
import usePageMeta from "../hooks/usePageMeta";
import api, { getErrorMessage } from "../services/api";
import { createHero, createStatusPill, gradients, ui } from "../styles/designSystem";

function MedicalRecordPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  usePageMeta(
    "Lịch sử khám bệnh",
    "Tra cứu hồ sơ khám bệnh, chẩn đoán và ghi chú điều trị của các lần thăm khám trước.",
  );

  useEffect(() => {
    api
      .get("/api/patient/medical-history")
      .then((response) => {
        setItems(response.data?.data || []);
      })
      .catch((error) => {
        setErrorText(getErrorMessage(error, "Không tải được lịch sử khám."));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.patient)}>
        <div style={ui.eyebrow}>Hồ sơ điều trị</div>
        <h1 style={ui.title}>Xem lại chẩn đoán và ghi chú điều trị theo từng lần khám</h1>
        <p style={ui.subtitle}>
          Hồ sơ khám bệnh được sắp xếp theo thời gian, giúp bạn nắm nhanh lịch sử
          điều trị và đối chiếu lại từng buổi thăm khám với bác sĩ.
        </p>
      </section>

      {loading && <div style={ui.stateCard}>Đang tải lịch sử khám...</div>}
      {!loading && errorText && <div style={ui.errorCard}>{errorText}</div>}
      {!loading && !errorText && items.length === 0 && (
        <div style={ui.stateCard}>Bạn chưa có hồ sơ khám nào.</div>
      )}

      {!loading && !errorText && items.length > 0 && (
        <div style={{ display: "grid", gap: "18px" }}>
          {items.map((item) => (
            <article key={item.id} style={ui.card}>
              <div style={styles.topRow}>
                <div>
                  <h3 style={styles.cardTitle}>Hồ sơ #{item.id}</h3>
                  <p style={styles.meta}>Bác sĩ phụ trách: {item.doctorName}</p>
                </div>
                <div style={createStatusPill("info")}>{item.createdAt}</div>
              </div>

              <div style={styles.contentGrid}>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Chẩn đoán</div>
                  <p style={styles.text}>
                    {item.diagnosis || "Chưa có chẩn đoán cho hồ sơ này."}
                  </p>
                </div>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Ghi chú điều trị</div>
                  <p style={styles.text}>{item.notes || "Chưa có ghi chú điều trị."}</p>
                </div>
              </div>

              <div style={styles.footerRow}>
                <div style={createStatusPill("success")}>
                  Lịch hẹn liên quan: #{item.appointmentId}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
    marginBottom: "18px",
  },
  cardTitle: {
    margin: 0,
    color: "#16324f",
    fontSize: "24px",
  },
  meta: {
    margin: "8px 0 0",
    color: "#5c7894",
    fontWeight: 600,
  },
  contentGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "16px",
  },
  text: {
    margin: "10px 0 0",
    color: "#34506e",
    lineHeight: 1.75,
  },
  footerRow: {
    marginTop: "18px",
    display: "flex",
    justifyContent: "flex-start",
  },
};

export default MedicalRecordPage;
