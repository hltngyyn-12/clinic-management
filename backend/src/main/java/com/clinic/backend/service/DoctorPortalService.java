package com.clinic.backend.service;

import com.clinic.backend.dto.doctor.*;
import com.clinic.backend.dto.medicalrecord.CreateMedicalRecordRequest;
import com.clinic.backend.dto.medicalrecord.MedicalRecordResponse;
import com.clinic.backend.dto.prescription.CreatePrescriptionRequest;
import com.clinic.backend.dto.test.CreateTestRequest;

import java.util.List;

public interface DoctorPortalService {
    List<DoctorAppointmentResponse> getTodayAppointments(String username);
    MedicalRecordResponse createMedicalRecord(String username, CreateMedicalRecordRequest request);
    DoctorPrescriptionItemResponse createPrescription(String username, CreatePrescriptionRequest request);
    DoctorTestItemResponse createTestRequest(String username, CreateTestRequest request);
    DoctorPatientHistoryResponse getPatientHistory(String username, Long patientId);
    DoctorProfileResponse getProfile(String username);
    DoctorProfileResponse updateProfile(String username, UpdateDoctorProfileRequest request);
    List<MedicineOptionResponse> getMedicines();
}
