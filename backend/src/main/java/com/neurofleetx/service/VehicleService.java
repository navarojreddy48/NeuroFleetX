package com.neurofleetx.service;

import com.neurofleetx.model.Vehicle;
import com.neurofleetx.model.VehicleStatus;
import com.neurofleetx.repository.VehicleRepository;
import com.neurofleetx.repository.VehicleTelemetryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleTelemetryRepository vehicleTelemetryRepository;

    public List<Vehicle> getAllVehicles() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        vehicles.forEach(this::hydrateVehicleLevels);
        return vehicles;
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        if (vehicle.getStatus() == null) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
        }
        if (vehicle.getLatitude() == null) {
            vehicle.setLatitude(23.2599);
        }
        if (vehicle.getLongitude() == null) {
            vehicle.setLongitude(77.4126);
        }
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle request) {
        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        vehicle.setVehicleName(request.getVehicleName());
        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setBatteryPercentage(request.getBatteryPercentage());
        vehicle.setBatteryLevel(request.getBatteryLevel());
        vehicle.setFuelLevel(request.getFuelLevel());
        vehicle.setSpeed(request.getSpeed());
        vehicle.setLatitude(request.getLatitude());
        vehicle.setLongitude(request.getLongitude());
        vehicle.setBatteryHealth(request.getBatteryHealth());
        vehicle.setEngineTemperature(request.getEngineTemperature());
        vehicle.setTireWear(request.getTireWear());
        vehicle.setCity(request.getCity());
        vehicle.setStatus(request.getStatus());
        return vehicleRepository.save(vehicle);
    }

    @Transactional
    public void deleteVehicle(Long id) {
        Vehicle existing = vehicleRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));
        vehicleTelemetryRepository.deleteByVehicleId(id);
        vehicleRepository.delete(existing);
    }

    private void hydrateVehicleLevels(Vehicle vehicle) {
        boolean isElectric = "EV".equalsIgnoreCase(vehicle.getVehicleType());

        Integer latestBattery = null;
        Integer latestFuel = null;

        var latestTelemetry = vehicleTelemetryRepository.findTopByVehicleIdOrderByTimestampDesc(vehicle.getId());
        if (latestTelemetry.isPresent()) {
            latestBattery = latestTelemetry.get().getBatteryLevel();
            latestFuel = latestTelemetry.get().getFuelLevel();
            if (vehicle.getSpeed() == null) {
                vehicle.setSpeed(latestTelemetry.get().getSpeed());
            }
            if (vehicle.getLatitude() == null) {
                vehicle.setLatitude(latestTelemetry.get().getLatitude());
            }
            if (vehicle.getLongitude() == null) {
                vehicle.setLongitude(latestTelemetry.get().getLongitude());
            }
        }

        Integer resolvedBattery = firstPositive(vehicle.getBatteryLevel(), vehicle.getBatteryPercentage(), latestBattery);
        if (resolvedBattery != null) {
            vehicle.setBatteryLevel(resolvedBattery);
            if (vehicle.getBatteryPercentage() == null || vehicle.getBatteryPercentage() <= 0) {
                vehicle.setBatteryPercentage(resolvedBattery);
            }
        }

        Integer resolvedFuel = isElectric
                ? firstPositive(vehicle.getFuelLevel(), resolvedBattery, latestFuel)
                : firstPositive(vehicle.getFuelLevel(), latestFuel, resolvedBattery);

        if (resolvedFuel != null) {
            vehicle.setFuelLevel(resolvedFuel);
        }
    }

    private static Integer firstPositive(Integer... values) {
        for (Integer value : values) {
            if (value != null && value > 0) {
                return value;
            }
        }
        return null;
    }
}
