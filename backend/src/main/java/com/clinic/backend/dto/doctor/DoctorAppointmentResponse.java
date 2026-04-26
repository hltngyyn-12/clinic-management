package com.clinic.backend.dto.doctor;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DoctorAppointmentResponse {
    private Long appointmentId;
    private Long patientId;
    private String patientName;
    private String appointmentDate;
    private String slotTime;
    private String status;
    private String paymentStatus;
    private String reason;
    private Boolean reviewed;
    private Integer reviewRating;
    private String reviewComment;
}
