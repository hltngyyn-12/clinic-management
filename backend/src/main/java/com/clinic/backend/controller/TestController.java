package com.clinic.backend.controller;

import com.clinic.backend.dto.test.CreateTestRequest;
import com.clinic.backend.service.TestService;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/tests")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody CreateTestRequest req) {
        return ResponseEntity.ok(testService.create(req));
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(testService.getAll());
    }
}