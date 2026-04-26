package com.clinic.backend.dto.doctor;

import lombok.Data;

@Data
public class UpdateDoctorProfileRequest {
    private String fullName;
    private String phone;
    private String specialty;
    private Integer experience;
    private String degree;
    private String bio;
    private String roomNumber;
    private String workingStart;
    private String workingEnd;
    private Integer slotDurationMinutes;
    private String consultationFee;
}
