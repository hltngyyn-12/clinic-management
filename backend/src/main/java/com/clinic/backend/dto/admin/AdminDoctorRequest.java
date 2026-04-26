package com.clinic.backend.dto.admin;

import lombok.Data;

@Data
public class AdminDoctorRequest {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String phone;
    private Long specialtyId;
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
