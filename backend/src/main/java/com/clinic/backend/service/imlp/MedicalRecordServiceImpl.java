package com.clinic.backend.service.impl;

import com.clinic.backend.entity.Appointment;
import com.clinic.backend.entity.MedicalRecord;
import com.clinic.backend.exception.ApiException;
import com.clinic.backend.repository.AppointmentRepository;
import com.clinic.backend.repository.MedicalRecordRepository;
import com.clinic.backend.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public MedicalRecord create(Long appointmentId, String diagnosis, String notes) {

        Appointment ap = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ApiException("Không tìm thấy lịch hẹn"));

        if (!"BOOKED".equalsIgnoreCase(ap.getStatus())) {
            throw new ApiException("Lịch hẹn không hợp lệ");
        }

        MedicalRecord record = new MedicalRecord();
        record.setAppointment(ap);
        record.setPatient(ap.getPatient());
        record.setDoctor(ap.getDoctor());
        record.setDiagnosis(diagnosis);
        record.setNotes(notes);
        record.setCreatedAt(LocalDate.now());

        return medicalRecordRepository.save(record);
    }
}