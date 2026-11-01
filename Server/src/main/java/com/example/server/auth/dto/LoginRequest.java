package com.example.server.auth.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {

	@NotBlank(message = "Email is required")
	@JsonAlias("username")
	private String email;

	@NotBlank(message = "Password is required")
	private String password;
}
