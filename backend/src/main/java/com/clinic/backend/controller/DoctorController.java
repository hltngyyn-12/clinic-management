package com.clinic.backend.controller;

import com.clinic.backend.dto.common.ApiResponse;
import com.clinic.backend.service.PatientPortalService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
@RequiredArgsConstructor
public class DoctorController {

    private final PatientPortalService patientPortalService;

    @GetMapping
    public ResponseEntity<?> getAllDoctors() {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy danh sách bác sĩ thành công",
                patientPortalService.getDoctors()
        ));
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<?> getDoctorSlots(
            @PathVariable Long id,
            @RequestParam String date
    ) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy slot khám thành công",
                patientPortalService.getAvailableSlots(id, date)
        ));
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<?> getDoctorReviews(@PathVariable Long id) {
        return ResponseEntity.ok(new ApiResponse<>(
                true,
                "Lấy đánh giá bác sĩ thành công",
                patientPortalService.getDoctorReviews(id)
        ));
    }

    @GetMapping("/test")
    public String testDoctor() {
        return "DOCTOR OK";
    }
}
