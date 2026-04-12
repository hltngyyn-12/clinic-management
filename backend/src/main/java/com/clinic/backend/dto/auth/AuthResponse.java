package com.clinic.backend.dto.auth;

public class AuthResponse {

    private String message;
    private String username;
    private String email;
    private String role;
    private String token;
    private String refreshToken;

    public AuthResponse() {
    }

    public AuthResponse(String message,
                        String username,
                        String email,
                        String role,
                        String token,
                        String refreshToken) {
        this.message = message;
        this.username = username;
        this.email = email;
        this.role = role;
        this.token = token;
        this.refreshToken = refreshToken;
    }

    public String getMessage() {
        return message;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getToken() {
        return token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }
}
