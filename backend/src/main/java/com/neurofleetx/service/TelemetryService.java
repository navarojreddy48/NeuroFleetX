package com.neurofleetx.service;

import com.neurofleetx.dto.VehicleTelemetryRequest;
import com.neurofleetx.model.Vehicle;
import com.neurofleetx.model.VehicleTelemetry;
import com.neurofleetx.repository.VehicleRepository;
import com.neurofleetx.repository.VehicleTelemetryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TelemetryService {

    private final VehicleTelemetryRepository vehicleTelemetryRepository;
    private final VehicleRepository vehicleRepository;

    public VehicleTelemetry saveTelemetry(Long vehicleId, VehicleTelemetryRequest request) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        VehicleTelemetry telemetry = VehicleTelemetry.builder()
            .vehicle(vehicle)
            .speed(request.getSpeed())
            .batteryLevel(request.getBatteryLevel())
            .fuelLevel(request.getFuelLevel())
            .latitude(request.getLatitude())
            .longitude(request.getLongitude())
            .build();

        vehicle.setSpeed(request.getSpeed());
        vehicle.setBatteryLevel(request.getBatteryLevel());
        vehicle.setFuelLevel(request.getFuelLevel());
        vehicle.setLatitude(request.getLatitude());
        vehicle.setLongitude(request.getLongitude());
        vehicleRepository.save(vehicle);

        return vehicleTelemetryRepository.save(telemetry);
    }

    public List<VehicleTelemetry> getTelemetryByVehicle(Long vehicleId) {
        return vehicleTelemetryRepository.findByVehicleId(vehicleId);
    }

    public VehicleTelemetry simulateTelemetry(Long vehicleId, VehicleTelemetryRequest request) {
        return saveTelemetry(vehicleId, request);
    }
}
