package com.clinic.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String home() {
        return "Clinic Management Backend is running";
    }

    @GetMapping("/api/test")
    public String test() {
        return "Backend test OK";
    }
}