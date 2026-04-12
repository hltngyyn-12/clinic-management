package com.clinic.backend.service;

import com.clinic.backend.dto.prescription.CreatePrescriptionRequest;
import com.clinic.backend.entity.Prescription;

import java.util.List;
public interface PrescriptionService {
    Prescription create(CreatePrescriptionRequest req);
    List<Prescription> getAll();
}