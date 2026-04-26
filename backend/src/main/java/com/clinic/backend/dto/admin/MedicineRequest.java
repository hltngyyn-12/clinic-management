package com.clinic.backend.dto.admin;

import lombok.Data;

@Data
public class MedicineRequest {
    private String name;
    private String unit;
    private Integer stockQuantity;
    private String price;
    private String description;
    private Boolean active;
}
