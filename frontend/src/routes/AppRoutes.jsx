import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

// NEW pages 29.03
import DoctorListPage from "../pages/DoctorListPage";
import BookingPage from "../pages/BookingPage";
import MyAppointmentsPage from "../pages/MyAppointmentsPage";
import MedicalRecordPage from "../pages/MedicalRecordPage";

//12.04
import CreateMedicalRecordPage from "../pages/CreateMedicalRecordPage";

// dashboard tạm
function PatientPage() {
  return <h2>Patient Dashboard</h2>;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>

          {/* PUBLIC */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* DASHBOARD */}
          <Route path="dashboard" element={<DashboardLayout />} />

          {/* PATIENT */}
          <Route path="patient" element={<PatientPage />} />
          <Route path="medical-records" element={<MedicalRecordPage />} />
          <Route path="doctor/create-record" element={<CreateMedicalRecordPage />} />

          {/* BOOKING FLOW */}
          <Route path="doctors" element={<DoctorListPage />} />
          <Route path="booking/:doctorId" element={<BookingPage />} />
          <Route path="appointments" element={<MyAppointmentsPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;