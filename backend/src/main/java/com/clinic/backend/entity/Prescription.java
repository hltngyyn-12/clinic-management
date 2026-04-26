package com.clinic.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
@Getter
@Setter
public class Prescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "medical_record_id")
    private MedicalRecord medicalRecord;

    private String medicineName;
    private String dosage;
    private String instructions;

    private String duration;
    private String frequency;

    @Column(name = "medicine_id", nullable = false)
    private Long medicineId;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;
}
