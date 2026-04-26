package com.clinic.backend.dto.doctor;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DoctorPatientHistoryResponse {
    private Long patientId;
    private String patientName;
    private String gender;
    private String dateOfBirth;
    private String address;
    private String insuranceNumber;
    private List<DoctorRecordItemResponse> records;
    private List<DoctorPrescriptionItemResponse> prescriptions;
    private List<DoctorTestItemResponse> tests;
}
