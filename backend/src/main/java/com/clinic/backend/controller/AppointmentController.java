package com.clinic.backend.controller;

import com.clinic.backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    // ✅ chỉ PATIENT được tạo
    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, String> req) {

        Long userId = Long.parseLong(req.get("userId"));
        Long doctorId = Long.parseLong(req.get("doctorId"));

        LocalDate date = LocalDate.parse(req.get("date"));
        LocalTime time = LocalTime.parse(req.get("time"));

        String reason = req.get("reason");

        return ResponseEntity.ok(
                appointmentService.create(userId, doctorId, date, time, reason)
        );
    }

    // ✅ chỉ PATIENT xem lịch của mình
    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/me")
    public ResponseEntity<?> myAppointments(@RequestParam Long userId) {
        return ResponseEntity.ok(
                appointmentService.getMyAppointments(userId)
        );
    }

    // ✅ chỉ PATIENT được hủy
    @PreAuthorize("hasRole('PATIENT')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        appointmentService.cancel(id);
        return ResponseEntity.ok("Cancelled");
    }
}