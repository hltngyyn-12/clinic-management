import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DoctorListPage from "../pages/DoctorListPage";
import MyAppointmentsPage from "../pages/MyAppointmentsPage";
import MedicalRecordPage from "../pages/MedicalRecordPage";
import CreateMedicalRecordPage from "../pages/CreateMedicalRecordPage";
import PrescriptionsPage from "../pages/PrescriptionsPage";
import TestResultsPage from "../pages/TestResultsPage";
import MyReviewsPage from "../pages/MyReviewsPage";
import PatientProfilePage from "../pages/PatientProfilePage";
import PaymentResultPage from "../pages/PaymentResultPage";
import InvoicePage from "../pages/InvoicePage";
import DoctorWorkspacePage from "../pages/DoctorWorkspacePage";
import DoctorProfilePage from "../pages/DoctorProfilePage";
import AdminDoctorsPage from "../pages/AdminDoctorsPage";
import AdminCatalogPage from "../pages/AdminCatalogPage";
import AdminOperationsPage from "../pages/AdminOperationsPage";

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
            path="doctors"
            element={
              <RoleRoute allow={["PATIENT"]}>
                <DoctorListPage />
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
          <Route
            path="patient/profile"
            element={
              <RoleRoute allow={["PATIENT"]}>
                <PatientProfilePage />
              </RoleRoute>
            }
          />
          <Route
            path="payment/momo-result"
            element={
              <RoleRoute allow={["PATIENT"]}>
                <PaymentResultPage />
              </RoleRoute>
            }
          />
          <Route
            path="invoices/:appointmentId"
            element={
              <RoleRoute allow={["PATIENT"]}>
                <InvoicePage />
              </RoleRoute>
            }
          />
          <Route
            path="medical-records"
            element={
              <RoleRoute allow={["PATIENT"]}>
                <MedicalRecordPage />
              </RoleRoute>
            }
          />
          <Route
            path="prescriptions"
            element={
              <RoleRoute allow={["PATIENT"]}>
                <PrescriptionsPage />
              </RoleRoute>
            }
          />
          <Route
            path="test-results"
            element={
              <RoleRoute allow={["PATIENT"]}>
                <TestResultsPage />
              </RoleRoute>
            }
          />
          <Route
            path="reviews"
            element={
              <RoleRoute allow={["PATIENT"]}>
                <MyReviewsPage />
              </RoleRoute>
            }
          />
          <Route
            path="doctor/workspace"
            element={
              <RoleRoute allow={["DOCTOR"]}>
                <DoctorWorkspacePage />
              </RoleRoute>
            }
          />
          <Route
            path="doctor/profile"
            element={
              <RoleRoute allow={["DOCTOR"]}>
                <DoctorProfilePage />
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
            path="admin/doctors"
            element={
              <RoleRoute allow={["ADMIN"]}>
                <AdminDoctorsPage />
              </RoleRoute>
            }
          />
          <Route
            path="admin/catalog"
            element={
              <RoleRoute allow={["ADMIN"]}>
                <AdminCatalogPage />
              </RoleRoute>
            }
          />
          <Route
            path="admin/operations"
            element={
              <RoleRoute allow={["ADMIN"]}>
                <AdminOperationsPage />
              </RoleRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Navigate to="/" replace />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
