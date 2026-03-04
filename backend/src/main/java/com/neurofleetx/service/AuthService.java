package com.neurofleetx.service;

import com.neurofleetx.config.JwtService;
import com.neurofleetx.dto.AuthResponse;
import com.neurofleetx.dto.LoginRequest;
import com.neurofleetx.dto.RegisterRequest;
import com.neurofleetx.dto.UserProfileResponse;
import com.neurofleetx.model.Driver;
import com.neurofleetx.model.DriverStatus;
import com.neurofleetx.model.Role;
import com.neurofleetx.model.User;
import com.neurofleetx.repository.DriverRepository;
import com.neurofleetx.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final DriverRepository driverRepository;

    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
        }

        validateRoleSpecificFields(request);

        User user = User.builder()
                .name(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .gender(request.getGender())
                .companyName(request.getCompanyName())
                .city(request.getCity())
                .licenseNumber(request.getLicenseNumber())
                .registrationNumber(request.getRegistrationNumber())
                .build();

        User savedUser = userRepository.save(user);

        if (request.getRole() == Role.DRIVER) {
            driverRepository.save(Driver.builder()
                .user(savedUser)
                .licenseNumber(request.getLicenseNumber())
                .rating(4.5)
                .status(DriverStatus.ACTIVE)
                .build());
        }

        return "User registered successfully";
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (isBlank(user.getPasswordHash()) || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        Role userRole = user.getRole();

        Driver driver = driverRepository.findByUser(user).orElse(null);

        UserDetails userDetails = org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(user.getPasswordHash())
            .authorities("ROLE_" + userRole.name())
            .build();
        String token = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(token)
                .role(userRole.name())
            .fullName(user.getName())
                .email(user.getEmail())
                .licenseNumber(driver != null ? driver.getLicenseNumber() : null)
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
            .fullName(user.getName())
                .email(user.getEmail())
            .role(user.getRole().name())
            .licenseNumber(user.getLicenseNumber())
            .status(null)
            .rating(null)
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
                // Kept for compatibility with existing frontend role selector.
            }
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
