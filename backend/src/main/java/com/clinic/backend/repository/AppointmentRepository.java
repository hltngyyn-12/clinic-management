package com.clinic.backend.repository;

import com.clinic.backend.entity.Appointment;
import com.clinic.backend.repository.projection.RevenueDailyProjection;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByDoctorIdAndAppointmentDate(Long doctorId, LocalDate appointmentDate);

    List<Appointment> findByPatientUserUsernameOrderByAppointmentDateDescSlotTimeDesc(String username);

    List<Appointment> findByDoctorUserUsernameAndAppointmentDateOrderBySlotTimeAsc(String username, LocalDate appointmentDate);

    List<Appointment> findByPatientIdOrderByAppointmentDateDescSlotTimeDesc(Long patientId);

    List<Appointment> findByDoctorIdOrderByAppointmentDateDescSlotTimeDesc(Long doctorId);

    List<Appointment> findByAppointmentDateBetweenOrderByAppointmentDateAsc(LocalDate startDate, LocalDate endDate);

    @Query(value = """
            select
                appointment_date as appointmentDate,
                count(*) as paidAppointments,
                coalesce(sum(deposit_amount), 0) as revenue
            from appointments
            where appointment_date between :startDate and :endDate
              and upper(coalesce(payment_status, '')) = 'PAID'
            group by appointment_date
            order by appointment_date
            """, nativeQuery = true)
    List<RevenueDailyProjection> getDailyRevenueReport(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query(value = """
            select count(*)
            from appointments
            where appointment_date between :startDate and :endDate
            """, nativeQuery = true)
    long countAppointmentsInRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query(value = """
            select count(*)
            from appointments
            where appointment_date between :startDate and :endDate
              and upper(coalesce(payment_status, '')) = 'PAID'
            """, nativeQuery = true)
    long countPaidAppointmentsInRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query(value = """
            select coalesce(sum(deposit_amount), 0)
            from appointments
            where appointment_date between :startDate and :endDate
              and upper(coalesce(payment_status, '')) = 'PAID'
            """, nativeQuery = true)
    Double sumRevenueInRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    boolean existsByDoctorIdAndAppointmentDateAndSlotTime(
            Long doctorId,
            LocalDate appointmentDate,
            LocalTime slotTime
    );
}
