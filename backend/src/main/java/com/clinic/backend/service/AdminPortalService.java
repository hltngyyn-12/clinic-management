package com.clinic.backend.service;

import com.clinic.backend.dto.admin.*;

import java.util.List;

public interface AdminPortalService {
    List<AdminDoctorResponse> getDoctors();

    AdminDoctorResponse getDoctor(Long doctorId);

    AdminDoctorResponse createDoctor(AdminDoctorRequest request);

    AdminDoctorResponse updateDoctor(Long doctorId, AdminDoctorRequest request);

    void deleteDoctor(Long doctorId);

    List<SpecialtyResponse> getSpecialties();

    SpecialtyResponse createSpecialty(SpecialtyRequest request);

    SpecialtyResponse updateSpecialty(Long specialtyId, SpecialtyRequest request);

    void deleteSpecialty(Long specialtyId);

    List<MedicineResponse> getMedicines();

    MedicineResponse createMedicine(MedicineRequest request);

    MedicineResponse updateMedicine(Long medicineId, MedicineRequest request);

    void deleteMedicine(Long medicineId);

    List<SlotConfigResponse> getSlotConfigs();

    SlotConfigResponse createSlotConfig(SlotConfigRequest request);

    SlotConfigResponse updateSlotConfig(Long slotConfigId, SlotConfigRequest request);

    void deleteSlotConfig(Long slotConfigId);

    RevenueReportResponse getRevenueReport(String startDate, String endDate);

    List<NotificationResponse> getNotifications();

    NotificationResponse createNotification(NotificationRequest request);

    NotificationResponse updateNotification(Long notificationId, NotificationRequest request);

    void deleteNotification(Long notificationId);
}
