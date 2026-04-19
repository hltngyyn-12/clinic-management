package com.clinic.backend.controller;

import com.clinic.backend.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.clinic.backend.dto.medicalrecord.CreateMedicalRecordRequest;
import jakarta.validation.Valid;
import com.clinic.backend.dto.common.ApiResponse;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> create(@Valid @RequestBody CreateMedicalRecordRequest req) {

        var data = medicalRecordService.create(
        req.getAppointmentId(),
        req.getDiagnosis(),
        req.getNotes()
        );

        return ResponseEntity.ok(
        new ApiResponse<>(true, "Tạo hồ sơ thành công", data)
);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DOCTOR', 'PATIENT', 'ADMIN')")
    public ResponseEntity<?> getById(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        String role = authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "");

        var data = medicalRecordService.getByIdForCurrentUser(id, username, role);

        return ResponseEntity.ok(
                new ApiResponse<>(true, "Lấy hồ sơ thành công", data)
        );
    }
}
