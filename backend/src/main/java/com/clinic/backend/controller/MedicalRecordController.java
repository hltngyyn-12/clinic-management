package com.clinic.backend.controller;

import com.clinic.backend.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/medical-records")
@RequiredArgsConstructor
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    @PostMapping
    @PreAuthorize("hasRole('DOCTOR')")
    public ResponseEntity<?> create(@RequestBody Map<String, String> req) {

        Long appointmentId = Long.parseLong(req.get("appointmentId"));
        String diagnosis = req.get("diagnosis");
        String notes = req.get("notes");

        return ResponseEntity.ok(
                medicalRecordService.create(appointmentId, diagnosis, notes)
        );
    }
}