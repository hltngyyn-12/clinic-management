import { useEffect, useState } from "react";
import api, { getErrorMessage } from "../services/api";

const emptySpecialtyForm = { name: "", description: "", active: true };
const emptyMedicineForm = { name: "", unit: "", stockQuantity: "", price: "", description: "", active: true };

function AdminCatalogPage() {
  const [specialties, setSpecialties] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [specialtyForm, setSpecialtyForm] = useState(emptySpecialtyForm);
  const [medicineForm, setMedicineForm] = useState(emptyMedicineForm);
  const [editingSpecialtyId, setEditingSpecialtyId] = useState(null);
  const [editingMedicineId, setEditingMedicineId] = useState(null);

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
      alert(getErrorMessage(error, "Failed to load admin catalog"));
    }
  };

  const submitSpecialty = async (event) => {
    event.preventDefault();
    try {
      if (editingSpecialtyId) {
        await api.put(`/api/admin/specialties/${editingSpecialtyId}`, specialtyForm);
        alert("Specialty updated successfully");
      } else {
        await api.post("/api/admin/specialties", specialtyForm);
        alert("Specialty created successfully");
      }
      setSpecialtyForm(emptySpecialtyForm);
      setEditingSpecialtyId(null);
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Failed to save specialty"));
    }
  };

  const submitMedicine = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...medicineForm,
        stockQuantity: medicineForm.stockQuantity === "" ? null : Number(medicineForm.stockQuantity),
      };
      if (editingMedicineId) {
        await api.put(`/api/admin/medicines/${editingMedicineId}`, payload);
        alert("Medicine updated successfully");
      } else {
        await api.post("/api/admin/medicines", payload);
        alert("Medicine created successfully");
      }
      setMedicineForm(emptyMedicineForm);
      setEditingMedicineId(null);
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Failed to save medicine"));
    }
  };

  const deleteSpecialty = async (id) => {
    if (!window.confirm("Delete this specialty?")) return;
    try {
      await api.delete(`/api/admin/specialties/${id}`);
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Failed to delete specialty"));
    }
  };

  const deleteMedicine = async (id) => {
    if (!window.confirm("Delete this medicine?")) return;
    try {
      await api.delete(`/api/admin/medicines/${id}`);
      await loadData();
    } catch (error) {
      alert(getErrorMessage(error, "Failed to delete medicine"));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div>
          <div style={styles.eyebrow}>ADMIN CATALOG</div>
          <h1 style={styles.title}>Manage Specialties And Medicines</h1>
          <p style={styles.subtitle}>
            Admin features 2 and 3: CRUD for specialty catalog and medicine catalog.
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Specialties</h2>
          <form onSubmit={submitSpecialty} style={styles.form}>
            <input
              name="name"
              value={specialtyForm.name}
              onChange={(e) => setSpecialtyForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Specialty name"
              style={styles.input}
            />
            <textarea
              name="description"
              value={specialtyForm.description}
              onChange={(e) => setSpecialtyForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              style={styles.textarea}
            />
            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={specialtyForm.active}
                onChange={(e) => setSpecialtyForm((prev) => ({ ...prev, active: e.target.checked }))}
              />
              Active specialty
            </label>
            <div style={styles.actionRow}>
              <button type="submit" style={styles.primaryButton}>
                {editingSpecialtyId ? "Update Specialty" : "Create Specialty"}
              </button>
              {editingSpecialtyId ? (
                <button type="button" onClick={() => { setEditingSpecialtyId(null); setSpecialtyForm(emptySpecialtyForm); }} style={styles.secondaryButton}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div style={styles.cardStack}>
            {specialties.map((specialty) => (
              <div key={specialty.id} style={styles.listCard}>
                <strong>{specialty.name}</strong>
                <p style={styles.listText}>{specialty.description || "No description"}</p>
                <div style={styles.actionRow}>
                  <button type="button" onClick={() => { setEditingSpecialtyId(specialty.id); setSpecialtyForm({ name: specialty.name || "", description: specialty.description || "", active: specialty.active ?? true }); }} style={styles.primaryButton}>
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteSpecialty(specialty.id)} style={styles.dangerButton}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={styles.panel}>
          <h2 style={styles.sectionTitle}>Medicines</h2>
          <form onSubmit={submitMedicine} style={styles.form}>
            <div style={styles.formGrid}>
              <input name="name" value={medicineForm.name} onChange={(e) => setMedicineForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Medicine name" style={styles.input} />
              <input name="unit" value={medicineForm.unit} onChange={(e) => setMedicineForm((prev) => ({ ...prev, unit: e.target.value }))} placeholder="Unit" style={styles.input} />
              <input name="stockQuantity" value={medicineForm.stockQuantity} onChange={(e) => setMedicineForm((prev) => ({ ...prev, stockQuantity: e.target.value }))} placeholder="Stock quantity" style={styles.input} />
              <input name="price" value={medicineForm.price} onChange={(e) => setMedicineForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="Price" style={styles.input} />
            </div>
            <textarea
              name="description"
              value={medicineForm.description}
              onChange={(e) => setMedicineForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Description"
              style={styles.textarea}
            />
            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={medicineForm.active}
                onChange={(e) => setMedicineForm((prev) => ({ ...prev, active: e.target.checked }))}
              />
              Active medicine
            </label>
            <div style={styles.actionRow}>
              <button type="submit" style={styles.primaryButton}>
                {editingMedicineId ? "Update Medicine" : "Create Medicine"}
              </button>
              {editingMedicineId ? (
                <button type="button" onClick={() => { setEditingMedicineId(null); setMedicineForm(emptyMedicineForm); }} style={styles.secondaryButton}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>

          <div style={styles.cardStack}>
            {medicines.map((medicine) => (
              <div key={medicine.id} style={styles.listCard}>
                <strong>{medicine.name}</strong>
                <p style={styles.listText}>
                  {medicine.unit || "N/A"} | stock {medicine.stockQuantity ?? 0} | price {medicine.price || "N/A"}
                </p>
                <p style={styles.listText}>{medicine.description || "No description"}</p>
                <div style={styles.actionRow}>
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
                    style={styles.primaryButton}
                  >
                    Edit
                  </button>
                  <button type="button" onClick={() => deleteMedicine(medicine.id)} style={styles.dangerButton}>
                    Delete
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

export default AdminCatalogPage;

const styles = {
  page: { display: "grid", gap: "24px" },
  hero: { background: "linear-gradient(135deg, #0f172a, #155e75)", color: "#fff", borderRadius: "28px", padding: "34px" },
  eyebrow: { display: "inline-flex", borderRadius: "999px", background: "rgba(255,255,255,0.15)", padding: "8px 12px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em" },
  title: { margin: "16px 0 0", fontSize: "36px" },
  subtitle: { margin: "14px 0 0", maxWidth: "760px", color: "#dbeafe", lineHeight: 1.6 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "20px" },
  panel: { background: "#fff", borderRadius: "24px", padding: "22px", boxShadow: "0 14px 32px rgba(15, 23, 42, 0.08)", display: "grid", gap: "18px" },
  sectionTitle: { margin: 0, color: "#0f172a" },
  form: { display: "grid", gap: "12px" },
  formGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px" },
  input: { width: "100%", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", background: "#fff" },
  textarea: { width: "100%", minHeight: "100px", border: "1px solid #cbd5e1", borderRadius: "12px", padding: "12px 14px", fontSize: "14px", resize: "vertical", background: "#fff" },
  checkboxRow: { display: "flex", alignItems: "center", gap: "10px", color: "#0f172a", fontWeight: 600 },
  actionRow: { display: "flex", gap: "10px", flexWrap: "wrap" },
  cardStack: { display: "grid", gap: "12px" },
  listCard: { border: "1px solid #dbeafe", borderRadius: "16px", padding: "14px", display: "grid", gap: "10px" },
  listText: { margin: 0, color: "#475569", lineHeight: 1.5 },
  primaryButton: { border: "none", borderRadius: "12px", background: "#0f766e", color: "#fff", padding: "12px 16px", fontWeight: 800, cursor: "pointer" },
  secondaryButton: { border: "1px solid #cbd5e1", borderRadius: "12px", background: "#fff", color: "#0f172a", padding: "12px 16px", fontWeight: 700, cursor: "pointer" },
  dangerButton: { border: "none", borderRadius: "12px", background: "#dc2626", color: "#fff", padding: "12px 16px", fontWeight: 800, cursor: "pointer" },
};
