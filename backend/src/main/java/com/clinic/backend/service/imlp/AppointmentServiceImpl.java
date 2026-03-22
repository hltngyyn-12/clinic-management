package com.clinic.backend.service.imlp;

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

    private final PatientRepository patientRepo;
    private final DoctorRepository doctorRepo;
    private final AppointmentRepository appointmentRepo;

    @Override
    public Appointment create(Long userId, Long doctorId, LocalDate date, LocalTime time, String reason) {

        Patient patient = patientRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Doctor doctor = doctorRepo.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appt = new Appointment();
        appt.setPatient(patient);
        appt.setDoctor(doctor);
        appt.setAppointmentDate(date);
        appt.setSlotTime(time);
        appt.setStatus("PENDING");
        appt.setReason(reason);

        return appointmentRepo.save(appt);
    }

    @Override
    public List<Appointment> getMyAppointments(Long userId) {
        Patient patient = patientRepo.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return appointmentRepo.findByPatientId(patient.getId());
    }

    @Override
    public void cancel(Long id) {
        Appointment appt = appointmentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        appt.setStatus("CANCELLED");
        appointmentRepo.save(appt);
    }
}