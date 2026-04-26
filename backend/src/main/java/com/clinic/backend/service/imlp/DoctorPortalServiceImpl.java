package com.clinic.backend.service.imlp;

import com.clinic.backend.dto.doctor.*;
import com.clinic.backend.dto.medicalrecord.CreateMedicalRecordRequest;
import com.clinic.backend.dto.medicalrecord.MedicalRecordResponse;
import com.clinic.backend.dto.prescription.CreatePrescriptionRequest;
import com.clinic.backend.dto.test.CreateTestRequest;
import com.clinic.backend.entity.*;
import com.clinic.backend.exception.ApiException;
import com.clinic.backend.repository.*;
import com.clinic.backend.service.DoctorPortalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorPortalServiceImpl implements DoctorPortalService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final TestRequestRepository testRequestRepository;
    private final TestResultRepository testResultRepository;
    private final PatientRepository patientRepository;
    private final MedicineRepository medicineRepository;

    @Override
    public List<DoctorAppointmentResponse> getTodayAppointments(String username) {
        return appointmentRepository.findByDoctorUserUsernameAndAppointmentDateOrderBySlotTimeAsc(username, LocalDate.now())
                .stream()
                .map(appointment -> new DoctorAppointmentResponse(
                        appointment.getId(),
                        appointment.getPatient() != null ? appointment.getPatient().getId() : null,
                        appointment.getPatient() != null ? appointment.getPatient().getName() : "Unknown Patient",
                        appointment.getAppointmentDate() != null ? appointment.getAppointmentDate().format(DATE_FORMAT) : "",
                        appointment.getSlotTime() != null ? appointment.getSlotTime().format(TIME_FORMAT) : "",
                        safeText(appointment.getStatus()),
                        safeText(appointment.getPaymentStatus()),
                        safeText(appointment.getReason()),
                        appointment.getReviewed(),
                        appointment.getReviewRating(),
                        appointment.getReviewComment()
                ))
                .toList();
    }

    @Override
    public MedicalRecordResponse createMedicalRecord(String username, CreateMedicalRecordRequest request) {
        Doctor doctor = getDoctorByUsername(username);
        Appointment appointment = appointmentRepository.findById(request.getAppointmentId())
                .orElseThrow(() -> new ApiException("Không tìm thấy lịch khám"));

        ensureDoctorOwnsAppointment(doctor, appointment);

        if (medicalRecordRepository.findByAppointmentId(appointment.getId()).isPresent()) {
            throw new ApiException("Lịch khám này đã có hồ sơ bệnh án");
        }

        MedicalRecord record = new MedicalRecord();
        record.setAppointment(appointment);
        record.setDoctor(doctor);
        record.setPatient(appointment.getPatient());
        record.setDiagnosis(request.getDiagnosis().trim());
        record.setSymptoms(trimOrNull(request.getSymptoms()));
        record.setNotes(trimOrNull(request.getNotes()));
        record.setFollowUpDate(parseOptionalDate(request.getFollowUpDate()));
        record.setCreatedAt(LocalDate.now());

        MedicalRecord saved = medicalRecordRepository.save(record);

        MedicalRecordResponse response = new MedicalRecordResponse();
        response.setId(saved.getId());
        response.setDiagnosis(saved.getDiagnosis());
        response.setNotes(saved.getNotes());
        response.setDoctorName(doctor.getName());
        response.setPatientName(appointment.getPatient() != null ? appointment.getPatient().getName() : "Unknown Patient");
        response.setCreatedAt(saved.getCreatedAt());
        return response;
    }

    @Override
    public DoctorPrescriptionItemResponse createPrescription(String username, CreatePrescriptionRequest request) {
        MedicalRecord record = getDoctorOwnedRecord(username, request.getMedicalRecordId());
        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new ApiException("Không tìm thấy thuốc"));

        Prescription prescription = new Prescription();
        prescription.setMedicalRecord(record);
        prescription.setMedicineId(medicine.getId());
        prescription.setMedicineName(
                request.getMedicineName() == null || request.getMedicineName().trim().isEmpty()
                        ? medicine.getName()
                        : request.getMedicineName().trim()
        );
        prescription.setDosage(request.getDosage().trim());
        prescription.setFrequency(trimOrNull(request.getFrequency()));
        prescription.setDuration(trimOrNull(request.getDuration()));
        prescription.setInstructions(trimOrNull(request.getInstructions()));

        Prescription saved = prescriptionRepository.save(prescription);
        return toDoctorPrescription(saved);
    }

    @Override
    public DoctorTestItemResponse createTestRequest(String username, CreateTestRequest request) {
        MedicalRecord record = getDoctorOwnedRecord(username, request.getMedicalRecordId());

        TestRequest testRequest = new TestRequest();
        testRequest.setMedicalRecord(record);
        testRequest.setTestName(request.getTestName().trim());
        testRequest.setStatus("REQUESTED");

        TestRequest saved = testRequestRepository.save(testRequest);
        return new DoctorTestItemResponse(
                saved.getId(),
                record.getId(),
                saved.getTestName(),
                saved.getStatus(),
                null,
                null
        );
    }

    @Override
    public DoctorPatientHistoryResponse getPatientHistory(String username, Long patientId) {
        ensureDoctorHasPatientAccess(username, patientId);

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ApiException("Không tìm thấy bệnh nhân"));

        List<DoctorRecordItemResponse> records = medicalRecordRepository.findByPatientIdOrderByCreatedAtDesc(patientId)
                .stream()
                .map(record -> new DoctorRecordItemResponse(
                        record.getId(),
                        record.getAppointment() != null ? record.getAppointment().getId() : null,
                        record.getDiagnosis(),
                        record.getSymptoms(),
                        record.getNotes(),
                        record.getFollowUpDate() != null ? record.getFollowUpDate().format(DATE_FORMAT) : null,
                        record.getCreatedAt() != null ? record.getCreatedAt().format(DATE_FORMAT) : null
                ))
                .toList();

        List<DoctorPrescriptionItemResponse> prescriptions = prescriptionRepository.findByMedicalRecordPatientIdOrderByIdDesc(patientId)
                .stream()
                .map(this::toDoctorPrescription)
                .toList();

        List<DoctorTestItemResponse> tests = testRequestRepository.findByMedicalRecordPatientIdOrderByIdDesc(patientId)
                .stream()
                .map(testRequest -> {
                    TestResult result = testResultRepository.findByTestRequestId(testRequest.getId()).orElse(null);
                    return new DoctorTestItemResponse(
                            testRequest.getId(),
                            testRequest.getMedicalRecord() != null ? testRequest.getMedicalRecord().getId() : null,
                            testRequest.getTestName(),
                            result != null ? safeText(result.getStatus()) : safeText(testRequest.getStatus()),
                            result != null ? safeText(result.getResult()) : null,
                            result != null ? safeText(result.getConclusion()) : null
                    );
                })
                .toList();

        return new DoctorPatientHistoryResponse(
                patient.getId(),
                patient.getName(),
                patient.getGender(),
                patient.getDateOfBirth() != null ? new java.sql.Date(patient.getDateOfBirth().getTime()).toString() : null,
                patient.getAddress(),
                patient.getInsuranceNumber(),
                records,
                prescriptions,
                tests
        );
    }

    @Override
    public DoctorProfileResponse getProfile(String username) {
        return toDoctorProfileResponse(getDoctorByUsername(username));
    }

    @Override
    public DoctorProfileResponse updateProfile(String username, UpdateDoctorProfileRequest request) {
        Doctor doctor = getDoctorByUsername(username);
        User user = doctor.getUser();

        if (user != null) {
            if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
                user.setFullName(request.getFullName().trim());
            }
            user.setPhone(trimOrNull(request.getPhone()));
        }

        doctor.setSpecialty(trimOrNull(request.getSpecialty()));
        doctor.setExperience(request.getExperience());
        doctor.setExperienceYears(request.getExperience());
        doctor.setDegree(trimOrNull(request.getDegree()));
        doctor.setBio(trimOrNull(request.getBio()));
        doctor.setRoomNumber(trimOrNull(request.getRoomNumber()));
        doctor.setWorkingStart(trimOrNull(request.getWorkingStart()));
        doctor.setWorkingEnd(trimOrNull(request.getWorkingEnd()));
        doctor.setSlotDurationMinutes(request.getSlotDurationMinutes());
        doctor.setConsultationFee(parseOptionalBigDecimal(request.getConsultationFee()));

        Doctor saved = doctorRepository.save(doctor);
        return toDoctorProfileResponse(saved);
    }

    @Override
    public List<MedicineOptionResponse> getMedicines() {
        return medicineRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(medicine -> new MedicineOptionResponse(
                        medicine.getId(),
                        medicine.getName(),
                        medicine.getUnit(),
                        medicine.getStockQuantity(),
                        medicine.getPrice() != null ? medicine.getPrice().toPlainString() : null
                ))
                .toList();
    }

    private Doctor getDoctorByUsername(String username) {
        return doctorRepository.findByUserUsername(username)
                .orElseThrow(() -> new ApiException("Không tìm thấy hồ sơ bác sĩ"));
    }

    private MedicalRecord getDoctorOwnedRecord(String username, Long medicalRecordId) {
        Doctor doctor = getDoctorByUsername(username);
        MedicalRecord record = medicalRecordRepository.findById(medicalRecordId)
                .orElseThrow(() -> new ApiException("Không tìm thấy hồ sơ bệnh án"));

        if (record.getDoctor() == null || !doctor.getId().equals(record.getDoctor().getId())) {
            throw new ApiException("Bạn không có quyền thao tác hồ sơ này");
        }

        return record;
    }

    private void ensureDoctorOwnsAppointment(Doctor doctor, Appointment appointment) {
        if (appointment.getDoctor() == null || !doctor.getId().equals(appointment.getDoctor().getId())) {
            throw new ApiException("Bạn không có quyền thao tác lịch khám này");
        }
    }

    private void ensureDoctorHasPatientAccess(String username, Long patientId) {
        boolean hasAccess = appointmentRepository.findByPatientIdOrderByAppointmentDateDescSlotTimeDesc(patientId)
                .stream()
                .anyMatch(appointment -> appointment.getDoctor() != null
                        && appointment.getDoctor().getUser() != null
                        && username.equals(appointment.getDoctor().getUser().getUsername()));

        if (!hasAccess) {
            throw new ApiException("Bạn không có quyền xem lịch sử bệnh nhân này");
        }
    }

    private DoctorPrescriptionItemResponse toDoctorPrescription(Prescription prescription) {
        return new DoctorPrescriptionItemResponse(
                prescription.getId(),
                prescription.getMedicalRecord() != null ? prescription.getMedicalRecord().getId() : null,
                prescription.getMedicineId(),
                prescription.getMedicineName(),
                prescription.getDosage(),
                prescription.getFrequency(),
                prescription.getDuration(),
                prescription.getInstructions()
        );
    }

    private DoctorProfileResponse toDoctorProfileResponse(Doctor doctor) {
        User user = doctor.getUser();
        return new DoctorProfileResponse(
                doctor.getId(),
                user != null ? user.getUsername() : null,
                user != null ? user.getEmail() : null,
                user != null ? user.getFullName() : null,
                user != null ? user.getPhone() : null,
                doctor.getSpecialty(),
                doctor.getExperience(),
                doctor.getDegree(),
                doctor.getBio(),
                doctor.getRoomNumber(),
                doctor.getWorkingStart(),
                doctor.getWorkingEnd(),
                doctor.getSlotDurationMinutes(),
                doctor.getConsultationFee() != null ? doctor.getConsultationFee().toPlainString() : null,
                doctor.getActive()
        );
    }

    private LocalDate parseOptionalDate(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalDate.parse(value.trim(), DATE_FORMAT);
        } catch (Exception ex) {
            throw new ApiException("Ngày tái khám không hợp lệ. Định dạng yyyy-MM-dd");
        }
    }

    private BigDecimal parseOptionalBigDecimal(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        try {
            return new BigDecimal(value.trim());
        } catch (Exception ex) {
            throw new ApiException("Consultation fee không hợp lệ");
        }
    }

    private String trimOrNull(String value) {
        if (value == null || value.trim().isEmpty()) {
            return null;
        }
        return value.trim();
    }

    private String safeText(String value) {
        return value == null ? "" : value;
    }
}
