package com.clinic.backend.dto.patient;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PatientPrescriptionResponse {
    private Long id;
    private Long medicalRecordId;
    private String doctorName;
    private String medicineName;
    private String dosage;
    private String instructions;
}
