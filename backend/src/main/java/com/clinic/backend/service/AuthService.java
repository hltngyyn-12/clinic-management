package com.clinic.backend.service;

import com.clinic.backend.dto.auth.AuthResponse;
import com.clinic.backend.dto.auth.LoginRequest;
import com.clinic.backend.dto.auth.RegisterRequest;
import com.clinic.backend.entity.RefreshToken;
import com.clinic.backend.entity.Role;
import com.clinic.backend.entity.User;
import com.clinic.backend.exception.ApiException;
import com.clinic.backend.repository.UserRepository;
import com.clinic.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       RefreshTokenService refreshTokenService) {
        this.userRepository = userRepository;
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
                user.getRole().name(),
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
