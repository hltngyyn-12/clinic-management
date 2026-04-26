package com.clinic.backend.dto.admin;

import lombok.Data;

@Data
public class NotificationRequest {
    private String title;
    private String message;
    private String targetRole;
    private Boolean active;
}
