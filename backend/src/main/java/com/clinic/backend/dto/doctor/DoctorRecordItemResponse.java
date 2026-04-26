package com.clinic.backend.dto.doctor;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DoctorRecordItemResponse {
    private Long id;
    private Long appointmentId;
    private String diagnosis;
    private String symptoms;
    private String notes;
    private String followUpDate;
    private String createdAt;
}
