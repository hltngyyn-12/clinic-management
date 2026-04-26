package com.clinic.backend.service;

import com.clinic.backend.dto.patient.*;

import java.util.List;

public interface PatientPortalService {
    List<DoctorOptionResponse> getDoctors();
    List<String> getAvailableSlots(Long doctorId, String date);
    AppointmentResponse bookAppointment(String username, AppointmentBookingRequest request);
    AppointmentResponse payDeposit(String username, Long appointmentId, DepositPaymentRequest request);
    List<AppointmentResponse> getAppointments(String username);
    List<MedicalHistoryResponse> getMedicalHistory(String username);
    List<PatientPrescriptionResponse> getPrescriptions(String username);
    List<PatientTestResultResponse> getTestResults(String username);
    ReviewResponse createReview(String username, CreateReviewRequest request);
    List<ReviewResponse> getMyReviews(String username);
    List<ReviewResponse> getDoctorReviews(Long doctorId);
}
