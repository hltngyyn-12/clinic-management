package com.clinic.backend.service;

import com.clinic.backend.dto.medicalrecord.MedicalRecordResponse;

public interface MedicalRecordService {

    MedicalRecordResponse create(Long appointmentId, String diagnosis, String notes);

    MedicalRecordResponse getByIdForCurrentUser(Long recordId, String username, String role);
}
