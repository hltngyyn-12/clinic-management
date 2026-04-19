import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DoctorListPage from "../pages/DoctorListPage";
import BookingPage from "../pages/BookingPage";
import MyAppointmentsPage from "../pages/MyAppointmentsPage";
import MedicalRecordPage from "../pages/MedicalRecordPage";
import CreateMedicalRecordPage from "../pages/CreateMedicalRecordPage";

function PatientPage() {
  return <h2>Patient Dashboard</h2>;
}

function getRoleFromStorage() {
  try {
    const rawUser = localStorage.getItem("user");
    const savedRole = localStorage.getItem("role");

    if (!rawUser && savedRole) return savedRole.toUpperCase();

    const user = rawUser ? JSON.parse(rawUser) : null;

    const role =
      user?.role ||
      user?.roles?.[0] ||
      user?.authorities?.[0]?.replace("ROLE_", "") ||
      savedRole;

    return role ? String(role).toUpperCase() : null;
  } catch (error) {
    console.error("Không đọc được role từ localStorage:", error);
    return null;
  }
}

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ children, allow }) {
  const token = localStorage.getItem("token");
  const role = getRoleFromStorage();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!role || !allow.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />

          <Route
            path="patient"
            element={
              <RoleRoute allow={["PATIENT"]}>
                <PatientPage />
              </RoleRoute>
            }
          />

          <Route
            path="medical-records"
            element={
              <RoleRoute allow={["DOCTOR", "PATIENT", "ADMIN"]}>
                <MedicalRecordPage />
              </RoleRoute>
            }
          />

          <Route
            path="doctor/create-record"
            element={
              <RoleRoute allow={["DOCTOR"]}>
                <CreateMedicalRecordPage />
              </RoleRoute>
            }
          />

          <Route
            path="doctors"
            element={
              <ProtectedRoute>
                <DoctorListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="booking/:doctorId"
            element={
              <RoleRoute allow={["PATIENT"]}>
                <BookingPage />
              </RoleRoute>
            }
          />

          <Route
            path="appointments"
            element={
              <RoleRoute allow={["PATIENT"]}>
                <MyAppointmentsPage />
              </RoleRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
