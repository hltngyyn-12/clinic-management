import { useEffect, useState } from "react";
import usePageMeta from "../hooks/usePageMeta";
import api, { getErrorMessage } from "../services/api";
import {
  createAutoGrid,
  createHero,
  createStatusPill,
  gradients,
  ui,
} from "../styles/designSystem";

function TestResultsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  usePageMeta(
    "Kết quả xét nghiệm",
    "Theo dõi yêu cầu xét nghiệm, trạng thái xử lý, kết quả và kết luận chuyên môn trực tuyến trên hệ thống ClinicMS.",
  );

  useEffect(() => {
    api
      .get("/api/patient/test-results")
      .then((response) => {
        setItems(response.data?.data || []);
      })
      .catch((error) => {
        setErrorText(
          getErrorMessage(error, "Không tải được kết quả xét nghiệm."),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.patient)}>
        <div style={ui.eyebrow}>Xét nghiệm trực tuyến</div>
        <h1 style={ui.title}>
          Theo dõi trạng thái xét nghiệm, kết quả và kết luận chuyên môn ngay
          trên hệ thống
        </h1>
        <p style={ui.subtitle}>
          Kết quả xét nghiệm được liên kết với từng hồ sơ khám bệnh, giúp bạn
          nắm tiến độ xử lý, xem thông tin trả về và đọc kết luận chuyên môn một
          cách thuận tiện.
        </p>
      </section>

      {loading && (
        <div style={ui.stateCard}>Đang tải dữ liệu xét nghiệm...</div>
      )}
      {!loading && errorText && <div style={ui.errorCard}>{errorText}</div>}
      {!loading && !errorText && items.length === 0 && (
        <div style={ui.stateCard}>
          Bạn chưa có dữ liệu xét nghiệm nào trên hệ thống.
        </div>
      )}

      {!loading && !errorText && items.length > 0 && (
        <div style={createAutoGrid(320)}>
          {items.map((item) => (
            <article key={item.testRequestId} style={ui.card}>
              <div style={styles.topRow}>
                <div>
                  <h3 style={styles.cardTitle}>{item.testName}</h3>
                  <p style={styles.meta}>Bác sĩ phụ trách: {item.doctorName}</p>
                </div>
                <div
                  style={createStatusPill(
                    item.status === "COMPLETED" ? "success" : "warning",
                  )}
                >
                  {item.status === "COMPLETED"
                    ? "Đã hoàn thành"
                    : item.status || "Đang xử lý"}
                </div>
              </div>

              <div style={styles.referenceRow}>
                <div style={ui.label}>Hồ sơ khám bệnh liên quan</div>
                <div style={styles.referenceValue}>#{item.medicalRecordId}</div>
              </div>

              <div style={styles.resultGrid}>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Kết quả xét nghiệm</div>
                  <p style={styles.resultText}>
                    {item.result || "Đang chờ cập nhật kết quả."}
                  </p>
                </div>
                <div style={ui.panelSoft}>
                  <div style={ui.label}>Kết luận chuyên môn</div>
                  <p style={styles.resultText}>
                    {item.conclusion || "Đang chờ bác sĩ cập nhật kết luận."}
                  </p>
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
  referenceRow: {
    marginBottom: "18px",
  },
  referenceValue: {
    marginTop: "8px",
    color: "#16324f",
    fontWeight: 700,
  },
  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  resultText: {
    margin: "10px 0 0",
    color: "#34506e",
    lineHeight: 1.7,
  },
};

export default TestResultsPage;
