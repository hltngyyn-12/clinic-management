package com.clinic.backend.controller;

import com.clinic.backend.entity.Appointment;
import com.clinic.backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

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

    @GetMapping("/me")
    public ResponseEntity<?> myAppointments(@RequestParam Long userId) {
        return ResponseEntity.ok(
                Appointment.getMyAppointments(userId)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(@PathVariable Long id) {
        appointmentService.cancel(id);
        return ResponseEntity.ok("Cancelled");
    }
}