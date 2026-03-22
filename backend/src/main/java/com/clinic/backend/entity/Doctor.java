package com.clinic.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctor")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String specialty;
    private Integer experience;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    // getter setter
}