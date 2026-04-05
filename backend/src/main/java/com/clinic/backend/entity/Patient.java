package com.clinic.backend.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "patient")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Date dateOfBirth;
    private String gender;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Long getId() {
    return id;
    }
}