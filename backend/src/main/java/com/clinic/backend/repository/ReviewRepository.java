package com.clinic.backend.repository;

import com.clinic.backend.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByPatientUserUsernameOrderByCreatedAtDesc(String username);

    List<Review> findByDoctorIdOrderByCreatedAtDesc(Long doctorId);

    Optional<Review> findByAppointmentIdAndPatientUserUsername(Long appointmentId, String username);

    boolean existsByAppointmentIdAndPatientUserUsername(Long appointmentId, String username);

    @Query("select avg(r.rating) from Review r where r.doctor.id = :doctorId")
    Double findAverageRatingByDoctorId(Long doctorId);
}
