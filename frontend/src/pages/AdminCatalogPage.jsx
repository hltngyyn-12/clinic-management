import { useEffect, useState } from "react";
import usePageMeta from "../hooks/usePageMeta";
import api, { getErrorMessage } from "../services/api";
import { confirmAction } from "../utils/feedbackUx";
import {
  createAutoGrid,
  createHero,
  gradients,
  ui,
} from "../styles/designSystem";

const emptySpecialtyForm = { name: "", description: "", active: true };
const emptyMedicineForm = {
  name: "",
  unit: "",
  stockQuantity: "",
  price: "",
  description: "",
  active: true,
};

function AdminCatalogPage() {
  const [specialties, setSpecialties] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [specialtyForm, setSpecialtyForm] = useState(emptySpecialtyForm);
  const [medicineForm, setMedicineForm] = useState(emptyMedicineForm);
  const [editingSpecialtyId, setEditingSpecialtyId] = useState(null);
  const [editingMedicineId, setEditingMedicineId] = useState(null);

  usePageMeta(
    "Danh mục chuyên khoa và thuốc",
    "Cập nhật danh mục chuyên khoa và kho thuốc của ClinicMS để đồng bộ cho hồ sơ bác sĩ và đơn thuốc điện tử.",
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [specialtyRes, medicineRes] = await Promise.all([
        api.get("/api/admin/specialties"),
        api.get("/api/admin/medicines"),
      ]);
      setSpecialties(specialtyRes.data?.data || []);
      setMedicines(medicineRes.data?.data || []);
    } catch (error) {
      alert(getErrorMessage(error, "Không thể tải dữ liệu danh mục."));
    }
  };

  const submitSpecialty = async (event) => {
    event.preventDefault();
    try {
      if (editingSpecialtyId) {
        await api.put(
          `/api/admin/specialties/${editingSpecialtyId}`,
          specialtyForm,
        );
        alert("Đã cập nhật chuyên khoa.");
      } else {
        await api.post("/api/admin/specialties", specialtyForm);
        alert("Đã tạo chuyên khoa.");
      }
      setSpecialtyForm(emptySpecialtyForm);
      setEditingSpecialtyId(null);
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Không thể lưu chuyên khoa."));
    }
  };

  const submitMedicine = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...medicineForm,
        stockQuantity:
          medicineForm.stockQuantity === ""
            ? null
            : Number(medicineForm.stockQuantity),
      };
      if (editingMedicineId) {
        await api.put(`/api/admin/medicines/${editingMedicineId}`, payload);
        alert("Đã cập nhật thuốc.");
      } else {
        await api.post("/api/admin/medicines", payload);
        alert("Đã tạo thuốc.");
      }
      setMedicineForm(emptyMedicineForm);
      setEditingMedicineId(null);
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Không thể lưu thuốc."));
    }
  };

  const deleteSpecialty = async (id) => {
    const confirmed = await confirmAction(
      "Bạn có chắc muốn xóa chuyên khoa này?",
      {
        title: "Xóa chuyên khoa",
        confirmLabel: "Xóa chuyên khoa",
      },
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/admin/specialties/${id}`);
      alert("Đã xóa chuyên khoa.");
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Không thể xóa chuyên khoa."));
    }
  };

  const deleteMedicine = async (id) => {
    const confirmed = await confirmAction("Bạn có chắc muốn xóa thuốc này?", {
      title: "Xóa thuốc",
      confirmLabel: "Xóa thuốc",
    });
    if (!confirmed) return;

    try {
      await api.delete(`/api/admin/medicines/${id}`);
      alert("Đã xóa thuốc.");
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Không thể xóa thuốc."));
    }
  };

  return (
    <div style={ui.page}>
      <section style={createHero(gradients.admin)}>
        <div style={ui.eyebrow}>Danh mục nền tảng của hệ thống</div>
        <h1 style={ui.title}>
          Chuẩn hóa chuyên khoa và thuốc để dữ liệu vận hành luôn nhất quán
        </h1>
        <p style={ui.subtitle}>
          Đây là nơi quản trị viên duy trì các danh mục dùng chung cho toàn bộ
          hệ thống, từ chuyên khoa hiển thị trên trang đặt lịch đến kho thuốc
          phục vụ kê đơn điện tử của bác sĩ.
        </p>
      </section>

      <div style={styles.grid}>
        <section style={ui.panel}>
          <div style={styles.sectionHead}>
            <h2 style={ui.sectionTitle}>Danh mục chuyên khoa</h2>
            <p style={ui.sectionHint}>
              Quản lý tên gọi, mô tả và trạng thái hoạt động của từng chuyên
              khoa để hiển thị chính xác cho bác sĩ và bệnh nhân.
            </p>
          </div>

          <form onSubmit={submitSpecialty} style={styles.form}>
            <input
              name="name"
              value={specialtyForm.name}
              onChange={(event) =>
                setSpecialtyForm((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              placeholder="Ví dụ: Tim mạch, Da liễu, Nội tổng quát..."
              style={ui.input}
            />
            <textarea
              name="description"
              value={specialtyForm.description}
              onChange={(event) =>
                setSpecialtyForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Mô tả ngắn về phạm vi khám, điều trị hoặc đặc điểm của chuyên khoa"
              style={ui.textarea}
            />
            <label style={ui.checkboxRow}>
              <input
                type="checkbox"
                checked={specialtyForm.active}
                onChange={(event) =>
                  setSpecialtyForm((prev) => ({
                    ...prev,
                    active: event.target.checked,
                  }))
                }
              />
              Kích hoạt chuyên khoa trên hệ thống
            </label>
            <div style={ui.actionRow}>
              <button type="submit" style={ui.primaryButton}>
                {editingSpecialtyId
                  ? "Cập nhật chuyên khoa"
                  : "Tạo chuyên khoa mới"}
              </button>
              {editingSpecialtyId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingSpecialtyId(null);
                    setSpecialtyForm(emptySpecialtyForm);
                  }}
                  style={ui.secondaryButton}
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
            </div>
          </form>

          <div style={styles.listWrap}>
            {specialties.map((specialty) => (
              <div key={specialty.id} style={ui.listCard}>
                <strong style={styles.itemTitle}>{specialty.name}</strong>
                <p style={styles.itemText}>
                  {specialty.description ||
                    "Chuyên khoa này chưa có mô tả chi tiết."}
                </p>
                <p style={styles.metaText}>
                  Trạng thái:{" "}
                  {specialty.active ? "Đang hoạt động" : "Tạm ẩn khỏi hệ thống"}
                </p>
                <div style={ui.actionRow}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSpecialtyId(specialty.id);
                      setSpecialtyForm({
                        name: specialty.name || "",
                        description: specialty.description || "",
                        active: specialty.active ?? true,
                      });
                    }}
                    style={ui.primaryButton}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSpecialty(specialty.id)}
                    style={ui.dangerButton}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={ui.panel}>
          <div style={styles.sectionHead}>
            <h2 style={ui.sectionTitle}>Danh mục thuốc</h2>
            <p style={ui.sectionHint}>
              Duy trì dữ liệu thuốc dùng cho kê đơn điện tử, bao gồm tên thuốc,
              đơn vị tính, tồn kho và thông tin tham chiếu.
            </p>
          </div>

          <form onSubmit={submitMedicine} style={styles.form}>
            <div style={createAutoGrid(160)}>
              <input
                name="name"
                value={medicineForm.name}
                onChange={(event) =>
                  setMedicineForm((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                placeholder="Tên thuốc"
                style={ui.input}
              />
              <input
                name="unit"
                value={medicineForm.unit}
                onChange={(event) =>
                  setMedicineForm((prev) => ({
                    ...prev,
                    unit: event.target.value,
                  }))
                }
                placeholder="Đơn vị tính"
                style={ui.input}
              />
              <input
                name="stockQuantity"
                value={medicineForm.stockQuantity}
                onChange={(event) =>
                  setMedicineForm((prev) => ({
                    ...prev,
                    stockQuantity: event.target.value,
                  }))
                }
                placeholder="Số lượng tồn kho"
                style={ui.input}
              />
              <input
                name="price"
                value={medicineForm.price}
                onChange={(event) =>
                  setMedicineForm((prev) => ({
                    ...prev,
                    price: event.target.value,
                  }))
                }
                placeholder="Giá tham chiếu"
                style={ui.input}
              />
            </div>
            <textarea
              name="description"
              value={medicineForm.description}
              onChange={(event) =>
                setMedicineForm((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              placeholder="Mô tả ngắn về công dụng, dạng bào chế hoặc lưu ý sử dụng"
              style={ui.textarea}
            />
            <label style={ui.checkboxRow}>
              <input
                type="checkbox"
                checked={medicineForm.active}
                onChange={(event) =>
                  setMedicineForm((prev) => ({
                    ...prev,
                    active: event.target.checked,
                  }))
                }
              />
              Kích hoạt thuốc trên danh mục kê đơn
            </label>
            <div style={ui.actionRow}>
              <button type="submit" style={ui.primaryButton}>
                {editingMedicineId ? "Cập nhật thuốc" : "Tạo thuốc mới"}
              </button>
              {editingMedicineId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingMedicineId(null);
                    setMedicineForm(emptyMedicineForm);
                  }}
                  style={ui.secondaryButton}
                >
                  Hủy chỉnh sửa
                </button>
              ) : null}
            </div>
          </form>

          <div style={styles.listWrap}>
            {medicines.map((medicine) => (
              <div key={medicine.id} style={ui.listCard}>
                <strong style={styles.itemTitle}>{medicine.name}</strong>
                <p style={styles.itemText}>
                  {medicine.unit || "Chưa có đơn vị"} | Tồn kho:{" "}
                  {medicine.stockQuantity ?? 0} | Giá:{" "}
                  {medicine.price || "Chưa cập nhật"}
                </p>
                <p style={styles.itemText}>
                  {medicine.description || "Thuốc này chưa có mô tả chi tiết."}
                </p>
                <p style={styles.metaText}>
                  Trạng thái:{" "}
                  {medicine.active ? "Đang hoạt động" : "Tạm ẩn khỏi danh mục"}
                </p>
                <div style={ui.actionRow}>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMedicineId(medicine.id);
                      setMedicineForm({
                        name: medicine.name || "",
                        unit: medicine.unit || "",
                        stockQuantity: medicine.stockQuantity ?? "",
                        price: medicine.price || "",
                        description: medicine.description || "",
                        active: medicine.active ?? true,
                      });
                    }}
                    style={ui.primaryButton}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMedicine(medicine.id)}
                    style={ui.dangerButton}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: "20px",
  },
  sectionHead: {
    display: "grid",
    gap: "6px",
  },
  form: {
    display: "grid",
    gap: "14px",
  },
  listWrap: {
    display: "grid",
    gap: "12px",
  },
  itemTitle: {
    color: "#16324f",
    fontSize: "18px",
  },
  itemText: {
    margin: "6px 0 0",
    color: "#5c7894",
    lineHeight: 1.6,
  },
  metaText: {
    margin: "4px 0 0",
    color: "#6f879f",
    fontSize: "14px",
  },
};

export default AdminCatalogPage;
