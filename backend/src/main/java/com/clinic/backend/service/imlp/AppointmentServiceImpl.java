package com.clinic.backend.service.imlp;

import com.clinic.backend.entity.Appointment;
import com.clinic.backend.entity.Doctor;
import com.clinic.backend.entity.Patient;
import com.clinic.backend.exception.ApiException;
import com.clinic.backend.repository.AppointmentRepository;
import com.clinic.backend.repository.DoctorRepository;
import com.clinic.backend.repository.PatientRepository;
import com.clinic.backend.service.AppointmentService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    @Override
    public Appointment create(Long userId, Long doctorId, LocalDate date, LocalTime time, String reason) {

        if (userId == null) {
            throw new ApiException("Thiếu thông tin bệnh nhân");
        }

        if (doctorId == null) {
            throw new ApiException("Thiếu thông tin bác sĩ");
        }

        if (date == null || time == null) {
            throw new ApiException("Ngày hoặc giờ không được để trống");
        }

        if (date.isBefore(LocalDate.now())) {
            throw new ApiException("Không thể đặt lịch trong quá khứ");
        }

        boolean exists = appointmentRepository
                .existsByDoctorIdAndAppointmentDateAndSlotTime(doctorId, date, time);

        if (exists) {
            throw new ApiException("Bác sĩ đã có lịch ở thời điểm này");
        }

        Patient patient = patientRepository.findById(userId)
                .orElseThrow(() -> new ApiException("Không tìm thấy bệnh nhân"));

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ApiException("Không tìm thấy bác sĩ"));

        Appointment ap = new Appointment();
        ap.setPatient(patient);
        ap.setDoctor(doctor);
        ap.setAppointmentDate(date);
        ap.setSlotTime(time);
        ap.setReason(reason);
        ap.setStatus("BOOKED");
        ap.setPaymentStatus("UNPAID");
        ap.setDepositAmount(100000d);
        ap.setReviewed(false);
        ap.setReviewRating(null);
        ap.setReviewComment(null);

        return appointmentRepository.save(ap);
    }

    @Override
    public List<Appointment> getMyAppointments(Long userId) {
        if (userId == null) {
            throw new ApiException("Thiếu thông tin bệnh nhân");
        }

        return appointmentRepository.findByPatientId(userId);
    }

    @Override
    public void cancel(Long id) {
        if (id == null) {
            throw new ApiException("Thiếu mã lịch hẹn");
        }

        Appointment ap = appointmentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Không tìm thấy lịch hẹn"));

        if ("CANCELLED".equalsIgnoreCase(ap.getStatus())) {
            throw new ApiException("Lịch hẹn đã được hủy trước đó");
        }

        ap.setStatus("CANCELLED");
        appointmentRepository.save(ap);
    }
    // 🔥 THÊM VÀO CUỐI FILE

public Appointment createByUsername(String username, Long doctorId, LocalDate date, LocalTime time, String reason) {

    Patient patient = patientRepository.findByUserUsername(username)
            .orElseThrow(() -> new ApiException("Không tìm thấy bệnh nhân"));

    Doctor doctor = doctorRepository.findById(doctorId)
            .orElseThrow(() -> new ApiException("Không tìm thấy bác sĩ"));

    boolean exists = appointmentRepository
            .existsByDoctorIdAndAppointmentDateAndSlotTime(doctorId, date, time);

    if (exists) {
        throw new ApiException("Bác sĩ đã có lịch");
    }

    Appointment ap = new Appointment();
    ap.setPatient(patient);
    ap.setDoctor(doctor);
    ap.setAppointmentDate(date);
    ap.setSlotTime(time);
    ap.setReason(reason);
    ap.setStatus("BOOKED");
    ap.setPaymentStatus("UNPAID");
    ap.setDepositAmount(100000d);
    ap.setReviewed(false);
    ap.setReviewRating(null);
    ap.setReviewComment(null);

    return appointmentRepository.save(ap);
}
}

