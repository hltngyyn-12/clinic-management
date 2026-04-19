package com.clinic.backend.dto.medicalrecord;

import lombok.Data;

@Data
public class MedicalRecordResponse {
    private Long id;
    private String diagnosis;
    private String notes;
    private String doctorName;
    private String patientName;
}