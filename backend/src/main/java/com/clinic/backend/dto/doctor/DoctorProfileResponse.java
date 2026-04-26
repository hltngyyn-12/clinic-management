package com.clinic.backend.dto.doctor;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DoctorProfileResponse {
    private Long doctorId;
    private String username;
    private String email;
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
    private Boolean active;
}
