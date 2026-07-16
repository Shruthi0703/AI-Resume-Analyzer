package com.airesume.resumeanalyzer.util;

import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {

    private static final String SECRET =
            "my_super_secret_key_for_resume_analyzer_project_2026_123456789";

    private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

    // Generate JWT Token
    public String generateToken(String email) {

        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Extract Username
    public String extractUsername(String token) {

        return getClaims(token).getSubject();
    }

    // Validate Token
    public boolean validateToken(String token, String email) {

        return extractUsername(token).equals(email)
                && !isTokenExpired(token);
    }

    // Check Expiration
    private boolean isTokenExpired(String token) {

        return getClaims(token).getExpiration().before(new Date());
    }

    // Get Claims
    private Claims getClaims(String token) {

        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}