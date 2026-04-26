package com.clinic.backend.service;

import com.clinic.backend.dto.auth.AuthResponse;
import com.clinic.backend.dto.auth.LoginRequest;
import com.clinic.backend.dto.auth.RegisterRequest;
import com.clinic.backend.entity.*;
import com.clinic.backend.exception.ApiException;
import com.clinic.backend.repository.DoctorRepository;
import com.clinic.backend.repository.PatientRepository;
import com.clinic.backend.repository.UserRepository;
import com.clinic.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(UserRepository userRepository,
                       PatientRepository patientRepository,
                       DoctorRepository doctorRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.refreshTokenService = refreshTokenService;
    }

    public AuthResponse register(RegisterRequest request) {
        validateRegisterRequest(request);

        if (userRepository.existsByUsername(request.getUsername().trim())) {
            throw new ApiException("Tên đăng nhập đã tồn tại");
        }

        if (userRepository.existsByEmail(request.getEmail().trim())) {
            throw new ApiException("Email đã được sử dụng");
        }

        Role role = parseRole(request.getRole());

        User user = new User();
        user.setUsername(request.getUsername().trim());
        user.setEmail(request.getEmail().trim());
        user.setFullName(request.getFullName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User savedUser = userRepository.save(user);
        createProfileIfNeeded(savedUser);

        return new AuthResponse(
                "Đăng ký thành công",
                savedUser.getUsername(),
                savedUser.getEmail(),
                savedUser.getRole().name(),
                null,
                null
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
                new ApiException("Sai tên đăng nhập, email hoặc mật khẩu"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ApiException("Sai tên đăng nhập, email hoặc mật khẩu");
        }

        String accessToken = jwtService.generateToken(
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPasswordHash())
                        .roles(user.getRole().name())
                        .build()
        );

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user);

        return new AuthResponse(
                "Đăng nhập thành công",
                user.getUsername(),
                user.getEmail(),
                user.getRole().name(),
                accessToken,
                refreshToken.getToken()
        );
    }

    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .or(() -> userRepository.findByEmail(username))
                .orElseThrow(() -> new ApiException("Không tìm thấy người dùng"));
    }

    public Map<String, String> refreshAccessToken(String refreshTokenValue) {
        if (isBlank(refreshTokenValue)) {
            throw new ApiException("Refresh token không được để trống");
        }

        RefreshToken refreshToken = refreshTokenService.verifyRefreshToken(refreshTokenValue);
        User user = refreshToken.getUser();

        String newAccessToken = jwtService.generateToken(
                org.springframework.security.core.userdetails.User
                        .withUsername(user.getUsername())
                        .password(user.getPasswordHash())
                        .roles(user.getRole().name())
                        .build()
        );

        return Map.of("accessToken", newAccessToken);
    }

    private void createProfileIfNeeded(User user) {
        if (user.getRole() == Role.PATIENT && patientRepository.findByUserId(user.getId()).isEmpty()) {
            Patient patient = new Patient();
            patient.setUser(user);
            patientRepository.save(patient);
        }

        if (user.getRole() == Role.DOCTOR && doctorRepository.findByUserId(user.getId()).isEmpty()) {
            Doctor doctor = new Doctor();
            doctor.setUser(user);
            doctor.setSpecialty("General");
            doctor.setExperience(0);
            doctor.setActive(true);
            doctor.setExperienceYears(0);
            doctor.setWorkingStart("09:00");
            doctor.setWorkingEnd("17:00");
            doctor.setSlotDurationMinutes(60);
            doctorRepository.save(doctor);
        }
    }

    private void validateRegisterRequest(RegisterRequest request) {
        if (request == null) {
            throw new ApiException("Thiếu dữ liệu yêu cầu");
        }

        if (isBlank(request.getUsername())) {
            throw new ApiException("Tên đăng nhập không được để trống");
        }

        if (isBlank(request.getEmail())) {
            throw new ApiException("Email không được để trống");
        }

        if (isBlank(request.getPassword())) {
            throw new ApiException("Mật khẩu không được để trống");
        }

        if (isBlank(request.getFullName())) {
            throw new ApiException("Họ và tên không được để trống");
        }

        if (isBlank(request.getRole())) {
            throw new ApiException("Vai trò không được để trống");
        }
    }

    private void validateLoginRequest(LoginRequest request) {
        if (request == null) {
            throw new ApiException("Thiếu dữ liệu yêu cầu");
        }

        if (isBlank(request.getUsernameOrEmail())) {
            throw new ApiException("Tên đăng nhập hoặc email không được để trống");
        }

        if (isBlank(request.getPassword())) {
            throw new ApiException("Mật khẩu không được để trống");
        }
    }

    private Role parseRole(String role) {
        try {
            return Role.valueOf(role.trim().toUpperCase());
        } catch (Exception e) {
            throw new ApiException("Vai trò không hợp lệ. Chỉ chấp nhận: ADMIN, DOCTOR, PATIENT");
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
