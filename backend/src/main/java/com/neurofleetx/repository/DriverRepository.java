package com.neurofleetx.repository;

import com.neurofleetx.model.Driver;
import com.neurofleetx.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByUser(User user);
}
