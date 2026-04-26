package com.clinic.backend.repository;

import com.clinic.backend.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
    Optional<TestResult> findByTestRequestId(Long testRequestId);

    List<TestResult> findByMedicalRecordPatientIdOrderByIdDesc(Long patientId);
}
