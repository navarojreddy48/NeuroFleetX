package com.neurofleetx.simulation;

import com.neurofleetx.dto.VehicleTelemetryRequest;
import com.neurofleetx.model.Vehicle;
import com.neurofleetx.model.VehicleStatus;
import com.neurofleetx.service.TelemetryService;
import com.neurofleetx.service.VehicleService;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
@Slf4j
public class TelemetrySimulationService {

    private static final double BASE_LAT = 23.2599;
    private static final double BASE_LON = 77.4126;
    private static final int TICK_SECONDS = 2;
    private static final double MIN_SPEED_KMH = 0.0;
    private static final double MAX_SPEED_KMH = 90.0;
    private static final double MAX_ACCELERATION_PER_TICK = 6.0;
    private static final double MAX_BRAKE_PER_TICK = 7.5;
    private static final double MAX_TURN_PER_TICK_DEG = 8.0;
    private static final double METERS_PER_DEGREE = 111_320.0;
    private static final double MAX_RADIUS_KM = 8.0;

    private final VehicleService vehicleService;
    private final TelemetryService telemetryService;

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();
    private final AtomicBoolean running = new AtomicBoolean(false);
    private final Map<Long, MotionState> motionStates = new ConcurrentHashMap<>();
    private ScheduledFuture<?> task;

    @PostConstruct
    public void autoStartSimulation() {
        String message = startSimulation();
        log.info("{}", message);
    }

    public synchronized String startSimulation() {
        if (running.get()) {
            return "Telemetry simulation is already running";
        }

        running.set(true);
        task = scheduler.scheduleAtFixedRate(this::simulateTick, 0, TICK_SECONDS, TimeUnit.SECONDS);
        return "Telemetry simulation started";
    }

    public synchronized String stopSimulation() {
        if (!running.get()) {
            return "Telemetry simulation is not running";
        }

        running.set(false);
        if (task != null) {
            task.cancel(false);
        }
        motionStates.clear();
        return "Telemetry simulation stopped";
    }

    private void simulateTick() {
        if (!running.get()) {
            return;
        }

        List<Vehicle> vehicles = vehicleService.getAllVehicles();
        for (Vehicle vehicle : vehicles) {
            if (vehicle.getStatus() == VehicleStatus.MAINTENANCE) {
                continue;
            }

            boolean isElectric = "EV".equalsIgnoreCase(vehicle.getVehicleType());
            double latitude = defaultDouble(vehicle.getLatitude(), BASE_LAT);
            double longitude = defaultDouble(vehicle.getLongitude(), BASE_LON);
            double speed = defaultDouble(vehicle.getSpeed(), randomInRange(20, 40));
            int battery = resolveBatteryLevel(vehicle);
            int fuel = resolveFuelLevel(vehicle, isElectric, battery);

            MotionState state = motionStates.computeIfAbsent(vehicle.getId(), key ->
                    new MotionState(randomInRange(20, 45), randomInRange(0, 360))
            );

            if ((isElectric && battery <= 0) || (!isElectric && fuel <= 0)) {
                speed = 0;
                state.targetSpeedKmh = 0;
            }

            if (Math.abs(state.targetSpeedKmh - speed) < 2.0) {
                state.targetSpeedKmh = pickNextTargetSpeed(battery, fuel);
            }

            if (speed < state.targetSpeedKmh) {
                speed = Math.min(speed + randomInRange(1.5, MAX_ACCELERATION_PER_TICK), state.targetSpeedKmh);
            } else if (speed > state.targetSpeedKmh) {
                speed = Math.max(speed - randomInRange(1.5, MAX_BRAKE_PER_TICK), state.targetSpeedKmh);
            }

            speed = clamp(speed, MIN_SPEED_KMH, MAX_SPEED_KMH);

            if ((isElectric && battery <= 0) || (!isElectric && fuel <= 0)) {
                speed = 0;
            }

            double distanceMeters = 0;
            if (speed > 0) {
                if (distanceFromBaseKm(latitude, longitude) > MAX_RADIUS_KM) {
                    state.headingDeg = headingTowardsBase(latitude, longitude);
                } else {
                    state.headingDeg = normalizeHeading(state.headingDeg + randomInRange(-MAX_TURN_PER_TICK_DEG, MAX_TURN_PER_TICK_DEG));
                }

                distanceMeters = (speed * 1000.0 / 3600.0) * TICK_SECONDS;
                double headingRad = Math.toRadians(state.headingDeg);
                double latRad = Math.toRadians(latitude);

                double deltaLat = (distanceMeters * Math.cos(headingRad)) / METERS_PER_DEGREE;
                double metersPerLonDegree = Math.max(20_000.0, METERS_PER_DEGREE * Math.cos(latRad));
                double deltaLon = (distanceMeters * Math.sin(headingRad)) / metersPerLonDegree;

                latitude += deltaLat;
                longitude += deltaLon;
            }

            double distanceKm = distanceMeters / 1000.0;

            if (isElectric) {
                double dischargePerKm = 0.85 + (speed / 180.0);
                double highLoadPenalty = speed > 75 ? 0.06 : 0.0;
                state.batteryAccumulator += distanceKm * dischargePerKm + highLoadPenalty;
            } else {
                double fuelBurnPerKm = 0.55 + (speed / 240.0);
                double highLoadPenalty = speed > 75 ? 0.05 : 0.0;
                double idleBurn = speed < 5 ? 0.03 : 0.0;
                state.fuelAccumulator += distanceKm * fuelBurnPerKm + highLoadPenalty + idleBurn;
            }

            int batteryDrop = (int) state.batteryAccumulator;
            int fuelDrop = (int) state.fuelAccumulator;
            if (isElectric) {
                if (batteryDrop > 0) {
                    battery = Math.max(0, battery - batteryDrop);
                    state.batteryAccumulator -= batteryDrop;
                }
                fuel = battery;
                state.fuelAccumulator = 0.0;
            } else {
                if (fuelDrop > 0) {
                    fuel = Math.max(0, fuel - fuelDrop);
                    state.fuelAccumulator -= fuelDrop;
                }
                state.batteryAccumulator = 0.0;
            }

            if ((isElectric && battery <= 8) || (!isElectric && fuel <= 8)) {
                state.targetSpeedKmh = randomInRange(5, 20);
            }

            boolean nearBase = distanceFromBaseKm(latitude, longitude) < 1.2;
            if (nearBase && speed < 12) {
                if (isElectric && battery < 90) {
                    battery = Math.min(100, battery + randomInt(2, 5));
                    fuel = battery;
                    state.batteryAccumulator = 0.0;
                }

                if (!isElectric && fuel < 85) {
                    fuel = Math.min(100, fuel + randomInt(3, 7));
                    state.fuelAccumulator = 0.0;
                }

                if (state.targetSpeedKmh < 10 && ((isElectric && battery >= 25) || (!isElectric && fuel >= 20))) {
                    state.targetSpeedKmh = randomInRange(22, 42);
                }
            }

            VehicleTelemetryRequest request = new VehicleTelemetryRequest();
            request.setSpeed(speed);
            request.setBatteryLevel(battery);
            request.setFuelLevel(fuel);
            request.setLatitude(latitude);
            request.setLongitude(longitude);

            if (vehicle.getStatus() == VehicleStatus.AVAILABLE || vehicle.getStatus() == VehicleStatus.IDLE) {
                vehicle.setStatus(VehicleStatus.IN_USE);
                vehicleService.updateVehicle(vehicle.getId(), vehicle);
            }

            telemetryService.simulateTelemetry(vehicle.getId(), request);
        }
    }

