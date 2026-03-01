package com.neurofleetx.service;

import com.neurofleetx.config.JwtService;
import com.neurofleetx.dto.AuthResponse;
import com.neurofleetx.dto.LoginRequest;
import com.neurofleetx.dto.RegisterRequest;
import com.neurofleetx.dto.UserProfileResponse;
import com.neurofleetx.model.Role;
import com.neurofleetx.model.User;
import com.neurofleetx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
        }

        validateRoleSpecificFields(request);

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .gender(request.getGender())
                .registrationNumber(request.getRole() == Role.ADMIN ? request.getRegistrationNumber() : null)
                .companyName(request.getRole() == Role.FLEET_MANAGER ? request.getCompanyName() : null)
                .licenseNumber(request.getRole() == Role.DRIVER ? request.getLicenseNumber() : null)
                .phoneNumber(request.getRole() == Role.CUSTOMER ? request.getPhoneNumber() : null)
                .city(request.getRole() == Role.CUSTOMER ? request.getCity() : null)
                .build();

        userRepository.save(user);
        return "User registered successfully";
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (user.getRole() != request.getRole()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Role does not match user account");
        }

        UserDetails userDetails = org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPassword())
            .authorities("ROLE_" + user.getRole().name())
            .build();
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .role(user.getRole().name())
            .fullName(user.getFullName())
                .email(user.getEmail())
                .gender(user.getGender())
                .companyName(user.getCompanyName())
                .build();
    }

    public void deleteAccount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        userRepository.delete(user);
    }

    public UserProfileResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return UserProfileResponse.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .gender(user.getGender())
                .role(user.getRole().name())
                .licenseNumber(user.getLicenseNumber())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }

    private void validateRoleSpecificFields(RegisterRequest request) {
        Role role = request.getRole();

        switch (role) {
            case ADMIN -> {
                if (isBlank(request.getRegistrationNumber())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Registration number is required for ADMIN");
                }
            }
            case FLEET_MANAGER -> {
                if (isBlank(request.getCompanyName())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Company name is required for FLEET_MANAGER");
                }
            }
            case DRIVER -> {
                if (isBlank(request.getLicenseNumber())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "License number is required for DRIVER");
                }
            }
            case CUSTOMER -> {
                if (isBlank(request.getPhoneNumber())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phone number is required for CUSTOMER");
                }
                if (isBlank(request.getCity())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "City is required for CUSTOMER");
                }
            }
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
