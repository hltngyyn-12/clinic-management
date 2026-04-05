package com.clinic.backend.repository;

import com.clinic.backend.entity.TestRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestRequestRepository extends JpaRepository<TestRequest, Long> {
}