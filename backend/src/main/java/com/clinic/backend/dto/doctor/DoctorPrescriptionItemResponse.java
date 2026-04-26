package com.clinic.backend.dto.doctor;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DoctorPrescriptionItemResponse {
    private Long id;
    private Long medicalRecordId;
    private Long medicineId;
    private String medicineName;
    private String dosage;
    private String frequency;
    private String duration;
    private String instructions;
}
