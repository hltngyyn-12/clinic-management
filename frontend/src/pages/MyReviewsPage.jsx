import { useEffect, useState } from "react";
import usePageMeta from "../hooks/usePageMeta";
import api, { getErrorMessage } from "../services/api";
import {
  createAutoGrid,
  createHero,
  gradients,
  ui,
} from "../styles/designSystem";

function MyReviewsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  usePageMeta(
    "Đánh giá",
    "Xem lại toàn bộ phản hồi, số sao và nhận xét mà bạn đã gửi cho bác sĩ sau mỗi lần thăm khám trên ClinicMS.",
  );

  useEffect(() => {
    api
      .get("/api/patient/reviews")
      .then((response) => {
        setItems(response.data?.data || []);
      })
      .catch((error) => {
        setErrorText(
          getErrorMessage(error, "Không tải được danh sách đánh giá."),
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.patient)}>
        <div style={ui.eyebrow}>Phản hồi dịch vụ</div>
        <h1 style={ui.title}>
          Lưu lại trải nghiệm khám bệnh và những đánh giá bạn đã gửi cho bác sĩ
        </h1>
        <p style={ui.subtitle}>
          Các phản hồi được lưu tập trung để bạn dễ xem lại lịch sử đánh giá,
          đồng thời giúp phòng khám cải thiện chất lượng chăm sóc theo trải
          nghiệm thực tế của người bệnh.
        </p>
      </section>

      {loading && (
        <div style={ui.stateCard}>Đang tải danh sách đánh giá...</div>
      )}
      {!loading && errorText && <div style={ui.errorCard}>{errorText}</div>}
      {!loading && !errorText && items.length === 0 && (
        <div style={ui.stateCard}>Bạn chưa gửi đánh giá nào cho bác sĩ.</div>
      )}

      {!loading && !errorText && items.length > 0 && (
        <div style={createAutoGrid(320)}>
          {items.map((item) => (
            <article key={item.id} style={ui.card}>
              <div style={styles.topRow}>
                <div>
                  <h3 style={styles.cardTitle}>{item.doctorName}</h3>
                  <p style={styles.meta}>
                    Lịch hẹn liên quan: #{item.appointmentId}
                  </p>
                </div>
                <div style={styles.ratingBadge}>{item.rating}/5</div>
              </div>
              <p style={styles.comment}>
                {item.comment ||
                  "Bạn chưa để lại nội dung nhận xét cho đánh giá này."}
              </p>
              <div style={styles.footer}>{item.createdAt}</div>
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
  ratingBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "76px",
    padding: "10px 14px",
    borderRadius: "999px",
    background: "#e8f2ff",
    color: "#0f4c81",
    fontWeight: 800,
  },
  comment: {
    margin: "18px 0 0",
    color: "#34506e",
    lineHeight: 1.75,
  },
  footer: {
    marginTop: "18px",
    color: "#7a8fa6",
    fontSize: "13px",
  },
};

export default MyReviewsPage;
