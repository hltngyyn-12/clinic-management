package com.clinic.backend.dto.test;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateTestRequest {

    @NotNull
    private Long medicalRecordId;

    @NotBlank
    private String testName;
}