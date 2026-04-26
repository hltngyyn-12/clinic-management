package com.clinic.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SpecialtyResponse {
    private Long id;
    private String name;
    private String description;
    private Boolean active;
}
