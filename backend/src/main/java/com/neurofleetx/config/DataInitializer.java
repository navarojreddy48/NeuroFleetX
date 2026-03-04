package com.neurofleetx.config;

import com.neurofleetx.model.Role;
import com.neurofleetx.model.RoleEntity;
import com.neurofleetx.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        for (Role role : Role.values()) {
            roleRepository.findByRoleName(role)
                    .orElseGet(() -> roleRepository.save(RoleEntity.builder().roleName(role).build()));
        }
    }
}
