package com.clinic.backend.dto.doctor;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DoctorTestItemResponse {
    private Long testRequestId;
    private Long medicalRecordId;
    private String testName;
    private String status;
    private String result;
    private String conclusion;
}
