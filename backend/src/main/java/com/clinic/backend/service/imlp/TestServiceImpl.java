package com.clinic.backend.service.imlp;

import com.clinic.backend.dto.test.CreateTestRequest;
import com.clinic.backend.entity.MedicalRecord;
import com.clinic.backend.entity.TestRequest;
import com.clinic.backend.exception.ApiException;
import com.clinic.backend.repository.MedicalRecordRepository;
import com.clinic.backend.repository.TestRequestRepository;
import com.clinic.backend.service.TestService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class TestServiceImpl implements TestService {

    private final TestRequestRepository testRequestRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    @Override
    public TestRequest create(CreateTestRequest req) {

        MedicalRecord record = medicalRecordRepository.findById(req.getMedicalRecordId())
                .orElseThrow(() -> new ApiException("Medical record not found"));

        TestRequest t = new TestRequest();
        t.setMedicalRecord(record);
        t.setTestName(req.getTestName());
        t.setStatus("PENDING");

        return testRequestRepository.save(t);
    }

    @Override
    public List<TestRequest> getAll() {
        return testRequestRepository.findAll();
    }
}