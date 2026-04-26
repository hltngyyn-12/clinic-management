package com.clinic.backend.repository;

import com.clinic.backend.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate appointmentDate);

    List<Appointment> findByPatientUserUsernameOrderByAppointmentDateDescSlotTimeDesc(String username);

    boolean existsByDoctorIdAndAppointmentDateAndSlotTime(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime slotTime
    );
}
