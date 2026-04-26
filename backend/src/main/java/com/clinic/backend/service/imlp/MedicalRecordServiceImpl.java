package com.clinic.backend.service.imlp;

import com.clinic.backend.dto.medicalrecord.MedicalRecordResponse;
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

    // ✅ CREATE → trả DTO
    @Override
    public MedicalRecordResponse create(Long appointmentId, String diagnosis, String notes) {

        if (appointmentId == null) {
            throw new ApiException("Thiếu ID lịch hẹn");
        }

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

        MedicalRecord saved = medicalRecordRepository.save(record);

        return toResponse(saved);
    }

    // ✅ GET BY ID → trả DTO + check quyền
    @Override
    public MedicalRecordResponse getByIdForCurrentUser(Long recordId, String username, String role) {

        if (recordId == null) {
            throw new ApiException("Thiếu ID hồ sơ");
        }

        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new ApiException("Không tìm thấy hồ sơ khám"));

        // ADMIN → full access
        if ("ADMIN".equalsIgnoreCase(role)) {
            return toResponse(record);
        }

        // DOCTOR → chỉ xem record của mình
        if ("DOCTOR".equalsIgnoreCase(role)
                && record.getDoctor() != null
                && record.getDoctor().getUser() != null
                && username.equals(record.getDoctor().getUser().getUsername())) {
            return toResponse(record);
        }

        // PATIENT → chỉ xem record của mình
        if ("PATIENT".equalsIgnoreCase(role)
                && record.getPatient() != null
                && record.getPatient().getUser() != null
                && username.equals(record.getPatient().getUser().getUsername())) {
            return toResponse(record);
        }

        throw new ApiException("Bạn không có quyền truy cập hồ sơ này");
    }

    // ✅ MAP ENTITY → DTO (NULL SAFE)
    private MedicalRecordResponse toResponse(MedicalRecord record) {

        MedicalRecordResponse res = new MedicalRecordResponse();

        res.setId(record.getId());
        res.setDiagnosis(record.getDiagnosis());
        res.setNotes(record.getNotes());
        res.setCreatedAt(record.getCreatedAt());

        // doctor name
        if (record.getDoctor() != null
                && record.getDoctor().getUser() != null
                && record.getDoctor().getUser().getFullName() != null) {

            res.setDoctorName(record.getDoctor().getUser().getFullName());
        } else {
            res.setDoctorName("Unknown Doctor");
        }

        // patient name
        if (record.getPatient() != null
                && record.getPatient().getUser() != null
                && record.getPatient().getUser().getFullName() != null) {

            res.setPatientName(record.getPatient().getUser().getFullName());
        } else {
            res.setPatientName("Unknown Patient");
        }

        return res;
    }
}