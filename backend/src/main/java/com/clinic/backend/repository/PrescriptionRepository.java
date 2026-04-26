package com.clinic.backend.repository;

import com.clinic.backend.entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByMedicalRecordPatientUserUsernameOrderByIdDesc(String username);
}
