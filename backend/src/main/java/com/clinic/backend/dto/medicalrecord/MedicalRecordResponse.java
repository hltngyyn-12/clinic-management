package com.clinic.backend.dto.medicalrecord;

import java.time.LocalDate;

import lombok.Data;

@Data
public class MedicalRecordResponse {
    private Long id;
    private String diagnosis;
    private String notes;
    private String doctorName;
    private String patientName;
    private LocalDate createdAt;
}