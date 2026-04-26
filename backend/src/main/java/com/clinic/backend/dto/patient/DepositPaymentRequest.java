package com.clinic.backend.dto.patient;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class DepositPaymentRequest {

    @NotNull
    private Double amount;
}
