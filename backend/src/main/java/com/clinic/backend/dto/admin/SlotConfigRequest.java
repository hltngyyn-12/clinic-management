package com.clinic.backend.dto.admin;

import lombok.Data;

@Data
public class SlotConfigRequest {
    private String name;
    private String workingStart;
    private String workingEnd;
    private Integer slotDurationMinutes;
    private String notes;
    private Boolean active;
}
