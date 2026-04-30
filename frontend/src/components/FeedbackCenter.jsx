import { useEffect, useMemo, useState } from "react";

const toneStyles = {
  success: {
    background: "linear-gradient(135deg, #ecfdf5, #f0fdf4)",
    border: "1px solid rgba(34, 197, 94, 0.18)",
    accent: "#15803d",
    icon: "✓",
  },
  error: {
    background: "linear-gradient(135deg, #fff1f2, #fff7f7)",
    border: "1px solid rgba(239, 68, 68, 0.18)",
    accent: "#b91c1c",
    icon: "!",
  },
  warning: {
    background: "linear-gradient(135deg, #fff7ed, #fffbeb)",
    border: "1px solid rgba(245, 158, 11, 0.2)",
    accent: "#b45309",
    icon: "i",
  },
  info: {
    background: "linear-gradient(135deg, #eff6ff, #f8fbff)",
    border: "1px solid rgba(15, 76, 129, 0.16)",
    accent: "#0f4c81",
    icon: "i",
  },
  danger: {
    background: "linear-gradient(135deg, #fff1f2, #fff7f7)",
    border: "1px solid rgba(239, 68, 68, 0.18)",
    accent: "#b91c1c",
    icon: "!",
  },
};

function FeedbackCenter() {
  const [toasts, setToasts] = useState([]);
  const [confirmState, setConfirmState] = useState(null);

  useEffect(() => {
    const handleToast = (event) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const detail = event.detail || {};
      const toast = {
        id,
        message: detail.message || "Đã xảy ra lỗi. Vui lòng thử lại.",
        tone: detail.tone || "info",
        duration: detail.duration ?? 3400,
      };

      setToasts((prev) => [...prev, toast]);

      window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, toast.duration);
    };

    const handleConfirm = (event) => {
      setConfirmState(event.detail || null);
    };

    window.addEventListener("clinic:toast", handleToast);
    window.addEventListener("clinic:confirm", handleConfirm);

    return () => {
      window.removeEventListener("clinic:toast", handleToast);
      window.removeEventListener("clinic:confirm", handleConfirm);
    };
  }, []);

  const confirmTone = useMemo(
    () => toneStyles[confirmState?.tone || "danger"] || toneStyles.danger,
    [confirmState],
  );

  const closeConfirm = (accepted) => {
    if (confirmState?.resolve) {
      confirmState.resolve(Boolean(accepted));
    }
    setConfirmState(null);
  };

  return (
    <>
      <div style={styles.toastStack}>
        {toasts.map((toast) => {
          const tone = toneStyles[toast.tone] || toneStyles.info;
          return (
            <div key={toast.id} style={{ ...styles.toastCard, background: tone.background, border: tone.border }}>
              <div style={{ ...styles.toastIcon, color: tone.accent, borderColor: tone.accent }}>{tone.icon}</div>
              <div style={styles.toastBody}>
                <strong style={styles.toastTitle}>
                  {toast.tone === "success"
                    ? "Hoàn tất"
                    : toast.tone === "error"
                      ? "Không thành công"
                      : toast.tone === "warning"
                        ? "Lưu ý"
                        : "Thông báo"}
                </strong>
                <p style={styles.toastText}>{toast.message}</p>
              </div>
              <button type="button" onClick={() => setToasts((prev) => prev.filter((item) => item.id !== toast.id))} style={styles.toastClose}>
                ×
              </button>
            </div>
          );
        })}
      </div>

      {confirmState ? (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalCard} role="dialog" aria-modal="true" aria-labelledby="confirm-title">
            <div style={styles.modalHeader}>
              <div style={{ ...styles.modalIcon, color: confirmTone.accent, borderColor: confirmTone.accent }}>
                {confirmTone.icon}
              </div>
              <div>
                <h3 id="confirm-title" style={styles.modalTitle}>
                  {confirmState.title || "Xác nhận thao tác"}
                </h3>
                <p style={styles.modalText}>{confirmState.message}</p>
              </div>
            </div>
            <div style={styles.modalActions}>
              <button type="button" onClick={() => closeConfirm(false)} style={styles.cancelButton}>
                {confirmState.cancelLabel || "Hủy"}
              </button>
              <button
                type="button"
                onClick={() => closeConfirm(true)}
                style={{
                  ...styles.confirmButton,
                  background: confirmState.tone === "danger" ? "#c24141" : "#0f4c81",
                }}
              >
                {confirmState.confirmLabel || "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const styles = {
  toastStack: {
    position: "fixed",
    top: 20,
    right: 20,
    zIndex: 2200,
    display: "grid",
    gap: "12px",
    width: "min(360px, calc(100vw - 32px))",
  },
  toastCard: {
    display: "grid",
    gridTemplateColumns: "auto 1fr auto",
    gap: "12px",
    alignItems: "start",
    padding: "14px 14px 14px 12px",
    borderRadius: "18px",
    boxShadow: "0 18px 34px rgba(19, 39, 66, 0.12)",
    backdropFilter: "blur(18px)",
  },
  toastIcon: {
    width: "30px",
    height: "30px",
    borderRadius: "999px",
    border: "1px solid currentColor",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    background: "rgba(255,255,255,0.72)",
  },
  toastBody: {
    display: "grid",
    gap: "4px",
  },
  toastTitle: {
    color: "#16324f",
    fontSize: "14px",
  },
  toastText: {
    margin: 0,
    color: "#4f647b",
    lineHeight: 1.5,
    fontSize: "14px",
  },
  toastClose: {
    border: "none",
    background: "transparent",
    color: "#7b8fa4",
    cursor: "pointer",
    fontSize: "22px",
    lineHeight: 1,
    padding: 0,
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    zIndex: 2100,
    background: "rgba(9, 23, 39, 0.36)",
    backdropFilter: "blur(6px)",
    display: "grid",
    placeItems: "center",
    padding: "20px",
  },
  modalCard: {
    width: "min(480px, 100%)",
    background: "rgba(255,255,255,0.98)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 28px 60px rgba(19, 39, 66, 0.16)",
    border: "1px solid rgba(147, 170, 193, 0.16)",
    display: "grid",
    gap: "20px",
  },
  modalHeader: {
    display: "grid",
    gridTemplateColumns: "auto 1fr",
    gap: "14px",
    alignItems: "start",
  },
  modalIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "999px",
    border: "1px solid currentColor",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    background: "#fff",
  },
  modalTitle: {
    margin: 0,
    color: "#16324f",
    fontSize: "22px",
  },
  modalText: {
    margin: "8px 0 0",
    color: "#526981",
    lineHeight: 1.6,
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    flexWrap: "wrap",
  },
  cancelButton: {
    border: "1px solid rgba(147, 170, 193, 0.28)",
    borderRadius: "14px",
    background: "#fff",
    color: "#16324f",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  confirmButton: {
    border: "none",
    borderRadius: "14px",
    color: "#fff",
    padding: "12px 16px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(19, 39, 66, 0.12)",
  },
};

export default FeedbackCenter;
