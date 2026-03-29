package com.clinic.backend.service.impl;

import com.clinic.backend.entity.*;
import com.clinic.backend.repository.*;
import com.clinic.backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public Appointment create(Long userId, Long doctorId, LocalDate date, LocalTime time, String reason) {

        // ❌ validate null
        if (date == null || time == null) {
            throw new RuntimeException("Date/time required");
        }

        // ❌ không cho đặt quá khứ
        if (date.isBefore(LocalDate.now())) {
            throw new RuntimeException("Cannot book in the past");
        }

        // ❌ check trùng lịch
        boolean exists = appointmentRepository
                .existsByDoctorIdAndAppointmentDateAndSlotTime(doctorId, date, time);

        if (exists) {
            throw new RuntimeException("Doctor already booked at this time");
        }

        Patient patient = patientRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment ap = new Appointment();
        ap.setPatient(patient);
        ap.setDoctor(doctor);
        ap.setAppointmentDate(date);
        ap.setSlotTime(time);
        ap.setReason(reason);
        ap.setStatus("BOOKED");

        return appointmentRepository.save(ap);
    }

    @Override
    public List<Appointment> getMyAppointments(Long userId) {
        return appointmentRepository.findByPatientId(userId);
    }

    @Override
    public void cancel(Long id) {
        Appointment ap = appointmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        ap.setStatus("CANCELLED");
        appointmentRepository.save(ap);
    }
}