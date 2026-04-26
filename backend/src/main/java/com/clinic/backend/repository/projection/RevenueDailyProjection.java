package com.clinic.backend.repository.projection;

import java.time.LocalDate;

public interface RevenueDailyProjection {
    LocalDate getAppointmentDate();

    Long getPaidAppointments();

    Double getRevenue();
}
