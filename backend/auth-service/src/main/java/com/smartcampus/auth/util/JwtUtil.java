package com.smartcampus.auth.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtUtil(
            @Value("${jwt.secret:SmartCampus-Super-Secret-Key-2026-Minimum-32-Characters}") String secret,
            @Value("${jwt.expiration-ms:86400000}") long expirationMs) {
        // Ensure key is at least 256 bits for HS256
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("JWT secret must be at least 32 characters long");
        }
        this.signingKey = Keys.hmacShaKeyFor(keyBytes);
        this.expirationMs = expirationMs;
    }

    /**
     * Generate a signed JWT token with user claims.
     */
    public String generateToken(Long userId, String email, String role, Long collegeId, String name) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .subject(email)
                .claims(Map.of(
                        "userId", userId,
                        "role", role,
                        "collegeId", collegeId != null ? collegeId : 0L,
                        "name", name != null ? name : email
                ))
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    /**
     * Validate token and return all claims. Returns null if invalid.
     */
    public Claims validateAndExtractClaims(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public String extractEmail(String token) {
        Claims claims = validateAndExtractClaims(token);
        return claims != null ? claims.getSubject() : null;
    }

    public String extractRole(String token) {
        Claims claims = validateAndExtractClaims(token);
        return claims != null ? claims.get("role", String.class) : null;
    }

    public boolean isTokenValid(String token) {
        return validateAndExtractClaims(token) != null;
    }
}
