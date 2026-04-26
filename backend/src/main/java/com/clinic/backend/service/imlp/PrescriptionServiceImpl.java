
package com.clinic.backend.service.imlp;

import com.clinic.backend.dto.prescription.CreatePrescriptionRequest;
import com.clinic.backend.entity.MedicalRecord;
import com.clinic.backend.entity.Prescription;
import com.clinic.backend.exception.ApiException;
import com.clinic.backend.repository.MedicalRecordRepository;
import com.clinic.backend.repository.PrescriptionRepository;
import com.clinic.backend.service.PrescriptionService;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class PrescriptionServiceImpl implements PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final MedicalRecordRepository medicalRecordRepository;

    @Override
    public Prescription create(CreatePrescriptionRequest req) {

        MedicalRecord record = medicalRecordRepository.findById(req.getMedicalRecordId())
                .orElseThrow(() -> new ApiException("Medical record not found"));

        Prescription p = new Prescription();
        p.setMedicalRecord(record);
        p.setMedicineName(req.getMedicineName());
        p.setDosage(req.getDosage());
        p.setInstructions(req.getInstructions());

        return prescriptionRepository.save(p);
    }

    @Override
    public List<Prescription> getAll() {
        return prescriptionRepository.findAll();
    }
}