package com.clinic.backend.dto.test;

import lombok.Data;

@Data
public class TestResponse {

    private Long id;
    private String testName;
    private String status;
}