package com.neurofleetx.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class UserProfileResponse {
    private String fullName;
    private String email;
    private String role;
    private String licenseNumber;
    private String status;
    private Double rating;
}
