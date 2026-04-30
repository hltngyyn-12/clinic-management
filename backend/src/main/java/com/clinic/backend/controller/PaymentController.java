package com.clinic.backend.controller;

import com.clinic.backend.dto.common.ApiResponse;
import com.clinic.backend.service.PaymentService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/api/patient/appointments/{appointmentId}/deposit/mock")
    public ResponseEntity<?> createMockPayment(@PathVariable Long appointmentId, Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Khởi tạo thanh toán mô phỏng thành công",
                paymentService.createMockPayment(authentication.getName(), appointmentId)
        ));
    }

    @PostMapping("/api/patient/appointments/{appointmentId}/deposit/momo")
    public ResponseEntity<?> createMomoPayment(@PathVariable Long appointmentId, Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Khởi tạo thanh toán MoMo thành công",
                paymentService.createMomoPayment(authentication.getName(), appointmentId)
        ));
    }

    @GetMapping("/api/patient/invoices/{appointmentId}")
    public ResponseEntity<?> getAppointmentInvoice(@PathVariable Long appointmentId, Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy hóa đơn thành công",
                paymentService.getAppointmentInvoice(authentication.getName(), appointmentId)
        ));
    }

    @GetMapping("/api/payments/momo/return")
    public void handleMomoReturn(@RequestParam Map<String, String> params, HttpServletResponse response) throws IOException {
        response.sendRedirect(paymentService.handleMomoRedirect(params));
    }

    @PostMapping("/api/payments/momo/ipn")
    public ResponseEntity<Void> handleMomoIpn(@RequestBody Map<String, Object> payload) {
        paymentService.handleMomoIpn(payload);
        return ResponseEntity.noContent().build();
    }
}
