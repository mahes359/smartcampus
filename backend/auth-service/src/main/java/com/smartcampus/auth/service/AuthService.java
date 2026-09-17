package com.smartcampus.auth.service;

import com.smartcampus.auth.dto.AuthResponse;
import com.smartcampus.auth.dto.LoginRequest;
import com.smartcampus.auth.dto.RegisterRequest;
import com.smartcampus.auth.entity.AppUser;
import com.smartcampus.auth.repository.UserRepository;
import com.smartcampus.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    /**
     * Authenticate a user with email and password.
     * Returns a signed JWT token + user info on success.
     * Throws RuntimeException on failure (controller maps to 401).
     */
    public AuthResponse login(LoginRequest request) {
        AppUser user = userRepository
                .findByEmailIgnoreCase(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!user.isActive()) {
            throw new RuntimeException("Account is disabled. Please contact your administrator.");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(
                user.getId(),
                user.getEmail(),
                user.getRole(),
                user.getCollegeId(),
                user.getName()
        );

        AuthResponse.UserInfo userInfo = AuthResponse.UserInfo.builder()
                .id(user.getId().toString())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .collegeId(user.getCollegeId())
                .build();

        log.info("User logged in: {} [{}]", user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .user(userInfo)
                .build();
    }

    /**
     * Register a new user account (SUPER_ADMIN only — enforced at controller level).
     */
    public AuthResponse.UserInfo register(RegisterRequest request) {
        if (!com.smartcampus.auth.constants.AppRoles.isValidRole(request.getRole())) {
            throw new IllegalArgumentException("Invalid role. Supported roles: " + com.smartcampus.auth.constants.AppRoles.ALL_ROLES);
        }

        if (userRepository.existsByEmailIgnoreCase(request.getEmail())) {
            throw new RuntimeException("A user with this email already exists");
        }

        String normalizedRole = com.smartcampus.auth.constants.AppRoles.normalizeRole(request.getRole());

        AppUser user = AppUser.builder()
                .email(request.getEmail().toLowerCase().trim())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .name(request.getName().trim())
                .role(normalizedRole)
                .collegeId(request.getCollegeId())
                .active(true)
                .build();

        AppUser saved = userRepository.save(user);
        log.info("New user registered: {} [{}]", saved.getEmail(), saved.getRole());

        return AuthResponse.UserInfo.builder()
                .id(saved.getId().toString())
                .name(saved.getName())
                .email(saved.getEmail())
                .role(saved.getRole())
                .collegeId(saved.getCollegeId())
                .build();
    }

    /**
     * Change password for the currently authenticated user.
     */
    public void changePassword(String email, String currentPassword, String newPassword) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("Authentication required");
        }

        if (newPassword == null || newPassword.length() < 6) {
            throw new IllegalArgumentException("New password must be at least 6 characters long");
        }

        AppUser user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isActive()) {
            throw new RuntimeException("Account is disabled");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new RuntimeException("Current password does not match");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password successfully changed for user: {}", user.getEmail());
    }
}
