package com.clinic.backend.service;

import com.clinic.backend.entity.Appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentService {

    Appointment create(Long userId, Long doctorId, LocalDate date, LocalTime time, String reason);

    List<Appointment> getMyAppointments(Long userId);

    void cancel(Long id);
}