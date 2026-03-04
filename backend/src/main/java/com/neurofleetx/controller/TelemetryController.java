package com.neurofleetx.controller;

import com.neurofleetx.dto.VehicleTelemetryRequest;
import com.neurofleetx.model.VehicleTelemetry;
import com.neurofleetx.service.TelemetryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class TelemetryController {

    private final TelemetryService telemetryService;

    @GetMapping("/{id}/telemetry")
    public List<VehicleTelemetry> getTelemetryByVehicle(@PathVariable Long id) {
        return telemetryService.getTelemetryByVehicle(id);
    }

    @PostMapping("/{id}/telemetry")
    public VehicleTelemetry createTelemetry(@PathVariable Long id, @RequestBody VehicleTelemetryRequest request) {
        return telemetryService.saveTelemetry(id, request);
    }
}
