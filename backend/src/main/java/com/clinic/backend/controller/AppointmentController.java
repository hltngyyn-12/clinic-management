package com.clinic.backend.controller;

import com.clinic.backend.dto.common.ApiResponse;
import com.clinic.backend.service.PatientPortalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final PatientPortalService patientPortalService;

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/me")
    public ResponseEntity<?> myAppointments(Authentication authentication) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy lịch khám thành công",
                patientPortalService.getAppointments(authentication.getName())
        ));
    }
}
