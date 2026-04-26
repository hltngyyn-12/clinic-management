package com.clinic.backend.repository;

import com.clinic.backend.entity.TestRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestRequestRepository extends JpaRepository<TestRequest, Long> {
    List<TestRequest> findByMedicalRecordPatientUserUsernameOrderByIdDesc(String username);

    List<TestRequest> findByMedicalRecordPatientIdOrderByIdDesc(Long patientId);

    List<TestRequest> findByMedicalRecordIdOrderByIdDesc(Long medicalRecordId);
}
