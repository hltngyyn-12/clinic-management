package com.clinic.backend.repository;

import com.clinic.backend.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    List<MedicalRecord> findByPatientUserUsernameOrderByCreatedAtDesc(String username);
}
