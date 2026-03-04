package com.neurofleetx.repository;

import com.neurofleetx.model.DriverEarning;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DriverEarningRepository extends JpaRepository<DriverEarning, Long> {
    List<DriverEarning> findByDriverId(Long driverId);
}
