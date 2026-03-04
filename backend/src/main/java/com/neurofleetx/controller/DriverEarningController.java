package com.neurofleetx.controller;

import com.neurofleetx.model.DriverEarning;
import com.neurofleetx.service.DriverEarningService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/earnings")
@RequiredArgsConstructor
public class DriverEarningController {

    private final DriverEarningService driverEarningService;

    @GetMapping
    public List<DriverEarning> getAll() {
        return driverEarningService.getAllEarnings();
    }

    @GetMapping("/driver/{driverId}")
    public List<DriverEarning> getByDriver(@PathVariable Long driverId) {
        return driverEarningService.getEarningsByDriverId(driverId);
    }
}
