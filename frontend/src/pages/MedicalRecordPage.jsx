import { useEffect, useState } from "react";
import usePageMeta from "../hooks/usePageMeta";
import api, { getErrorMessage } from "../services/api";
import {
  createHero,
  createStatusPill,
  gradients,
  ui,
} from "../styles/designSystem";

function MedicalRecordPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  usePageMeta(
    "Lịch sử khám bệnh",
    "Tra cứu hồ sơ khám bệnh, chẩn đoán, ghi chú điều trị và thông tin bác sĩ phụ trách từ các lần thăm khám trước trên hệ thống ClinicMS.",
  );

  useEffect(() => {
    api
      .get("/api/patient/medical-history")
      .then((response) => {
        setItems(response.data?.data || []);
      })
      .catch((error) => {
        setErrorText(
          getErrorMessage(error, "Không tải được lịch sử khám bệnh."),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.patient)}>
        <div style={ui.eyebrow}>Hồ sơ điều trị</div>
        <h1 style={ui.title}>
          Xem lại chẩn đoán, ghi chú điều trị và diễn tiến sức khỏe theo từng
          lần thăm khám
        </h1>
        <p style={ui.subtitle}>
          Mỗi hồ sơ khám bệnh được lưu theo từng mốc thời gian để bạn dễ theo
          dõi quá trình điều trị, đối chiếu chỉ định chuyên môn và chuẩn bị tốt
          hơn cho những lần tái khám tiếp theo.
        </p>
      </section>

      {loading && <div style={ui.stateCard}>Đang tải lịch sử khám bệnh...</div>}
      {!loading && errorText && <div style={ui.errorCard}>{errorText}</div>}
      {!loading && !errorText && items.length === 0 && (
        <div style={ui.stateCard}>
          Bạn chưa có hồ sơ khám bệnh nào trên hệ thống.
        </div>
      )}

      {!loading && !errorText && items.length > 0 && (
        <div style={{ display: "grid", gap: "18px" }}>
          {items.map((item) => (
            <article key={item.id} style={ui.card}>
              <div style={styles.topRow}>
                <div>
                  <h3 style={styles.cardTitle}>Hồ sơ khám bệnh #{item.id}</h3>
                  <p style={styles.meta}>Bác sĩ phụ trách: {item.doctorName}</p>
                </div>
                <div style={createStatusPill("info")}>{item.createdAt}</div>
              </div>

              <div style={styles.contentGrid}>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Chẩn đoán</div>
                  <p style={styles.text}>
                    {item.diagnosis ||
                      "Hồ sơ này chưa có nội dung chẩn đoán chi tiết."}
                  </p>
                </div>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Ghi chú điều trị</div>
                  <p style={styles.text}>
                    {item.notes ||
                      "Bác sĩ chưa bổ sung ghi chú điều trị cho hồ sơ này."}
                  </p>
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
