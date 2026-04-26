package com.clinic.backend.service.imlp;

import com.clinic.backend.dto.patient.*;
import com.clinic.backend.entity.*;
import com.clinic.backend.exception.ApiException;
import com.clinic.backend.repository.*;
import com.clinic.backend.service.PatientPortalService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PatientPortalServiceImpl implements PatientPortalService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");
    private static final double DEFAULT_DEPOSIT_AMOUNT = 100000d;

    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final TestRequestRepository testRequestRepository;
    private final TestResultRepository testResultRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public List<DoctorOptionResponse> getDoctors() {
        return doctorRepository.findAll().stream()
                .map(doctor -> new DoctorOptionResponse(
                        doctor.getId(),
                        doctor.getName(),
                        normalizeText(doctor.getSpecialty(), "General"),
                        doctor.getExperience(),
                        roundRating(reviewRepository.findAverageRatingByDoctorId(doctor.getId()))
                ))
                .sorted(Comparator.comparing(DoctorOptionResponse::getName, String.CASE_INSENSITIVE_ORDER))
                .toList();
    }

    @Override
    public List<String> getAvailableSlots(Long doctorId, String date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ApiException("Không tìm thấy bác sĩ"));

        LocalDate appointmentDate = parseDate(date);
        if (appointmentDate.isBefore(LocalDate.now())) {
            throw new ApiException("Không thể xem slot trong quá khứ");
        }

        List<String> baseSlots = List.of("09:00", "10:00", "11:00", "14:00", "15:00", "16:00");
        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorIdAndAppointmentDate(doctor.getId(), appointmentDate);

        return baseSlots.stream()
                .filter(slot -> bookedAppointments.stream()
                        .noneMatch(appointment -> appointment.getSlotTime() != null
                                && slot.equals(appointment.getSlotTime().format(TIME_FORMAT))
                                && !"CANCELLED".equalsIgnoreCase(appointment.getStatus())))
                .toList();
    }

    @Override
    public AppointmentResponse bookAppointment(String username, AppointmentBookingRequest request) {
        Patient patient = getPatientByUsername(username);
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ApiException("Không tìm thấy bác sĩ"));

        LocalDate appointmentDate = parseDate(request.getDate());
        LocalTime slotTime = parseTime(request.getTime());

        if (appointmentDate.isBefore(LocalDate.now())) {
            throw new ApiException("Không thể đặt lịch trong quá khứ");
        }

        boolean exists = appointmentRepository.existsByDoctorIdAndAppointmentDateAndSlotTime(
                doctor.getId(),
                appointmentDate,
                slotTime
        );

        if (exists) {
            throw new ApiException("Khung giờ này đã được đặt");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(appointmentDate);
        appointment.setSlotTime(slotTime);
        appointment.setReason(normalizeText(request.getReason(), "General consultation"));
        appointment.setStatus("BOOKED");
        appointment.setDepositAmount(DEFAULT_DEPOSIT_AMOUNT);
        appointment.setPaymentStatus("UNPAID");
        appointment.setReviewed(false);
        appointment.setReviewRating(null);
        appointment.setReviewComment(null);

        return toAppointmentResponse(appointmentRepository.save(appointment), false);
    }

    @Override
    public AppointmentResponse payDeposit(String username, Long appointmentId, DepositPaymentRequest request) {
        Appointment appointment = getOwnedAppointment(username, appointmentId);

        if ("CANCELLED".equalsIgnoreCase(appointment.getStatus())) {
            throw new ApiException("Không thể thanh toán cho lịch đã hủy");
        }

        double amount = request.getAmount() == null ? DEFAULT_DEPOSIT_AMOUNT : request.getAmount();
        if (amount <= 0) {
            throw new ApiException("Số tiền đặt cọc phải lớn hơn 0");
        }

        appointment.setDepositAmount(amount);
        appointment.setPaymentStatus("PAID");

        return toAppointmentResponse(appointmentRepository.save(appointment), hasReview(appointment.getId(), username));
    }

    @Override
    public List<AppointmentResponse> getAppointments(String username) {
        return appointmentRepository.findByPatientUserUsernameOrderByAppointmentDateDescSlotTimeDesc(username)
                .stream()
                .map(appointment -> toAppointmentResponse(appointment, hasReview(appointment.getId(), username)))
                .toList();
    }

    @Override
    public List<MedicalHistoryResponse> getMedicalHistory(String username) {
        return medicalRecordRepository.findByPatientUserUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(record -> new MedicalHistoryResponse(
                        record.getId(),
                        record.getAppointment() != null ? record.getAppointment().getId() : null,
                        record.getDoctor() != null ? record.getDoctor().getId() : null,
                        record.getDoctor() != null ? record.getDoctor().getName() : "Unknown Doctor",
                        record.getDiagnosis(),
                        record.getNotes(),
                        record.getCreatedAt() != null ? record.getCreatedAt().toString() : ""
                ))
                .toList();
    }

    @Override
    public List<PatientPrescriptionResponse> getPrescriptions(String username) {
        return prescriptionRepository.findByMedicalRecordPatientUserUsernameOrderByIdDesc(username)
                .stream()
                .map(prescription -> new PatientPrescriptionResponse(
                        prescription.getId(),
                        prescription.getMedicalRecord() != null ? prescription.getMedicalRecord().getId() : null,
                        prescription.getMedicalRecord() != null && prescription.getMedicalRecord().getDoctor() != null
                                ? prescription.getMedicalRecord().getDoctor().getName()
                                : "Unknown Doctor",
                        prescription.getMedicineName(),
                        prescription.getDosage(),
                        normalizeText(prescription.getInstructions(), "No instructions")
                ))
                .toList();
    }

    @Override
    public List<PatientTestResultResponse> getTestResults(String username) {
        List<TestRequest> requests = testRequestRepository.findByMedicalRecordPatientUserUsernameOrderByIdDesc(username);
        List<PatientTestResultResponse> responses = new ArrayList<>();

        for (TestRequest request : requests) {
            Optional<TestResult> resultOptional = testResultRepository.findByTestRequestId(request.getId());
            TestResult result = resultOptional.orElse(null);

            responses.add(new PatientTestResultResponse(
                    request.getId(),
                    request.getMedicalRecord() != null ? request.getMedicalRecord().getId() : null,
                    request.getMedicalRecord() != null && request.getMedicalRecord().getDoctor() != null
                            ? request.getMedicalRecord().getDoctor().getName()
                            : "Unknown Doctor",
                    request.getTestName(),
                    result != null ? "COMPLETED" : normalizeText(request.getStatus(), "PENDING"),
                    result != null ? normalizeText(result.getResult(), "No result yet") : "Pending result",
                    result != null ? normalizeText(result.getConclusion(), "No conclusion") : "Pending review"
            ));
        }

        return responses;
    }

    @Override
    public ReviewResponse createReview(String username, CreateReviewRequest request) {
        Appointment appointment = getOwnedAppointment(username, request.getAppointmentId());

        if (reviewRepository.existsByAppointmentIdAndPatientUserUsername(appointment.getId(), username)) {
            throw new ApiException("Lịch khám này đã được đánh giá");
        }

        if (!"PAID".equalsIgnoreCase(appointment.getPaymentStatus())) {
            throw new ApiException("Hãy thanh toán đặt cọc trước khi đánh giá");
        }

        Review review = new Review();
        review.setAppointment(appointment);
        review.setPatient(appointment.getPatient());
        review.setDoctor(appointment.getDoctor());
        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());

        Review savedReview = reviewRepository.save(review);

        appointment.setReviewed(true);
        appointment.setReviewRating(request.getRating());
        appointment.setReviewComment(request.getComment().trim());
        appointmentRepository.save(appointment);

        return toReviewResponse(savedReview);
    }

    @Override
    public List<ReviewResponse> getMyReviews(String username) {
        return reviewRepository.findByPatientUserUsernameOrderByCreatedAtDesc(username)
                .stream()
                .map(this::toReviewResponse)
                .toList();
    }

    @Override
    public List<ReviewResponse> getDoctorReviews(Long doctorId) {
        return reviewRepository.findByDoctorIdOrderByCreatedAtDesc(doctorId)
                .stream()
                .map(this::toReviewResponse)
                .toList();
    }

    private Patient getPatientByUsername(String username) {
        return patientRepository.findByUserUsername(username)
                .orElseThrow(() -> new ApiException("Không tìm thấy hồ sơ bệnh nhân"));
    }

    private Appointment getOwnedAppointment(String username, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ApiException("Không tìm thấy lịch khám"));

        if (appointment.getPatient() == null
                || appointment.getPatient().getUser() == null
                || !username.equals(appointment.getPatient().getUser().getUsername())) {
            throw new ApiException("Bạn không có quyền thao tác lịch khám này");
        }

        return appointment;
    }

    private AppointmentResponse toAppointmentResponse(Appointment appointment, boolean reviewSubmitted) {
        Doctor doctor = appointment.getDoctor();
        return new AppointmentResponse(
                appointment.getId(),
                doctor != null ? doctor.getId() : null,
                doctor != null ? doctor.getName() : "Unknown Doctor",
                doctor != null ? normalizeText(doctor.getSpecialty(), "General") : "General",
                appointment.getAppointmentDate() != null ? appointment.getAppointmentDate().format(DATE_FORMAT) : "",
                appointment.getSlotTime() != null ? appointment.getSlotTime().format(TIME_FORMAT) : "",
                normalizeText(appointment.getStatus(), "BOOKED"),
                normalizeText(appointment.getReason(), ""),
                appointment.getDepositAmount(),
                normalizeText(appointment.getPaymentStatus(), "UNPAID"),
                reviewSubmitted
        );
    }

    private ReviewResponse toReviewResponse(Review review) {
        return new ReviewResponse(
                review.getId(),
                review.getAppointment() != null ? review.getAppointment().getId() : null,
                review.getDoctor() != null ? review.getDoctor().getId() : null,
                review.getDoctor() != null ? review.getDoctor().getName() : "Unknown Doctor",
                review.getRating(),
                review.getComment(),
                review.getCreatedAt() != null ? review.getCreatedAt().toString() : LocalDateTime.now().toString()
        );
    }

    private boolean hasReview(Long appointmentId, String username) {
        return reviewRepository.existsByAppointmentIdAndPatientUserUsername(appointmentId, username);
    }

    private LocalDate parseDate(String value) {
        try {
            return LocalDate.parse(value, DATE_FORMAT);
        } catch (Exception ex) {
            throw new ApiException("Ngày khám không hợp lệ. Định dạng yyyy-MM-dd");
        }
    }

    private LocalTime parseTime(String value) {
        try {
            return LocalTime.parse(value, TIME_FORMAT);
        } catch (Exception ex) {
            throw new ApiException("Giờ khám không hợp lệ. Định dạng HH:mm");
        }
    }

    private String normalizeText(String value, String fallback) {
        if (value == null || value.trim().isEmpty()) {
            return fallback;
        }
        return value.trim();
    }

    private Double roundRating(Double value) {
        if (value == null) {
            return null;
        }
        return Double.valueOf(String.format(Locale.US, "%.1f", value));
    }
}
