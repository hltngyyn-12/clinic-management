package com.clinic.backend.dto.prescription;

import lombok.Data;

@Data
public class PrescriptionResponse {

    private Long id;
    private String medicineName;
    private String dosage;
    private String instructions;
}