    public boolean isRunning() {
        return running.get();
    }

    @PreDestroy
    public void shutdown() {
        stopSimulation();
        scheduler.shutdownNow();
    }

    private static int defaultInt(Integer value, int fallback) {
        return value == null ? fallback : value;
    }

    private static int normalizeLevel(int value, int min, int max, int fallbackMin, int fallbackMax) {
        if (value <= 0) {
            return randomInt(fallbackMin, fallbackMax);
        }
        return Math.max(min, Math.min(max, value));
    }

    private static int resolveBatteryLevel(Vehicle vehicle) {
        int raw = vehicle.getBatteryLevel() != null
                ? vehicle.getBatteryLevel()
                : defaultInt(vehicle.getBatteryPercentage(), randomInt(72, 98));

        return normalizeLevel(raw, 1, 100, 72, 98);
    }

    private static int resolveFuelLevel(Vehicle vehicle, boolean isElectric, int battery) {
        if (isElectric) {
            int raw = vehicle.getFuelLevel() != null ? vehicle.getFuelLevel() : battery;
            if (raw <= 0) {
                return battery;
            }
            return Math.max(1, Math.min(100, raw));
        }

        int raw = vehicle.getFuelLevel() != null ? vehicle.getFuelLevel() : randomInt(58, 95);
        return normalizeLevel(raw, 1, 100, 58, 95);
    }

    private static double defaultDouble(Double value, double fallback) {
        return value == null ? fallback : value;
    }

    private static int randomInt(int min, int max) {
        return ThreadLocalRandom.current().nextInt(min, max + 1);
    }

    private static double randomInRange(double min, double max) {
        return ThreadLocalRandom.current().nextDouble(min, max);
    }

    private static double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }

    private static double normalizeHeading(double heading) {
        double result = heading % 360.0;
        return result < 0 ? result + 360.0 : result;
    }

    private static double distanceFromBaseKm(double latitude, double longitude) {
        double deltaLatKm = (latitude - BASE_LAT) * 111.0;
        double deltaLonKm = (longitude - BASE_LON) * 111.0 * Math.cos(Math.toRadians(BASE_LAT));
        return Math.sqrt(deltaLatKm * deltaLatKm + deltaLonKm * deltaLonKm);
    }

    private static double headingTowardsBase(double latitude, double longitude) {
        double dy = BASE_LAT - latitude;
        double dx = (BASE_LON - longitude) * Math.cos(Math.toRadians(latitude));
        return normalizeHeading(Math.toDegrees(Math.atan2(dx, dy)));
    }

    private static double pickNextTargetSpeed(int battery, int fuel) {
        if (battery <= 10 || fuel <= 10) {
            return randomInRange(5, 18);
        }

        double scenario = randomInRange(0, 1);
        if (scenario < 0.20) {
            return randomInRange(8, 22);
        }
        if (scenario < 0.70) {
            return randomInRange(28, 52);
        }
        if (scenario < 0.92) {
            return randomInRange(55, 76);
        }
        return randomInRange(81, 88);
    }

    private static class MotionState {
        private double targetSpeedKmh;
        private double headingDeg;
        private double batteryAccumulator;
        private double fuelAccumulator;

        private MotionState(double targetSpeedKmh, double headingDeg) {
            this.targetSpeedKmh = targetSpeedKmh;
            this.headingDeg = headingDeg;
            this.batteryAccumulator = 0.0;
            this.fuelAccumulator = 0.0;
        }
    }
}
