package com.neurofleetx.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class RoleTestController {

    @GetMapping("/admin/test")
    public Map<String, String> adminTest(Authentication authentication) {
        return Map.of(
                "message", "Admin endpoint access granted",
                "user", authentication.getName()
        );
    }

    @GetMapping("/manager/test")
    public Map<String, String> managerTest(Authentication authentication) {
        return Map.of(
                "message", "Fleet manager endpoint access granted",
                "user", authentication.getName()
        );
    }

    @GetMapping("/driver/test")
    public Map<String, String> driverTest(Authentication authentication) {
        return Map.of(
                "message", "Driver endpoint access granted",
                "user", authentication.getName()
        );
    }

    @GetMapping("/customer/test")
    public Map<String, String> customerTest(Authentication authentication) {
        return Map.of(
                "message", "Customer endpoint access granted",
                "user", authentication.getName()
        );
    }
}
