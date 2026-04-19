package com.clinic.backend.controller;

import com.clinic.backend.entity.Doctor;
import com.clinic.backend.repository.DoctorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors") // 👈 FIX Ở ĐÂY (THÊM S)
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // 👉 API chính cho frontend
    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // 👉 test riêng
    @GetMapping("/test")
    public String testDoctor() {
        return "DOCTOR OK";
    }
}