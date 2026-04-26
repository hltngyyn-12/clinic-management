package com.clinic.backend.dto.prescription;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreatePrescriptionRequest {

    @NotNull
    private Long medicalRecordId;

    @NotBlank
    private String medicineName;

    @NotNull
    private Long medicineId;

    @NotBlank
    private String dosage;

    private String frequency;
    private String duration;
    private String instructions;
}
