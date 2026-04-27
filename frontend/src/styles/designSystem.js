export const gradients = {
  hospital: "linear-gradient(160deg, #ffffff, #f4f9fd)",
  patient: "linear-gradient(160deg, #0f4c81, #4f8fcf)",
  doctor: "linear-gradient(160deg, #0f4c81, #2f6fa3)",
  admin: "linear-gradient(160deg, #123e66, #355f8c)",
};

export const ui = {
  page: {
    display: "grid",
    gap: "24px",
  },
  hero: {
    borderRadius: "30px",
    padding: "32px",
    color: "#fff",
    boxShadow: "0 24px 52px rgba(19, 39, 66, 0.08)",
  },
  eyebrow: {
    display: "inline-flex",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.14)",
    fontWeight: 800,
    fontSize: "12px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  title: {
    margin: "16px 0 0",
    fontSize: "36px",
    lineHeight: 1.14,
    letterSpacing: "-0.03em",
  },
  subtitle: {
    margin: "14px 0 0",
    maxWidth: "760px",
    color: "rgba(255,255,255,0.86)",
    lineHeight: 1.75,
  },
  panel: {
    background: "rgba(255,255,255,0.96)",
    borderRadius: "24px",
    padding: "24px",
    boxShadow: "0 16px 34px rgba(19, 39, 66, 0.07)",
    border: "1px solid rgba(147, 170, 193, 0.16)",
  },
  panelSoft: {
    background: "#f7fbff",
    borderRadius: "20px",
    padding: "18px",
    border: "1px solid rgba(147, 170, 193, 0.16)",
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
    color: "#16324f",
    fontSize: "24px",
  },
  sectionHint: {
    margin: "6px 0 0",
    color: "#5f758d",
    lineHeight: 1.6,
  },
  stateCard: {
    background: "rgba(255,255,255,0.96)",
    borderRadius: "20px",
    padding: "18px",
    border: "1px solid rgba(147, 170, 193, 0.16)",
  },
  errorCard: {
    background: "#fff1f2",
    color: "#9f1239",
    borderRadius: "20px",
    padding: "18px",
    border: "1px solid #fecdd3",
  },
  card: {
    background: "rgba(255,255,255,0.96)",
    borderRadius: "22px",
    padding: "22px",
    boxShadow: "0 14px 28px rgba(19, 39, 66, 0.06)",
    border: "1px solid rgba(147, 170, 193, 0.16)",
  },
  listCard: {
    border: "1px solid rgba(147, 170, 193, 0.16)",
    borderRadius: "18px",
    padding: "16px",
    background: "#fff",
  },
  input: {
    width: "100%",
    border: "1px solid #cdd9e5",
    borderRadius: "14px",
    padding: "12px 14px",
    fontSize: "14px",
    background: "#fff",
  },
  textarea: {
    width: "100%",
    minHeight: "110px",
    border: "1px solid #cdd9e5",
    borderRadius: "14px",
    padding: "12px 14px",
    fontSize: "14px",
    resize: "vertical",
    background: "#fff",
  },
  label: {
    fontSize: "12px",
    fontWeight: 800,
    color: "#6f879f",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  muted: {
    margin: 0,
    color: "#64748b",
    lineHeight: 1.6,
  },
  primaryButton: {
    border: "none",
    borderRadius: "14px",
    background: "#0f4c81",
    color: "#fff",
    padding: "12px 16px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(15, 76, 129, 0.14)",
  },
  secondaryButton: {
    border: "1px solid rgba(147, 170, 193, 0.24)",
    borderRadius: "14px",
    background: "#fff",
    color: "#16324f",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  dangerButton: {
    border: "none",
    borderRadius: "14px",
    background: "#c24141",
    color: "#fff",
    padding: "12px 16px",
    fontWeight: 800,
    cursor: "pointer",
  },
  actionRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#16324f",
    fontWeight: 600,
  },
};

export const createHero = (background) => ({
  ...ui.hero,
  background,
});

export const createStatusPill = (type = "info") => {
  const palette = {
    success: { background: "#dcfce7", color: "#166534" },
    warning: { background: "#fef3c7", color: "#92400e" },
    info: { background: "#e0f2fe", color: "#075985" },
    danger: { background: "#fee2e2", color: "#991b1b" },
  };
  const tone = palette[type] || palette.info;
  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 12px",
    borderRadius: "999px",
    fontWeight: 800,
    fontSize: "12px",
    ...tone,
  };
};

export const createAutoGrid = (min = 260) => ({
  display: "grid",
  gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
  gap: "18px",
});
