package com.clinic.backend.service.imlp;

import com.clinic.backend.config.MomoProperties;
import com.clinic.backend.dto.patient.InvoiceResponse;
import com.clinic.backend.dto.patient.PaymentInitResponse;
import com.clinic.backend.entity.Appointment;
import com.clinic.backend.entity.AppointmentInvoice;
import com.clinic.backend.entity.PaymentTransaction;
import com.clinic.backend.exception.ApiException;
import com.clinic.backend.repository.AppointmentInvoiceRepository;
import com.clinic.backend.repository.AppointmentRepository;
import com.clinic.backend.repository.PaymentTransactionRepository;
import com.clinic.backend.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private static final DateTimeFormatter DISPLAY_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DISPLAY_TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");

    private final MomoProperties momoProperties;
    private final AppointmentRepository appointmentRepository;
    private final PaymentTransactionRepository paymentTransactionRepository;
    private final AppointmentInvoiceRepository appointmentInvoiceRepository;

    private final RestClient restClient = RestClient.create();

    @Override
    @Transactional
    public PaymentInitResponse createMomoPayment(String username, Long appointmentId) {
        Appointment appointment = getOwnedAppointment(username, appointmentId);

        if ("PAID".equalsIgnoreCase(safeText(appointment.getPaymentStatus()))) {
            throw new ApiException("Lịch hẹn này đã được thanh toán đặt cọc.");
        }
        if ("CANCELLED".equalsIgnoreCase(safeText(appointment.getStatus()))) {
            throw new ApiException("Không thể thanh toán cho lịch đã hủy.");
        }

        long amount = Math.round(appointment.getDepositAmount() == null ? 100000d : appointment.getDepositAmount());
        String transactionRef = buildTransactionRef(appointment.getId());
        String orderId = buildProviderOrderId(appointment.getId());
        String extraData = "";
        String requestType = safeText(momoProperties.getRequestType(), "captureWallet");

        String rawSignature =
                "accessKey=" + momoProperties.getAccessKey()
                        + "&amount=" + amount
                        + "&extraData=" + extraData
                        + "&ipnUrl=" + momoProperties.getIpnUrl()
                        + "&orderId=" + orderId
                        + "&orderInfo=" + buildOrderInfo(appointment.getId())
                        + "&partnerCode=" + momoProperties.getPartnerCode()
                        + "&redirectUrl=" + momoProperties.getRedirectUrl()
                        + "&requestId=" + transactionRef
                        + "&requestType=" + requestType;

        String signature = hmacSha256(momoProperties.getSecretKey(), rawSignature);

        Map<String, Object> requestBody = new LinkedHashMap<>();
        requestBody.put("partnerCode", momoProperties.getPartnerCode());
        requestBody.put("partnerName", safeText(momoProperties.getStoreName(), "ClinicMS"));
        requestBody.put("storeId", safeText(momoProperties.getStoreId(), "ClinicMS"));
        requestBody.put("requestId", transactionRef);
        requestBody.put("amount", amount);
        requestBody.put("orderId", orderId);
        requestBody.put("orderInfo", buildOrderInfo(appointment.getId()));
        requestBody.put("redirectUrl", momoProperties.getRedirectUrl());
        requestBody.put("ipnUrl", momoProperties.getIpnUrl());
        requestBody.put("extraData", extraData);
        requestBody.put("requestType", requestType);
        requestBody.put("signature", signature);
        requestBody.put("lang", safeText(momoProperties.getLang(), "vi"));
        requestBody.put("autoCapture", true);

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restClient.post()
                .uri(momoProperties.getCreateEndpoint())
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        if (response == null) {
            throw new ApiException("Không nhận được phản hồi từ MoMo.");
        }

        Number resultCode = (Number) response.get("resultCode");
        String message = String.valueOf(response.getOrDefault("message", "Không khởi tạo được thanh toán."));
        if (resultCode == null || resultCode.intValue() != 0) {
            throw new ApiException(message);
        }

        String payUrl = String.valueOf(response.get("payUrl"));
        String providerTransId = response.get("transId") == null ? null : String.valueOf(response.get("transId"));

        PaymentTransaction transaction = new PaymentTransaction();
        transaction.setAppointment(appointment);
        transaction.setPatient(appointment.getPatient());
        transaction.setProvider("MOMO");
        transaction.setTransactionRef(transactionRef);
        transaction.setProviderOrderId(orderId);
        transaction.setProviderTransactionNo(providerTransId);
        transaction.setAmount((double) amount);
        transaction.setStatus("PENDING");
        transaction.setResponseCode(String.valueOf(resultCode.intValue()));
        transaction.setMessage(message);
        transaction.setPaymentUrl(payUrl);
        paymentTransactionRepository.save(transaction);

        return new PaymentInitResponse("MOMO", appointment.getId(), transactionRef, payUrl);
    }

    @Override
    @Transactional
    public String handleMomoRedirect(Map<String, String> params) {
        try {
            PaymentProcessingResult result = processMomoCallback(params);
            return UriComponentsBuilder.fromUriString(momoProperties.getFrontendResultUrl())
                    .queryParam("status", result.success() ? "success" : "failed")
                    .queryParam("appointmentId", result.appointmentId())
                    .queryParam("code", result.code())
                    .encode(StandardCharsets.UTF_8)
                    .build()
                    .toUriString();
        } catch (Exception ex) {
            return UriComponentsBuilder.fromUriString(momoProperties.getFrontendResultUrl())
                    .queryParam("status", "failed")
                    .queryParam("appointmentId", 0)
                    .queryParam("code", "CALLBACK_ERROR")
                    .encode(StandardCharsets.UTF_8)
                    .build()
                    .toUriString();
        }
    }

    @Override
    @Transactional
    public void handleMomoIpn(Map<String, Object> payload) {
        Map<String, String> params = new LinkedHashMap<>();
        payload.forEach((key, value) -> params.put(key, value == null ? "" : String.valueOf(value)));
        processMomoCallback(params);
    }

    @Override
    public InvoiceResponse getAppointmentInvoice(String username, Long appointmentId) {
        Appointment appointment = getOwnedAppointment(username, appointmentId);
        AppointmentInvoice invoice = appointmentInvoiceRepository.findByAppointmentId(appointment.getId())
                .orElseThrow(() -> new ApiException("Chưa có hóa đơn cho lịch hẹn này."));
        return toInvoiceResponse(invoice);
    }

    private PaymentProcessingResult processMomoCallback(Map<String, String> params) {
        String orderId = safeText(params.get("orderId"));
        if (orderId.isBlank()) {
            throw new ApiException("Không tìm thấy orderId từ MoMo.");
        }

        PaymentTransaction transaction = paymentTransactionRepository.findByProviderOrderId(orderId)
                .orElseThrow(() -> new ApiException("Không tìm thấy giao dịch thanh toán."));

        if (!isValidMomoSignature(params)) {
            markFailedTransaction(transaction, "INVALID_SIGNATURE", "Sai chữ ký xác thực MoMo.");
            return new PaymentProcessingResult(
                    false,
                    transaction.getAppointment().getId(),
                    "INVALID_SIGNATURE",
                    "Chữ ký xác thực không hợp lệ."
            );
        }

        int resultCode = parseResultCode(params.get("resultCode"));
        String message = safeText(params.get("message"), "Giao dịch chưa hoàn tất.");

        if (resultCode != 0) {
            markFailedTransaction(transaction, String.valueOf(resultCode), message);
            return new PaymentProcessingResult(
                    false,
                    transaction.getAppointment().getId(),
                    String.valueOf(resultCode),
                    message
            );
        }

        if (!"SUCCESS".equalsIgnoreCase(safeText(transaction.getStatus()))) {
            transaction.setStatus("SUCCESS");
            transaction.setResponseCode(String.valueOf(resultCode));
            transaction.setMessage(message);
            transaction.setProviderTransactionNo(safeText(params.get("transId")));
            transaction.setPaidAt(LocalDateTime.now());
            paymentTransactionRepository.save(transaction);

            Appointment appointment = transaction.getAppointment();
            appointment.setPaymentStatus("PAID");
            appointment.setDepositAmount(transaction.getAmount());
            appointmentRepository.save(appointment);

            ensureInvoice(transaction, appointment);
        }

        return new PaymentProcessingResult(
                true,
                transaction.getAppointment().getId(),
                "SUCCESS",
                "Thanh toán đặt cọc thành công."
        );
    }

    private void ensureInvoice(PaymentTransaction transaction, Appointment appointment) {
        if (appointmentInvoiceRepository.findByAppointmentId(appointment.getId()).isPresent()) {
            return;
        }

        AppointmentInvoice invoice = new AppointmentInvoice();
        invoice.setAppointment(appointment);
        invoice.setPaymentTransaction(transaction);
        invoice.setInvoiceNumber(buildInvoiceNumber(appointment.getId()));
        invoice.setPatientName(appointment.getPatient() != null ? appointment.getPatient().getName() : "Bệnh nhân");
        invoice.setDoctorName(appointment.getDoctor() != null ? appointment.getDoctor().getName() : "Bác sĩ");
        invoice.setSpecialty(appointment.getDoctor() != null ? safeText(appointment.getDoctor().getSpecialty()) : "");
        invoice.setAmount(transaction.getAmount());
        invoice.setPaymentMethod("MOMO");
        invoice.setPaymentStatus("PAID");
        appointmentInvoiceRepository.save(invoice);
    }

    private void markFailedTransaction(PaymentTransaction transaction, String responseCode, String message) {
        transaction.setStatus("FAILED");
        transaction.setResponseCode(responseCode);
        transaction.setMessage(message);
        paymentTransactionRepository.save(transaction);
    }

    private Appointment getOwnedAppointment(String username, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ApiException("Không tìm thấy lịch khám."));

        if (appointment.getPatient() == null
                || appointment.getPatient().getUser() == null
                || !username.equals(appointment.getPatient().getUser().getUsername())) {
            throw new ApiException("Bạn không có quyền thao tác lịch hẹn này.");
        }
        return appointment;
    }

    private boolean isValidMomoSignature(Map<String, String> params) {
        String provided = safeText(params.get("signature"));
        if (provided.isBlank()) {
            return false;
        }

        String rawSignature =
                "accessKey=" + momoProperties.getAccessKey()
                        + "&amount=" + safeText(params.get("amount"))
                        + "&extraData=" + safeText(params.get("extraData"))
                        + "&message=" + safeText(params.get("message"))
                        + "&orderId=" + safeText(params.get("orderId"))
                        + "&orderInfo=" + safeText(params.get("orderInfo"))
                        + "&orderType=" + safeText(params.get("orderType"))
                        + "&partnerCode=" + safeText(params.get("partnerCode"))
                        + "&payType=" + safeText(params.get("payType"))
                        + "&requestId=" + safeText(params.get("requestId"))
                        + "&responseTime=" + safeText(params.get("responseTime"))
                        + "&resultCode=" + safeText(params.get("resultCode"))
                        + "&transId=" + safeText(params.get("transId"));

        String calculated = hmacSha256(momoProperties.getSecretKey(), rawSignature);
        return provided.equals(calculated);
    }

    private String hmacSha256(String secret, String data) {
        try {
            Mac hmac = Mac.getInstance("HmacSHA256");
            hmac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] bytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hash = new StringBuilder();
            for (byte item : bytes) {
                hash.append(String.format("%02x", item));
            }
            return hash.toString();
        } catch (Exception ex) {
            throw new ApiException("Không thể tạo chữ ký MoMo.");
        }
    }

    private int parseResultCode(String resultCode) {
        try {
            return Integer.parseInt(safeText(resultCode, "-1"));
        } catch (Exception ex) {
            return -1;
        }
    }

    private String buildTransactionRef(Long appointmentId) {
        return "MOMOAPT" + appointmentId + System.currentTimeMillis();
    }

    private String buildProviderOrderId(Long appointmentId) {
        return "APT" + appointmentId + "M" + System.currentTimeMillis();
    }

    private String buildOrderInfo(Long appointmentId) {
        return "Thanh toan dat coc lich hen " + appointmentId;
    }

    private String buildInvoiceNumber(Long appointmentId) {
        return "INV-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + "-" + appointmentId;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String safeText(String value, String fallback) {
        String normalized = safeText(value);
        return normalized.isBlank() ? fallback : normalized;
    }

    private InvoiceResponse toInvoiceResponse(AppointmentInvoice invoice) {
        Appointment appointment = invoice.getAppointment();
        PaymentTransaction transaction = invoice.getPaymentTransaction();
        return new InvoiceResponse(
                invoice.getId(),
                invoice.getInvoiceNumber(),
                appointment.getId(),
                invoice.getPatientName(),
                invoice.getDoctorName(),
                invoice.getSpecialty(),
                appointment.getAppointmentDate() != null ? appointment.getAppointmentDate().format(DISPLAY_DATE_FORMAT) : "",
                appointment.getSlotTime() != null ? appointment.getSlotTime().format(DISPLAY_TIME_FORMAT) : "",
                invoice.getAmount(),
                invoice.getPaymentMethod(),
                invoice.getPaymentStatus(),
                transaction != null ? transaction.getTransactionRef() : "",
                transaction != null ? safeText(transaction.getProviderTransactionNo()) : "",
                invoice.getIssuedAt() != null ? invoice.getIssuedAt().toString() : ""
        );
    }

    private record PaymentProcessingResult(boolean success, Long appointmentId, String code, String message) {
    }
}
