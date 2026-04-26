package com.clinic.backend.dto.patient;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppointmentResponse {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private String specialty;
    private String appointmentDate;
    private String slotTime;
    private String status;
    private String reason;
    private Double depositAmount;
    private String paymentStatus;
    private boolean reviewSubmitted;
}
