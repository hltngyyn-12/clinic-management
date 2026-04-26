package com.clinic.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private String targetRole;
    private Boolean active;
    private String createdAt;
}
