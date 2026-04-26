package com.clinic.backend.controller;

import com.clinic.backend.entity.Doctor;
import com.clinic.backend.repository.DoctorRepository;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public List<Map<String, Object>> getAllDoctors() {
        return doctorRepository.findAll()
                .stream()
                .map(d -> {
                    Map<String, Object> res = new HashMap<>();
                    res.put("id", d.getId());
                    res.put("name", d.getName());
                    res.put("specialty", d.getSpecialty());
                    res.put("experience", d.getExperience());
                    return res;
                })
                .toList();
    }

    @GetMapping("/test")
    public String testDoctor() {
        return "DOCTOR OK";
    }
}