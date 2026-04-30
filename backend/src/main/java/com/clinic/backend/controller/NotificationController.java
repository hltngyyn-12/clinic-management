package com.clinic.backend.controller;

import com.clinic.backend.dto.admin.NotificationResponse;
import com.clinic.backend.dto.common.ApiResponse;
import com.clinic.backend.entity.Notification;
import com.clinic.backend.security.CustomUserDetails;
import com.clinic.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private final NotificationRepository notificationRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMyNotifications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String role = userDetails.getRole();
        List<NotificationResponse> notifications = notificationRepository
                .findAllByActiveTrueAndTargetRoleInOrderByCreatedAtDesc(List.of(role, "ALL"))
                .stream()
                .map(this::toResponse)
                .toList();

        return ResponseEntity.ok(new ApiResponse<>(true, "Notifications fetched successfully", notifications));
    }

    private NotificationResponse toResponse(Notification notification) {
        return new NotificationResponse(
                notification.getId(),
                notification.getTitle(),
                notification.getMessage(),
                notification.getTargetRole(),
                notification.getActive(),
                notification.getCreatedAt() != null ? notification.getCreatedAt().format(DATETIME_FORMAT) : null
        );
    }
}
