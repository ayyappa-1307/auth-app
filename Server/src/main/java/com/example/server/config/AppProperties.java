package com.example.server.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "app")
public class AppProperties {

	private final Cors cors = new Cors();
	private final Jwt jwt = new Jwt();

	@Getter
	@Setter
	public static class Cors {
		/**
		 * Comma-separated origins from CORS_ALLOWED_ORIGINS / app.cors.allowed-origins.
		 */
		private String allowedOrigins = "http://localhost:5173";

		public List<String> originList() {
			return Arrays.stream(allowedOrigins.split(","))
					.map(String::trim)
					.filter(s -> !s.isEmpty())
					.toList();
		}
	}

	@Getter
	@Setter
	public static class Jwt {
		private String secret;
		private long expirationMs = 86_400_000L;
	}
}
