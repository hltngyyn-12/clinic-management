package com.clinic.backend.service;

import com.clinic.backend.dto.auth.AuthResponse;
import com.clinic.backend.dto.auth.LoginRequest;
import com.clinic.backend.dto.auth.RegisterRequest;
import com.clinic.backend.entity.Role;
import com.clinic.backend.entity.User;
import com.clinic.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        validateRegisterRequest(request);

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email đã được sử dụng");
        }

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim());
        user.setFullName(request.getFullName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(parseRole(request.getRole()));

        userRepository.save(user);

        return new AuthResponse(
                "Đăng ký thành công",
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    public AuthResponse login(LoginRequest request) {
        validateLoginRequest(request);

        String usernameOrEmail = request.getUsernameOrEmail().trim();

        Optional<User> optionalUser = userRepository.findByUsername(usernameOrEmail);

        if (optionalUser.isEmpty()) {
            optionalUser = userRepository.findByEmail(usernameOrEmail);
        }

        User user = optionalUser.orElseThrow(() ->
                new RuntimeException("Sai tên đăng nhập, email hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Sai tên đăng nhập, email hoặc mật khẩu");
        }

        return new AuthResponse(
                "Đăng nhập thành công",
                user.getUsername(),
                user.getEmail(),
                user.getRole().name()
        );
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (request == null) {
            throw new RuntimeException("Thiếu dữ liệu yêu cầu");
        }

        if (isBlank(request.getUsername())) {
            throw new RuntimeException("Tên đăng nhập không được để trống");
        }

        if (isBlank(request.getEmail())) {
            throw new RuntimeException("Email không được để trống");
        }

        if (isBlank(request.getPassword())) {
            throw new RuntimeException("Mật khẩu không được để trống");
        }

        if (isBlank(request.getFullName())) {
            throw new RuntimeException("Họ và tên không được để trống");
        }

        if (isBlank(request.getRole())) {
            throw new RuntimeException("Vai trò không được để trống");
        }
    }

    private void validateLoginRequest(LoginRequest request) {
        if (request == null) {
            throw new RuntimeException("Thiếu dữ liệu yêu cầu");
        }

        if (isBlank(request.getUsernameOrEmail())) {
            throw new RuntimeException("Tên đăng nhập hoặc email không được để trống");
        }

        if (isBlank(request.getPassword())) {
            throw new RuntimeException("Mật khẩu không được để trống");
        }
    }

    private Role parseRole(String role) {
        try {
            return Role.valueOf(role.trim().toUpperCase());
        } catch (Exception e) {
            throw new RuntimeException("Vai trò không hợp lệ. Chỉ chấp nhận: ADMIN, DOCTOR, PATIENT");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
