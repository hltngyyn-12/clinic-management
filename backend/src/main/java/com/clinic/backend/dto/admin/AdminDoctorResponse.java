package com.clinic.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminDoctorResponse {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private Long specialtyId;
    private String specialtyName;
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
