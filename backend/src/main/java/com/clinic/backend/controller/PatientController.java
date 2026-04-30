package com.clinic.backend.controller;

import com.clinic.backend.dto.common.ApiResponse;
import com.clinic.backend.dto.patient.AppointmentBookingRequest;
import com.clinic.backend.dto.patient.CreateReviewRequest;
import com.clinic.backend.dto.patient.DepositPaymentRequest;
import com.clinic.backend.dto.patient.UpdatePatientProfileRequest;
import com.clinic.backend.service.PatientPortalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient")
@RequiredArgsConstructor
public class PatientController {

    private final PatientPortalService patientPortalService;

    @GetMapping("/doctors")
    public ResponseEntity<?> getDoctors() {
        return ResponseEntity.ok(new ApiResponse<>(true, "Lấy danh sách bác sĩ thành công", patientPortalService.getDoctors()));
    }

    @PostMapping("/appointments")
    public ResponseEntity<?> bookAppointment(
            @Valid @RequestBody AppointmentBookingRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Đặt lịch khám thành công",
                patientPortalService.bookAppointment(authentication.getName(), request)
        ));
    }

    @PutMapping("/appointments/{appointmentId}/deposit")
    public ResponseEntity<?> payDeposit(
            @PathVariable Long appointmentId,
            @Valid @RequestBody DepositPaymentRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Thanh toán đặt cọc thành công",
                patientPortalService.payDeposit(authentication.getName(), appointmentId, request)
        ));
    }

    @GetMapping("/appointments")
    public ResponseEntity<?> getAppointments(Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy lịch khám thành công",
                patientPortalService.getAppointments(authentication.getName())
        ));
    }

    @GetMapping("/medical-history")
    public ResponseEntity<?> getMedicalHistory(Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy lịch sử khám bệnh thành công",
                patientPortalService.getMedicalHistory(authentication.getName())
        ));
    }

    @GetMapping("/prescriptions")
    public ResponseEntity<?> getPrescriptions(Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy đơn thuốc thành công",
                patientPortalService.getPrescriptions(authentication.getName())
        ));
    }

    @GetMapping("/test-results")
    public ResponseEntity<?> getTestResults(Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy kết quả xét nghiệm thành công",
                patientPortalService.getTestResults(authentication.getName())
        ));
    }

    @PostMapping("/reviews")
    public ResponseEntity<?> createReview(
            @Valid @RequestBody CreateReviewRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Đánh giá bác sĩ thành công",
                patientPortalService.createReview(authentication.getName(), request)
        ));
    }

    @GetMapping("/reviews")
    public ResponseEntity<?> getMyReviews(Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy danh sách đánh giá thành công",
                patientPortalService.getMyReviews(authentication.getName())
        ));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy hồ sơ bệnh nhân thành công",
                patientPortalService.getProfile(authentication.getName())
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody UpdatePatientProfileRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Cập nhật hồ sơ bệnh nhân thành công",
                patientPortalService.updateProfile(authentication.getName(), request)
        ));
    }
}
