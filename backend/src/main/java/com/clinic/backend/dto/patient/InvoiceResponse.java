package com.clinic.backend.dto.patient;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class InvoiceResponse {
    private Long invoiceId;
    private String invoiceNumber;
    private Long appointmentId;
    private String patientName;
    private String doctorName;
    private String specialty;
    private String appointmentDate;
    private String slotTime;
    private Double amount;
    private String paymentMethod;
    private String paymentStatus;
    private String transactionRef;
    private String providerTransactionNo;
    private String issuedAt;
}
