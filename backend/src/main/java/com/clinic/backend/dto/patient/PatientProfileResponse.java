package com.clinic.backend.dto.patient;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PatientProfileResponse {
    private Long patientId;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private String dateOfBirth;
    private String gender;
    private String address;
    private String insuranceNumber;
}
