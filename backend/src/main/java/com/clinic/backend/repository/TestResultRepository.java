package com.clinic.backend.repository;

import com.clinic.backend.entity.TestResult;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestResultRepository extends JpaRepository<TestResult, Long> {
}