package com.neurofleetx.repository;

import com.neurofleetx.model.VehicleTelemetry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleTelemetryRepository extends JpaRepository<VehicleTelemetry, Long> {
    List<VehicleTelemetry> findByVehicleId(Long vehicleId);

    Optional<VehicleTelemetry> findTopByVehicleIdOrderByTimestampDesc(Long vehicleId);

    void deleteByVehicleId(Long vehicleId);
}
