package com.clinic.backend.dto.patient;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AppointmentBookingRequest {

    @NotNull
    private Long doctorId;

    @NotBlank
    private String date;

    @NotBlank
    private String time;

    private String reason;
}
