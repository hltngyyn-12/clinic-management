package com.clinic.backend.service;

import com.clinic.backend.entity.MedicalRecord;

public interface MedicalRecordService {

    MedicalRecord create(Long appointmentId, String diagnosis, String notes);
}