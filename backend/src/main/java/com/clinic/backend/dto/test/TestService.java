package com.clinic.backend.service;

import com.clinic.backend.dto.test.CreateTestRequest;
import com.clinic.backend.entity.TestRequest;

import java.util.List;
public interface TestService {
    TestRequest create(CreateTestRequest req);
    List<TestRequest> getAll();
}