package com.clinic.backend.dto.patient;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PaymentInitResponse {
    private String provider;
    private Long appointmentId;
    private String transactionRef;
    private String paymentUrl;
}
