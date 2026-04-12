package com.clinic.backend.controller;

import com.clinic.backend.dto.prescription.CreatePrescriptionRequest;
import com.clinic.backend.service.PrescriptionService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/prescriptions")
@RequiredArgsConstructor
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreatePrescriptionRequest req) {
        return ResponseEntity.ok(prescriptionService.create(req));
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(prescriptionService.getAll());
    }
}