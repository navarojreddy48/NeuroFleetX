package com.neurofleetx.controller;

import com.neurofleetx.simulation.TelemetrySimulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/simulation")
@RequiredArgsConstructor
public class SimulationController {

    private final TelemetrySimulationService telemetrySimulationService;

    @PostMapping("/start")
    public Map<String, Object> startSimulation() {
        String message = telemetrySimulationService.startSimulation();
        return Map.of(
            "message", message,
            "running", telemetrySimulationService.isRunning()
        );
    }

    @PostMapping("/stop")
    public Map<String, Object> stopSimulation() {
        String message = telemetrySimulationService.stopSimulation();
        return Map.of(
            "message", message,
            "running", telemetrySimulationService.isRunning()
        );
    }
}
