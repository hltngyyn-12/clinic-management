package com.clinic.backend.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RevenueReportResponse {
    private String startDate;
    private String endDate;
    private int totalAppointments;
    private int paidAppointments;
    private double totalRevenue;
    private List<RevenueDailyItemResponse> dailyItems;
}
