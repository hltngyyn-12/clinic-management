package com.clinic.backend.service.imlp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.clinic.backend.dto.admin.AdminDoctorRequest;
import com.clinic.backend.dto.admin.AdminDoctorResponse;
import com.clinic.backend.dto.admin.MedicineRequest;
import com.clinic.backend.dto.admin.MedicineResponse;
import com.clinic.backend.dto.admin.NotificationRequest;
import com.clinic.backend.dto.admin.NotificationResponse;
import com.clinic.backend.dto.admin.RevenueDailyItemResponse;
import com.clinic.backend.dto.admin.RevenueReportResponse;
import com.clinic.backend.dto.admin.SlotConfigRequest;
import com.clinic.backend.dto.admin.SlotConfigResponse;
import com.clinic.backend.dto.admin.SpecialtyRequest;
import com.clinic.backend.dto.admin.SpecialtyResponse;
import com.clinic.backend.entity.Doctor;
import com.clinic.backend.entity.Medicine;
import com.clinic.backend.entity.Notification;
import com.clinic.backend.entity.Role;
import com.clinic.backend.entity.SlotConfig;
import com.clinic.backend.entity.Specialty;
import com.clinic.backend.entity.User;
import com.clinic.backend.exception.ApiException;
import com.clinic.backend.repository.AppointmentRepository;
import com.clinic.backend.repository.DoctorRepository;
import com.clinic.backend.repository.MedicineRepository;
import com.clinic.backend.repository.NotificationRepository;
import com.clinic.backend.repository.PrescriptionRepository;
import com.clinic.backend.repository.SlotConfigRepository;
import com.clinic.backend.repository.SpecialtyRepository;
import com.clinic.backend.repository.UserRepository;
import com.clinic.backend.repository.projection.RevenueDailyProjection;
import com.clinic.backend.service.AdminPortalService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminPortalServiceImpl implements AdminPortalService {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ISO_LOCAL_DATE;
    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final SpecialtyRepository specialtyRepository;
    private final MedicineRepository medicineRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final SlotConfigRepository slotConfigRepository;
    private final NotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<AdminDoctorResponse> getDoctors() {
        return doctorRepository.findAll().stream()
                .sorted(Comparator.comparing(Doctor::getId).reversed())
                .map(this::toDoctorResponse)
                .toList();
    }

    @Override
    public AdminDoctorResponse getDoctor(Long doctorId) {
        return toDoctorResponse(getDoctorEntity(doctorId));
    }

    @Override
    public AdminDoctorResponse createDoctor(AdminDoctorRequest request) {
        validateDoctorCreateRequest(request);

        if (userRepository.existsByUsername(request.getUsername().trim())) {
            throw new ApiException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new ApiException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim());
        user.setFullName(request.getFullName().trim());
        user.setPhone(trimOrNull(request.getPhone()));
        user.setPasswordHash(passwordEncoder.encode(request.getPassword().trim()));
        user.setRole(Role.DOCTOR);
        User savedUser = userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setUser(savedUser);
        applyDoctorRequest(doctor, request);
        return toDoctorResponse(doctorRepository.save(doctor));
    }

    @Override
    public AdminDoctorResponse updateDoctor(Long doctorId, AdminDoctorRequest request) {
        Doctor doctor = getDoctorEntity(doctorId);
        User user = doctor.getUser();
        if (user == null) {
            throw new ApiException("Doctor account is invalid");
        }

        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            String username = request.getUsername().trim();
            userRepository.findByUsername(username).ifPresent(existing -> {
                if (!existing.getId().equals(user.getId())) {
                    throw new ApiException("Username already exists");
                }
            });
            user.setUsername(username);
        }

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            String email = request.getEmail().trim();
            userRepository.findByEmail(email).ifPresent(existing -> {
                if (!existing.getId().equals(user.getId())) {
                    throw new ApiException("Email already exists");
                }
            });
            user.setEmail(email);
        }

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }
        user.setPhone(trimOrNull(request.getPhone()));

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(request.getPassword().trim()));
        }

        applyDoctorRequest(doctor, request);
        userRepository.save(user);
        return toDoctorResponse(doctorRepository.save(doctor));
    }

    @Override
    public void deleteDoctor(Long doctorId) {
        Doctor doctor = getDoctorEntity(doctorId);
        if (!appointmentRepository.findByDoctorId(doctorId).isEmpty()) {
            throw new ApiException("Cannot delete doctor with appointments. Set active = false instead.");
        }

        User user = doctor.getUser();
        doctorRepository.delete(doctor);
        if (user != null) {
            userRepository.delete(user);
        }
    }

    @Override
    public List<SpecialtyResponse> getSpecialties() {
        return specialtyRepository.findAllByOrderByNameAsc().stream()
                .map(this::toSpecialtyResponse)
                .toList();
    }

    @Override
    public SpecialtyResponse createSpecialty(SpecialtyRequest request) {
        validateSpecialtyRequest(request);
        if (specialtyRepository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new ApiException("Specialty already exists");
        }

        Specialty specialty = new Specialty();
        applySpecialtyRequest(specialty, request);
        return toSpecialtyResponse(specialtyRepository.save(specialty));
    }

    @Override
    public SpecialtyResponse updateSpecialty(Long specialtyId, SpecialtyRequest request) {
        Specialty specialty = specialtyRepository.findById(specialtyId)
                .orElseThrow(() -> new ApiException("Specialty not found"));
        validateSpecialtyRequest(request);

        specialtyRepository.findAllByOrderByNameAsc().stream()
                .filter(item -> item.getName().equalsIgnoreCase(request.getName().trim()))
                .filter(item -> !item.getId().equals(specialtyId))
                .findFirst()
                .ifPresent(item -> {
                    throw new ApiException("Specialty already exists");
                });

        applySpecialtyRequest(specialty, request);
        return toSpecialtyResponse(specialtyRepository.save(specialty));
    }

    @Override
    public void deleteSpecialty(Long specialtyId) {
        Specialty specialty = specialtyRepository.findById(specialtyId)
                .orElseThrow(() -> new ApiException("Specialty not found"));
        if (doctorRepository.countBySpecialtyId(specialtyId) > 0) {
            throw new ApiException("Cannot delete specialty currently assigned to doctor");
        }
        specialtyRepository.delete(specialty);
    }

    @Override
    public List<MedicineResponse> getMedicines() {
        return medicineRepository.findAll().stream()
                .sorted(Comparator.comparing(Medicine::getId).reversed())
                .map(this::toMedicineResponse)
                .toList();
    }

    @Override
    public MedicineResponse createMedicine(MedicineRequest request) {
        validateMedicineRequest(request);
        Medicine medicine = new Medicine();
        applyMedicineRequest(medicine, request);
        return toMedicineResponse(medicineRepository.save(medicine));
    }

    @Override
    public MedicineResponse updateMedicine(Long medicineId, MedicineRequest request) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new ApiException("Medicine not found"));
        validateMedicineRequest(request);
        applyMedicineRequest(medicine, request);
        return toMedicineResponse(medicineRepository.save(medicine));
    }

    @Override
    public void deleteMedicine(Long medicineId) {
        Medicine medicine = medicineRepository.findById(medicineId)
                .orElseThrow(() -> new ApiException("Medicine not found"));

        if (prescriptionRepository.countByMedicineId(medicineId) > 0) {
            medicine.setActive(false);
            medicineRepository.save(medicine);
            return;
        }

        medicineRepository.delete(medicine);
    }

    @Override
    public List<SlotConfigResponse> getSlotConfigs() {
        return slotConfigRepository.findAllByOrderByIdDesc().stream()
                .map(this::toSlotConfigResponse)
                .toList();
    }

    @Override
    public SlotConfigResponse createSlotConfig(SlotConfigRequest request) {
        validateSlotConfigRequest(request);
        SlotConfig slotConfig = new SlotConfig();
        applySlotConfigRequest(slotConfig, request);
        return toSlotConfigResponse(slotConfigRepository.save(slotConfig));
    }

    @Override
    public SlotConfigResponse updateSlotConfig(Long slotConfigId, SlotConfigRequest request) {
        SlotConfig slotConfig = slotConfigRepository.findById(slotConfigId)
                .orElseThrow(() -> new ApiException("Slot config not found"));
        validateSlotConfigRequest(request);
        applySlotConfigRequest(slotConfig, request);
        return toSlotConfigResponse(slotConfigRepository.save(slotConfig));
    }

    @Override
    public void deleteSlotConfig(Long slotConfigId) {
        SlotConfig slotConfig = slotConfigRepository.findById(slotConfigId)
                .orElseThrow(() -> new ApiException("Slot config not found"));
        slotConfigRepository.delete(slotConfig);
    }

    @Override
    public RevenueReportResponse getRevenueReport(String startDate, String endDate) {
        LocalDate start = parseDateOrDefault(startDate, YearMonth.now().atDay(1));
        LocalDate end = parseDateOrDefault(endDate, LocalDate.now());

        if (end.isBefore(start)) {
            throw new ApiException("End date must be after start date");
        }

        long totalAppointments = appointmentRepository.countAppointmentsInRange(start, end);
        long paidAppointments = appointmentRepository.countPaidAppointmentsInRange(start, end);
        Double totalRevenue = appointmentRepository.sumRevenueInRange(start, end);

        List<RevenueDailyItemResponse> dailyItems = appointmentRepository.getDailyRevenueReport(start, end)
                .stream()
                .map(this::toRevenueDailyItem)
                .toList();

        return new RevenueReportResponse(
                start.format(DATE_FORMAT),
                end.format(DATE_FORMAT),
                (int) totalAppointments,
                (int) paidAppointments,
                totalRevenue == null ? 0 : totalRevenue,
                dailyItems
        );
    }

    @Override
    public List<NotificationResponse> getNotifications() {
        return notificationRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toNotificationResponse)
                .toList();
    }

    @Override
    public NotificationResponse createNotification(NotificationRequest request) {
        validateNotificationRequest(request);
        Notification notification = new Notification();
        applyNotificationRequest(notification, request);
        return toNotificationResponse(notificationRepository.save(notification));
    }

    @Override
    public NotificationResponse updateNotification(Long notificationId, NotificationRequest request) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ApiException("Notification not found"));
        validateNotificationRequest(request);
        applyNotificationRequest(notification, request);
        return toNotificationResponse(notificationRepository.save(notification));
    }

    @Override
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ApiException("Notification not found"));
        notificationRepository.delete(notification);
    }

    private Doctor getDoctorEntity(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ApiException("Doctor not found"));
    }

    private void applyDoctorRequest(Doctor doctor, AdminDoctorRequest request) {
        Specialty specialty = null;
        if (request.getSpecialtyId() != null) {
            specialty = specialtyRepository.findById(request.getSpecialtyId())
                    .orElseThrow(() -> new ApiException("Specialty not found"));
            doctor.setSpecialtyId(specialty.getId());
            doctor.setSpecialty(specialty.getName());
        } else {
            doctor.setSpecialtyId(null);
            doctor.setSpecialty(null);
        }

        doctor.setExperience(request.getExperience());
        doctor.setExperienceYears(request.getExperience());
        doctor.setDegree(trimOrNull(request.getDegree()));
        doctor.setBio(trimOrNull(request.getBio()));
        doctor.setRoomNumber(trimOrNull(request.getRoomNumber()));
        doctor.setWorkingStart(defaultString(request.getWorkingStart(), "09:00"));
        doctor.setWorkingEnd(defaultString(request.getWorkingEnd(), "17:00"));
        doctor.setSlotDurationMinutes(request.getSlotDurationMinutes() == null ? 60 : request.getSlotDurationMinutes());
        doctor.setConsultationFee(parseBigDecimalOrNull(request.getConsultationFee()));
        doctor.setActive(request.getActive() == null || request.getActive());
    }

    private void applySpecialtyRequest(Specialty specialty, SpecialtyRequest request) {
        specialty.setName(request.getName().trim());
        specialty.setDescription(trimOrNull(request.getDescription()));
        specialty.setActive(request.getActive() == null || request.getActive());
    }

    private void applyMedicineRequest(Medicine medicine, MedicineRequest request) {
        medicine.setName(request.getName().trim());
        medicine.setUnit(trimOrNull(request.getUnit()));
        medicine.setStockQuantity(request.getStockQuantity());
        medicine.setPrice(parseBigDecimalOrNull(request.getPrice()));
        medicine.setDescription(trimOrNull(request.getDescription()));
        medicine.setActive(request.getActive() == null || request.getActive());
    }

    private void applySlotConfigRequest(SlotConfig slotConfig, SlotConfigRequest request) {
        slotConfig.setName(request.getName().trim());
        slotConfig.setWorkingStart(request.getWorkingStart().trim());
        slotConfig.setWorkingEnd(request.getWorkingEnd().trim());
        slotConfig.setSlotDurationMinutes(request.getSlotDurationMinutes());
        slotConfig.setNotes(trimOrNull(request.getNotes()));
        slotConfig.setActive(request.getActive() == null || request.getActive());
    }

    private void applyNotificationRequest(Notification notification, NotificationRequest request) {
        notification.setTitle(request.getTitle().trim());
        notification.setMessage(request.getMessage().trim());
        notification.setTargetRole(request.getTargetRole().trim().toUpperCase());
        notification.setActive(request.getActive() == null || request.getActive());
    }

    private AdminDoctorResponse toDoctorResponse(Doctor doctor) {
        User user = doctor.getUser();
        return new AdminDoctorResponse(
                doctor.getId(),
                user != null ? user.getId() : null,
                user != null ? user.getUsername() : null,
                user != null ? user.getEmail() : null,
                user != null ? user.getFullName() : null,
                user != null ? user.getPhone() : null,
                doctor.getSpecialtyId(),
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

    private SpecialtyResponse toSpecialtyResponse(Specialty specialty) {
        return new SpecialtyResponse(
                specialty.getId(),
                specialty.getName(),
                specialty.getDescription(),
                specialty.getActive()
        );
    }

    private MedicineResponse toMedicineResponse(Medicine medicine) {
        return new MedicineResponse(
                medicine.getId(),
                medicine.getName(),
                medicine.getUnit(),
                medicine.getStockQuantity(),
                medicine.getPrice() != null ? medicine.getPrice().toPlainString() : null,
                medicine.getDescription(),
                medicine.getActive()
        );
    }

    private SlotConfigResponse toSlotConfigResponse(SlotConfig slotConfig) {
        return new SlotConfigResponse(
                slotConfig.getId(),
                slotConfig.getName(),
                slotConfig.getWorkingStart(),
                slotConfig.getWorkingEnd(),
                slotConfig.getSlotDurationMinutes(),
                slotConfig.getNotes(),
                slotConfig.getActive()
        );
    }

    private NotificationResponse toNotificationResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getTargetRole(),
                notification.getActive(),
                notification.getCreatedAt() != null ? notification.getCreatedAt().format(DATETIME_FORMAT) : null
        );
    }

    private RevenueDailyItemResponse toRevenueDailyItem(RevenueDailyProjection projection) {
        return new RevenueDailyItemResponse(
                projection.getAppointmentDate() != null ? projection.getAppointmentDate().format(DATE_FORMAT) : null,
                projection.getPaidAppointments() == null ? 0 : projection.getPaidAppointments().intValue(),
                projection.getRevenue() == null ? 0 : projection.getRevenue()
        );
    }

    private void validateDoctorCreateRequest(AdminDoctorRequest request) {
        if (isBlank(request.getUsername()) || isBlank(request.getEmail()) || isBlank(request.getPassword())
                || isBlank(request.getFullName())) {
            throw new ApiException("Username, email, password and full name are required");
        }
    }

    private void validateSpecialtyRequest(SpecialtyRequest request) {
        if (isBlank(request.getName())) {
            throw new ApiException("Specialty name is required");
        }
    }

    private void validateMedicineRequest(MedicineRequest request) {
        if (isBlank(request.getName())) {
            throw new ApiException("Medicine name is required");
        }
    }

    private void validateSlotConfigRequest(SlotConfigRequest request) {
        if (isBlank(request.getName()) || isBlank(request.getWorkingStart()) || isBlank(request.getWorkingEnd())
                || request.getSlotDurationMinutes() == null) {
            throw new ApiException("Slot name, working time and duration are required");
        }
    }

    private void validateNotificationRequest(NotificationRequest request) {
        if (isBlank(request.getTitle()) || isBlank(request.getMessage()) || isBlank(request.getTargetRole())) {
            throw new ApiException("Title, message and target role are required");
        }
    }

    private LocalDate parseDateOrDefault(String raw, LocalDate fallback) {
        if (isBlank(raw)) {
            return fallback;
        }
        try {
            return LocalDate.parse(raw.trim(), DATE_FORMAT);
        } catch (Exception exception) {
            throw new ApiException("Invalid date format. Use yyyy-MM-dd");
        }
    }

    private BigDecimal parseBigDecimalOrNull(String raw) {
        if (isBlank(raw)) {
            return null;
        }
        try {
            return new BigDecimal(raw.trim());
        } catch (Exception exception) {
            throw new ApiException("Invalid decimal value");
        }
    }

    private String trimOrNull(String raw) {
        if (isBlank(raw)) {
            return null;
        }
        return raw.trim();
    }

    private String defaultString(String raw, String fallback) {
        if (isBlank(raw)) {
            return fallback;
        }
        return raw.trim();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
