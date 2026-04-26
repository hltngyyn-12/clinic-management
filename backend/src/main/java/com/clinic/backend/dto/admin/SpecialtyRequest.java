package com.clinic.backend.dto.admin;

import lombok.Data;

@Data
public class SpecialtyRequest {
    private String name;
    private String description;
    private Boolean active;
}
