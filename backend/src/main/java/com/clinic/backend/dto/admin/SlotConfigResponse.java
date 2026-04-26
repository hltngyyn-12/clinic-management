package com.clinic.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SlotConfigResponse {
    private Long id;
    private String name;
    private String workingStart;
    private String workingEnd;
    private Integer slotDurationMinutes;
    private String notes;
    private Boolean active;
}
