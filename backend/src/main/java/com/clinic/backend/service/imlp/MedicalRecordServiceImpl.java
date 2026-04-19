package com.clinic.backend.service.imlp;

import com.clinic.backend.entity.Appointment;
import com.clinic.backend.entity.MedicalRecord;
import com.clinic.backend.exception.ApiException;
import com.clinic.backend.repository.AppointmentRepository;
import com.clinic.backend.repository.MedicalRecordRepository;
import com.clinic.backend.service.MedicalRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.clinic.backend.dto.medicalrecord.MedicalRecordResponse;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class MedicalRecordServiceImpl implements MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public MedicalRecordResponse create(Long appointmentId, String diagnosis, String notes) {

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

    @Override
    public MedicalRecordResponse getByIdForCurrentUser(Long recordId, String username, String role) {
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new ApiException("Không tìm thấy hồ sơ khám"));

        if ("ADMIN".equalsIgnoreCase(role)) {
            return toResponse(record);
        }

        if ("DOCTOR".equalsIgnoreCase(role)
                && record.getDoctor() != null
                && record.getDoctor().getUser() != null
                && username.equals(record.getDoctor().getUser().getUsername())) {
            return toResponse(record);
        }

        if ("PATIENT".equalsIgnoreCase(role)
                && record.getPatient() != null
                && record.getPatient().getUser() != null
                && username.equals(record.getPatient().getUser().getUsername())) {
            return toResponse(record);
        }

        throw new ApiException("Bạn không có quyền truy cập hồ sơ này");
    }
    private MedicalRecordResponse toResponse(MedicalRecord record) {
    MedicalRecordResponse res = new MedicalRecordResponse();

    res.setId(record.getId());
    res.setDiagnosis(record.getDiagnosis());
    res.setNotes(record.getNotes());

    if (record.getDoctor() != null) {
        res.setDoctorName(record.getDoctor().getName());
    }

    if (record.getPatient() != null) {
        res.setPatientName(record.getPatient().getName());
    }

    return res;
    }
}
