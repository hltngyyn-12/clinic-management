package com.clinic.backend.service;

import com.clinic.backend.dto.patient.InvoiceResponse;
import com.clinic.backend.dto.patient.PaymentInitResponse;

import java.util.Map;

public interface PaymentService {
    PaymentInitResponse createMomoPayment(String username, Long appointmentId);
    String handleMomoRedirect(Map<String, String> params);
    void handleMomoIpn(Map<String, Object> payload);
    InvoiceResponse getAppointmentInvoice(String username, Long appointmentId);
}
