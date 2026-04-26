package com.clinic.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenueDailyItemResponse {
    private String date;
    private int paidAppointments;
    private double revenue;
}
