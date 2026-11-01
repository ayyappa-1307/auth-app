package com.example.server.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import com.example.server.config.AppProperties;
import com.example.server.user.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class JwtService {

	private final AppProperties appProperties;

	public String generateToken(User user) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + appProperties.getJwt().getExpirationMs());
		return Jwts.builder()
				.subject(user.getEmail())
				.claim("uid", user.getId())
				.claim("name", user.getFullName())
				.issuedAt(now)
				.expiration(expiry)
				.signWith(signingKey())
				.compact();
	}

	public String extractEmail(String token) {
		return parseClaims(token).getSubject();
	}

	public boolean isValid(String token, User user) {
		try {
			Claims claims = parseClaims(token);
			return user.getEmail().equalsIgnoreCase(claims.getSubject())
					&& claims.getExpiration().after(new Date());
		} catch (JwtException | IllegalArgumentException ex) {
			return false;
		}
	}

	private Claims parseClaims(String token) {
		return Jwts.parser()
				.verifyWith(signingKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}

	private SecretKey signingKey() {
		byte[] keyBytes = appProperties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8);
		if (keyBytes.length < 32) {
			try {
				keyBytes = MessageDigest.getInstance("SHA-256").digest(keyBytes);
			} catch (Exception e) {
				throw new IllegalStateException("Unable to derive JWT signing key", e);
			}
		}
		return Keys.hmacShaKeyFor(keyBytes);
	}
}
