package com.clinic.backend.repository;

import com.clinic.backend.entity.AppointmentInvoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppointmentInvoiceRepository extends JpaRepository<AppointmentInvoice, Long> {
    Optional<AppointmentInvoice> findByAppointmentId(Long appointmentId);
}
