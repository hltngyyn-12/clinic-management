package com.clinic.backend.controller;

import com.clinic.backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // ✅ FIX SECURITY (KHÔNG dùng userId nữa)
    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody Map<String, String> req,
            Authentication authentication
    ) {

        String username = authentication.getName();

        Long doctorId = Long.parseLong(req.get("doctorId"));
        LocalDate date = LocalDate.parse(req.get("date"));
        LocalTime time = LocalTime.parse(req.get("time"));
        String reason = req.get("reason");

        return ResponseEntity.ok(
                appointmentService.createByUsername(username, doctorId, date, time, reason)
        );
    }

    // giữ nguyên
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/me")
    public ResponseEntity<?> myAppointments(@RequestParam Long userId) {
        return ResponseEntity.ok(
                appointmentService.getMyAppointments(userId)
        );
    }

    @PreAuthorize("hasRole('PATIENT')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        appointmentService.cancel(id);
        return ResponseEntity.ok("Cancelled");
    }
}