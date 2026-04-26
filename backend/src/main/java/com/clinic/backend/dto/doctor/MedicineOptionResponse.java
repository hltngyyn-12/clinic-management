package com.clinic.backend.dto.doctor;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MedicineOptionResponse {
    private Long id;
    private String name;
    private String unit;
    private Integer stockQuantity;
    private String price;
}
