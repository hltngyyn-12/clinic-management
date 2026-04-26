package com.clinic.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MedicineResponse {
    private Long id;
    private String name;
    private String unit;
    private Integer stockQuantity;
    private String price;
    private String description;
    private Boolean active;
}
