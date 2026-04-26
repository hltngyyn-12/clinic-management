package com.clinic.backend.controller;

import com.clinic.backend.dto.common.ApiResponse;
import com.clinic.backend.dto.doctor.UpdateDoctorProfileRequest;
import com.clinic.backend.dto.medicalrecord.CreateMedicalRecordRequest;
import com.clinic.backend.dto.prescription.CreatePrescriptionRequest;
import com.clinic.backend.dto.test.CreateTestRequest;
import com.clinic.backend.service.DoctorPortalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorPortalController {

    private final DoctorPortalService doctorPortalService;

    @GetMapping("/appointments/today")
    public ResponseEntity<?> getTodayAppointments(Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy lịch khám hôm nay thành công",
                doctorPortalService.getTodayAppointments(authentication.getName())
        ));
    }

    @PostMapping("/medical-records")
    public ResponseEntity<?> createMedicalRecord(
            @Valid @RequestBody CreateMedicalRecordRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Tạo hồ sơ bệnh án thành công",
                doctorPortalService.createMedicalRecord(authentication.getName(), request)
        ));
    }

    @PostMapping("/prescriptions")
    public ResponseEntity<?> createPrescription(
            @Valid @RequestBody CreatePrescriptionRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Kê đơn thuốc thành công",
                doctorPortalService.createPrescription(authentication.getName(), request)
        ));
    }

    @PostMapping("/test-requests")
    public ResponseEntity<?> createTestRequest(
            @Valid @RequestBody CreateTestRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Yêu cầu xét nghiệm thành công",
                doctorPortalService.createTestRequest(authentication.getName(), request)
        ));
    }

    @GetMapping("/patients/{patientId}/history")
    public ResponseEntity<?> getPatientHistory(
            @PathVariable Long patientId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy lịch sử bệnh nhân thành công",
                doctorPortalService.getPatientHistory(authentication.getName(), patientId)
        ));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy hồ sơ bác sĩ thành công",
                doctorPortalService.getProfile(authentication.getName())
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateDoctorProfileRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Cập nhật hồ sơ bác sĩ thành công",
                doctorPortalService.updateProfile(authentication.getName(), request)
        ));
    }

    @GetMapping("/medicines")
    public ResponseEntity<?> getMedicines() {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy danh sách thuốc thành công",
                doctorPortalService.getMedicines()
        ));
    }
}
