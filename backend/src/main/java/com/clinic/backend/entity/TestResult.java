package com.clinic.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "test_results")
@Getter
@Setter
public class TestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "test_request_id")
    private TestRequest testRequest;

    private String result;
    private String conclusion;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @Column(name = "request_note")
    private String requestNote;

    @Column(name = "result_date")
    private LocalDate resultDate;

    @Column(name = "result_text")
    private String resultText;

    private String status;

    @Column(name = "test_name")
    private String testName;

    @ManyToOne
    @JoinColumn(name = "medical_record_id", nullable = false)
    private MedicalRecord medicalRecord;
}
