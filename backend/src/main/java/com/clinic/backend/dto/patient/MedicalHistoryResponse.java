package com.clinic.backend.dto.patient;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MedicalHistoryResponse {
    private Long id;
    private Long appointmentId;
    private Long doctorId;
    private String doctorName;
    private String diagnosis;
    private String notes;
    private String createdAt;
}
