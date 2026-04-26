package com.clinic.backend.dto.patient;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PatientTestResultResponse {
    private Long testRequestId;
    private Long medicalRecordId;
    private String doctorName;
    private String testName;
    private String status;
    private String result;
    private String conclusion;
}
