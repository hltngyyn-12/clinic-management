package com.clinic.backend.dto.patient;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DoctorOptionResponse {
    private Long id;
    private String name;
    private String specialty;
    private Integer experience;
    private Double averageRating;
}
