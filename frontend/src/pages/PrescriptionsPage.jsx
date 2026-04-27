import { useEffect, useState } from "react";
import usePageMeta from "../hooks/usePageMeta";
import api, { getErrorMessage } from "../services/api";
import { createAutoGrid, createHero, gradients, ui } from "../styles/designSystem";

function PrescriptionsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  usePageMeta(
    "Đơn thuốc điện tử",
    "Xem danh sách đơn thuốc điện tử, liều dùng và hướng dẫn sử dụng được kê bởi bác sĩ.",
  );

  useEffect(() => {
    api
      .get("/api/patient/prescriptions")
      .then((response) => {
        setItems(response.data?.data || []);
      })
      .catch((error) => {
        setErrorText(getErrorMessage(error, "Không tải được đơn thuốc."));
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.patient)}>
        <div style={ui.eyebrow}>Đơn thuốc điện tử</div>
        <h1 style={ui.title}>Tra cứu thuốc đã kê và hướng dẫn sử dụng rõ ràng</h1>
        <p style={ui.subtitle}>
          Toàn bộ đơn thuốc được lưu theo từng hồ sơ khám để bạn đối chiếu tên
          thuốc, liều dùng và chỉ dẫn của bác sĩ trong cùng một nơi.
        </p>
      </section>

      {loading && <div style={ui.stateCard}>Đang tải đơn thuốc...</div>}
      {!loading && errorText && <div style={ui.errorCard}>{errorText}</div>}
      {!loading && !errorText && items.length === 0 && (
        <div style={ui.stateCard}>Bạn chưa có đơn thuốc nào.</div>
      )}

      {!loading && !errorText && items.length > 0 && (
        <div style={createAutoGrid(320)}>
          {items.map((item) => (
            <article key={item.id} style={ui.card}>
              <div style={styles.titleRow}>
                <div>
                  <h3 style={styles.cardTitle}>{item.medicineName}</h3>
                  <p style={styles.meta}>Bác sĩ kê đơn: {item.doctorName}</p>
                </div>
              </div>

              <div style={createAutoGrid(140)}>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Liều dùng</div>
                  <div style={styles.valueText}>{item.dosage || "Chưa cập nhật"}</div>
                </div>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Tần suất</div>
                  <div style={styles.valueText}>{item.frequency || "Chưa cập nhật"}</div>
                </div>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Thời gian dùng</div>
                  <div style={styles.valueText}>{item.duration || "Chưa cập nhật"}</div>
                </div>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Hồ sơ</div>
                  <div style={styles.valueText}>#{item.medicalRecordId}</div>
                </div>
              </div>

              <div style={styles.instructionsBox}>
                <div style={ui.label}>Hướng dẫn sử dụng</div>
                <p style={styles.instructionsText}>
                  {item.instructions || "Chưa có hướng dẫn sử dụng."}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  titleRow: {
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
  valueText: {
    marginTop: "8px",
    color: "#16324f",
    fontWeight: 700,
  },
  instructionsBox: {
    ...ui.panelSoft,
    marginTop: "18px",
  },
  instructionsText: {
    margin: "10px 0 0",
    color: "#34506e",
    lineHeight: 1.7,
  },
};

export default PrescriptionsPage;
